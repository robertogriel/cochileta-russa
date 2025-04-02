import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import { Bell, BellOff } from 'lucide-react-native';

const ALARM_KEY = '@cochileta:alarm';
const SOUNDS = [
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3',
];

export default function AlarmScreen() {
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  useEffect(() => {
    loadAlarm();
  }, []);

  const loadAlarm = async () => {
    try {
      const savedAlarm = await AsyncStorage.getItem(ALARM_KEY);
      if (savedAlarm) {
        setAlarmTime(new Date(savedAlarm));
        setIsAlarmActive(true);
      }
    } catch (error) {
      console.error('Error loading alarm:', error);
    }
  };

  const saveAlarm = async (date: Date | null) => {
    try {
      if (date) {
        await AsyncStorage.setItem(ALARM_KEY, date.toISOString());
        setIsAlarmActive(true);
        scheduleRandomAlarm(date);
      } else {
        await AsyncStorage.removeItem(ALARM_KEY);
        setIsAlarmActive(false);
      }
    } catch (error) {
      console.error('Error saving alarm:', error);
    }
  };

  const scheduleRandomAlarm = async (baseTime: Date) => {
    // Calculate random offset between -2 and +2 hours
    const randomOffset = Math.floor(Math.random() * 4 * 60) - 120; // minutes
    const randomTime = new Date(baseTime);
    randomTime.setMinutes(randomTime.getMinutes() + randomOffset);

    // Schedule the alarm
    const now = new Date();
    const timeUntilAlarm = randomTime.getTime() - now.getTime();

    if (timeUntilAlarm > 0) {
      setTimeout(async () => {
        const shouldPlaySound = Math.random() > 0.3; // 70% chance to play sound
        if (shouldPlaySound) {
          const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
          const { sound } = await Audio.Sound.createAsync({ uri: randomSound });
          await sound.playAsync();
        }
      }, timeUntilAlarm);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setAlarmTime(selectedDate);
      saveAlarm(selectedDate);
    }
  };

  const toggleAlarm = () => {
    if (isAlarmActive) {
      setAlarmTime(null);
      saveAlarm(null);
    } else {
      setShowPicker(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cochileta Russa</Text>
      <Text style={styles.subtitle}>Durma... se tiver coragem!</Text>

      {alarmTime && (
        <Text style={styles.timeDisplay}>
          {format(alarmTime, "HH:mm 'hrs'", { locale: ptBR })}
        </Text>
      )}

      <TouchableOpacity style={styles.toggleButton} onPress={toggleAlarm}>
        {isAlarmActive ? (
          <>
            <BellOff size={32} color="#ff4444" />
            <Text style={styles.buttonText}>Desativar Alarme</Text>
          </>
        ) : (
          <>
            <Bell size={32} color="#4CAF50" />
            <Text style={styles.buttonText}>Ativar Alarme</Text>
          </>
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={alarmTime || new Date()}
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 40,
    fontStyle: 'italic',
  },
  timeDisplay: {
    fontSize: 48,
    color: '#ff4444',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});