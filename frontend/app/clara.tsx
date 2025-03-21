import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { GiftedChat, Bubble, IMessage as GiftedChatMessage } from 'react-native-gifted-chat';
import { useRouter, useNavigation } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Color scheme
const COLORS = {
  primary: '#FEF9D9',    // Light cream
  secondary: '#8EACCD',  // Muted blue
  tertiary: '#D2E0FB',   // Light blue
  accent: '#DEE5D4',     // Sage green
  black: '#000000',
  white: '#FFFFFF'
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.85; // Makes buttons 85% of screen width

interface IMessage extends GiftedChatMessage {
  options?: ChatOption[];
}

interface ChatOption {
  id: string;
  text: string;
}

const ClaraChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [disabledBatchId, setDisabledBatchId] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ 
      headerShown: false 
    });
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => navigation.setOptions({ tabBarStyle: undefined });
  }, [navigation, fadeAnim]);

  useEffect(() => {
    setMessages([
      createBotMessage('Welcome! Are you a patient or a caregiver?\nHint: if you are unsure pick the first option!', [
        { id: 'patient', text: 'I am a patient' },
        { id: 'caregiver', text: 'I am a caregiver' },
      ]),
    ]);
  }, []);

  const createBotMessage = (text: string, options?: ChatOption[]): IMessage => ({
    _id: Math.round(Math.random() * 1000000).toString(),
    text,
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'Clara',
      avatar: require('@/assets/images/clara-logo.png'),
    },
    options,
  });

  const createUserMessage = (text: string): IMessage => ({
    _id: Math.round(Math.random() * 1000000).toString(),
    text,
    createdAt: new Date(),
    user: {
      _id: 1,
    },
  });

  const handleOptionSelect = useCallback((optionId: string, optionText: string, messageId: string) => {
    setDisabledBatchId(messageId);
    
    const fadeOutAnimation = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });
  
    const fadeInAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });
  
    fadeOutAnimation.start(() => {
      let response: string;
      switch (optionId) {
        case 'patient':
          response = 'What can I help you with today?';
          setMessages(prevMessages => [
            ...prevMessages,
            createUserMessage(optionText),
            createBotMessage(response, [
              { id: 'location', text: 'Where am I?' },
              { id: 'family', text: 'Who is my family?' },
              { id: 'emergency', text: 'Emergency Contacts' },
              { id: 'assistance', text: 'General Assistance' },
              { id: 'back', text: 'Back' },
            ]),
          ]);
          break;
  
        case 'caregiver':
          router.push('/login'); // Navigate to the login screen
          break;
  
        case 'back':
          setMessages(prevMessages => [
            ...prevMessages,
            createUserMessage(optionText),
            createBotMessage('Are you a patient or a caregiver?\nHint: if you are unsure pick the first option!', [
              { id: 'patient', text: 'I am a patient' },
              { id: 'caregiver', text: 'I am a caregiver' },
            ]),
          ]);
          break;
  
        case 'location':
          router.push('/geoscreen'); // Route to geoscreen.tsx
          break;
  
        case 'family':
          router.push('/Family'); // Route to family.tsx
          break;
  
        case 'emergency':
          router.push('/contacts'); // Route to contact.tsx
          break;
  
        case 'assistance':
          router.push('/chatbot'); // Route to chatbot.tsx
          break;
  
        default:
          response = 'How else can I help you?';
          setMessages(prevMessages => [
            ...prevMessages,
            createUserMessage(optionText),
            createBotMessage(response, [
              { id: 'location', text: 'Where am I?' },
              { id: 'family', text: 'Who is my family?' },
              { id: 'emergency', text: 'Emergency Contacts' },
              { id: 'assistance', text: 'General Assistance' },
              { id: 'back', text: 'Back' },
            ]),
          ]);
          break;
      }
      fadeInAnimation.start();
    });
  }, [fadeAnim, router]);

  const renderBubble = (props: any) => {
    const isBatchDisabled = disabledBatchId === props.currentMessage._id;
    const isUser = props.currentMessage.user._id === 1;

    return (
      <Animated.View style={{ 
        opacity: fadeAnim,
      }}>
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: COLORS.primary,
              borderRadius: 20,
              padding: 12,
              marginBottom: 8,
              maxWidth: BUTTON_WIDTH,
            },
            right: {
              backgroundColor: COLORS.tertiary,
              borderRadius: 20,
              padding: 12,
              marginBottom: 8,
              maxWidth: BUTTON_WIDTH,
            },
          }}
          textStyle={{
            left: { color: COLORS.black, fontSize: 16, lineHeight: 22 },
            right: { color: COLORS.black, fontSize: 16, lineHeight: 22 }
          }}
        />
        {props.currentMessage.options && (
          <View style={{ 
            marginTop: 12,
            width: BUTTON_WIDTH, // Ensure buttons have the same width
          }}>
            {props.currentMessage.options.map((option: ChatOption) => (
              <TouchableOpacity
                key={option.id}
                onPress={isBatchDisabled ? undefined : () => handleOptionSelect(option.id, option.text, props.currentMessage._id)}
                style={{
                  backgroundColor: isBatchDisabled ? COLORS.accent : COLORS.secondary,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  width: '100%', // Ensure buttons take full width of their container
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: COLORS.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  transform: [{ scale: isBatchDisabled ? 0.98 : 1 }],
                }}
                disabled={isBatchDisabled}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 16,
                  color: isBatchDisabled ? COLORS.black : COLORS.white,
                  fontWeight: '500',
                }}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Header with Back Button */}
      <View style={{
        backgroundColor: COLORS.secondary,
        paddingVertical: 16,
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Center items vertically
        justifyContent: 'flex-start', // Align items to the left
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push('/')} // Navigate back to the homepage
          style={{
            marginLeft: 16, // Add some spacing from the left edge
          }}
        >
          <Text style={{ fontSize: 24, color: COLORS.white }}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{
            fontSize: 24,
            color: COLORS.white,
            fontWeight: '500',
            letterSpacing: 0.5,
            marginLeft: -38, // Offset the title to the left
          }}>
            Clara
          </Text>
        </View>
      </View>

      {/* Chat Interface */}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        user={{ _id: 1 }}
        renderInputToolbar={() => null}
        inverted={false}
        renderAvatar={null}
        minInputToolbarHeight={0}
        alwaysShowSend={false}
        listViewProps={{
          style: { backgroundColor: COLORS.white },
          contentContainerStyle: { paddingVertical: 16 },
        }}
      />
    </SafeAreaView>
  );
};

export default ClaraChatScreen;