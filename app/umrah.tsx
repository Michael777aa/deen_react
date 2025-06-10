import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { CheckCircle, Circle, MapPin, Calendar, Info } from 'lucide-react-native';
import { umrahSteps } from '@/mocks/umrahData';

export default function UmrahScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <Stack.Screen options={{ title: "Umrah Guide" }} />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.headerImage}
            resizeMode="cover"
          />

          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Info size={20} color={colors[theme].primary} />
              <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
                About Umrah
              </Text>
            </View>
            <Text style={[styles.infoText, { color: colors[theme].text }]}>
              Umrah is a pilgrimage to Mecca that can be undertaken at any time of the year, unlike Hajj. It consists of a series of rituals that symbolize the lives of Ibrahim (Abraham) and his wife Hajar.
            </Text>
          </Card>

          <View style={styles.stepsContainer}>
            <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
              Umrah Steps
            </Text>
            
            {umrahSteps.map((step, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.stepCard, 
                  { 
                    backgroundColor: colors[theme].card,
                    borderLeftColor: activeStep === index ? colors[theme].primary : 'transparent',
                    borderLeftWidth: activeStep === index ? 4 : 0,
                  }
                ]}
                onPress={() => setActiveStep(index)}
              >
                <View style={styles.stepHeader}>
                  {activeStep > index ? (
                    <CheckCircle size={24} color={colors[theme].primary} fill={colors[theme].primary} />
                  ) : activeStep === index ? (
                    <Circle size={24} color={colors[theme].primary} fill={colors[theme].primary} />
                  ) : (
                    <Circle size={24} color={colors[theme].inactive} />
                  )}
                  
                  <Text style={[
                    styles.stepTitle, 
                    { 
                      color: colors[theme].text,
                      marginLeft: 12,
                    }
                  ]}>
                    {step.title}
                  </Text>
                </View>
                
                {activeStep === index && (
                  <View style={styles.stepDetails}>
                    <Text style={[styles.stepDescription, { color: colors[theme].text }]}>
                      {step.description}
                    </Text>
                    
                    {step.imageUrl && (
                      <Image
                        source={{ uri: step.imageUrl }}
                        style={styles.stepImage}
                        resizeMode="cover"
                      />
                    )}
                    
                    <View style={styles.stepInfo}>
                      <View style={styles.stepInfoItem}>
                        <MapPin size={16} color={colors[theme].primary} />
                        <Text style={[styles.stepInfoText, { color: colors[theme].text }]}>
                          {step.location}
                        </Text>
                      </View>
                      
                      {step.duration && (
                        <View style={styles.stepInfoItem}>
                          <Calendar size={16} color={colors[theme].primary} />
                          <Text style={[styles.stepInfoText, { color: colors[theme].text }]}>
                            {step.duration}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {step.tips && (
                      <View style={[styles.tipBox, { backgroundColor: colors[theme].primary + '10' }]}>
                        <Text style={[styles.tipTitle, { color: colors[theme].primary }]}>
                          Tips:
                        </Text>
                        <Text style={[styles.tipText, { color: colors[theme].text }]}>
                          {step.tips}
                        </Text>
                      </View>
                    )}
                    
                    {step.duas && (
                      <View style={[styles.duaBox, { backgroundColor: colors[theme].secondary + '10' }]}>
                        <Text style={[styles.duaTitle, { color: colors[theme].secondary }]}>
                          Dua:
                        </Text>
                        <Text style={[styles.duaArabic, { color: colors[theme].text }]}>
                          {step.duas.arabic}
                        </Text>
                        <Text style={[styles.duaTranslation, { color: colors[theme].text }]}>
                          {step.duas.translation}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Card style={styles.checklistCard}>
            <Text style={[styles.checklistTitle, { color: colors[theme].text }]}>
              Umrah Checklist
            </Text>
            
            <View style={styles.checklistItem}>
              <CheckCircle size={20} color={colors[theme].primary} />
              <Text style={[styles.checklistText, { color: colors[theme].text }]}>
                Valid passport with at least 6 months validity
              </Text>
            </View>
            
            <View style={styles.checklistItem}>
              <CheckCircle size={20} color={colors[theme].primary} />
              <Text style={[styles.checklistText, { color: colors[theme].text }]}>
                Umrah visa
              </Text>
            </View>
            
            <View style={styles.checklistItem}>
              <Circle size={20} color={colors[theme].inactive} />
              <Text style={[styles.checklistText, { color: colors[theme].text }]}>
                Ihram clothing for men
              </Text>
            </View>
            
            <View style={styles.checklistItem}>
              <Circle size={20} color={colors[theme].inactive} />
              <Text style={[styles.checklistText, { color: colors[theme].text }]}>
                Modest clothing for women
              </Text>
            </View>
            
            <View style={styles.checklistItem}>
              <Circle size={20} color={colors[theme].inactive} />
              <Text style={[styles.checklistText, { color: colors[theme].text }]}>
                Prayer mat
              </Text>
            </View>
            
            <View style={styles.checklistItem}>
              <Circle size={20} color={colors[theme].inactive} />
              <Text style={[styles.checklistText, { color: colors[theme].text }]}>
                Medications and first aid kit
              </Text>
            </View>
          </Card>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  infoCard: {
    margin: 16,
    marginTop: -40,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  stepsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepDetails: {
    marginTop: 16,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  stepImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  stepInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  stepInfoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  tipBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  duaBox: {
    padding: 12,
    borderRadius: 8,
  },
  duaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  duaArabic: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  duaTranslation: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  checklistCard: {
    margin: 16,
    marginTop: 0,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checklistText: {
    fontSize: 14,
    marginLeft: 12,
  },
});