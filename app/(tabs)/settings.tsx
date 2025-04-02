import { View, Text, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Som Aleatório</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: '#767577', true: '#ff4444' }}
          thumbColor={soundEnabled ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Vibração</Text>
        <Switch
          value={vibrationEnabled}
          onValueChange={setVibrationEnabled}
          trackColor={{ false: '#767577', true: '#ff4444' }}
          thumbColor={vibrationEnabled ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.disclaimer}>
        Nota: As configurações são meramente decorativas. O app decidirá aleatoriamente se vai tocar som ou vibrar!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    marginTop: 60,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    fontSize: 18,
    color: '#fff',
  },
  disclaimer: {
    marginTop: 30,
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});