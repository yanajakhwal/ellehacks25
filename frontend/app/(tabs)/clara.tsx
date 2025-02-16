import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, IMessage as GiftedChatMessage } from 'react-native-gifted-chat';
import { useRouter, useNavigation } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
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
    setDisabledBatchId(messageId); // Disable the current batch
  
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
          createBotMessage('Are you a patient or a caregiver? Hint: if you are unsure pick the first option!', [
            { id: 'patient', text: 'I am a patient' },
            { id: 'caregiver', text: 'I am a caregiver' },
          ]),
        ]);
        // Do NOT update disabledBatchId here; let it remain as the current batch's ID
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
  }, [])

  const renderBubble = (props: any) => {
    const isBatchDisabled = disabledBatchId === props.currentMessage._id;

    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            left: { backgroundColor: '#F4F5C9', borderRadius: 30, padding: 5, marginBottom: 5 },
            right: { backgroundColor: '#FFFAD1', borderRadius: 30, padding: 5, marginBottom: 5 },
          }}
          textStyle={{ left: { color: '#000', fontSize: 16 }, right: { color: '#000', fontSize: 16 } }}
        />
        {props.currentMessage.options && (
          <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
            {props.currentMessage.options.map((option: ChatOption) => (
              <TouchableOpacity
                key={option.id}
                onPress={isBatchDisabled ? undefined : () => handleOptionSelect(option.id, option.text, props.currentMessage._id)}
                style={{
                  backgroundColor: isBatchDisabled ? '#CCCCCC' : '#FFFAD1',
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
                disabled={isBatchDisabled}
              >
                <Text style={{ fontSize: 18, color: '#000' }}>{option.text}</Text>
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

      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        user={{ _id: 1 }}
        renderInputToolbar={() => null}
        inverted={false}
        renderAvatar={null}
        minInputToolbarHeight={0}
        alwaysShowSend={false}
      />
    </SafeAreaView>
  );
};

export default ClaraChatScreen;
