// src/screens/CreateStreamScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { StreamStatus, StreamType } from '@/types/stream.enum';
import { Picker } from '@react-native-picker/picker';
import { Video, Calendar, Clock } from 'lucide-react-native';
import { useAuth } from '@/context/auth';
import { StreamService } from '@/redux/features/streams/streamApi';

const CreateStreamScreen = () => {
  const { darkMode } = useSettingsStore();
  const { user } = useAuth();
  const theme = darkMode ? 'dark' : 'light';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: StreamType.KHUTBAH,
    scheduledStartTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    chatEnabled: true,
    isPrivate: false,
    tags: [] as string[],
    thumbnailUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleCreateStream = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your stream');
      return;
    }

    try {
      setLoading(true);
      const newStream = await StreamService.createNewStream({
        ...formData,
        center: user?.email || 'My Mosque',
        imam: user?.name || 'Host',
        status: StreamStatus.UPCOMING, // enum value
        scheduledStartTime: new Date(formData.scheduledStartTime), // ensure correct type
      });
      
      router.replace(`/streams`);
    } catch (error) {
      console.error('Error creating stream:', error);
      Alert.alert('Error', 'Failed to create stream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStart = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your stream');
      return;
    }

    try {
      setLoading(true);
     
      const newStream = await StreamService.quickStartStream({
        ...formData,
        center: user?.email || 'My Mosque',
        imam: user?.name || 'Host',
        status: StreamStatus.LIVE, // enum value
        scheduledStartTime: new Date(formData.scheduledStartTime), // ensure correct type
      });
      
      router.push(`/streams/broadcast?streamKey=${newStream.streamKey}`);

      
      
    } catch (error) {
      console.error('Error quick starting stream:', error);
      Alert.alert('Error', 'Failed to start stream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (formData.tags.length >= 5) return;
    const newTag = `tag${formData.tags.length + 1}`;
    setFormData({...formData, tags: [...formData.tags, newTag]});
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData({...formData, tags: newTags});
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors[theme].text }]}>Create New Stream</Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Title*</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors[theme].card,
              color: colors[theme].text,
              borderColor: colors[theme].border
            }
          ]}
          placeholder="Enter stream title"
          placeholderTextColor={colors[theme].inactive}
          value={formData.title}
          onChangeText={(text) => setFormData({...formData, title: text})}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Description</Text>
        <TextInput
          style={[
            styles.textarea,
            { 
              backgroundColor: colors[theme].card,
              color: colors[theme].text,
              borderColor: colors[theme].border
            }
          ]}
          placeholder="Enter stream description"
          placeholderTextColor={colors[theme].inactive}
          multiline
          numberOfLines={4}
          value={formData.description}
          onChangeText={(text) => setFormData({...formData, description: text})}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Stream Type*</Text>
        <View style={[
          styles.pickerContainer,
          { 
            backgroundColor: colors[theme].card,
            borderColor: colors[theme].border
          }
        ]}>
          <Picker
            selectedValue={formData.type}
            onValueChange={(itemValue: StreamType) => setFormData({...formData, type: itemValue})}
            style={{ color: colors[theme].text }}
          >
            {Object.values(StreamType).map((type) => (
              <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
            ))}
          </Picker>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Thumbnail URL</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors[theme].card,
              color: colors[theme].text,
              borderColor: colors[theme].border
            }
          ]}
          placeholder="Enter thumbnail URL (optional)"
          placeholderTextColor={colors[theme].inactive}
          value={formData.thumbnailUrl}
          onChangeText={(text) => setFormData({...formData, thumbnailUrl: text})}
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Enable Chat</Text>
        <Switch
          value={formData.chatEnabled}
          onValueChange={(value) => setFormData({...formData, chatEnabled: value})}
          trackColor={{ false: colors[theme].inactive, true: colors[theme].primary }}
          thumbColor={colors[theme].card}
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Private Stream</Text>
        <Switch
          value={formData.isPrivate}
          onValueChange={(value) => setFormData({...formData, isPrivate: value})}
          trackColor={{ false: colors[theme].inactive, true: colors[theme].primary }}
          thumbColor={colors[theme].card}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Tags</Text>
        <View style={styles.tagsContainer}>
          {formData.tags.map((tag, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.tag, { backgroundColor: colors[theme].primary }]}
              onPress={() => removeTag(index)}
            >
              <Text style={styles.tagText}>#{tag} ×</Text>
            </TouchableOpacity>
          ))}
          {formData.tags.length < 5 && (
            <TouchableOpacity
              style={[styles.addTagButton, { borderColor: colors[theme].primary }]}
              onPress={addTag}
            >
              <Text style={[styles.addTagText, { color: colors[theme].primary }]}>+ Add Tag</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.createButton,
          { backgroundColor: colors[theme].primary }
        ]}
        onPress={handleCreateStream}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.createButtonText}>Schedule Stream</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.quickStartButton,
          { backgroundColor: colors[theme].secondary }
        ]}
        onPress={handleQuickStart}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.createButtonText}>Start Stream Now</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      contentContainer: {
        padding: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
      },
      formGroup: {
        marginBottom: 20,
      },
      switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
      },
      input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
      },
      textarea: {
        height: 100,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        textAlignVertical: 'top',
      },
      pickerContainer: {
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
      },
      dateInput: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
      },
      dateText: {
        marginLeft: 10,
        fontSize: 16,
      },
      createButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      quickStartButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      },
      createButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
      },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  addTagButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  addTagText: {
    fontSize: 12,
  },
});

export default CreateStreamScreen;