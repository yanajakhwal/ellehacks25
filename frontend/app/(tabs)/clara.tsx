import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Animated, Platform, Dimensions } from 'react-native';
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
      tabBarStyle: { display: "none" },
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
        case 'caregiver':
          response = 'What can I help you with today?';
          setMessages(prevMessages => [
            ...prevMessages,
            createUserMessage(optionText),
            createBotMessage(response, [
              { id: 'identity', text: 'Who am I?' },
              { id: 'family', text: 'Who is my family?' },
              { id: 'emergency', text: 'Emergency Contacts' },
              { id: 'assistance', text: 'General Assistance' },
              { id: 'back', text: 'Back' },
            ]),
          ]);
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

        default:
          response = 'How else can I help you?';
          setMessages(prevMessages => [
            ...prevMessages,
            createUserMessage(optionText),
            createBotMessage(response, [
              { id: 'identity', text: 'Who am I?' },
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
  }, [fadeAnim]);

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
      <View style={{
        backgroundColor: COLORS.secondary,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Text style={{
          fontSize: 24,
          color: COLORS.white,
          fontWeight: '500',
          letterSpacing: 0.5,
        }}>
          Clara
        </Text>
      </View>

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