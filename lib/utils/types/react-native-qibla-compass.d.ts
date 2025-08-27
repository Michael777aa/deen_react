declare module "lpf" {
  interface LPF {
    init(values?: number[]): void;
    smoothing: number;
    next(value: number): number;
  }

  const lpf: LPF;
  export default lpf;
}
// declare module "react-native-qibla-compass" {
//     import { Component } from "react";
//     import { ViewProps } from "react-native";

//     interface QiblaCompassProps extends ViewProps {
//       size?: number;
//     }

//     export default class QiblaCompass extends Component<QiblaCompassProps> {}
//   }
