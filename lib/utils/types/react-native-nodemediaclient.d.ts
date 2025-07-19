declare module "react-native-nodemediaclient" {
  import { Component, Ref } from "react";
  import { ViewProps } from "react-native";

  export interface CameraConfig {
    cameraId?: number;
    cameraFrontMirror?: boolean;
  }

  export interface AudioConfig {
    bitrate?: number;
    profile?: number;
    samplerate?: number;
  }

  export interface VideoConfig {
    preset?: number;
    bitrate?: number;
    profile?: number;
    fps?: number;
    videoFrontMirror?: boolean;
  }

  export interface NodeCameraViewProps extends ViewProps {
    outputUrl?: string;
    camera?: CameraConfig;
    audio?: AudioConfig;
    video?: VideoConfig;
    autopreview?: boolean;
    onStatus?: (code: number, msg: string) => void;
  }

  export class NodeCameraView extends Component<NodeCameraViewProps> {
    start(): void;
    stop(): void;
    switchCamera(): void;
  }

  export default NodeCameraView;
}
