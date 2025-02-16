import React, { useState, useCallback, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  TouchableOpacity, 
  Text, 
  Dimensions, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { GiftedChat, Bubble, IMessage, InputToolbar, Send } from 'react-native-gifted-chat';
import { useRouter, useNavigation } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/config';
import { IconSymbol } from '@/components/ui/IconSymbol';

const COLORS = {
  primary: '#FEF9D9',
  secondary: '#8EACCD',
  tertiary: '#D2E0FB',
  accent: '#DEE5D4',
  black: '#000000',
  white: '#FFFFFF'
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.85;
const TAB_BAR_HEIGHT = 49;

const DeepseekChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const router = useRouter();
    const navigation = useNavigation();
  
    useEffect(() => {
      const keyboardWillShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        () => setKeyboardVisible(true)
      );
      const keyboardWillHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => setKeyboardVisible(false)
      );
  
      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Deepseek',
          avatar: require('@/assets/images/clara-logo.png'),
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    try {
      setIsLoading(true);
      
      setMessages(previousMessages => 
        GiftedChat.append(previousMessages, newMessages)
      );

      const payload = {
        user_id: "user_123",
        user_data: {},
        conversation_history: messages.map(msg => ({
          role: msg.user._id === 1 ? "user" : "assistant",
          content: msg.text
        })),
        user_question: newMessages[0].text
      };

      const response = await axios.post(`${API_URL}/chat`, payload);

      const botMessage: IMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: response.data.response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Deepseek',
          avatar: require('@/assets/images/clara-logo.png'),
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [botMessage])
      );
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: IMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Deepseek',
          avatar: require('@/assets/images/clara-logo.png'),
        },
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const renderBubble = (props: any) => {
    return (
      <View>
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
      </View>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.secondary,
          padding: 8,
          paddingBottom: 68, // Add slight bottom padding
          paddingTop: 18, // Add slight top padding
          paddingHorizontal: 8, // Add slight horizontal padding
        }}
        primaryStyle={{ alignItems: 'center' }}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={{
          height: 44,
          width: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 4,
        }}
      >
        <View
          style={{
            height: 32,
            width: 32,
            borderRadius: 16,
            backgroundColor: COLORS.secondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconSymbol name="arrow.up.circle.fill" size={24} color={COLORS.white} />
        </View>
      </Send>
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: COLORS.white,
      paddingBottom: keyboardVisible ? 0 : TAB_BAR_HEIGHT 
    }}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={{ flex: 1 }}>
          <View style={{
            backgroundColor: COLORS.secondary,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            shadowColor: COLORS.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                color: COLORS.white,
                fontWeight: '500',
                letterSpacing: 0.5,
                marginLeft: 0,
              }}>
                Clara ♡
              </Text>
            </View>
          </View>

          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.select({
              ios: TAB_BAR_HEIGHT - 320,
              android: TAB_BAR_HEIGHT - 290,
            })}
          >
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{ _id: 1 }}
              renderBubble={renderBubble}
              renderInputToolbar={renderInputToolbar}
              renderSend={renderSend}
              renderLoading={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={COLORS.secondary} />
                </View>
              )}
              isLoadingEarlier={isLoading}
              renderAvatar={null}
              alwaysShowSend
              scrollToBottom
              textInputProps={{
                placeholder: 'Type a message...',
                style: {
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: COLORS.secondary,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 16,
                  height: 48,
                  maxHeight: 64,
                  flex: 1,
                  marginRight: 4,
                },
                multiline: true,
                numberOfLines: 2,
                textAlignVertical: 'center',
                onBlur: dismissKeyboard,
              }}
              listViewProps={{
                style: { backgroundColor: COLORS.white },
                contentContainerStyle: { 
                  paddingVertical: 16,
                },
                keyboardShouldPersistTaps: 'never',
                keyboardDismissMode: 'on-drag',
              }}
              minInputToolbarHeight={50}
              maxInputLength={1000}
              bottomOffset={keyboardVisible ? 0 : TAB_BAR_HEIGHT}
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default DeepseekChatScreen;
