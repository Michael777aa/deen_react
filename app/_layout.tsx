import RootLayoutNav from "@/components/RootLayout";
import SplashGate from "@/components/SplashGate";
import { AuthProvider } from "@/context/auth";

export default function RootLayout() {
  return (
    <SplashGate>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SplashGate>
  );
}
