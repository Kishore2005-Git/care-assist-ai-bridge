import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { MessageCircle, Mic, Send, Volume2, Loader, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  detectLanguage,
  translateText,
  getUserLanguage,
  setUserLanguage,
  supportedLanguages,
  getOpenAIResponse
} from "@/utils/translationService";

interface Message {
  id: number;
  text: string;
  originalText?: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const MedicalChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(getUserLanguage());
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Initialize with translated welcome message
  useEffect(() => {
    const initializeChat = async () => {
      const welcomeMessage = "Hello! I'm your AI medical assistant. How can I help you today?";
      
      // Only translate if not English and auto-translate is on
      let translatedText = welcomeMessage;
      if (selectedLanguage !== 'en' && autoTranslate) {
        try {
          setIsTranslating(true);
          translatedText = await translateText({ 
            text: welcomeMessage, 
            targetLanguage: selectedLanguage,
            sourceLanguage: 'en'
          });
        } catch (error) {
          console.error('Translation error:', error);
        } finally {
          setIsTranslating(false);
        }
      }
      
      setMessages([{
        id: 1,
        text: translatedText,
        originalText: welcomeMessage,
        sender: "ai",
        timestamp: new Date(),
      }]);
    };
    
    initializeChat();
  }, [selectedLanguage]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Your browser does not support speech recognition");
      return;
    }

    // Clean up previous recognition instance
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Create new recognition instance with selected language
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage === 'zh' ? 'zh-CN' : 
                                    selectedLanguage === 'ja' ? 'ja-JP' :
                                    selectedLanguage === 'ko' ? 'ko-KR' :
                                    selectedLanguage === 'ar' ? 'ar-SA' :
                                    selectedLanguage === 'hi' ? 'hi-IN' :
                                    `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
        setNewMessage(transcript);
        
        // If result is final, stop listening and submit message
        if (event.results[0].isFinal) {
          if (transcript.trim() !== "") {
            setTimeout(() => {
              handleSendMessage(transcript);
              setIsListening(false);
            }, 500);
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error(`Speech recognition error: ${event.error}`);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setNewMessage("");
      toast.info("Listening...");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  const handleSendMessage = async (text: string = newMessage) => {
    if (text.trim() === "") return;
    
    setIsSending(true);
    
    let detectedLanguage = selectedLanguage;
    let userMessageText = text;
    
    try {
      // Auto-detect language if enabled and different from selected language
      detectedLanguage = await detectLanguage(text);
      
      // Add user message
      const userMessage: Message = {
        id: Date.now(),
        text: text,
        sender: "user",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      
      // If detected language is different from English and we need translation for AI
      let messageForAI = text;
      if (detectedLanguage !== 'en') {
        try {
          messageForAI = await translateText({
            text: text,
            targetLanguage: 'en',
            sourceLanguage: detectedLanguage
          });
        } catch (err) {
          console.error('Error translating user message for AI:', err);
          // Continue with original text if translation fails
        }
      }
      
      // Get AI response from OpenAI
      try {
        const aiResponseText = await getOpenAIResponse(messageForAI);
        
        // Translate AI response if needed
        let translatedResponse = aiResponseText;
        if (detectedLanguage !== 'en' && autoTranslate) {
          try {
            translatedResponse = await translateText({
              text: aiResponseText,
              targetLanguage: detectedLanguage,
              sourceLanguage: 'en'
            });
          } catch (err) {
            console.error('Error translating AI response:', err);
            // Continue with original response if translation fails
            translatedResponse = aiResponseText;
          }
        }
        
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: autoTranslate && detectedLanguage !== 'en' ? translatedResponse : aiResponseText,
          originalText: autoTranslate && detectedLanguage !== 'en' ? aiResponseText : undefined,
          sender: "ai",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsSending(false);
        
        // Read AI response aloud
        speakText(autoTranslate && detectedLanguage !== 'en' ? translatedResponse : aiResponseText);
        
        // If we detected a different language than selected, offer to switch
        if (detectedLanguage !== selectedLanguage && supportedLanguages.some(lang => lang.code === detectedLanguage)) {
          const detectedLangName = supportedLanguages.find(l => l.code === detectedLanguage)?.name;
        
          // Fix: Update the toast to use the correct format for sonner
          toast(`Language detected: ${detectedLangName}`, {
            action: {
              label: "Switch",
              onClick: () => handleLanguageChange(detectedLanguage),
            },
          });
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        toast.error('Failed to get response from AI. Please check your OpenAI API key.');
        setIsSending(false);
      }
    } catch (err) {
      console.error('Error in message handling:', err);
      setIsSending(false);
      toast.error('There was an error processing your message.');
    }
  };

  const speakText = (text: string) => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'zh' ? 'zh-CN' : 
                        selectedLanguage === 'ja' ? 'ja-JP' :
                        selectedLanguage === 'ko' ? 'ko-KR' :
                        selectedLanguage === 'ar' ? 'ar-SA' :
                        selectedLanguage === 'hi' ? 'hi-IN' :
                        `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;
      
      // Find a voice that matches the language if possible
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => voice.lang.startsWith(selectedLanguage));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Your browser does not support text-to-speech");
    }
  };

  // Handle speaking individual message
  const handleSpeakMessage = (text: string) => {
    speakText(text);
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setUserLanguage(language);
    
    // If we're currently listening, restart with the new language
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Wait a moment before restarting with the new language
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'zh' ? 'zh-CN' : 
                                      language === 'ja' ? 'ja-JP' :
                                      language === 'ko' ? 'ko-KR' : 
                                      language === 'ar' ? 'ar-SA' :
                                      language === 'hi' ? 'hi-IN' :
                                      `${language}-${language.toUpperCase()}`;
          recognitionRef.current.start();
        }
      }, 200);
    }
    
    toast.success(`Language changed to ${supportedLanguages.find(l => l.code === language)?.name}`);
  };

  // Toggle auto-translate
  const toggleAutoTranslate = () => {
    setAutoTranslate(!autoTranslate);
    toast.info(autoTranslate ? 
      "Auto-translation disabled. Responses will be in English." : 
      "Auto-translation enabled. Responses will be translated."
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <Button
          variant="outline"
          className="mb-6 self-start"
          onClick={() => navigate("/")}
        >
          &larr; Back to Home
        </Button>
        
        <h2 className="text-3xl font-bold mb-6 text-healthcare-700 dark:text-healthcare-100">
          AI Medical Assistant Chat
        </h2>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-healthcare-500" />
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleAutoTranslate}
            className={autoTranslate ? "bg-healthcare-100 dark:bg-healthcare-800" : ""}
          >
            {autoTranslate ? "Auto-Translate: ON" : "Auto-Translate: OFF"}
          </Button>
          
          {isTranslating && (
            <div className="flex items-center text-sm text-healthcare-500">
              <Loader className="h-4 w-4 mr-1 animate-spin" />
              Translating...
            </div>
          )}
        </div>
        
        <Card className="p-6 flex-1 flex flex-col max-w-3xl w-full mx-auto">
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === "user"
                        ? "bg-healthcare-500 text-white"
                        : "bg-gray-100 dark:bg-healthcare-800 text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="flex items-center mb-2">
                        <div className="bg-white dark:bg-healthcare-600 p-1 rounded-full">
                          <MessageCircle className="h-4 w-4 text-healthcare-500 dark:text-white" />
                        </div>
                        <span className="ml-2 font-medium">Medical Assistant</span>
                      </div>
                    )}
                    <p>{message.text}</p>
                    
                    {/* Show original text if translated */}
                    {message.originalText && autoTranslate && (
                      <div className="mt-2 text-xs opacity-70 border-t pt-1">
                        <p className="font-semibold">Original:</p>
                        <p>{message.originalText}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {message.sender === "ai" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSpeakMessage(message.text)}
                          className="p-1 h-auto"
                          disabled={isSpeaking}
                        >
                          {isSpeaking ? (
                            <Loader className="h-3 w-3 animate-spin" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="flex gap-2 mt-auto">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Type your health question in ${supportedLanguages.find(l => l.code === selectedLanguage)?.name}...`}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSending) handleSendMessage();
              }}
              disabled={isSending}
            />
            <Button 
              onClick={toggleListening} 
              className={`${isListening ? "bg-red-500 hover:bg-red-600" : "bg-healthcare-500 hover:bg-healthcare-600"}`}
              disabled={isSending}
            >
              {isListening ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <Button 
              onClick={() => handleSendMessage()} 
              className="bg-healthcare-500 hover:bg-healthcare-600"
              disabled={isSending || newMessage.trim() === ""}
            >
              {isSending ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            This AI assistant provides general information only and is not a substitute 
            for professional medical advice, diagnosis, or treatment.
          </div>
        </Card>
      </main>
      
      <footer className="bg-healthcare-100 dark:bg-healthcare-800 py-6">
        <div className="container mx-auto px-4 text-center text-healthcare-700 dark:text-healthcare-100">
          <p>&copy; {new Date().getFullYear()} CareAssist AI Bridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MedicalChat;
