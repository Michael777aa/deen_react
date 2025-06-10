import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  Animated,
  SafeAreaView
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { 
  BookOpen, 
  Bookmark, 
  Share2, 
  Settings, 
  Play, 
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Heart,
  Volume2,
  Download
} from 'lucide-react-native';
import { quranSurahs, getQuranVerses } from '@/mocks/quranData';

export default function SurahDetailScreen() {
  const params = useLocalSearchParams();
  const surahNumber = parseInt(params.surah as string || "1");
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const [isLoading, setIsLoading] = useState(true);
  const [verses, setVerses] = useState<any[]>([]);
  const [surahInfo, setSurahInfo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadSurah = async () => {
      setIsLoading(true);
      try {
        // Find surah info
        const info = quranSurahs.find(s => s.number === surahNumber);
        if (!info) {
          throw new Error('Surah not found');
        }
        setSurahInfo(info);
        
        // Get verses (mock data)
        const surahVerses = getQuranVerses(surahNumber);
        setVerses(surahVerses);
        
        setTimeout(() => {
          setIsLoading(false);
          
          // Fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
          }).start();
        }, 800);
      } catch (error) {
        console.error('Error loading surah:', error);
        setIsLoading(false);
      }
    };
    
    if (surahNumber && !isNaN(surahNumber)) {
      loadSurah();
    } else {
      setIsLoading(false);
    }
  }, [surahNumber]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleBookmark = (verseNumber: number) => {
    if (bookmarkedVerses.includes(verseNumber)) {
      setBookmarkedVerses(bookmarkedVerses.filter(v => v !== verseNumber));
    } else {
      setBookmarkedVerses([...bookmarkedVerses, verseNumber]);
    }
  };

  const navigateToPreviousSurah = () => {
    if (surahNumber > 1) {
      router.push(`/quran/${surahNumber - 1}`);
    }
  };

  const navigateToNextSurah = () => {
    if (surahNumber < 114) {
      router.push(`/quran/${surahNumber + 1}`);
    }
  };

  const goBack = () => {
    router.back();
  };

  const downloadAudio = () => {
    if (Platform.OS === 'web') {
      alert('Download not available on web');
      return;
    }
    
    setIsDownloading(true);
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setDownloadProgress(Math.min(progress, 1));
      
      if (progress >= 1) {
        clearInterval(interval);
        setIsDownloading(false);
        alert('Surah downloaded successfully for offline listening');
      }
    }, 300);
  };

  if (isLoading) {
    return (
      <View style={[
        styles.loadingContainer, 
        { backgroundColor: colors[theme].background }
      ]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
        <Text style={[styles.loadingText, { color: colors[theme].text }]}>
          Loading Surah...
        </Text>
      </View>
    );
  }

  if (!surahInfo) {
    return (
      <View style={[
        styles.errorContainer, 
        { backgroundColor: colors[theme].background }
      ]}>
        <Text style={[styles.errorText, { color: colors[theme].text }]}>
          Surah not found
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors[theme].primary }]}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <Stack.Screen 
        options={{ 
          title: `Surah ${surahInfo.englishName}`,
          headerShown: false
        }} 
      />
      
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: colors[theme].card }]}>
        <TouchableOpacity onPress={goBack} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors[theme].text }]}>
          Surah {surahInfo.englishName}
        </Text>
        <TouchableOpacity style={styles.headerButton}>
          <Share2 size={24} color={colors[theme].text} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Beautiful Surah Header */}
        <Card style={styles.surahHeader}>
          <View style={styles.surahHeaderContent}>
            <View style={[styles.surahNumberBadge, { backgroundColor: colors[theme].primary }]}>
              <Text style={styles.surahNumberText}>
                {surahInfo.number}
              </Text>
            </View>
            <Text style={[styles.surahName, { color: colors[theme].text }]}>
              {surahInfo.englishName}
            </Text>
            <Text style={[styles.surahNameArabic, { color: colors[theme].text }]}>
              {surahInfo.name}
            </Text>
            <Text style={[styles.surahInfo, { color: colors[theme].inactive }]}>
              {surahInfo.revelationType} • {surahInfo.numberOfAyahs} verses
            </Text>
          </View>
          
          <View style={styles.surahActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors[theme].card }]}
              onPress={() => toggleBookmark(0)}
            >
              <Bookmark 
                size={20} 
                color={colors[theme].primary} 
                fill={bookmarkedVerses.includes(0) ? colors[theme].primary : 'transparent'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: colors[theme].primary }]}
              onPress={togglePlayPause}
            >
              {isPlaying ? (
                <Pause size={20} color="#FFFFFF" />
              ) : (
                <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors[theme].card }]}
              onPress={downloadAudio}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <View style={styles.downloadProgress}>
                  <Text style={[styles.downloadProgressText, { color: colors[theme].primary }]}>
                    {Math.round(downloadProgress * 100)}%
                  </Text>
                </View>
              ) : (
                <Download size={20} color={colors[theme].primary} />
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* Settings Bar */}
        <View style={styles.settingsBar}>
          <TouchableOpacity 
            style={[
              styles.settingButton, 
              { 
                backgroundColor: showTranslation ? colors[theme].primary + '20' : colors[theme].card 
              }
            ]}
            onPress={() => setShowTranslation(!showTranslation)}
          >
            <Text style={[
              styles.settingButtonText, 
              { 
                color: showTranslation ? colors[theme].primary : colors[theme].inactive 
              }
            ]}>
              Translation
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.settingButton, 
              { 
                backgroundColor: showTransliteration ? colors[theme].primary + '20' : colors[theme].card 
              }
            ]}
            onPress={() => setShowTransliteration(!showTransliteration)}
          >
            <Text style={[
              styles.settingButtonText, 
              { 
                color: showTransliteration ? colors[theme].primary : colors[theme].inactive 
              }
            ]}>
              Transliteration
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.settingButton, 
              { backgroundColor: colors[theme].card }
            ]}
          >
            <Settings size={16} color={colors[theme].text} />
          </TouchableOpacity>
        </View>

        {/* Font Size Control */}
        <View style={styles.fontSizeControl}>
          <Text style={[styles.fontSizeLabel, { color: colors[theme].text }]}>
            Font Size
          </Text>
          <View style={styles.fontSizeSlider}>
            <TouchableOpacity 
              style={[styles.fontSizeButton, { backgroundColor: colors[theme].card }]}
              onPress={() => setFontSize(Math.max(14, fontSize - 1))}
            >
              <Text style={{ color: colors[theme].text }}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.fontSizeValue, { color: colors[theme].text }]}>
              {fontSize}
            </Text>
            <TouchableOpacity 
              style={[styles.fontSizeButton, { backgroundColor: colors[theme].card }]}
              onPress={() => setFontSize(Math.min(30, fontSize + 1))}
            >
              <Text style={{ color: colors[theme].text }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.versesContainer} showsVerticalScrollIndicator={false}>
          {/* Bismillah for all surahs except At-Tawbah (9) */}
          {surahNumber !== 9 && (
            <Card style={styles.bismillahCard}>
              <Text style={[styles.bismillahText, { color: colors[theme].text }]}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </Text>
              <Text style={[styles.bismillahTranslation, { color: colors[theme].inactive }]}>
                In the name of Allah, the Most Gracious, the Most Merciful
              </Text>
            </Card>
          )}
          
          {verses.map((verse, index) => (
            <Card key={index} style={styles.verseCard}>
              <View style={styles.verseHeader}>
                <View style={[
                  styles.verseNumberContainer, 
                  { backgroundColor: colors[theme].primary + '20' }
                ]}>
                  <Text style={[styles.verseNumber, { color: colors[theme].primary }]}>
                    {verse.number}
                  </Text>
                </View>
                
                <View style={styles.verseActions}>
                  <TouchableOpacity 
                    style={styles.verseActionButton}
                    onPress={() => toggleBookmark(verse.number)}
                  >
                    <Bookmark 
                      size={16} 
                      color={bookmarkedVerses.includes(verse.number) ? colors[theme].primary : colors[theme].inactive} 
                      fill={bookmarkedVerses.includes(verse.number) ? colors[theme].primary : 'transparent'}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.verseActionButton}>
                    <Play size={16} color={colors[theme].inactive} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.verseActionButton}>
                    <Share2 size={16} color={colors[theme].inactive} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={[
                styles.verseArabic, 
                { 
                  color: colors[theme].text,
                  fontSize: fontSize,
                }
              ]}>
                {verse.arabic}
              </Text>
              
              {showTransliteration && (
                <Text style={[styles.verseTransliteration, { color: colors[theme].text }]}>
                  {verse.transliteration}
                </Text>
              )}
              
              {showTranslation && (
                <Text style={[styles.verseTranslation, { color: colors[theme].inactive }]}>
                  {verse.translation}
                </Text>
              )}
            </Card>
          ))}
        </ScrollView>

        {/* Navigation Bar */}
        <View style={[
          styles.navigationBar, 
          { backgroundColor: colors[theme].card }
        ]}>
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={navigateToPreviousSurah}
            disabled={surahNumber === 1}
          >
            <ChevronLeft 
              size={24} 
              color={surahNumber === 1 ? colors[theme].inactive : colors[theme].text} 
            />
            <Text style={[
              styles.navigationText, 
              { 
                color: surahNumber === 1 ? colors[theme].inactive : colors[theme].text 
              }
            ]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <View style={styles.navigationInfo}>
            <Text style={[styles.navigationSurah, { color: colors[theme].text }]}>
              {surahInfo.englishName}
            </Text>
            <Text style={[styles.navigationNumber, { color: colors[theme].inactive }]}>
              {surahInfo.number}/114
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={navigateToNextSurah}
            disabled={surahNumber === 114}
          >
            <Text style={[
              styles.navigationText, 
              { 
                color: surahNumber === 114 ? colors[theme].inactive : colors[theme].text 
              }
            ]}>
              Next
            </Text>
            <ChevronRight 
              size={24} 
              color={surahNumber === 114 ? colors[theme].inactive : colors[theme].text} 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  surahHeader: {
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  surahHeaderContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  surahNumberBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  surahNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  surahName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 8,
  },
  surahNameArabic: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  surahInfo: {
    fontSize: 14,
    marginTop: 8,
  },
  surahActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  downloadProgress: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  settingButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  fontSizeLabel: {
    fontSize: 14,
    marginRight: 12,
    width: 70,
  },
  fontSizeSlider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontSizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  versesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bismillahCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bismillahText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bismillahTranslation: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  verseCard: {
    marginBottom: 16,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseActions: {
    flexDirection: 'row',
  },
  verseActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  verseArabic: {
    textAlign: 'right',
    lineHeight: 40,
    marginBottom: 12,
    fontWeight: '500',
  },
  verseTransliteration: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  verseTranslation: {
    fontSize: 14,
    lineHeight: 22,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  navigationInfo: {
    alignItems: 'center',
  },
  navigationSurah: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  navigationNumber: {
    fontSize: 12,
  },
});