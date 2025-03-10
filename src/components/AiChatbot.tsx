import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  Mic,
  Sun,
  Moon,
  Sparkles,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import userData from '../../db/data.json';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import 'regenerator-runtime/runtime';
import { ParticlesBackground } from './ParticlesBackground';
import { EmojiPicker } from './EmojiPicker';

interface AiChatbotProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reactions?: string[];
  parentId?: string;
}

type ChatMode = 'personal' | 'general';
type ThemeMode = 'dark' | 'light';
type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';

// Initialize Gemini API with error handling
const initializeGeminiApi = () => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY1;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    return null;
  }
};

export const AiChatbot: React.FC<AiChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi there! I'm Arbaaz's AI assistant. Ask me anything about Arbaaz, his projects, skills, or experience, or switch to general mode for broader questions!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('personal');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const model = useRef(initializeGeminiApi());

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    resetTranscript();
    setIsLoading(true);
    setError(null);

    try {
      let response: string;

      if (chatMode === 'personal') {
        response = await generatePersonalResponse(input);
      } else {
        if (!model.current) {
          throw new Error('AI model not initialized');
        }
        const result = await model.current.generateContent(input);
        response = result.response.text();
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        parentId: messageId,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Sorry, I encountered an error. Please try again.');

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble processing your request. Please try again or switch chat modes.",
        timestamp: new Date(),
        parentId: messageId,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalResponse = async (query: string): Promise<string> => {
    // Create a context from user data
    const context = {
      projects: userData.projects,
      bio: userData.about.bio,
      contact: userData.contact,
    };

    try {
      if (!model.current) {
        throw new Error('AI model not initialized');
      }

      // Prepare a prompt that includes the context
      const prompt = `
        You are an AI assistant for Arbaaz, a software engineer. Here's the context about Arbaaz:
        
        Bio: ${context.bio}
        
        Projects:
        ${Object.entries(context.projects)
          .map(([name, details]) => `- ${name}: ${details.description}`)
          .join('\n')}
        
        Contact Information:
        ${Object.entries(context.contact)
          .map(([platform, link]) => `- ${platform}: ${link}`)
          .join('\n')}
        
        Based on this information, please provide a natural and informative response to this question:
        ${query}
        
        Keep the response concise, professional, and focused on Arbaaz's information.
      `;

      const result = await model.current.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error with personal response:', error);
      throw error;
    }
  };

  // Handle click outside to prevent input focus issues
  const handleChatbotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleChatMode = () => {
    setChatMode((prev) => (prev === 'personal' ? 'general' : 'personal'));
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Switched to ${
          chatMode === 'personal' ? 'general' : 'personal'
        } mode. ${
          chatMode === 'personal'
            ? 'I can now answer questions about any topic using my knowledge base.'
            : 'I will now focus on answering questions about Arbaaz.'
        }`,
        timestamp: new Date(),
      },
    ]);
  };

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleVoiceInput = () => {
    if (browserSupportsSpeechRecognition) {
      if (listening) {
        SpeechRecognition.stopListening();
      } else {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
      }
    } else {
      alert('Your browser does not support speech recognition.');
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              reactions: [...(message.reactions || []), emoji],
            }
          : message
      )
    );
    setShowEmojiPicker(false);
    setActiveMessageId(null);
  };

  const getThemeClasses = () => {
    const baseClasses = 'transition-all duration-300';
    const modeClasses =
      themeMode === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-gray-100 text-gray-800';

    let colorClasses = '';
    switch (themeColor) {
      case 'blue':
        colorClasses = 'accent-blue-500';
        break;
      case 'purple':
        colorClasses = 'accent-purple-500';
        break;
      case 'green':
        colorClasses = 'accent-green-500';
        break;
      case 'orange':
        colorClasses = 'accent-orange-500';
        break;
      case 'pink':
        colorClasses = 'accent-pink-500';
        break;
    }

    return `${baseClasses} ${modeClasses} ${colorClasses}`;
  };

  const getMessageClasses = (role: 'user' | 'assistant') => {
    const baseClasses = 'rounded-lg p-4 shadow-lg max-w-[80%] relative';

    if (role === 'user') {
      return `${baseClasses} ml-auto ${
        themeMode === 'dark'
          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
          : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
      }`;
    } else {
      return `${baseClasses} mr-auto ${
        themeMode === 'dark'
          ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100'
          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800'
      }`;
    }
  };

  return (
    <div
      className={`flex flex-col h-full relative ${getThemeClasses()}`}
      onClick={handleChatbotClick}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ParticlesBackground themeMode={themeMode} themeColor={themeColor} />
      </div>

      {/* Header */}
      <div
        className={`terminal-header p-3 flex items-center justify-between z-10 ${
          themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center">
          <Bot
            size={18}
            className={`mr-2 ${
              themeColor === 'blue'
                ? 'text-blue-400'
                : themeColor === 'purple'
                ? 'text-purple-400'
                : themeColor === 'green'
                ? 'text-green-400'
                : themeColor === 'orange'
                ? 'text-orange-400'
                : 'text-pink-400'
            }`}
          />
          <span
            className={`text-sm ${
              themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            AI Assistant (
            {chatMode === 'personal' ? 'Personal Mode' : 'General Mode'})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleChatMode}
            className={`p-1.5 rounded-full transition-colors ${
              themeMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title={`Switch to ${
              chatMode === 'personal' ? 'General' : 'Personal'
            } Mode`}
          >
            {chatMode === 'personal' ? (
              <Sparkles size={16} className="text-yellow-400" />
            ) : (
              <MessageSquare size={16} className="text-blue-400" />
            )}
          </button>
          <button
            onClick={toggleThemeMode}
            className={`p-1.5 rounded-full transition-colors ${
              themeMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? (
              <Sun size={16} className="text-yellow-400" />
            ) : (
              <Moon size={16} className="text-blue-400" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-full transition-colors ${
              themeMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Settings"
          >
            <Settings
              size={16}
              className={
                themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }
            />
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              themeMode === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Close AI Assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden ${
              themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            } border-b ${
              themeMode === 'dark' ? 'border-gray-700' : 'border-gray-300'
            }`}
          >
            <div className="p-4">
              <h3
                className={`text-sm font-medium mb-2 ${
                  themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Theme Color
              </h3>
              <div className="flex space-x-2">
                {(
                  ['blue', 'purple', 'green', 'orange', 'pink'] as ThemeColor[]
                ).map((color) => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className={`w-6 h-6 rounded-full ${
                      color === 'blue'
                        ? 'bg-blue-500'
                        : color === 'purple'
                        ? 'bg-purple-500'
                        : color === 'green'
                        ? 'bg-green-500'
                        : color === 'orange'
                        ? 'bg-orange-500'
                        : 'bg-pink-500'
                    } ${
                      themeColor === color
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : ''
                    }`}
                    aria-label={`${color} theme`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        className={`flex-1 p-4 overflow-y-auto terminal-scrollbar terminal-content relative z-10 ${
          themeMode === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'
        }`}
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${getMessageClasses(message.role)}`}
              layout
            >
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <span
                    className={`text-xs ${
                      themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      themeMode === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="message-content">
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex mt-2 flex-wrap gap-1">
                    {message.reactions.map((emoji, index) => (
                      <span
                        key={index}
                        className="text-sm bg-gray-800/30 rounded-full px-1.5 py-0.5"
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message actions */}
                <div className="absolute bottom-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setActiveMessageId(message.id);
                      setShowEmojiPicker(
                        !showEmojiPicker && message.id === activeMessageId
                      );
                    }}
                    className={`p-1 rounded-full ${
                      themeMode === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    } text-xs`}
                  >
                    😀
                  </button>
                </div>
              </div>

              {/* Emoji picker */}
              {showEmojiPicker && activeMessageId === message.id && (
                <div className="absolute top-full right-0 mt-1 z-20">
                  <EmojiPicker
                    onSelect={(emoji) => addReaction(message.id, emoji)}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center mr-auto rounded-lg p-3 max-w-[80%] ${
              themeMode === 'dark'
                ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100'
                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800'
            }`}
          >
            <div className="flex items-center">
              <div className="flex space-x-1 mr-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className={`w-2 h-2 rounded-full ${
                    themeColor === 'blue'
                      ? 'bg-blue-400'
                      : themeColor === 'purple'
                      ? 'bg-purple-400'
                      : themeColor === 'green'
                      ? 'bg-green-400'
                      : themeColor === 'orange'
                      ? 'bg-orange-400'
                      : 'bg-pink-400'
                  }`}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className={`w-2 h-2 rounded-full ${
                    themeColor === 'blue'
                      ? 'bg-blue-400'
                      : themeColor === 'purple'
                      ? 'bg-purple-400'
                      : themeColor === 'green'
                      ? 'bg-green-400'
                      : themeColor === 'orange'
                      ? 'bg-orange-400'
                      : 'bg-pink-400'
                  }`}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className={`w-2 h-2 rounded-full ${
                    themeColor === 'blue'
                      ? 'bg-blue-400'
                      : themeColor === 'purple'
                      ? 'bg-purple-400'
                      : themeColor === 'green'
                      ? 'bg-green-400'
                      : themeColor === 'orange'
                      ? 'bg-orange-400'
                      : 'bg-pink-400'
                  }`}
                />
              </div>
              <span>Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className={`terminal-input-container p-3 relative z-10 ${
          themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask me anything in ${chatMode} mode...`}
            className={`flex-1 p-3 rounded-l-md outline-none transition-colors ${
              themeMode === 'dark'
                ? 'bg-gray-700 text-white border border-gray-600 focus:border-blue-500'
                : 'bg-gray-100 text-gray-800 border border-gray-300 focus:border-blue-400'
            }`}
            disabled={isLoading}
          />

          {/* Voice input button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-3 ${
              listening
                ? 'bg-red-500 hover:bg-red-600'
                : `${
                    themeColor === 'blue'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : themeColor === 'purple'
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : themeColor === 'green'
                      ? 'bg-green-500 hover:bg-green-600'
                      : themeColor === 'orange'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-pink-500 hover:bg-pink-600'
                  }`
            } text-white transition-colors`}
            disabled={isLoading || !browserSupportsSpeechRecognition}
            title={
              browserSupportsSpeechRecognition
                ? 'Voice input'
                : "Browser doesn't support voice input"
            }
          >
            <Mic size={18} className={listening ? 'animate-pulse' : ''} />
          </button>

          {/* Send button */}
          <button
            type="submit"
            className={`p-3 rounded-r-md ${
              themeColor === 'blue'
                ? 'bg-blue-600 hover:bg-blue-700'
                : themeColor === 'purple'
                ? 'bg-purple-600 hover:bg-purple-700'
                : themeColor === 'green'
                ? 'bg-green-600 hover:bg-green-700'
                : themeColor === 'orange'
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-pink-600 hover:bg-pink-700'
            } text-white transition-colors disabled:opacity-50`}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </form>

        {/* Mode indicator */}
        <div
          className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-t-lg text-xs font-medium ${
            chatMode === 'personal'
              ? 'bg-blue-500 text-white'
              : 'bg-yellow-500 text-gray-900'
          }`}
        >
          {chatMode === 'personal' ? (
            <div className="flex items-center">
              <MessageSquare size={12} className="mr-1" />
              Personal Mode
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles size={12} className="mr-1" />
              General Mode
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};
