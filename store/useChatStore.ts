// import { create } from 'zustand';
// import { ChatMessage } from '@/types';

// type ChatState = {
//   messages: ChatMessage[];
//   isLoading: boolean;
//   error: string | null;
//   addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
//   sendMessage: (content: string) => Promise<void>;
//   sendImageMessage: (imageUri: string, caption?: string) => Promise<void>;
//   clearMessages: () => void;
// };

// export const useChatStore = create<ChatState>((set, get) => ({
//   messages: [
//     {
//       id: '1',
//       role: 'system',
//       content: 'I am an AI assistant that can help with Islamic knowledge. Ask me anything about Islam, the Quran, Hadith, or Islamic practices.',
//       timestamp: new Date().toISOString(),
//     },
//     {
//       id: '2',
//       role: 'assistant',
//       content: 'Assalamu alaikum! I am your Islamic knowledge assistant. How can I help you today?',
//       timestamp: new Date().toISOString(),
//     },
//   ],
//   isLoading: false,
//   error: null,
//   addMessage: (message) => {
//     const newMessage: ChatMessage = {
//       id: Date.now().toString(),
//       timestamp: new Date().toISOString(),
//       ...message,
//     };
//     set((state) => ({
//       messages: [...state.messages, newMessage],
//     }));
//   },
//   sendMessage: async (content) => {
//     const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
//       role: 'user',
//       content,
//     };

//     get().addMessage(userMessage);
//     set({ isLoading: true });

//     try {
//       // Simulate API call to AI service
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       // In a real app, this would be an API call to your AI service
//       let response = '';

//       if (content.toLowerCase().includes('quran')) {
//         response = "The Quran is the central religious text of Islam. Muslims believe it was revealed to the Prophet Muhammad (peace be upon him) by the angel Gabriel over a period of approximately 23 years, beginning in 610 CE. It consists of 114 chapters (surahs) and is regarded as the verbatim word of Allah. The Quran provides guidance on all aspects of life, including faith, worship, ethics, and social relations.";
//       } else if (content.toLowerCase().includes('prayer') || content.toLowerCase().includes('salah')) {
//         response = "Prayer (Salah) is one of the Five Pillars of Islam. Muslims pray five times a day: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night). Each prayer consists of specific movements and recitations, including standing, bowing, prostrating, and sitting. Before prayer, Muslims perform a ritual purification called Wudu. Prayer is a direct connection with Allah and is considered essential for spiritual growth.";
//       } else if (content.toLowerCase().includes('hadith')) {
//         response = "Hadith are the recorded sayings, actions, and silent approvals of the Prophet Muhammad (peace be upon him). They are considered the second most important source of Islamic law and guidance after the Quran. Hadith were meticulously collected and authenticated by scholars through a rigorous process of verification. The most authentic collections are Sahih Bukhari and Sahih Muslim. Hadith provide practical examples of how to implement Quranic teachings in daily life.";
//       } else if (content.toLowerCase().includes('dua')) {
//         response = "Dua is the act of supplication or asking Allah for assistance, guidance, or blessings. It is a form of worship and a way to communicate directly with Allah. The Prophet Muhammad (peace be upon him) taught many duas for different occasions. Some of the most powerful duas include Ayatul Kursi, the last two verses of Surah Al-Baqarah, and Dua for forgiveness. Allah loves when His servants ask Him, and making dua is encouraged at all times, especially during the last third of the night.";
//       } else if (content.toLowerCase().includes('pillars') || content.toLowerCase().includes('five pillars')) {
//         response = "The Five Pillars of Islam are the fundamental practices that every Muslim must follow:\n\n1. Shahada (Faith): The declaration of faith - 'There is no god but Allah, and Muhammad is the messenger of Allah.'\n\n2. Salah (Prayer): Performing the five daily prayers.\n\n3. Zakat (Charity): Giving a portion of one's wealth to those in need.\n\n4. Sawm (Fasting): Fasting during the month of Ramadan from dawn to sunset.\n\n5. Hajj (Pilgrimage): Making the pilgrimage to Mecca at least once in a lifetime if physically and financially able.";
//       } else if (content.toLowerCase().includes('ramadan')) {
//         response = "Ramadan is the ninth month of the Islamic lunar calendar and is considered the holiest month for Muslims. During Ramadan, Muslims fast from dawn to sunset, abstaining from food, drink, and other physical needs. It is a time of spiritual reflection, increased devotion, and worship. The Quran was first revealed to Prophet Muhammad during Ramadan. The month ends with the celebration of Eid al-Fitr. Fasting during Ramadan is one of the Five Pillars of Islam and teaches self-discipline, sacrifice, and empathy for those less fortunate.";
//       } else {
//         response = "Thank you for your question. In Islam, seeking knowledge is highly encouraged. The Prophet Muhammad (peace be upon him) said: 'Seeking knowledge is obligatory upon every Muslim.' Islam encourages a balance between faith and reason, and promotes critical thinking within the framework of divine guidance. The Quran repeatedly asks people to reflect, ponder, and use their intellect. Is there something specific about Islamic teachings you would like to know more about?";
//       }

//       const assistantMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
//         role: 'assistant',
//         content: response,
//       };

//       get().addMessage(assistantMessage);
//       set({ isLoading: false });
//     } catch (error) {
//       set({ error: 'Failed to get response', isLoading: false });
//     }
//   },
//   sendImageMessage: async (imageUri, caption = '') => {
//     // Create a user message with image
//     const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
//       role: 'user',
//       content: caption,
//       imageUri: imageUri
//     };

//     get().addMessage(userMessage);
//     set({ isLoading: true });

//     try {
//       // Simulate API call to AI service
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // In a real app, this would be an API call to your AI service with image analysis
//       let response = '';

//       if (caption.toLowerCase().includes('quran')) {
//         response = "Thank you for sharing this image. I can see it's related to the Quran. The Quran is the holy book of Islam, containing the revelations of Allah to Prophet Muhammad through the angel Gabriel. It consists of 114 chapters (surahs) and provides guidance for all aspects of life.";
//       } else if (caption.toLowerCase().includes('mosque') || imageUri.toLowerCase().includes('mosque')) {
//         response = "This appears to be a mosque (masjid). Mosques are places of worship for Muslims where they gather for daily prayers, Friday congregational prayers, and other religious activities. The architectural features often include domes, minarets, and prayer halls oriented towards the Kaaba in Mecca.";
//       } else if (caption.toLowerCase().includes('food') || caption.toLowerCase().includes('halal')) {
//         response = "Thank you for sharing this food image. In Islam, food must be halal (permissible) to consume. This means it should not contain pork, alcohol, or meat from animals not slaughtered according to Islamic guidelines. Muslims are encouraged to say 'Bismillah' (In the name of Allah) before eating and to eat with the right hand.";
//       } else {
//         response = "Thank you for sharing this image. In Islam, visual representations are approached with care. While artistic expression is valued, Islam emphasizes focusing on the Creator rather than created images, especially avoiding idolatry. If you have specific questions about what you've shared or about Islamic perspectives on art and imagery, please let me know.";
//       }

//       const assistantMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
//         role: 'assistant',
//         content: response,
//       };

//       get().addMessage(assistantMessage);
//       set({ isLoading: false });
//     } catch (error) {
//       set({ error: 'Failed to process image', isLoading: false });
//     }
//   },
//   clearMessages: () => {
//     set({
//       messages: [
//         {
//           id: '1',
//           role: 'system',
//           content: 'I am an AI assistant that can help with Islamic knowledge. Ask me anything about Islam, the Quran, Hadith, or Islamic practices.',
//           timestamp: new Date().toISOString(),
//         },
//         {
//           id: '2',
//           role: 'assistant',
//           content: 'Assalamu alaikum! I am your Islamic knowledge assistant. How can I help you today?',
//           timestamp: new Date().toISOString(),
//         },
//       ],
//     });
//   },
// }));
