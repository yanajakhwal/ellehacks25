import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  fixedColor?: string;
};

export function ThemedView({ style, fixedColor = '#FFFFFF', ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: fixedColor }, style]} {...otherProps} />;
}