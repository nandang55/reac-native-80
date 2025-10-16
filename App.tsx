/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
          ✅ React Native 0.80
        </Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
          NewSparkelRn80 - Phase 1 Complete
        </Text>
        <Text style={[styles.info, { color: isDarkMode ? '#aaaaaa' : '#888888' }]}>
          All dependencies installed successfully!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
