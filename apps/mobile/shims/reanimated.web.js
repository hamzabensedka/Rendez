import { Image, ScrollView, Text, View } from 'react-native';

const noopLayout = {
  duration() {
    return this;
  },
  delay() {
    return this;
  },
  springify() {
    return this;
  },
  damping() {
    return this;
  },
};

export const FadeIn = noopLayout;
export const FadeOut = noopLayout;
export const FadeInDown = noopLayout;
export const FadeOutUp = noopLayout;
export const FadeInUp = noopLayout;
export const FadeOutDown = noopLayout;
export const SlideInDown = noopLayout;
export const SlideOutDown = noopLayout;
export const Easing = {
  linear: (t) => t,
  ease: (t) => t,
  in: (fn) => fn,
  out: (fn) => fn,
  inOut: (fn) => fn,
  bezier: () => (t) => t,
};

export function useSharedValue(init) {
  return { value: init };
}

export function useAnimatedStyle(updater) {
  try {
    return typeof updater === 'function' ? updater() : {};
  } catch {
    return {};
  }
}

export function withTiming(value) {
  return value;
}

export function withSpring(value) {
  return value;
}

export function runOnJS(fn) {
  return fn;
}

export function runOnUI(fn) {
  return fn;
}

export const Animated = {
  View,
  Text,
  Image,
  ScrollView,
  createAnimatedComponent: (Component) => Component,
};

export default Animated;
