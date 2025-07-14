import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthError, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as jose from "jose";
import { AuthUser } from "@/lib/utils/member";
import { tokenCache } from "@/lib/utils/cache";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// 웹 브라우저 인증 세션 완료 처리
// Complete web browser authentication session
WebBrowser.maybeCompleteAuthSession();

// 인증 컨텍스트 생성 (사용자 정보, 로그인/로그아웃 함수 등)
// Create auth context (user info, sign in/out functions etc.)
const AuthContext = createContext({
  user: null as AuthUser | null,
  signIn: (provider: any) => {},
  signOut: () => {},
  isLoading: false,
  error: null as AuthError | null,
  fetchWithAuth: (url: string, options: RequestInit) =>
    Promise.resolve(new Response()),
});

// 각 OAuth 공급자별 설정 (Google, Kakao, Naver)
// Configuration for each OAuth provider (Google, Kakao, Naver)
const configs = {
  google: {
    clientId: "google",
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri(),
  },
  kakao: {
    clientId: "kakao",
    scopes: ["profile", "account_email"],
    redirectUri: makeRedirectUri(),
  },
  naver: {
    clientId: "naver",
    scopes: ["name", "email", "profile"],
    redirectUri: makeRedirectUri(),
  },
};

// 각 OAuth 공급자별 discovery 문서 (인증/토큰 엔드포인트)
// Discovery documents for each OAuth provider (auth/token endpoints)
const discoveries = {
  google: {
    authorizationEndpoint: `${BASE_URL}/api/v1/auth/google/authorize`,
    tokenEndpoint: `${BASE_URL}/api/v1/auth/google/token`,
  },
  kakao: {
    authorizationEndpoint: `${BASE_URL}/api/v1/auth/kakao/authorize`,
    tokenEndpoint: `${BASE_URL}/api/v1/auth/kakao/token`,
  },
  naver: {
    authorizationEndpoint: `${BASE_URL}/api/v1/auth/naver/authorize`,
    tokenEndpoint: `${BASE_URL}/api/v1/auth/naver/token`,
  },
};

// 인증 프로바이더 컴포넌트
// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const refreshInProgressRef = useRef(false);

  // 각 공급자별 인증 요청 훅
  // Auth request hooks for each provider
  const [googleRequest, googleResponse, googlePromptAsync] = useAuthRequest(
    configs.google,
    discoveries.google
  );
  const [kakaoRequest, kakaoResponse, kakaoPromptAsync] = useAuthRequest(
    configs.kakao,
    discoveries.kakao
  );
  const [naverRequest, naverResponse, naverPromptAsync] = useAuthRequest(
    configs.naver,
    discoveries.naver
  );

  // 앱 시작 시 저장된 세션 복원
  // Restore saved session when app starts
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const cachedAccessToken = await tokenCache?.getToken("accessToken");
        const cachedRefreshToken = await tokenCache?.getToken("refreshToken");
        if (cachedAccessToken) {
          const decoded = jose.decodeJwt(cachedAccessToken) as AuthUser;
          setUser(decoded);
          setAccessToken(cachedAccessToken);
          setRefreshToken(cachedRefreshToken || null);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        signOut();
      }
    };

    restoreSession();
  }, []);

  // 인증 응답 처리
  // Handle auth responses
  useEffect(() => {
    handleResponse(googleResponse, "google");
    handleResponse(kakaoResponse, "kakao");
    handleResponse(naverResponse, "naver");
  }, [googleResponse, kakaoResponse, naverResponse]);

  // 인증 응답 처리 함수
  // Function to handle auth response
  const handleResponse = async (
    response: any | null,
    provider: "google" | "kakao" | "naver"
  ) => {
    if (response?.type === "success") {
      try {
        setIsLoading(true);
        const { code } = response.params;
        const tokenRes = await fetch(`${BASE_URL}/api/v1/auth/${provider}/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            platform: "native",
          }),
        });
        const { accessToken, refreshToken } = await tokenRes.json();
        await handleNativeTokens({ accessToken, refreshToken });
      } catch (e) {
        console.error("Auth response error:", e);
        setError(e as AuthError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 로그인 함수 (공급자 선택)
  // Sign in function (select provider)
  const signIn = async (provider: "google" | "kakao" | "naver") => {
    try {
      console.log("Attempting to login with:", provider);
      switch (provider) {
        case "google":
            if (googleRequest && googlePromptAsync) {
              await googlePromptAsync();
            } else {
              console.warn("Google auth request not ready");
            }
          
          break;
          case "kakao":
            if (kakaoRequest && kakaoPromptAsync) {
              await kakaoPromptAsync();
            }
            break;
          case "naver":
            if (naverRequest && naverPromptAsync) {
              await naverPromptAsync();
            }
            break;
          
          break;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error as AuthError);
    }
  };

  // 액세스 토큰 갱신 함수
  // Refresh access token function
  const refreshAccessToken = async (
    tokenToUse?: string,
    provider?: "google" | "kakao" | "naver"
  ) => {
    if (refreshInProgressRef.current) return;

    refreshInProgressRef.current = true;
    try {
      const currentRefreshToken = tokenToUse || refreshToken;
      if (!currentRefreshToken || !provider) return;

      const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: "native",
          provider,
          refreshToken: currentRefreshToken,
        }),
      });

      if (!response.ok) {
        signOut();
        return undefined;
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await response.json();

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      await tokenCache?.saveToken("accessToken", newAccessToken);
      await tokenCache?.saveToken("refreshToken", newRefreshToken);
      const decoded = jose.decodeJwt(newAccessToken);
      setUser(decoded as AuthUser);

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      signOut();
      return undefined;
    } finally {
      refreshInProgressRef.current = false;
    }
  };

  // 토큰 저장 및 사용자 정보 설정
  // Save tokens and set user info
  const handleNativeTokens = async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    await tokenCache?.saveToken("accessToken", accessToken);
    await tokenCache?.saveToken("refreshToken", refreshToken);
    const decoded = jose.decodeJwt(accessToken) as AuthUser;
    console.log("USER INFO", decoded);
    
    setUser(decoded);
  };

  // 인증이 필요한 fetch 요청
  // Authenticated fetch request
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newToken: any = await refreshAccessToken();

      if (newToken) {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    }

    return response;
  };

  // 로그아웃 함수
  // Sign out function
  const signOut = async () => {
    await tokenCache?.deleteToken("accessToken");
    await tokenCache?.deleteToken("refreshToken");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoading,
        error,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 사용자 정의 인증 훅
// Custom auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    ...context,
    signInWithGoogle: () => context.signIn("google"),
    signInWithKakao: () => context.signIn("kakao"),
    signInWithNaver: () => context.signIn("naver"),
  };
};