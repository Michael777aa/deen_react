import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { languages } from '@/constants/languages';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Check } from 'lucide-react-native';
import i18n from '../i18nextConfig'; // <- added

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, darkMode } = useSettingsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const theme = darkMode ? 'dark' : 'light';

  const selectedLanguage = languages.find(lang => lang.code === language);

  const handleSelectLanguage = (langCode: string) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode); // <-- update i18next
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.selector,
          { backgroundColor: colors[theme].card, borderColor: colors[theme].border }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectorText, { color: colors[theme].text }]}>
          {selectedLanguage?.name || 'Select Language'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { backgroundColor: colors[theme].background }
          ]}>
            <Text style={[styles.modalTitle, { color: colors[theme].text }]}>
              Select Language
            </Text>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    language === item.code && { 
                      backgroundColor: colors[theme].primary + '20' 
                    }
                  ]}
                  onPress={() => handleSelectLanguage(item.code)}
                >
                  <Text style={[styles.languageName, { color: colors[theme].text }]}>
                    {item.name}
                  </Text>
                  
                  {language === item.code && (
                    <Check size={20} color={colors[theme].primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors[theme].card }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: colors[theme].text }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectorText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    width: '100%',
  },
  languageName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});