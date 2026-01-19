import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

export default function PaywallScreen() {
  const router = useRouter();
  
  // États pour stocker le produit récupéré depuis le store et l'état de chargement
  const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // 1. Charger l'offre configurée dans RevenueCat (Tableau de bord)
  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        // On suppose que l'offering s'appelle 'current' et contient au moins un package
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPkg(offerings.current.availablePackages[0]);
        }
      } catch (e) {
        console.log("Erreur chargement offres", e);
        Alert.alert("Erreur", "Impossible de charger les prix. Vérifiez votre connexion.");
      }
    };
    loadOfferings();
  }, []);

  // 2. Fonction d'achat
  const handleBuy = async () => {
    if (!pkg) return;
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      
      if (typeof customerInfo.entitlements.active['pro'] !== "undefined") {
        Alert.alert(
          "Félicitations ! 🥂", 
          "Vous êtes maintenant membre PREMIUM. Profitez bien !",
          [{ text: "Let's Go !", onPress: () => router.back() }]
        );
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Erreur", e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  // 3. Fonction Restaurer les achats (Obligatoire pour Apple)
  const restorePurchases = async () => {
    setIsPurchasing(true);
    try {
      const restore = await Purchases.restorePurchases();
      if (restore.entitlements.active['pro']) {
        Alert.alert("Succès", "Vos achats ont été restaurés.");
        router.back();
      } else {
        Alert.alert("Info", "Aucun achat précédent trouvé.");
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de restaurer.");
    } finally {
      setIsPurchasing(false);
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
          <FeatureItem emoji="🔥" title="Mode Hardcore" desc="Accès aux questions les plus osées." />
          <FeatureItem emoji="🚫" title="Zéro Publicité" desc="Une expérience fluide, sans coupure." />
          <FeatureItem emoji="🚀" title="À Vie" desc="Payez une fois, gardez-le pour toujours." />
          <FeatureItem emoji="❤️" title="Soutien Créateur" desc="Aidez un développeur indépendant !" />
        </View>

        {/* Prix et Bouton d'action */}
        <View style={styles.offerContainer}>
          
          {pkg ? (
            <Text style={styles.price}>{pkg.product.priceString} <Text style={styles.perYear}>/ à vie</Text></Text>
          ) : (
             // Spinner de chargement si le prix n'est pas encore arrivé du Store
             <ActivityIndicator size="large" color="#FF2E93" style={{marginBottom: 10}} />
          )}

          <Text style={styles.promoText}>Offre de lancement unique</Text>

          <TouchableOpacity 
            style={[styles.buyButton, (!pkg || isPurchasing) && { opacity: 0.7 }]} 
            onPress={handleBuy}
            disabled={!pkg || isPurchasing}
          >
            <Text style={styles.buyButtonText}>
              {isPurchasing ? "Validation..." : "DÉBLOQUER TOUT"}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.guarantee}>🔒 Paiement sécurisé via Store</Text>
        </View>

        {/* Liens légaux */}
        <View style={styles.legalContainer}>
          <TouchableOpacity onPress={restorePurchases}>
            <Text style={styles.legalText}>Restaurer les achats</Text>
          </TouchableOpacity>
          
          <View style={styles.legalRow}>
            <TouchableOpacity onPress={() => router.push('/legal')}>
                <Text style={styles.legalTextSmall}>Conditions</Text>
            </TouchableOpacity>
            
            <Text style={styles.legalTextSmall}> • </Text>
            
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