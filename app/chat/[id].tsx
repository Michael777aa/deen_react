import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from '@/components/ChatMessage';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Send, Image as ImageIcon, Mic, Paperclip, X } from 'lucide-react-native';
import { ChatMessage as ChatMessageType } from '@/types';
import * as ImagePicker from 'expo-image-picker';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const { messages, sendMessage, sendImageMessage, isLoading } = useChatStore();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if ((input.trim() === '' && !image) || isLoading) return;
    
    if (image) {
      await sendImageMessage(image, input.trim());
      setImage(null);
    } else {
      await sendMessage(input.trim());
    }
    
    setInput('');
  };

  const pickImage = async () => {
    setShowAttachmentOptions(false);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
  };

  const takePhoto = async () => {
    setShowAttachmentOptions(false);
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
  };

  const renderItem = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage message={item} />
  );

  return (
    <>
      <Stack.Screen options={{ title: `Islamic Assistant` }} />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages.filter(m => m.role !== 'system')}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors[theme].primary} />
            <Text style={[styles.loadingText, { color: colors[theme].text }]}>
              Thinking...
            </Text>
          </View>
        )}
        
        {image && (
          <View style={[styles.imagePreviewContainer, { backgroundColor: colors[theme].card }]}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={[
          styles.inputContainer, 
          { 
            backgroundColor: colors[theme].card,
            borderTopColor: colors[theme].border
          }
        ]}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => setShowAttachmentOptions(!showAttachmentOptions)}
          >
            <Paperclip size={20} color={colors[theme].inactive} />
          </TouchableOpacity>
          
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors[theme].background,
                color: colors[theme].text,
                borderColor: colors[theme].border
              }
            ]}
            placeholder="Ask anything about Islam..."
            placeholderTextColor={colors[theme].inactive}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            editable={!isLoading}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { 
                backgroundColor: colors[theme].primary,
                opacity: (input.trim() === '' && !image) || isLoading ? 0.5 : 1
              }
            ]}
            onPress={handleSend}
            disabled={(input.trim() === '' && !image) || isLoading}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {showAttachmentOptions && (
          <View style={[styles.attachmentOptions, { backgroundColor: colors[theme].card }]}>
            <TouchableOpacity 
              style={styles.attachmentOption}
              onPress={pickImage}
            >
              <View style={[styles.attachmentIconContainer, { backgroundColor: colors[theme].primary + '20' }]}>
                <ImageIcon size={24} color={colors[theme].primary} />
              </View>
              <Text style={[styles.attachmentOptionText, { color: colors[theme].text }]}>
                Gallery
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.attachmentOption}
              onPress={takePhoto}
            >
              <View style={[styles.attachmentIconContainer, { backgroundColor: colors[theme].primary + '20' }]}>
                <Mic size={24} color={colors[theme].primary} />
              </View>
              <Text style={[styles.attachmentOptionText, { color: colors[theme].text }]}>
                Camera
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  imagePreviewContainer: {
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentOptions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  attachmentOption: {
    alignItems: 'center',
    marginRight: 24,
  },
  attachmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentOptionText: {
    fontSize: 12,
  },
});