import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  RenderModeType,
} from 'react-native-agora';
import { useLocalSearchParams } from 'expo-router';
import * as Device from 'expo-device'; // use full import for Device
import { Camera } from 'expo-camera';

const APP_ID = '3cfb0c62ce814dcabcf95a3a16aaffb7';
const TOKEN = '007eJxTYFhc7ufc6upyTOf2+vicP68ckrhZXIrOCKmcfnGp++5i3jYFBuPktCSDZDOj5FQLQ5OU5MSk5DRL00TjREOzxMS0tCRzxb7yjIZARoZzCsEMjFAI4rMwlKQWlzAwAABfzR/w'; // Use empty token if you're using "App ID only" mode

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
  useEffect(() => {
    // ✅ Log actual device info
    Device.getDeviceTypeAsync().then((name) => {
      console.log("📱 Running on device:", name);
    });
    console.log("📱 Platform OS:", Platform.OS);
  }, []);


useEffect(() => {
  (async () => {
    const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
    console.log("📷 Camera permission:", camStatus);
  })();
}, []);

  useEffect(() => {
    const initAgora = async () => {
      await requestPermissions();

      const engine = engineRef.current;

      engine.initialize({
        appId: APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      engine.enableVideo();

      const video = engine.setupLocalVideo({
        uid: UID,
        renderMode: RenderModeType.RenderModeFit,
      });
      console.log("video",video);
      
      const result = engine.startPreview();
      console.log("📺 Started local preview",result);
      engine.startRtmpStreamWithTranscoding(
        `rtmps://global-live.mux.com/app/${streamKey}`,
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
      engine.registerEventHandler({
        onJoinChannelSuccess: () => console.log('✅ Joined channel'),
        onError: (err) => console.error('❌ Agora Error:', err),
      });
      
      engine.joinChannel(TOKEN, CHANNEL_NAME, UID, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    };

    initAgora();

    return () => {
      const engine = engineRef.current;
      engine.leaveChannel();
      engine.stopRtmpStream(`rtmps://global-live.mux.com/app/${streamKey}`);
      engine.release();
    };
  }, [streamKey]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
    <Text style={{ color: '#fff', marginBottom: 10 }}>🔴 Broadcasting Live to Mux</Text>
    <RtcSurfaceView
      style={{ width: 320, height: 240, backgroundColor: 'black' }}
      canvas={{ uid: 1234, renderMode: RenderModeType.RenderModeFit }}
    />
  </View>
  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  title: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  preview: {
    width: 320,
    height: 240,
    backgroundColor: 'black',
  },
  
});
