// types.ts
import { IMessage as GiftedChatMessage } from 'react-native-gifted-chat';

export interface IMessage extends GiftedChatMessage {
  options?: ChatOption[];
}

export interface ChatOption {
  id: string;
  text: string;
}

export interface CustomMessageProps {
  options?: ChatOption[];
  customStyle?: any;
}

// ClaraChatScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Platform, StatusBar } from 'react-native';
import { GiftedChat, Bubble} from 'react-native-gifted-chat';
import { useRouter, useNavigation } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

const ClaraChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    // Hide tab bar
    navigation.setOptions({ tabBarStyle: { display: "none" } });
    return () => navigation.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  useEffect(() => {
    setMessages([
      createBotMessage('Are you a patient or a caregiver? Hint: if you are unsure pick the first option!', [
        { id: 'patient', text: 'I am a patient' },
        { id: 'caregiver', text: 'I am a caregiver' },
      ]),
    ]);
  }, []);

  const createBotMessage = (text: string, options?: ChatOption[]): IMessage => ({
    _id: Math.round(Math.random() * 1000000),
    text,
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'Clara',
      avatar: require('@/assets/images/clara-logo.png'),
    },
    options,
  });

  const handleUserTypeSelection = useCallback((type: string) => {
    setUserType(type);
    setMessages(prevMessages => [
      createBotMessage('If you are not sure, choose the first option!'),
      createBotMessage('What can I help you with today?', [
        { id: 'identity', text: 'Who am I?' },
        { id: 'family', text: 'Who is my family?' },
        { id: 'emergency', text: 'Emergency Contacts' },
        { id: 'assistance', text: 'General Assistance' },
      ]),
      ...prevMessages,
    ]);
  }, []);

  const handleOptionSelect = useCallback((optionId: string) => {
    let response: string;
    switch (optionId) {
      case 'identity':
        response = 'Let me help you understand who you are...';
        break;
      case 'family':
        response = 'I can tell you about your family members...';
        break;
      case 'emergency':
        response = 'Here are your emergency contacts...';
        break;
      case 'assistance':
        response = 'How can I assist you today?';
        break;
      default:
        response = 'How else can I help you?';
    }

    setMessages(prevMessages => [
      createBotMessage(response, [
        { id: 'identity', text: 'Who am I?' },
        { id: 'family', text: 'Who is my family?' },
        { id: 'emergency', text: 'Emergency Contacts' },
        { id: 'assistance', text: 'General Assistance' },
      ]),
      ...prevMessages,
    ]);
  }, []);

  const renderBubble = (props: any) => {
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#F4F5C9',
              borderRadius: 30,
              padding: 5,
              marginBottom: 5,
            },
            right: {
              backgroundColor: '#FFFAD1',
              borderRadius: 30,
              padding: 5,
              marginBottom: 5,
            },
          }}
          textStyle={{
            left: {
              color: '#000',
              fontSize: 16,
            },
            right: {
              color: '#000',
              fontSize: 16,
            },
          }}
        />
        {props.currentMessage.options && (
          <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
            {props.currentMessage.options.map((option: ChatOption) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleOptionSelect(option.id)}
                style={{
                  backgroundColor: '#FFFAD1',
                  borderRadius: 35,
                  padding: 15,
                  marginBottom: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
                }}
              >
                <Text style={{ fontSize: 18, color: '#000' }}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E6EEFA' }}>
      <View style={{ backgroundColor: '#A2B7D7', paddingVertical: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, color: 'white', fontWeight: 'normal' }}>Clara</Text>
      </View>
      
      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }} 
        onPress={() => router.back()}
      >
        <IconSymbol name="chevron.left" size={20} color="#000" />
        <Text style={{ fontSize: 18, marginLeft: 4, color: 'black' }}>back</Text>
      </TouchableOpacity>
  
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        user={{ _id: 1 }}
        renderInputToolbar={() => null} // Hide input toolbar since we're using buttons
        inverted={false} // Set to false to display messages from top to bottom
        renderAvatar={null} // Hide avatar
        minInputToolbarHeight={0} // Ensure no extra space is added
        alwaysShowSend={false} // Hide send button
      />
    </SafeAreaView>
  );
};

export default ClaraChatScreen;