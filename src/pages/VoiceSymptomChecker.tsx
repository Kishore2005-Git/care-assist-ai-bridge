
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define the SpeechRecognition interface since TypeScript doesn't include it by default
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

const VoiceSymptomChecker = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // References for Web Speech API
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition on component mount
  useEffect(() => {
    // Initialize the SpeechRecognition object
    // @ts-ignore: Browser API not fully typed in TypeScript
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          // If we're supposed to be listening but recognition ended,
          // try to restart it (some browsers stop after silence)
          recognitionRef.current.start();
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        });
        setIsListening(false);
      };
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
    }
    
    // Cleanup on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  
  // Toggle listening state
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isListening) {
      // Start listening
      setTranscript("");
      setAiResponse("");
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: "Listening",
        description: "Speak clearly to describe your symptoms.",
      });
    } else {
      // Stop listening and process the transcript
      recognitionRef.current.stop();
      setIsListening(false);
      
      if (transcript.trim()) {
        processTranscript(transcript);
      }
    }
  };
  
  // Process transcript and get AI response
  const processTranscript = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call GPT-4 API
      // For now, simulate an AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate AI response based on common symptoms
      let response = "";
      if (text.toLowerCase().includes('headache') || text.toLowerCase().includes('fever')) {
        response = "Based on your symptoms of headache and fever, you may have a common cold or flu. Please rest, stay hydrated, and monitor your temperature. If symptoms worsen or persist for more than 3 days, please consult a healthcare professional.";
      } else if (text.toLowerCase().includes('cough') || text.toLowerCase().includes('throat')) {
        response = "Your symptoms suggest a respiratory infection. Drink warm fluids, get plenty of rest, and consider over-the-counter cough relief medication. If you experience difficulty breathing or symptoms worsen, seek medical attention.";
      } else if (text.toLowerCase().includes('stomachache') || text.toLowerCase().includes('nausea')) {
        response = "Your digestive symptoms might indicate a stomach virus or food poisoning. Stay hydrated with clear fluids, eat bland foods, and avoid dairy and spicy items. If symptoms are severe or persist more than 24 hours, consult a doctor.";
      } else {
        response = "I've analyzed your symptoms. While I can provide general guidance, I recommend consulting with a healthcare professional for an accurate diagnosis. Please remember that medical conditions require proper examination.";
      }
      
      setAiResponse(response);
      
      // Use text-to-speech to read the response
      speakResponse(response);
    } catch (error) {
      console.error('Error processing transcript:', error);
      toast({
        title: "Error",
        description: "Failed to process your symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Text-to-speech function
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a female voice (common for medical assistants)
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Female') ||
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Samantha')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in this browser.",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          &larr; Back to Home
        </Button>
        
        <h2 className="text-3xl font-bold mb-6 text-healthcare-700 dark:text-healthcare-100">
          Voice Symptom Checker
        </h2>
        
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Please press the microphone button and clearly describe your symptoms.
              Our AI will analyze your voice and provide an initial assessment.
            </p>
            
            <Button 
              size="lg" 
              className={`rounded-full p-8 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-healthcare-500 hover:bg-healthcare-600'}`}
              onClick={toggleListening}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
            
            <p className="mt-4 text-sm text-gray-500">
              {isListening ? "Listening... Speak now" : "Tap to speak"}
            </p>
          </div>
          
          {(transcript || isProcessing) && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-healthcare-800 rounded-lg">
              <h3 className="font-medium mb-2">Your symptoms:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {transcript || (isProcessing ? "Processing your speech..." : "")}
              </p>
              
              {isProcessing && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-healthcare-500 border-t-transparent rounded-full"></div>
                  <span className="ml-2">Analyzing symptoms...</span>
                </div>
              )}
              
              {aiResponse && (
                <div className="mt-6 p-4 bg-healthcare-50 dark:bg-healthcare-700 rounded-lg">
                  <h3 className="font-medium mb-2 text-healthcare-700 dark:text-healthcare-100">AI Assessment:</h3>
                  <p className="text-gray-700 dark:text-gray-300">{aiResponse}</p>
                  <p className="mt-4 text-sm text-red-500 dark:text-red-400">
                    Note: This is not a medical diagnosis. Always consult with a healthcare professional.
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => speakResponse(aiResponse)}
                    >
                      Play Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
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

export default VoiceSymptomChecker;
