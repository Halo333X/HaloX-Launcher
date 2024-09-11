import React from "react";
import { WebView } from "react-native-webview";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const launcher = 'https://halo333x.github.io/HaloX-Launcher/';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <WebView
  style={styles.webview}
  source={{ uri: launcher }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  mediaPlaybackRequiresUserAction={false}
  allowsInlineMediaPlayback={true}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
  }}
  onHttpError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('HTTP error: ', nativeEvent.statusCode);
  }}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#190130"
  },
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default App;