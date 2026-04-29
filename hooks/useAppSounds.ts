import { Audio, AVPlaybackStatus } from 'expo-av';
import { useEffect } from 'react';

export const useAppSounds = () => {
  useEffect(() => {
    let soundObject: Audio.Sound | null = null;
    let isFading = false; 

    const fadeOut = async (sound: Audio.Sound) => {
      if (isFading) return;
      isFading = true;

      let currentVolume = 1.0;
      const interval = setInterval(async () => {
        currentVolume -= 0.1;
        if (currentVolume <= 0) {
          clearInterval(interval);
          await sound.stopAsync();
          await sound.unloadAsync();
        } else {
          await sound.setVolumeAsync(Math.max(0, currentVolume));
        }
      }, 200); 
    };

    const playIntro = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/inicio.mp3'),
          { shouldPlay: true, volume: 1.0 }
        );

        soundObject = sound;

        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            const timeLeft = (status.durationMillis || 0) - status.positionMillis;
            
            if (timeLeft <= 4000 && !isFading) {
              fadeOut(sound);
            }

            
            if (status.didJustFinish) {
              sound.unloadAsync();
            }
          }
        });
      } catch (e) {
        console.log("Error en audio:", e);
      }
    };

    playIntro();

    return () => {
      if (soundObject) soundObject.unloadAsync();
    };
  }, []);
};