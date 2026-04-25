import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CardDeckScreen from './src/screens/CardDeckScreen';
import ListScreen from './src/screens/ListScreen';
import StatsScreen from './src/screens/StatsScreen';

type Screen = 'deck' | 'list' | 'stats';

export default function App() {
  const [activeTab, setActiveTab] = useState<Screen>('deck');

  const navigate = (screen: Screen) => setActiveTab(screen);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {activeTab === 'deck' && (
        <CardDeckScreen onNavigate={navigate} activeTab={activeTab} />
      )}
      {activeTab === 'list' && (
        <ListScreen onNavigate={navigate} activeTab={activeTab} />
      )}
      {activeTab === 'stats' && (
        <StatsScreen onNavigate={navigate} activeTab={activeTab} />
      )}
    </SafeAreaProvider>
  );
}
