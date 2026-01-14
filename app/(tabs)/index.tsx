import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();

  // --- ÉTATS ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPack, setSelectedPack] = useState(''); // 'hot' ou 'hard'
  const [isPremium, setIsPremium] = useState(false); 

  // Vérifie le statut Premium à chaque fois qu'on affiche l'écran
  useFocusEffect(
    useCallback(() => {
      checkPremiumStatus();
    }, [])
  );

  const checkPremiumStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('is_premium');
      if (value === 'true') {
        setIsPremium(true);
      }
    } catch (e) {
      console.log("Erreur lecture mémoire");
    }
  };

  // Gère le clic sur un pack
  const handlePackPress = (mode: string) => {
    // Si c'est le pack Soft OU si le joueur a payé -> On lance
    if (mode === 'soft' || isPremium) {
      router.push({ pathname: "/game", params: { mode: mode } });
    } else {
      // Sinon -> On bloque
      setSelectedPack(mode);
      setModalVisible(true);
    }
  };

  // Redirection vers le paywall depuis la pop-up
  const goToPaywall = () => {
    setModalVisible(false);
    router.push('/paywall');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1a0033', '#000000']}
        style={styles.background}
      >
        <View style={styles.cardContainer}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoShadowWrapper}>
               <Image source={require('../../assets/images/logo-verdict.png')} style={styles.logoImage} />
            </View>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>VERDICT</Text>
            </View>
          </View>

          {/* BOUTON PREMIUM OU BADGE VIP */}
          {!isPremium ? (
            <TouchableOpacity style={styles.premiumButton} onPress={() => router.push('/paywall')}>
              <Text style={styles.premiumText}>💎 Débloquer la version PRO</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.premiumBadgeActive}>
              <Text style={styles.premiumBadgeText}>👑 MEMBRE VIP ACTIF</Text>
            </View>
          )}

          {/* MENU DES PACKS */}
          <View style={styles.menuContainer}>
            
            {/* Pack Soft */}
            <TouchableOpacity style={[styles.button, styles.btnSoft]} onPress={() => handlePackPress('soft')}>
              <View style={styles.textWrapper}>
                <Text style={styles.btnTitle}>Pack Soft 😇</Text>
                {!isPremium && <Text style={styles.btnSub}>GRATUIT</Text>}
              </View>
            </TouchableOpacity>

            {/* Pack Hot */}
            <TouchableOpacity style={[styles.button, styles.btnHot]} onPress={() => handlePackPress('hot')}>
                <Text style={styles.btnTitle}>Pack Hot 😈</Text>
                {!isPremium && <Text style={styles.lock}>🔒</Text>}
            </TouchableOpacity>

            {/* Pack Hardcore */}
            <TouchableOpacity style={[styles.button, styles.btnHard]} onPress={() => handlePackPress('hard')}>
                <Text style={styles.btnTitle}>Pack Hardcore ☠️</Text>
                {!isPremium && <Text style={styles.lock}>🔒</Text>}
            </TouchableOpacity>

          </View>

          {/* Bouton Règles */}
          <TouchableOpacity style={styles.rulesBtnSmall} onPress={() => router.push('/rules')}>
            <Text style={styles.rulesTextSmall}>Règles du jeu</Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>

      {/* MODAL DE BLOCAGE */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalEmoji}>
              {selectedPack === 'hot' ? '😈' : '☠️'}
            </Text>
            
            <Text style={styles.modalTitle}>DÉBLOQUER LE PACK</Text>
            
            <Text style={styles.modalDesc}>
              Ce pack est réservé aux membres PRO.
            </Text>

            <View style={styles.priceTag}>
              <Text style={styles.priceText}>4,99 € / vie</Text>
            </View>

            {/* Bouton Voir l'offre */}
            <TouchableOpacity style={styles.btnBuy} onPress={goToPaywall}>
              <Text style={styles.btnBuyText}>VOIR L'OFFRE 🔥</Text>
            </TouchableOpacity>

            {/* Bouton Fermer */}
            <TouchableOpacity style={styles.btnClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCloseText}>Plus tard</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  cardContainer: {
    width: '100%', maxWidth: 400, paddingVertical: 30, backgroundColor: 'rgba(20, 0, 40, 0.9)', 
    borderRadius: 30, borderWidth: 2, borderColor: '#D400FF', paddingHorizontal: 25,
    shadowColor: '#D400FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 10, alignItems: 'center',
  },
  header: { marginBottom: 20, alignItems: 'center' },
  logoShadowWrapper: { shadowColor: '#D400FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 15, marginBottom: 5 },
  logoImage: { width: 250, height: 250, resizeMode: 'contain' },
  titleWrapper: { marginTop: -20, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 50, shadowColor: '#D400FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30, elevation: 20, backgroundColor: 'rgba(212, 0, 255, 0.01)' },
  title: { fontSize: 46, fontWeight: '900', color: 'white', textShadowColor: '#D400FF', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10, letterSpacing: 2, fontStyle: 'italic' },
  
  // Style bouton Premium (Doré)
  premiumButton: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignSelf: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Style Badge Actif (Vert)
  premiumBadgeActive: {
    marginBottom: 25,
    backgroundColor: 'rgba(76, 217, 100, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CD964',
    alignSelf: 'center',
  },
  premiumBadgeText: {
    color: '#4CD964',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },

  menuContainer: { width: '100%', gap: 15, marginBottom: 25 },
  button: { paddingVertical: 18, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  textWrapper: { alignItems: 'center' },
  btnSoft: { backgroundColor: '#0057FF' },
  btnHot: { backgroundColor: '#C71F1F' },
  btnHard: { backgroundColor: '#5E17A8' },
  btnTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  btnSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600', marginTop: 2 },
  lock: { fontSize: 22, position: 'absolute', right: 20, opacity: 0.8 },
  
  rulesBtnSmall: { marginTop: 10, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 50, alignItems: 'center', borderWidth: 1, borderColor: '#D400FF', backgroundColor: 'rgba(212, 0, 255, 0.15)', shadowColor: '#D400FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 10 },
  rulesTextSmall: { color: '#E0AAFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },

  // Styles de la Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#1a0033',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalEmoji: { fontSize: 60, marginBottom: 15 },
  modalTitle: {
    color: 'white', fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 1
  },
  modalDesc: {
    color: '#ccc', fontSize: 16, textAlign: 'center', marginBottom: 25, lineHeight: 22
  },
  priceTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginBottom: 20,
    borderWidth: 1, borderColor: '#FFD700'
  },
  priceText: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  
  btnBuy: {
    width: '100%', backgroundColor: '#FFD700',
    paddingVertical: 15, borderRadius: 50, alignItems: 'center', marginBottom: 15,
    shadowColor: '#FFD700', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5
  },
  btnBuyText: { color: '#1a0033', fontSize: 18, fontWeight: 'bold' },
  
  btnClose: { padding: 10 },
  btnCloseText: { color: '#aaa', fontSize: 16, textDecorationLine: 'underline' }
});