/**
 * Type declarations for peer dependencies.
 * These packages are required at runtime by the consuming app.
 */
declare module 'react-native-safe-area-context' {
  export function useSafeAreaInsets(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
