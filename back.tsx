// case 'identity':
//         response = 'Let me help you understand who you are...';
//         setMessages(prevMessages => [
//           createBotMessage(response, [
//             { id: 'identity', text: 'Who am I?' },
//             { id: 'family', text: 'Who is my family?' },
//             { id: 'emergency', text: 'Emergency Contacts' },
//             { id: 'assistance', text: 'General Assistance' },
//           ]),
//           createUserMessage(optionText),
//           ...prevMessages,
//         ]);
//         break;
//       case 'family':
//         response = 'I can tell you about your family members...';
//         setMessages(prevMessages => [
//           createBotMessage(response, [
//             { id: 'identity', text: 'Who am I?' },
//             { id: 'family', text: 'Who is my family?' },
//             { id: 'emergency', text: 'Emergency Contacts' },
//             { id: 'assistance', text: 'General Assistance' },
//           ]),
//           createUserMessage(optionText),
//           ...prevMessages,
//         ]);
//         break;
//       case 'emergency':
//         response = 'Here are your emergency contacts...';
//         setMessages(prevMessages => [
//           createBotMessage(response, [
//             { id: 'identity', text: 'Who am I?' },
//             { id: 'family', text: 'Who is my family?' },
//             { id: 'emergency', text: 'Emergency Contacts' },
//             { id: 'assistance', text: 'General Assistance' },
//           ]),
//           createUserMessage(optionText),
//           ...prevMessages,
//         ]);
//         break;
//       case 'assistance':
//         response = 'How can I assist you today?';
//         setMessages(prevMessages => [
//           createBotMessage(response, [
//             { id: 'identity', text: 'Who am I?' },
//             { id: 'family', text: 'Who is my family?' },
//             { id: 'emergency', text: 'Emergency Contacts' },
//             { id: 'assistance', text: 'General Assistance' },
//           ]),
//           createUserMessage(optionText),
//           ...prevMessages,
//         ]);
//         break;