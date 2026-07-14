import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { typography, colors } from '../tokens';

export type TypographyVariant = keyof typeof typography;

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'body', 
  color = colors.light.text, 
  weight,
  align,
  style, 
  ...props 
}) => {
  const variantStyles = typography[variant as TypographyVariant];
  
  return (
    <RNText 
      style={[
        variantStyles,
        { color, textAlign: align },
        weight && { fontWeight: weight },
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};
