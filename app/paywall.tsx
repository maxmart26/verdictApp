import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaywallScreen() {
  const router = useRouter();

  // Fonction pour simuler l'achat et SAUVEGARDER le statut
  const handleBuy = async () => {
    try {
      // On écrit dans la mémoire du téléphone que c'est payé
      await AsyncStorage.setItem('is_premium', 'true');
      
      Alert.alert(
        "Félicitations ! 🥂", 
        "Vous êtes maintenant membre PREMIUM. Profitez bien !",
        [{ 
          text: "Let's Go !", 
          onPress: () => router.back() // Retour au menu
        }]
      );
    } catch (e) {
      Alert.alert("Erreur", "Impossible de sauvegarder l'achat.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton Fermer */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>Fermer</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Titre et Accroche */}
        <View style={styles.header}>
          <Text style={styles.mainEmoji}>💎</Text>
          <Text style={styles.title}>VERDICT <Text style={styles.titlePro}>PREMIUM</Text></Text>
          <Text style={styles.subtitle}>Passez à la vitesse supérieure.</Text>
        </View>

        {/* Liste des avantages */}
        <View style={styles.featuresContainer}>
          <FeatureItem emoji="🔥" title="Mode Hardcore et tout les autres" desc="Accès aux questions les plus osées." />
          <FeatureItem emoji="🚫" title="Zéro Publicité" desc="Une expérience fluide, sans coupure." />
          <FeatureItem emoji="🚀" title="Accès Futur Garanti" desc="Tous les prochains modes inclus gratuitement." />
          <FeatureItem emoji="❤️" title="Soutien Créateur" desc="Aidez un développeur indépendant !" />
        </View>

        {/* Prix et Bouton d'action */}
        <View style={styles.offerContainer}>
          <Text style={styles.price}>4,99 € <Text style={styles.perYear}>/ à vie</Text></Text>
          <Text style={styles.promoText}>Offre de lancement unique</Text>

          <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
            <Text style={styles.buyButtonText}>DÉBLOQUER TOUT MAINTENANT</Text>
          </TouchableOpacity>
          
          <Text style={styles.guarantee}>🔒 Paiement sécurisé</Text>
        </View>

        {/* Liens légaux (MIS À JOUR ICI 👇) */}
        <View style={styles.legalContainer}>
          <TouchableOpacity onPress={() => Alert.alert("Info", "Rien à restaurer pour le moment (Mode Simulation).")}>
            <Text style={styles.legalText}>Restaurer les achats</Text>
          </TouchableOpacity>
          
          <View style={styles.legalRow}>
            {/* Lien vers la page Mentions Légales */}
            <TouchableOpacity onPress={() => router.push('/legal')}>
                <Text style={styles.legalTextSmall}>Conditions</Text>
            </TouchableOpacity>
            
            <Text style={styles.legalTextSmall}> • </Text>
            
            {/* Lien vers la page Mentions Légales */}
            <TouchableOpacity onPress={() => router.push('/legal')}>
                <Text style={styles.legalTextSmall}>Confidentialité</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// Petit composant pour les lignes d'avantages
function FeatureItem({ emoji, title, desc }: { emoji: string, title: string, desc: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIconBox}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
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
  scrollContent: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingRight: 20,
    marginBottom: 10,
  },
  closeText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
  titlePro: {
    color: '#FFD700',
  },
  subtitle: {
    color: '#CCC',
    fontSize: 16,
    marginTop: 5,
  },
  featuresContainer: {
    width: '90%',
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
  },
  featureIconBox: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  featureDesc: {
    color: '#AAA',
    fontSize: 14,
  },
  offerContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 46, 147, 0.1)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF2E93',
    alignItems: 'center',
  },
  price: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  perYear: {
    fontSize: 16,
    color: '#DDD',
    fontWeight: 'normal',
  },
  promoText: {
    color: '#FF2E93',
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
    fontSize: 12,
    marginTop: 5,
  },
  buyButton: {
    backgroundColor: '#FF2E93',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#FF2E93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  guarantee: {
    color: '#666',
    fontSize: 12,
    marginTop: 15,
  },
  legalContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  legalRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  legalText: {
    color: '#888',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  legalTextSmall: {
    color: '#555',
    fontSize: 12,
  },
});