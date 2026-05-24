declare module 'expo-linear-gradient' {
  import type { ComponentType, ReactNode } from 'react';
  import type { ViewProps } from 'react-native';

  export interface LinearGradientProps extends ViewProps {
    colors: readonly string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: readonly number[];
    children?: ReactNode;
  }

  export const LinearGradient: ComponentType<LinearGradientProps>;
}
