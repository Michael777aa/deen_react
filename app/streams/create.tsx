// src/screens/CreateStreamScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { StreamStatus, StreamType } from '@/types/stream.enum';
import { Picker } from '@react-native-picker/picker';
import {  Calendar, Clock } from 'lucide-react-native';
import { useAuth } from '@/context/auth';
import { StreamService } from '@/redux/features/streams/streamApi';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const CreateStreamScreen = () => {
  const { darkMode } = useSettingsStore();
  const { user } = useAuth();
  const theme = darkMode ? 'dark' : 'light';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: StreamType.KHUTBAH,
    status: StreamStatus.UPCOMING,
    scheduledStartTime: new Date,
    chatEnabled: true,
    isPrivate: false,
    tags: [] as string[],
    thumbnailUrl: '',
    tagInput: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update current date every minute to keep it fresh
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCreateStream = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your stream');
      return;
    }

    // Check if scheduled time is in the past
    if (formData.scheduledStartTime < currentDate) {
      Alert.alert('Invalid Time', 'Scheduled time cannot be in the past');
      return;
    }

    try {
      setLoading(true);
      const newStream = await StreamService.createNewStream({
        ...formData,
        center: user?.email || 'My Mosque',
        imam: user?.name || 'Host',
      });
      
      router.replace(`/streams/${newStream._id}`);
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
      });
      
      router.push(`/streams/broadcast?streamKey=${newStream.streamKey}`);
    } catch (error) {
      console.error('Error quick starting stream:', error);
      Alert.alert('Error', 'Failed to start stream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (!formData.tagInput.trim()) return;
    if (formData.tags.length >= 5) {
      Alert.alert('Maximum tags reached', 'You can only add up to 5 tags');
      return;
    }
    if (formData.tags.includes(formData.tagInput)) {
      Alert.alert('Duplicate tag', 'This tag already exists');
      return;
    }
    
    setFormData({
      ...formData,
      tags: [...formData.tags, formData.tagInput.trim()],
      tagInput: ''
    });
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowPicker(null);
    if (selectedDate) {
      // On Android, we need to combine date and time
      if (showPicker === 'date' && Platform.OS === 'android') {
        const newDate = new Date(selectedDate);
        newDate.setHours(formData.scheduledStartTime.getHours());
        newDate.setMinutes(formData.scheduledStartTime.getMinutes());
        selectedDate = newDate;
      } else if (showPicker === 'time' && Platform.OS === 'android') {
        const newDate = new Date(formData.scheduledStartTime);
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        selectedDate = newDate;
      }
      
      setFormData({
        ...formData,
        scheduledStartTime: selectedDate
      });
    }
  };

  const showDatepicker = () => {
    setShowPicker('date');
  };

  const showTimepicker = () => {
    setShowPicker('time');
  };

  const formatDateTime = () => {
    return formData.scheduledStartTime.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate minimum date (today) and maximum date (1 year from now)
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors[theme].background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors[theme].text }]}>Create New Stream</Text>
      
      {/* Title Field */}
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
          maxLength={100}
        />
      </View>
      
      {/* Description Field */}
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
          maxLength={500}
        />
      </View>
      
      {/* Stream Status */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Stream Status*</Text>
        <View style={[
          styles.pickerContainer,
          {
            backgroundColor: colors[theme].card,
            borderColor: colors[theme].border
          }
        ]}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(value: StreamStatus) => setFormData({ ...formData, status: value })}
            style={{ color: colors[theme].text }}
          >
            {Object.values(StreamStatus).map((status) => (
              <Picker.Item
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                value={status}
              />
            ))}
          </Picker>
        </View>
      </View>
      
      {/* Stream Type */}
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
              <Picker.Item 
                key={type} 
                label={type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} 
                value={type} 
              />
            ))}
          </Picker>
        </View>
      </View>
      
      {/* Scheduled Date/Time */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Scheduled Time*</Text>
        <View style={styles.datetimeContainer}>
          <TouchableOpacity 
            style={[
              styles.datetimeButton,
              { 
                backgroundColor: colors[theme].card,
                borderColor: colors[theme].border
              }
            ]}
            onPress={showDatepicker}
          >
            <Calendar size={18} color={colors[theme].text} />
            <Text style={[styles.datetimeText, { color: colors[theme].text }]}>
              {formData.scheduledStartTime.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.datetimeButton,
              { 
                backgroundColor: colors[theme].card,
                borderColor: colors[theme].border
              }
            ]}
            onPress={showTimepicker}
          >
            <Clock size={18} color={colors[theme].text} />
            <Text style={[styles.datetimeText, { color: colors[theme].text }]}>
              {formData.scheduledStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.datetimePreview, { color: colors[theme].text }]}>
          Scheduled for: {formatDateTime()}
        </Text>
        
        {showPicker && (
          <DateTimePicker
            value={formData.scheduledStartTime}
            mode={showPicker}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateTimeChange}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
        )}
      </View>
      
      {/* Thumbnail URL */}
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
          keyboardType="url"
        />
      </View>
      
      {/* Chat Enabled Switch */}
      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Enable Chat</Text>
        <Switch
          value={formData.chatEnabled}
          onValueChange={(value) => setFormData({...formData, chatEnabled: value})}
          trackColor={{ false: colors[theme].inactive, true: colors[theme].primary }}
          thumbColor={colors[theme].card}
        />
      </View>
      
      {/* Private Stream Switch */}
      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Private Stream</Text>
        <Switch
          value={formData.isPrivate}
          onValueChange={(value) => setFormData({...formData, isPrivate: value})}
          trackColor={{ false: colors[theme].inactive, true: colors[theme].primary }}
          thumbColor={colors[theme].card}
        />
      </View>
      
      {/* Tags */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors[theme].text }]}>Tags (max 5)</Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={[
              styles.tagInput,
              { 
                backgroundColor: colors[theme].card,
                color: colors[theme].text,
                borderColor: colors[theme].border
              }
            ]}
            placeholder="Add a tag"
            placeholderTextColor={colors[theme].inactive}
            value={formData.tagInput}
            onChangeText={(text) => setFormData({...formData, tagInput: text})}
            onSubmitEditing={handleAddTag}
            returnKeyType="done"
            maxLength={20}
          />
          <TouchableOpacity
            style={[
              styles.addTagButton,
              { backgroundColor: colors[theme].primary }
            ]}
            onPress={handleAddTag}
            disabled={!formData.tagInput.trim()}
          >
            <Text style={styles.addTagButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tagsContainer}>
          {formData.tags.map((tag) => (
            <View key={tag} style={[
              styles.tag,
              { backgroundColor: colors[theme].primary }
            ]}>
              <Text style={styles.tagText}>#{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text style={styles.tagRemove}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  datetimeButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  datetimeText: {
    marginLeft: 10,
    fontSize: 16,
  },
  datetimePreview: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 10,
  },
  addTagButton: {
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  tagRemove: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  createButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickStartButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateStreamScreen;