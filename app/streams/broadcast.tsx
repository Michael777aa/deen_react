// src/app/streams/broadcast.tsx
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

const APP_ID = '813a6d4def9b4ed090e62592497f2cc7';
const TOKEN = ''; // Empty token works only if project uses "App ID" authentication mode

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
  const CHANNEL_NAME = `${streamKey}`;
  const engineRef = useRef(createAgoraRtcEngine());

  useEffect(() => {
    const initAgora = async () => {
      await requestPermissions(); // 👈 Request permissions before engine init

      const engine = engineRef.current;

      engine.initialize({
        appId: APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      engine.enableVideo();

      engine.setupLocalVideo({
        uid: 0,
        renderMode: RenderModeType.RenderModeHidden,
      });

      engine.startPreview();

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
              uid: 0,
              x: 0,
              y: 0,
              width: 640,
              height: 360,
              zOrder: 1,
            },
          ],
        }
      );

      engine.joinChannel(TOKEN, CHANNEL_NAME, 0, {
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
    <View style={styles.container}>
      <Text style={styles.title}>🔴 Broadcasting Live to Mux</Text>
      <RtcSurfaceView
        style={styles.preview}
        canvas={{ uid: 0, renderMode: RenderModeType.RenderModeHidden }}
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
    flex: 1,
    backgroundColor: 'black',
  },
});
