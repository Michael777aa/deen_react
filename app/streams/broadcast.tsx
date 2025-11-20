// src/screens/LiveBroadcast.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, RotateCcw, Video, VideoOff, Mic, MicOff } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LiveBroadcast() {
  const { streamKey } = useLocalSearchParams<{ streamKey: string }>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);
  const [viewerCount, setViewerCount] = useState(1);
  
  const cameraRef = useRef<any>(null);
  const webViewRef = useRef<WebView>(null);
  const durationIntervalRef:any = useRef<any>(0);

  // Update stream duration
  useEffect(() => {
    if (isStreaming) {
      durationIntervalRef.current = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isStreaming]);

  // Simulate viewer count changes
  useEffect(() => {
    let viewerInterval: any;
    
    if (isStreaming) {
      viewerInterval = setInterval(() => {
        setViewerCount(prev => {
          // Simulate random viewer changes
          const change = Math.random() > 0.7 ? 1 : Math.random() > 0.3 ? 0 : -1;
          return Math.max(1, prev + change);
        });
      }, 5000);
    }

    return () => {
      if (viewerInterval) clearInterval(viewerInterval);
    };
  }, [isStreaming]);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4444" />
        <Text style={styles.loadingText}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required for live broadcasting
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startStreaming = async () => {
    if (!streamKey) {
      Alert.alert('Error', 'Stream key is missing');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate stream start process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsStreaming(true);
      setStreamDuration(0);
      setViewerCount(1);
      
      // Send message to WebView
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'STREAM_STARTED',
          streamKey: streamKey
        }));
      }
      
      Alert.alert('Live! 🎥', 'You are now streaming live to your audience!');
      
    } catch (error) {
      console.error('Error starting stream:', error);
      Alert.alert('Error', 'Failed to start stream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopStreaming = async () => {
    try {
      setIsLoading(true);
      
      // Simulate stream stop process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsStreaming(false);
      
      // Send message to WebView
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'STREAM_STOPPED',
          streamKey: streamKey,
          duration: streamDuration
        }));
      }
      
      Alert.alert('Stream Ended', `Your stream lasted ${streamDuration} seconds with up to ${viewerCount} viewers.`);
      
    } catch (error) {
      console.error('Error stopping stream:', error);
      Alert.alert('Error', 'Failed to stop stream.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    setFacing(current => current === 'back' ? 'front' : 'back');
  };

  const toggleCameraView = () => {
    setShowCamera(!showCamera);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'START_STREAM_REQUEST':
          startStreaming();
          break;
          
        case 'STOP_STREAM_REQUEST':
          stopStreaming();
          break;
          
        case 'TOGGLE_CAMERA_REQUEST':
          toggleCameraView();
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body { 
                margin: 0; 
                padding: 0; 
                background: #000; 
                color: white; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .control-panel {
                padding: 20px;
                background: rgba(0,0,0,0.9);
            }
            .stats-container {
                display: flex;
                justify-content: space-around;
                margin-bottom: 20px;
                background: rgba(255,255,255,0.1);
                padding: 15px;
                border-radius: 10px;
            }
            .stat {
                text-align: center;
            }
            .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #ff4444;
                margin-bottom: 5px;
            }
            .stat-label {
                font-size: 12px;
                color: #999;
            }
            .controls {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .control-btn {
                flex: 1;
                min-width: 120px;
                padding: 12px;
                border: none;
                border-radius: 25px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                background: #333;
                color: white;
            }
            .control-btn:active {
                transform: scale(0.95);
            }
            .start-btn {
                background: linear-gradient(45deg, #ff4444, #ff6b6b);
            }
            .stop-btn {
                background: linear-gradient(45deg, #666, #999);
            }
            .stream-info {
                background: rgba(255,68,68,0.1);
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
                border-left: 4px solid #ff4444;
            }
            .stream-key {
                font-family: 'Courier New', monospace;
                background: rgba(0,0,0,0.5);
                padding: 8px;
                border-radius: 5px;
                margin-top: 5px;
                word-break: break-all;
                font-size: 11px;
            }
            .live-indicator {
                display: inline-flex;
                align-items: center;
                background: #ff4444;
                padding: 4px 12px;
                border-radius: 15px;
                margin-bottom: 10px;
            }
            .live-dot {
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
                margin-right: 6px;
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="control-panel">
            ${isStreaming ? `
                <div class="live-indicator">
                    <div class="live-dot"></div>
                    LIVE NOW
                </div>
            ` : ''}
            
            <div class="stats-container">
                <div class="stat">
                    <div class="stat-value" id="viewers">${viewerCount}</div>
                    <div class="stat-label">VIEWERS</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="duration">${formatDuration(streamDuration)}</div>
                    <div class="stat-label">DURATION</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="bitrate">${Math.floor(800 + Math.random() * 400)}</div>
                    <div class="stat-label">KBPS</div>
                </div>
            </div>

            <div class="controls">
                ${!isStreaming ? `
                    <button class="control-btn start-btn" onclick="startStream()">
                        🔴 GO LIVE
                    </button>
                ` : `
                    <button class="control-btn stop-btn" onclick="stopStream()">
                        ⏹️ END STREAM
                    </button>
                `}
                <button class="control-btn" onclick="toggleCamera()">
                    📷 ${showCamera ? 'HIDE' : 'SHOW'} CAMERA
                </button>
            </div>

            <div class="stream-info">
                <strong>Stream Key:</strong>
                <div class="stream-key">${streamKey}</div>
            </div>
        </div>

        <script>
            function startStream() {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'START_STREAM_REQUEST'
                    }));
                }
            }

            function stopStream() {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'STOP_STREAM_REQUEST'
                    }));
                }
            }

            function toggleCamera() {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'TOGGLE_CAMERA_REQUEST'
                    }));
                }
            }

            // Update stats periodically
            setInterval(() => {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'REQUEST_STATS_UPDATE'
                    }));
                }
            }, 1000);
        </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Live Broadcast</Text>
          {isStreaming && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.reloadButton} onPress={toggleCamera}>
          <RotateCcw size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Camera Preview */}
      {showCamera && (
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              {isStreaming && (
                <View style={styles.streamingOverlay}>
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>LIVE</Text>
                  </View>
                </View>
              )}
            </View>
          </CameraView>
          
          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.cameraControlButton}
              onPress={toggleMute}
            >
              {isMuted ? (
                <MicOff size={24} color="#FFFFFF" />
              ) : (
                <Mic size={24} color="#FFFFFF" />
              )}
              <Text style={styles.cameraControlText}>
                {isMuted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cameraControlButton}
              onPress={toggleCameraView}
            >
              <VideoOff size={24} color="#FFFFFF" />
              <Text style={styles.cameraControlText}>Hide Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* WebView Control Panel */}
      <View style={styles.webviewContainer}>
        <WebView 
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webview}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
        />
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF4444" />
          <Text style={styles.loadingOverlayText}>
            {isStreaming ? 'Stopping stream...' : 'Starting stream...'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reloadButton: {
    padding: 8,
  },
  cameraContainer: {
    height: height * 0.6,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  streamingOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    marginRight: 6,
  },
  recordingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  cameraControlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 25,
    minWidth: 80,
  },
  cameraControlText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 4,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
});