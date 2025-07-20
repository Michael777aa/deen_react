declare module "react-native-live-stream" {
  import { Component } from "react";
  import { ViewProps } from "react-native";

  interface LiveStreamProps extends ViewProps {
    cameraFronted?: boolean;
    video?: {
      bitrate?: number;
      fps?: number;
      width?: number;
      height?: number;
    };
    audio?: {
      bitrate?: number;
      sampleRate?: number;
    };
  }

  export default class LiveStreamView extends Component<LiveStreamProps> {
    startStream(url: string): void;
    stopStream(): void;
  }
}
