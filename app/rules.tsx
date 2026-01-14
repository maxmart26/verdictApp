import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function RulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1a0033', '#000000']}
        style={styles.background}
      >
        <View style={styles.cardContainer}>
          
          {/* TITRE */}
          <Text style={styles.title}>RÈGLES DU JEU</Text>
          <View style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* ÉTAPE 1 */}
            <View style={styles.stepContainer}>
              <Text style={styles.stepEmoji}>🗣️</Text>
              <View style={styles.textContainer}>
                <Text style={styles.stepTitle}>1. LIS LA QUESTION</Text>
                <Text style={styles.stepDesc}>
                  Lis la carte à voix haute pour que tout le monde entende.
                </Text>
              </View>
            </View>

            {/* ÉTAPE 2 - LE SWIPE */}
            <View style={styles.stepContainer}>
              <Text style={styles.stepEmoji}>👆</Text>
              <View style={styles.textContainer}>
                <Text style={styles.stepTitle}>2. LE VERDICT</Text>
                <Text style={styles.stepDesc}>
                  Glisse la carte selon la vérité :
                </Text>
                
                {/* Visualisation des directions */}
                <View style={styles.swipeGuide}>
                    <View style={styles.guideItem}>
                        <Text style={styles.guideArrow}>⬅️</Text>
                        <Text style={styles.guideEmoji}>😈</Text>
                        <Text style={[styles.guideText, {color: '#FF3B30'}]}>COUPABLE</Text>
                    </View>
                    <View style={styles.guideDivider} />
                    <View style={styles.guideItem}>
                        <Text style={styles.guideArrow}>➡️</Text>
                        <Text style={styles.guideEmoji}>😇</Text>
                        <Text style={[styles.guideText, {color: '#4CD964'}]}>INNOCENT</Text>
                    </View>
                </View>

              </View>
            </View>

            {/* ÉTAPE 3 - LA PUNITION */}
            <View style={styles.stepContainer}>
              <Text style={styles.stepEmoji}>🥃</Text>
              <View style={styles.textContainer}>
                <Text style={styles.stepTitle}>3. LA SANCTION</Text>
                <Text style={styles.stepDesc}>
                  Si tu es <Text style={{color: '#FF3B30', fontWeight: 'bold'}}>COUPABLE</Text>, tu bois 1 gorgée.
                </Text>
              </View>
            </View>

            {/* --- LA NOUVELLE RÈGLE BONUS --- */}
            <View style={[styles.stepContainer, styles.bonusBox]}>
              <Text style={styles.stepEmoji}>🤥</Text>
              <View style={styles.textContainer}>
                <Text style={[styles.stepTitle, { color: '#FFD700' }]}>BONUS : LE MYTHO</Text>
                <Text style={styles.stepDesc}>
                  Si tu te mets <Text style={{color: '#4CD964', fontWeight: 'bold'}}>INNOCENT</Text> alors que tu es coupable et qu'un joueur le <Text style={{fontWeight: 'bold', color: 'white'}}>PROUVE</Text>...
                </Text>
                <Text style={styles.penaltyText}>👉 C'EST 2 GORGÉES DIRECT !</Text>
              </View>
            </View>

            {/* Note de fin */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                ⚠️ L'abus d'alcool est dangereux pour la santé. Jouez avec modération.
              </Text>
            </View>

          </ScrollView>

          {/* BOUTON RETOUR */}
          <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
            <Text style={styles.btnText}>C'EST COMPRIS ! 🔥</Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    height: '85%',
    backgroundColor: 'rgba(20, 0, 40, 0.9)', 
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D400FF',
    padding: 25,
    shadowColor: '#D400FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    fontStyle: 'italic',
    marginBottom: 10,
    textShadowColor: '#D400FF',
    textShadowRadius: 10,
  },
  divider: {
    width: 50,
    height: 4,
    backgroundColor: '#FF2E93',
    borderRadius: 2,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  // Style spécifique pour la règle bonus
  bonusBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Fond doré très léger
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)', // Bordure dorée
  },
  stepEmoji: {
    fontSize: 35,
    marginRight: 15,
    marginTop: 0,
  },
  textContainer: {
    flex: 1,
  },
  stepTitle: {
    color: '#FF2E93',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  stepDesc: {
    color: '#E0E0E0',
    fontSize: 15,
    lineHeight: 20,
  },
  penaltyText: {
    color: '#FFD700', // Or
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
    fontStyle: 'italic',
  },
  
  swipeGuide: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  guideItem: {
    alignItems: 'center',
  },
  guideArrow: { fontSize: 24, marginBottom: 5 },
  guideEmoji: { fontSize: 30, marginBottom: 5 },
  guideText: { fontWeight: 'bold', fontSize: 12 },
  guideDivider: { width: 1, height: '80%', backgroundColor: 'white', opacity: 0.2 },

  noteContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 46, 147, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 46, 147, 0.3)',
  },
  noteText: {
    color: '#FF99C8',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  btnBack: {
    width: '100%',
    backgroundColor: '#D400FF',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#D400FF',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});