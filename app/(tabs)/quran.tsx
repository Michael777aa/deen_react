import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Platform,
  Vibration
} from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  Star, 
  Clock, 
  Play, 
  Download,
  Heart,
  Bell,
  ChevronDown,
  ChevronUp,
  Headphones,
  Share2,
  BookOpenCheck
} from 'lucide-react-native';
import { quranSurahs } from '@/mocks/quranData';

const { width } = Dimensions.get('window');

export default function QuranScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyRead, setRecentlyRead] = useState([1, 36, 67, 112]); // Mock recently read surahs
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'bookmarks', 'recent'
  const [favorites, setFavorites] = useState<number[]>([2, 18, 36, 55, 67]); // Mock favorite surahs
  const [downloadingSurah, setDownloadingSurah] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showAllSurahs, setShowAllSurahs] = useState(false);
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const filteredSurahs = quranSurahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );

  const displayedSurahs = showAllSurahs ? filteredSurahs : filteredSurahs.slice(0, 20);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const navigateToSurah = (surahNumber: number) => {
    router.push(`/quran/${surahNumber}`);
  };

  const toggleFavorite = (surahNumber: number) => {
    if (favorites.includes(surahNumber)) {
      setFavorites(favorites.filter(num => num !== surahNumber));
    } else {
      setFavorites([...favorites, surahNumber]);
    }
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
  };

  const downloadSurah = (surahNumber: number) => {
    if (Platform.OS === 'web') {
      alert('Download not available on web');
      return;
    }
    
    setDownloadingSurah(surahNumber);
    setDownloadProgress(0);
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setDownloadProgress(Math.min(progress, 1));
      
      if (progress >= 1) {
        clearInterval(interval);
        setDownloadingSurah(null);
        alert(`Surah ${surahNumber} downloaded successfully for offline listening`);
      }
    }, 300);
  };

  const toggleExpandSurah = (surahNumber: number) => {
    setExpandedSurah(expandedSurah === surahNumber ? null : surahNumber);
  };

  const renderSurahItem = ({ item }: { item: typeof quranSurahs[0] }) => (
    <TouchableOpacity 
      style={[
        styles.surahItem, 
        { backgroundColor: colors[theme].card }
      ]}
      onPress={() => navigateToSurah(item.number)}
    >
      <View style={styles.surahItemHeader}>
        <View style={styles.surahItemLeft}>
          <View style={[styles.surahNumberContainer, { backgroundColor: colors[theme].primary + '15' }]}>
            <Text style={[styles.surahNumber, { color: colors[theme].primary }]}>
              {item.number}
            </Text>
          </View>
          <View style={styles.surahInfo}>
            <Text style={[styles.surahName, { color: colors[theme].text }]}>
              {item.englishName}
            </Text>
            <Text style={[styles.surahMeta, { color: colors[theme].inactive }]}>
              {item.revelationType} • {item.numberOfAyahs} verses
            </Text>
          </View>
        </View>
        
        <View style={styles.surahActions}>
          <Text style={[styles.surahArabicName, { color: colors[theme].text }]}>
            {item.name}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleFavorite(item.number)}
            >
              <Heart 
                size={16} 
                color={colors[theme].primary} 
                fill={favorites.includes(item.number) ? colors[theme].primary : 'transparent'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleExpandSurah(item.number)}
            >
              {expandedSurah === item.number ? (
                <ChevronUp size={16} color={colors[theme].primary} />
              ) : (
                <ChevronDown size={16} color={colors[theme].primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {expandedSurah === item.number && (
        <View style={styles.expandedContent}>
          <View style={styles.expandedActions}>
            <TouchableOpacity 
              style={[styles.expandedActionButton, { backgroundColor: colors[theme].primary + '15' }]}
              onPress={() => navigateToSurah(item.number)}
            >
              <BookOpenCheck size={16} color={colors[theme].primary} />
              <Text style={[styles.expandedActionText, { color: colors[theme].primary }]}>Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.expandedActionButton, { backgroundColor: colors[theme].primary + '15' }]}
            >
              <Headphones size={16} color={colors[theme].primary} />
              <Text style={[styles.expandedActionText, { color: colors[theme].primary }]}>Listen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.expandedActionButton, { backgroundColor: colors[theme].primary + '15' }]}
              onPress={() => downloadSurah(item.number)}
            >
              {downloadingSurah === item.number ? (
                <View style={styles.downloadProgress}>
                  <Text style={[styles.downloadProgressText, { color: colors[theme].primary }]}>
                    {Math.round(downloadProgress * 100)}%
                  </Text>
                </View>
              ) : (
                <>
                  <Download size={16} color={colors[theme].primary} />
                  <Text style={[styles.expandedActionText, { color: colors[theme].primary }]}>Download</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.expandedActionButton, { backgroundColor: colors[theme].primary + '15' }]}
            >
              <Share2 size={16} color={colors[theme].primary} />
              <Text style={[styles.expandedActionText, { color: colors[theme].primary }]}>Share</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.expandedDescription, { color: colors[theme].inactive }]}>
            {item.englishNameTranslation} - This surah has {item.numberOfAyahs} verses and was revealed in {item.revelationType}.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      {/* Beautiful Header Banner */}
      <Animated.View 
        style={[
          styles.headerBanner,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1584286595398-a8c264b1dea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }} 
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>القرآن الكريم</Text>
          <Text style={styles.headerSubtitle}>Read • Reflect • Remember</Text>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>114</Text>
              <Text style={styles.statLabel}>Surahs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>6,236</Text>
              <Text style={styles.statLabel}>Verses</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Daily Verse Card - Redesigned */}
      <Animated.View 
        style={[
          styles.dailyVerseContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Card style={styles.dailyVerseCard}>
          <View style={styles.dailyVerseHeader}>
            <View style={styles.dailyVerseTitle}>
              <Bell size={16} color={colors[theme].primary} />
              <Text style={[styles.dailyVerseTitleText, { color: colors[theme].primary }]}>
                Verse of the Day
              </Text>
            </View>
            <TouchableOpacity style={styles.dailyVerseShare}>
              <Text style={[styles.dailyVerseShareText, { color: colors[theme].primary }]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.dailyVerseArabic, { color: colors[theme].text }]}>
            وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ
          </Text>
          
          <Text style={[styles.dailyVerseTranslation, { color: colors[theme].inactive }]}>
            "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me."
          </Text>
          
          <View style={styles.dailyVerseFooter}>
            <Text style={[styles.dailyVerseReference, { color: colors[theme].primary }]}>
              Surah Al-Baqarah (2:186)
            </Text>
            <TouchableOpacity 
              style={[styles.dailyVerseButton, { backgroundColor: colors[theme].primary }]}
              onPress={() => navigateToSurah(2)}
            >
              <Text style={styles.dailyVerseButtonText}>
                Read Surah
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          { backgroundColor: colors[theme].card, borderColor: colors[theme].border }
        ]}>
          <Search size={20} color={colors[theme].inactive} />
          <TextInput
            style={[styles.searchInput, { color: colors[theme].text }]}
            placeholder="Search surah by name or number..."
            placeholderTextColor={colors[theme].inactive}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { borderBottomColor: colors[theme].border }]}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'all' && { borderBottomColor: colors[theme].primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'all' ? colors[theme].primary : colors[theme].inactive }
          ]}>
            All Surahs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'recent' && { borderBottomColor: colors[theme].primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'recent' ? colors[theme].primary : colors[theme].inactive }
          ]}>
            Recent
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'bookmarks' && { borderBottomColor: colors[theme].primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('bookmarks')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'bookmarks' ? colors[theme].primary : colors[theme].inactive }
          ]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Content based on active tab */}
        {activeTab === 'recent' && recentlyRead.length > 0 && (
          <View style={styles.recentContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScrollView}>
              {recentlyRead.map((surahNumber) => {
                const surah = quranSurahs.find(s => s.number === surahNumber);
                if (!surah) return null;
                
                return (
                  <TouchableOpacity 
                    key={surah.number}
                    style={[styles.recentCard, { backgroundColor: colors[theme].card }]}
                    onPress={() => navigateToSurah(surah.number)}
                  >
                    <BookOpen size={24} color={colors[theme].primary} />
                    <Text style={[styles.recentSurahName, { color: colors[theme].text }]}>
                      {surah.englishName}
                    </Text>
                    <Text style={[styles.recentSurahMeta, { color: colors[theme].inactive }]}>
                      Surah {surah.number}
                    </Text>
                    <View style={styles.lastReadIndicator}>
                      <Clock size={12} color="#FFFFFF" />
                      <Text style={styles.lastReadText}>Last read</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {activeTab === 'bookmarks' && (
          <View style={styles.bookmarksContainer}>
            {favorites.length > 0 ? (
              favorites.map(surahNumber => {
                const surah = quranSurahs.find(s => s.number === surahNumber);
                if (!surah) return null;
                
                return (
                  <TouchableOpacity 
                    key={surah.number}
                    style={[styles.bookmarkCard, { backgroundColor: colors[theme].card }]}
                    onPress={() => navigateToSurah(surah.number)}
                  >
                    <View style={styles.bookmarkIconContainer}>
                      <Heart size={24} color={colors[theme].primary} fill={colors[theme].primary} />
                    </View>
                    <View style={styles.bookmarkInfo}>
                      <Text style={[styles.bookmarkTitle, { color: colors[theme].text }]}>
                        Surah {surah.englishName}
                      </Text>
                      <Text style={[styles.bookmarkMeta, { color: colors[theme].inactive }]}>
                        {surah.revelationType} • {surah.numberOfAyahs} verses
                      </Text>
                    </View>
                    <View style={styles.bookmarkActions}>
                      <Play size={20} color={colors[theme].primary} fill={colors[theme].primary} />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyBookmarksContainer}>
                <Bookmark size={48} color={colors[theme].inactive} />
                <Text style={[styles.emptyBookmarksText, { color: colors[theme].text }]}>
                  No favorite surahs yet
                </Text>
                <Text style={[styles.emptyBookmarksSubtext, { color: colors[theme].inactive }]}>
                  Tap the heart icon on any surah to add it to your favorites
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'all' && (
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors[theme].primary} />
              <Text style={[styles.loadingText, { color: colors[theme].text }]}>
                Loading Surahs...
              </Text>
            </View>
          ) : (
            <View style={styles.allSurahsContainer}>
              {displayedSurahs.map(surah => renderSurahItem({ item: surah }))}
              
              {!showAllSurahs && filteredSurahs.length > 20 && (
                <TouchableOpacity 
                  style={[styles.showMoreButton, { backgroundColor: colors[theme].card }]}
                  onPress={() => {
                    setShowAllSurahs(true);
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    }, 100);
                  }}
                >
                  <Text style={[styles.showMoreText, { color: colors[theme].primary }]}>
                    Show All {filteredSurahs.length} Surahs
                  </Text>
                  <ChevronDown size={16} color={colors[theme].primary} />
                </TouchableOpacity>
              )}
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerBanner: {
    height: 180,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
  },
  dailyVerseContainer: {
    paddingHorizontal: 16,
    marginTop: -30,
    marginBottom: 16,
    zIndex: 10,
  },
  dailyVerseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  dailyVerseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyVerseTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyVerseTitleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  dailyVerseShare: {
    padding: 4,
  },
  dailyVerseShareText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dailyVerseArabic: {
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 32,
  },
  dailyVerseTranslation: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  dailyVerseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyVerseReference: {
    fontSize: 12,
    fontWeight: '500',
  },
  dailyVerseButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  dailyVerseButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentContainer: {
    marginBottom: 16,
  },
  recentScrollView: {
    paddingHorizontal: 16,
  },
  recentCard: {
    width: 160,
    height: 180,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentSurahName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  recentSurahMeta: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  lastReadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastReadText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
  bookmarksContainer: {
    paddingHorizontal: 16,
  },
  bookmarkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookmarkIconContainer: {
    marginRight: 16,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookmarkMeta: {
    fontSize: 14,
    marginTop: 4,
  },
  bookmarkActions: {
    padding: 8,
  },
  emptyBookmarksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyBookmarksText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyBookmarksSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  allSurahsContainer: {
    paddingHorizontal: 16,
  },
  surahItem: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  surahItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  surahItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  surahMeta: {
    fontSize: 14,
  },
  surahActions: {
    alignItems: 'flex-end',
  },
  surahArabicName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  expandedActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  expandedActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  expandedDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  downloadProgress: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadProgressText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
});