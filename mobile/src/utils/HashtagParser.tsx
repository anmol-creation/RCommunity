import React from 'react';
import { Text, Linking, StyleSheet, TextStyle } from 'react-native';

interface HashtagParserProps {
  text: string;
  style?: TextStyle;
  onHashtagPress?: (tag: string) => void;
}

export const HashtagParser: React.FC<HashtagParserProps> = ({ text, style, onHashtagPress }) => {
  const words = text.split(/(\s+)/); // Split by whitespace but keep delimiters

  return (
    <Text style={style}>
      {words.map((word, index) => {
        if (word.startsWith('#') && word.length > 1) {
          const tag = word.substring(1); // remove '#'
          return (
            <Text
              key={index}
              style={[style, styles.hashtag]}
              onPress={() => onHashtagPress && onHashtagPress(tag)}
            >
              {word}
            </Text>
          );
        }
        return <Text key={index} style={style}>{word}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  hashtag: {
    color: '#4FA5F5',
    fontWeight: 'bold',
  },
});
