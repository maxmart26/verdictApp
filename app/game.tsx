import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

// Import de tes questions
import { ALL_QUESTIONS } from '../data/questions';

const { width } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const mode = params.mode || 'soft'; 
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // --- NOUVEAU : ÉTAT POUR LE SON (ON par défaut) ---
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Configuration Audio
  useEffect(() => {
    async function configureAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.log("Erreur config audio", e);
      }
    }
    configureAudio();
  }, []);

  useEffect(() => {
    const filtered = ALL_QUESTIONS.filter(q => q.type === mode);
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    shuffled.push({ id: 9999, text: "Pack terminé !", emoji: "🏁", type: 'end' });
    setQuestions(shuffled);
  }, [mode]);

  const isEndCard = questions[cardIndex]?.type === 'end';

  // --- FONCTION SON MODIFIÉE (Vérifie si le son est actif) ---
  const playSound = async (type: 'guilty' | 'innocent') => {
    // Si l'utilisateur a coupé le son, on ne fait rien
    if (!isSoundOn) return;

    try {
      let soundFile;
      if (type === 'guilty') {
        soundFile = require('../assets/sounds/guilty.mp3');
      } else {
        soundFile = require('../assets/sounds/innocent.mp3');
      }

      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Erreur lecture son", error);
    }
  };

  const handleSwiping = (x: number) => {
    if (isEndCard) return;

    if (x > 40) {
      if (swipeDirection !== 'right') {
        setSwipeDirection('right');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (x < -40) {
      if (swipeDirection !== 'left') {
        setSwipeDirection('left');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      if (swipeDirection !== null) setSwipeDirection(null);
    }
  };

  const resetSwipe = () => {
    setSwipeDirection(null);
  };

  const onSwiped = (index: number, direction: string) => {
    if (direction === 'left') {
      playSound('guilty'); 
    } else if (direction === 'right') {
      playSound('innocent'); 
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCardIndex(index + 1);
    setSwipeDirection(null);
  }

  const renderCard = (card: any) => {
    if (!card) return null;
    
    if (card.type === 'end') {
       return (
        <View style={[styles.card, styles.endCard]}>
          <Text style={styles.cardEmoji}>🏁</Text>
          <Text style={styles.cardText}>C'est fini pour ce pack !</Text>
          <TouchableOpacity style={styles.btnRestart} onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}>
            <Text style={styles.btnRestartText}>Retour au menu</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.cardEmoji}>{card.emoji}</Text>
        <Text style={styles.cardText}>{card.text}</Text>
        <View style={styles.instructionsContainer}>
           <Text style={styles.instructionLeft}>👈 Coupable</Text>
           <Text style={styles.instructionRight}>Innocent 👉</Text>
        </View>
      </View>
    );
  };

  if (questions.length === 0) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      
      {!isEndCard && swipeDirection === 'left' && (
        <View style={styles.fixedOverlay} pointerEvents="none">
           <View style={styles.animBox}>
              <LottieView
                source={require('../assets/animations/devil.json')}
                autoPlay
                loop
                style={styles.lottieAnim}
              />
              <Text style={[styles.overlayText, { color: '#FF3B30' }]}>COUPABLE</Text>
           </View>
        </View>
      )}

      {!isEndCard && swipeDirection === 'right' && (
        <View style={styles.fixedOverlay} pointerEvents="none">
           <View style={styles.animBox}>
              <LottieView
                source={require('../assets/animations/angel.json')}
                autoPlay
                loop
                style={styles.lottieAnim}
              />
              <Text style={[styles.overlayText, { color: '#4CD964' }]}>INNOCENT</Text>
           </View>
        </View>
      )}

      {/* --- NOUVEAU HEADER : BOUTON MUTE + BOUTON QUITTER --- */}
      <View style={styles.headerRow}>
        
        {/* Bouton Mute (Gauche) */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => setIsSoundOn(!isSoundOn)}
        >
          <Text style={styles.iconText}>
            {isSoundOn ? '🔊' : '🔇'}
          </Text>
        </TouchableOpacity>

        {/* Bouton Quitter (Droite) */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>✖️ Quitter</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          key={questions.length}
          cards={questions}
          renderCard={renderCard}
          
          onSwipedLeft={(index) => onSwiped(index, 'left')}
          onSwipedRight={(index) => onSwiped(index, 'right')}
          
          onSwipedAborted={resetSwipe} 
          onSwiping={handleSwiping} 
          cardIndex={cardIndex}
          backgroundColor={'transparent'}
          stackSize={3}
          cardVerticalMargin={40}
          swipeAnimationDuration={200}
          verticalSwipe={false}
          disableLeftSwipe={isEndCard}
          disableRightSwipe={isEndCard}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0518',
    paddingTop: 50,
  },
  fixedOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
    justifyContent: 'center', alignItems: 'center',
  },
  animBox: {
    alignItems: 'center', justifyContent: 'center', transform: [{ scale: 1.3 }]
  },
  lottieAnim: { width: 180, height: 180 },
  overlayText: {
    fontSize: 32, fontWeight: '900', marginTop: 0, textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10
  },
  
  // --- NOUVEAUX STYLES HEADER ---
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espace max entre gauche et droite
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
    marginBottom: 10,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)', // Fond un peu transparent
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  closeButton: { 
    // J'ai enlevé le padding excessif pour l'aligner avec le mute
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  swiperContainer: { flex: 1, marginTop: -20 },
  card: {
    flex: 0.7, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'white', padding: 25, elevation: 10,
  },
  endCard: { 
    backgroundColor: '#F5F5F5', 
    borderWidth: 5, 
    borderColor: '#FF2E93' 
  },
  cardEmoji: { fontSize: 60, marginBottom: 20 },
  cardText: { textAlign: 'center', fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 40 },
  instructionsContainer: {
      position: 'absolute', bottom: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20
  },
  instructionLeft: { 
    color: '#FF3B30', 
    fontWeight: 'bold' 
  },
  instructionRight: { 
    color: '#4CD964', 
    fontWeight: 'bold' 
  },
  btnRestart: { backgroundColor: '#FF2E93', padding: 15, borderRadius: 30 },
  btnRestartText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});