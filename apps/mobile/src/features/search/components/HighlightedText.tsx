import React, { useMemo } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface HighlightedTextProps {
  text: string;
  query: string;
  style?: TextStyle;
  highlightedStyle?: TextStyle;
}

/**
 * Component that highlights matching text within a string
 * Optimized with useMemo to prevent unnecessary re-renders
 */
export const HighlightedText = React.memo<HighlightedTextProps>(function HighlightedText({
  text,
  query,
  style,
  highlightedStyle,
}) {
  const parts = useMemo(() => {
    if (!query.trim()) {
      return [<Text key="full-text" style={[styles.text, style]}>{text}</Text>];
    }

    const result: React.ReactElement[] = [];
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let lastIndex = 0;
    let index = lowerText.indexOf(lowerQuery, lastIndex);

    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        result.push(
          <Text key={`text-${lastIndex}`} style={[styles.text, style]}>
            {text.substring(lastIndex, index)}
          </Text>
        );
      }

      // Add highlighted match
      result.push(
        <Text
          key={`match-${index}`}
          style={[styles.text, style, styles.highlighted, highlightedStyle]}
        >
          {text.substring(index, index + query.length)}
        </Text>
      );

      lastIndex = index + query.length;
      index = lowerText.indexOf(lowerQuery, lastIndex);
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(
        <Text key={`text-${lastIndex}`} style={[styles.text, style]}>
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return result;
  }, [text, query, style, highlightedStyle]);

  return <Text>{parts}</Text>;
});

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  highlighted: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Bold',
  },
});
