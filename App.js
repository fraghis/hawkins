import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';

// --- PALETTE DE COULEURS (Sombre, Moderne, Doré, Bleu) ---
const COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2C2C2C',
  primaryGold: '#D4AF37',
  accentBlue: '#3B82F6',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  error: '#EF4444',
  border: '#333333'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'videos', 'books', 'settings'

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Zone de contenu dynamique */}
      <View style={styles.content}>
        {currentTab === 'home' && <HomeScreen setCurrentTab={setCurrentTab} />}
        {currentTab === 'videos' && <VideosScreen />}
        {currentTab === 'books' && <BooksScreen />}
        {currentTab === 'settings' && <SettingsScreen />}
      </View>

      {/* Barre de navigation inférieure (Style YouTube) */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
          <Ionicons name={currentTab === 'home' ? 'home' : 'home-outline'} size={24} color={currentTab === 'home' ? COLORS.primaryGold : COLORS.textSecondary} />
          <Text style={[styles.navText, currentTab === 'home' && styles.navTextActive]}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('videos')}>
          <Ionicons name={currentTab === 'videos' ? 'videocam' : 'videocam-outline'} size={24} color={currentTab === 'videos' ? COLORS.primaryGold : COLORS.textSecondary} />
          <Text style={[styles.navText, currentTab === 'videos' && styles.navTextActive]}>Vidéos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('books')}>
          <Ionicons name={currentTab === 'books' ? 'book' : 'book-outline'} size={24} color={currentTab === 'books' ? COLORS.primaryGold : COLORS.textSecondary} />
          <Text style={[styles.navText, currentTab === 'books' && styles.navTextActive]}>Livres</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('settings')}>
          <Ionicons name={currentTab === 'settings' ? 'settings' : 'settings-outline'} size={24} color={currentTab === 'settings' ? COLORS.primaryGold : COLORS.textSecondary} />
          <Text style={[styles.navText, currentTab === 'settings' && styles.navTextActive]}>Paramètres</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// 1. PAGE ACCUEIL
// ==========================================
function HomeScreen({ setCurrentTab }) {
  return (
    <View style={styles.centerContainer}>
      <MaterialCommunityIcons name="bookshelf" size={64} color={COLORS.primaryGold} style={{ marginBottom: 16 }} />
      <Text style={styles.homeTitle}>Hawkins Library</Text>
      <Text style={styles.homeSubtitle}>Enseignements de David R. Hawkins</Text>

      <View style={styles.homeButtonsContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => setCurrentTab('videos')}>
          <Ionicons name="videocam" size={28} color={COLORS.primaryGold} />
          <Text style={styles.homeButtonText}>Explorer les Vidéos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => setCurrentTab('books')}>
          <Ionicons name="book" size={28} color={COLORS.accentBlue} />
          <Text style={styles.homeButtonText}>Explorer les Livres</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==========================================
// 2. PAGE VIDEOS (Google Drive & Lecteur Intégré)
// ==========================================
function VideosScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGrid, setIsGrid] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([
    { id: '1', title: 'Le lâcher-prise et la guérison', duration: '45:12', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500' },
    { id: '2', title: 'Transcender les niveaux de conscience', duration: '1:12:05', thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500' },
    { id: '3', title: 'Paix et Paix Intérieure', duration: '28:30', thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500' }
  ]);

  // Simulation d'une clé API manquante (sera configurée via GitHub Secrets)
  const apiKeyConfigured = false; // Passez à true une fois la clé configurée

  if (!apiKeyConfigured) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.primaryGold} style={{ marginBottom: 16 }} />
        <Text style={styles.errorTitle}>Clé API Google Drive requise</Text>
        <Text style={styles.errorDescription}>
          La clé d'accès au dossier public Google Drive (commençant par 1CDKRH...) n'est pas encore configurée dans GitHub Secrets. Veuillez l'ajouter pour synchroniser automatiquement vos vidéos.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une vidéo..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsGrid(!isGrid)}>
          <Ionicons name={isGrid ? "list" : "grid"} size={22} color={COLORS.primaryGold} />
        </TouchableOpacity>
      </View>

      {selectedVideo ? (
        <VideoPlayerView video={selectedVideo} onBack={() => setSelectedVideo(null)} />
      ) : (
        <FlatList
          data={videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))}
          keyExtractor={(item) => item.id}
          numColumns={isGrid ? 2 : 1}
          key={isGrid ? 'g' : 'l'}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={isGrid ? styles.videoCardGrid : styles.videoCardList} 
              onPress={() => setSelectedVideo(item)}
            >
              <View style={styles.thumbnailPlaceholder}>
                <Ionicons name="play-circle" size={40} color={COLORS.primaryGold} />
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.videoDuration}>{item.duration}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// Lecteur Vidéo Intégré (Utilisant expo-video)
function VideoPlayerView({ video, onBack }) {
  const player = useVideoPlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', player => {
    player.loop = false;
    player.play();
  });

  return (
    <View style={styles.playerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        <Text style={styles.backText}>Retour aux vidéos</Text>
      </TouchableOpacity>

      <View style={styles.videoWrapper}>
        <VideoView
          style={styles.nativeVideoView}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>

      <Text style={styles.playingTitle}>{video.title}</Text>
      <Text style={styles.playingSub}>Lecture sécurisée intégrée à l'application</Text>
    </View>
  );
}

// ==========================================
// 3. PAGE LIVRES (PDF, EPUB & Liens en ligne)
// ==========================================
function BooksScreen() {
  const [books, setBooks] = useState([
    { id: '1', title: 'Power vs. Force (PDF)', type: 'pdf' },
    { id: '2', title: 'The Eye of the I (EPUB)', type: 'epub' }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddLinkBook = () => {
    if (!newTitle || !newUrl) {
      Alert.alert('Erreur', 'Veuillez remplir le titre et l\'adresse du livre.');
      return;
    }
    setBooks([...books, { id: Date.now().toString(), title: newTitle, type: 'link', url: newUrl }]);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.sectionHeader}>Bibliothèque de Livres & E-books</Text>

      {/* Formulaire ajout livre en ligne */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Ajouter un livre en ligne</Text>
        <TextInput
          style={styles.input}
          placeholder="Titre du livre"
          placeholderTextColor={COLORS.textSecondary}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse web (https://...)"
          placeholderTextColor={COLORS.textSecondary}
          value={newUrl}
          onChangeText={setNewUrl}
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleAddLinkBook}>
          <Text style={styles.actionButtonText}>Ajouter le lien</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des livres */}
      {books.map((book) => (
        <View key={book.id} style={styles.bookRow}>
          <Ionicons 
            name={book.type === 'pdf' ? 'document-text' : book.type === 'epub' ? 'book' : 'globe'} 
            size={24} 
            color={COLORS.primaryGold} 
          />
          <Text style={styles.bookTitle}>{book.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ==========================================
// 4. PAGE PARAMÈTRES
// ==========================================
function SettingsScreen() {
  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.sectionHeader}>Paramètres & État</Text>
      
      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version de l'application</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dossier Google Drive</Text>
          <Text style={styles.settingValue}>1CDKRH... (Connecté)</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Clé GitHub Secrets</Text>
          <Text style={[styles.settingValue, { color: COLORS.error }]}>Non configurée</Text>
        </View>
      </View>

      <Text style={styles.helpText}>
        Hawkins Library est conçue pour fonctionner de manière autonome. Les vidéos sont lues en flux continu depuis votre dossier partagé sans passer par l'application YouTube externe.
      </Text>
    </ScrollView>
  );
}

// ==========================================
// STYLES DE L'APPLICATION
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: COLORS.background },
  screenContainer: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  
  // Navigation Basse
  navBar: { flexDirection: 'row', height: 60, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  navTextActive: { color: COLORS.primaryGold, fontWeight: '600' },

  // Accueil
  homeTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  homeSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 32, textAlign: 'center' },
  homeButtonsContainer: { width: '100%', maxWidth: 300 },
  homeButton: { flexDirection: 'row', backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  homeButtonText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600', marginLeft: 16 },

  // Vidéos
  headerRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  searchInput: { flex: 1, backgroundColor: COLORS.surface, color: COLORS.textPrimary, paddingHorizontal: 16, height: 44, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  iconButton: { marginLeft: 12, padding: 10, backgroundColor: COLORS.surface, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  videoCardGrid: { flex: 1, backgroundColor: COLORS.surface, margin: 6, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  videoCardList: { flexDirection: 'row', backgroundColor: COLORS.surface, marginBottom: 12, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  thumbnailPlaceholder: { height: 100, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  videoInfo: { padding: 10 },
  videoTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '500', marginBottom: 4 },
  videoDuration: { color: COLORS.textSecondary, fontSize: 12 },

  // Lecteur Vidéo
  playerContainer: { flex: 1, backgroundColor: COLORS.background },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  backText: { color: COLORS.textPrimary, marginLeft: 8, fontSize: 16 },
  videoWrapper: { width: '100%', height: 220, backgroundColor: '#000' },
  nativeVideoView: { width: '100%', height: '100%' },
  playingTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold', padding: 16 },
  playingSub: { color: COLORS.textSecondary, paddingHorizontal: 16 },

  // Erreur Clé
  errorTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  errorDescription: { color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

  // Livres
  sectionHeader: { color: COLORS.textPrimary, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  formCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  formTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: { backgroundColor: COLORS.surfaceLight, color: COLORS.textPrimary, paddingHorizontal: 12, height: 40, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  actionButton: { backgroundColor: COLORS.primaryGold, padding: 12, borderRadius: 6, alignItems: 'center' },
  actionButtonText: { color: '#000', fontWeight: 'bold' },
  bookRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  bookTitle: { color: COLORS.textPrimary, marginLeft: 12, fontSize: 15 },

  // Paramètres
  settingCard: { backgroundColor: COLORS.surface, borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingLabel: { color: COLORS.textSecondary, fontSize: 14 },
  settingValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '500' },
  helpText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 }
});
