import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { MessageCircle, Mic, Send, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const MedicalChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI medical assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Supported languages
  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "zh-CN", name: "Chinese" },
    { code: "hi-IN", name: "Hindi" },
    { code: "ja-JP", name: "Japanese" },
  ];

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
      recognitionRef.current.lang = selectedLanguage;

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
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  const handleSendMessage = (text: string = newMessage) => {
    if (text.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: getAIResponse(text),
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      
      // Read AI response aloud
      speakText(aiResponse.text);
    }, 1000);
  };
  
  const getAIResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes("headache")) {
      return "Headaches can have many causes including stress, dehydration, or lack of sleep. If you're experiencing severe or persistent headaches, it's best to consult a healthcare professional. In the meantime, make sure you're staying hydrated and getting adequate rest.";
    } else if (userMessageLower.includes("fever")) {
      return "A fever is often a sign that your body is fighting an infection. If your temperature is above 100.4°F (38°C) or if the fever persists for more than three days, please seek medical attention. Rest and drink plenty of fluids.";
    } else if (userMessageLower.includes("allergy") || userMessageLower.includes("allergic")) {
      return "Allergic reactions can range from mild to severe. Common treatments include antihistamines and avoiding allergens. If you're experiencing severe symptoms like difficulty breathing, seek emergency medical help immediately.";
    } else {
      return "I understand your concern. While I can provide general information, I recommend consulting a healthcare professional for personalized medical advice. Is there anything specific you'd like to know more about?";
    }
  };

  const speakText = (text: string) => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      
      // Find a voice that matches the language if possible
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => voice.lang.startsWith(selectedLanguage.slice(0, 2)));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Your browser does not support text-to-speech");
    }
  };

  // Handle speaking individual message
  const handleSpeakMessage = (text: string) => {
    speakText(text);
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

        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white dark:bg-healthcare-800 border border-gray-300 dark:border-healthcare-600 rounded px-3 py-1 text-sm"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
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
                        >
                          <Volume2 className="h-3 w-3" />
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
              placeholder={`Type your health question in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button 
              onClick={toggleListening} 
              className={`${isListening ? "bg-red-500 hover:bg-red-600" : "bg-healthcare-500 hover:bg-healthcare-600"}`}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleSendMessage()} className="bg-healthcare-500 hover:bg-healthcare-600">
              <Send className="h-5 w-5" />
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
