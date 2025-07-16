import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  RenderModeType,
} from 'react-native-agora';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

const APP_ID = '813a6d4def9b4ed090e62592497f2cc7';
const TOKEN = '';
const CHANNEL_NAME = 'test';
const UID = 1234;

export default function BroadcastScreen() {
  const engineRef = useRef(createAgoraRtcEngine());

  useEffect(() => {
    (async () => {
      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Audio.requestPermissionsAsync();
      console.log('📷 Camera:', camStatus, '🎙️ Mic:', micStatus);

      const engine = engineRef.current;

      engine.initialize({
        appId: APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      engine.enableVideo();

      engine.setupLocalVideo({
        uid: UID,
        renderMode: RenderModeType.RenderModeFit,
      });

      engine.startPreview();

      engine.registerEventHandler({
        onJoinChannelSuccess: () => console.log('✅ Joined channel'),
        onError: (err) => console.error('❌ Agora Error:', err),
      });

      engine.joinChannel(TOKEN, CHANNEL_NAME, UID, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    })();

    return () => {
      const engine = engineRef.current;
      engine.leaveChannel();
      engine.release();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', marginBottom: 10 }}>🎥 Preview</Text>
      <RtcSurfaceView
        style={{ width: 320, height: 240, backgroundColor: 'black' }}
        canvas={{ uid: UID, renderMode: RenderModeType.RenderModeFit }}
      />
    </View>
  );
}
