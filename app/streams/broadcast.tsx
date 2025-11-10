import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, PermissionsAndroid, Alert } from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  RenderModeType,
  RtmpStreamPublishState,
} from 'react-native-agora';
import { useLocalSearchParams } from 'expo-router';
import * as Device from 'expo-device';
import { Camera } from 'expo-camera';
const APP_ID = '3cfb0c62ce814dcabcf95a3a16aaffb7';
const TOKEN = '007eJxTYDCqZWmY0M52x5IlJFG59PFfIZVnGXae1bcCH/Bu7IxZKqfAYJyclmSQbGaUnGphaJKSnJiUnGZpmmicaGiWmJiWlmSe3zkjoyGQkcH/RDMDIxSC+CwMJanFJQwMANJIHs4=';

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export default function BroadcastScreen() {
  const { streamKey } = useLocalSearchParams<{ streamKey: string }>();
  const CHANNEL_NAME = "testChannel";

  const engineRef = useRef(createAgoraRtcEngine());
  const UID = 1234;
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<string>('Initializing...');

  useEffect(() => {
    (async () => {
      try {
        setStatus('Requesting camera permission...');
        const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(camStatus);
        console.log("📷 Camera permission:", camStatus);
        
        if (camStatus !== 'granted') {
          const errorMsg = "Camera permission not granted. Please enable camera access in settings.";
          setError(errorMsg);
          setStatus('Permission denied');
          Alert.alert(
            "Camera Permission Required",
            "This app needs camera access to broadcast. Please enable it in settings.",
            [{ text: "OK" }]
          );
        } else {
          setStatus('Camera permission granted');
        }
      } catch (err) {
        console.error("❌ Error requesting camera permission:", err);
        setError("Failed to request camera permission");
        setStatus('Permission error');
      }
    })();
  }, []);

  useEffect(() => {
    // Don't initialize if camera permission is not granted
    if (cameraPermission !== 'granted') {
      console.log("⏸️ Skipping Agora initialization - camera permission not granted");
      return;
    }

    if (!streamKey) {
      setError("Stream key is missing");
      setStatus('Error: Missing stream key');
      return;
    }

    const initAgora = async () => {
      try {
        setStatus('Requesting permissions...');
        await requestPermissions();

        const engine = engineRef.current;

        setStatus('Initializing Agora engine...');
        // Initialize Agora engine
        const initResult = engine.initialize({
          appId: APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });
        console.log("🔧 Agora initialize result:", initResult);

        if (initResult !== 0) {
          throw new Error(`Failed to initialize Agora engine: ${initResult}`);
        }

        // Register event handler BEFORE other operations
        engine.registerEventHandler({
          onJoinChannelSuccess: () => {
            console.log('✅ Joined channel successfully');
            setIsInitialized(true);
            setIsStreaming(true);
            setStatus('✅ Streaming live!');
            setError(null);
          },
          onError: (err, msg) => {
            console.error('❌ Agora Error:', err, msg);
            setIsStreaming(false);
            // Error 1052 = No camera available / System resource issue
            // Error 109 = Invalid parameter
            const errorCode = typeof err === 'number' ? err : Number(err);
            if (errorCode === 1052) {
              setError("Camera is not available or system resources are limited. Please use a physical device with a working camera.");
              setStatus('Error: Camera unavailable');
            } else if (errorCode === 109) {
              setError("Invalid camera configuration. Please check your device settings.");
              setStatus('Error: Invalid configuration');
            } else {
              setError(`Agora Error ${errorCode}: ${msg || 'Unknown error'}`);
              setStatus(`Error: ${errorCode}`);
            }
          },
          onLocalVideoStateChanged: (source, state, error) => {
            console.log("📹 Local video state changed:", { source, state, error });
            if (error === 0 && state === 2) {
              console.log("✅ Video is capturing");
              setStatus('Video capturing...');
            } else if (error !== 0) {
              console.error("❌ Local video error:", error);
              setError(`Video error: ${error}`);
            }
          },
          onRtmpStreamingStateChanged: (url, state, errCode) => {
            console.log("📡 RTMP streaming state changed:", { url, state, errCode });
            if (state === RtmpStreamPublishState.RtmpStreamPublishStateIdle) {
              setStatus('RTMP stream idle');
            } else if (state === RtmpStreamPublishState.RtmpStreamPublishStateConnecting) {
              setStatus('Connecting to RTMP server...');
            } else if (state === RtmpStreamPublishState.RtmpStreamPublishStateRunning) {
              setStatus('✅ Streaming to Mux!');
              setIsStreaming(true);
            } else if (state === RtmpStreamPublishState.RtmpStreamPublishStateRecovering) {
              setStatus('Recovering stream...');
            } else if (state === RtmpStreamPublishState.RtmpStreamPublishStateFailure) {
              setStatus('Stream failed');
              setError(`RTMP stream failed: ${errCode}`);
            }
          },
        });

        setStatus('Setting up video...');
        engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
        
        // Enable video
        const enableVideoResult = engine.enableVideo();
        console.log("📹 Enable video result:", enableVideoResult);
        if (enableVideoResult !== 0) {
          throw new Error(`Failed to enable video: ${enableVideoResult}`);
        }

        // Setup local video
        setStatus('Configuring camera...');
        const videoResult = engine.setupLocalVideo({
          uid: UID,
          renderMode: RenderModeType.RenderModeFit,
        });
        console.log("📹 Setup local video result:", videoResult);
        if (videoResult !== 0) {
          throw new Error(`Failed to setup local video: ${videoResult}`);
        }

        // Start preview
        setStatus('Starting camera preview...');
        const previewResult = engine.startPreview();
        console.log("📺 Started local preview result:", previewResult);

        if (previewResult !== 0) {
          console.warn("⚠️ Preview start returned:", previewResult);
          // Don't throw here, preview might still work
        }

        // Start RTMP stream
        setStatus('Starting RTMP stream...');
        const rtmpUrl = `rtmps://global-live.mux.com/app/${streamKey}`;
        const rtmpResult = engine.startRtmpStreamWithTranscoding(
          rtmpUrl,
          {
            width: 640,
            height: 360,
            videoBitrate: 400,
            videoFramerate: 15,
            videoGop: 30,
            audioSampleRate: 44100,
            audioBitrate: 48,
            audioChannels: 1,
            transcodingUsers: [
              {
                uid: UID,
                x: 0,
                y: 0,
                width: 640,
                height: 360,
                zOrder: 1,
              },
            ],
          }
        );
        console.log("📡 RTMP stream start result:", rtmpResult);
        if (rtmpResult !== 0) {
          console.warn("⚠️ RTMP stream start returned:", rtmpResult);
        }

        // Join channel
        setStatus('Joining channel...');
        const joinResult = engine.joinChannel(TOKEN, CHANNEL_NAME, UID, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
        console.log("🚪 Join channel result:", joinResult);
        if (joinResult !== 0) {
          throw new Error(`Failed to join channel: ${joinResult}`);
        }

      } catch (err: any) {
        console.error("❌ Error initializing Agora:", err);
        setError(err.message || "Failed to initialize streaming");
      }
    };

    initAgora();

    return () => {
      try {
        console.log("🧹 Cleaning up Agora engine...");
        const engine = engineRef.current;
        engine.leaveChannel();
        if (streamKey) {
          engine.stopRtmpStream(`rtmps://global-live.mux.com/app/${streamKey}`);
        }
        engine.release();
        setIsInitialized(false);
        setIsStreaming(false);
      } catch (err) {
        console.error("❌ Error cleaning up Agora:", err);
      }
    };
  }, [streamKey, cameraPermission]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isStreaming ? '🔴 Broadcasting Live to Mux' : '📹 Broadcast Setup'}
      </Text>
      
      {/* Status indicator */}
      <View style={[styles.statusContainer, isStreaming && styles.statusSuccess]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* Error display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Permission status */}
      {cameraPermission !== 'granted' && !error && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>📷 Waiting for camera permission...</Text>
        </View>
      )}

      {/* Video preview */}
      <RtcSurfaceView
        style={styles.preview}
        canvas={{ uid: UID, renderMode: RenderModeType.RenderModeFit }}
      />

      {/* Streaming info */}
      {isStreaming && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>✅ Stream is live!</Text>
          <Text style={styles.infoSubtext}>Stream Key: {streamKey}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    maxWidth: 400,
    height: 300,
    backgroundColor: 'black',
    borderRadius: 8,
    marginVertical: 10,
  },
  statusContainer: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    padding: 12,
    borderRadius: 8,
    margin: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    maxWidth: '90%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    padding: 12,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    maxWidth: '90%',
  },
  infoText: {
    color: '#64b5f6',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoSubtext: {
    color: '#90caf9',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
