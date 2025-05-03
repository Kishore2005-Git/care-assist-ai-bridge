
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Mic } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VoiceSymptomChecker = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();
  
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // This would normally connect to Web Speech API
      setTranscript("Listening for symptoms...");
      // Simulate listening response after 3 seconds
      setTimeout(() => {
        setTranscript("I'm experiencing headache and fever since yesterday.");
        setIsListening(false);
      }, 3000);
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
            >
              <Mic className="h-10 w-10" />
            </Button>
            
            <p className="mt-4 text-sm text-gray-500">
              {isListening ? "Listening... Speak now" : "Tap to speak"}
            </p>
          </div>
          
          {transcript && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-healthcare-800 rounded-lg">
              <h3 className="font-medium mb-2">Transcript:</h3>
              <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
              
              {transcript !== "Listening for symptoms..." && (
                <div className="mt-6 p-4 bg-healthcare-50 dark:bg-healthcare-700 rounded-lg">
                  <h3 className="font-medium mb-2 text-healthcare-700 dark:text-healthcare-100">Initial Assessment:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Based on your symptoms, you may have a common cold or flu. 
                    Please monitor your temperature and stay hydrated. If symptoms persist 
                    for more than 3 days or worsen, please consult a healthcare professional.
                  </p>
                  <p className="mt-4 text-sm text-red-500 dark:text-red-400">
                    Note: This is not a medical diagnosis. Always consult with a healthcare professional.
                  </p>
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
