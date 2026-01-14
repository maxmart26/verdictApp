import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LegalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a0033', '#000000']} style={styles.background}>
        
        <View style={styles.header}>
          <Text style={styles.title}>MENTIONS LÉGALES</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          
          <Section title="1. Confidentialité & Données">
            <Text style={styles.text}>
              L'application Verdict ne collecte aucune donnée personnelle. 
              Toutes les informations (comme votre statut Premium) sont stockées localement sur votre téléphone.
              Nous n'avons accès ni à vos contacts, ni à votre localisation, ni à votre caméra.
            </Text>
          </Section>

          <Section title="2. Conditions d'Utilisation (EULA)">
            <Text style={styles.text}>
              Verdict est un jeu à but humoristique. Les questions sont faites pour rire entre amis.
              En téléchargeant l'application, vous acceptez de l'utiliser avec bienveillance.
              L'incitation à la haine ou le harcèlement ne sont pas tolérés.
            </Text>
          </Section>

          <Section title="3. Avertissement Santé">
            <Text style={styles.text}>
              Ce jeu peut contenir des références à la consommation d'alcool.
              L'abus d'alcool est dangereux pour la santé. Consommez avec modération.
              L'application ne force personne à boire. Les joueurs restent responsables de leurs actes.
            </Text>
          </Section>

          <Section title="4. Achats & Abonnements">
            <Text style={styles.text}>
              L'achat du mode "Premium" est un achat unique (Lifetime) géré par l'App Store (Apple) ou le Play Store (Google).
              Pour toute demande de remboursement, veuillez contacter directement le support d'Apple ou Google.
            </Text>
          </Section>

          <Section title="5. Contact">
            <Text style={styles.text}>
              Pour toute question ou signalement de bug, contactez le développeur :
              contact@verdict-app.com (Mets ton vrai mail ici plus tard)
            </Text>
          </Section>

          <View style={styles.spacer} />

        </ScrollView>

        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>Fermer</Text>
        </TouchableOpacity>

      </LinearGradient>
    </View>
  );
}

// Petit composant pour faire propre
const Section = ({ title, children }: { title: string, children: any }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderColor: '#333', paddingBottom: 15 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  scrollView: { flex: 1 },
  content: { paddingBottom: 100 },
  section: { marginBottom: 25 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  text: { color: '#CCC', fontSize: 14, lineHeight: 22 },
  spacer: { height: 50 },
  closeButton: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25,
    borderWidth: 1, borderColor: '#555'
  },
  closeText: { color: 'white', fontWeight: 'bold' }
});