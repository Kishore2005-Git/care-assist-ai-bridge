
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Hand } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GestureControl = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState("");
  const navigate = useNavigate();
  
  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    if (!isDetecting) {
      // This would normally connect to a gesture recognition API
      setTimeout(() => {
        setDetectedGesture("Open palm detected - Navigation mode activated");
        setIsDetecting(true);
      }, 2000);
    } else {
      setDetectedGesture("");
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
          Gesture Control Interface
        </h2>
        
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Enable gesture-based navigation to control the interface using hand movements.
              Perfect for users with limited mobility.
            </p>
            
            <div className="relative mx-auto w-full max-w-md h-64 bg-gray-100 dark:bg-healthcare-900 rounded-lg mb-6 overflow-hidden">
              {/* This would be a video feed in a real implementation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isDetecting ? (
                  <div className="text-center">
                    <Hand className="h-20 w-20 mx-auto text-healthcare-500 animate-pulse-soft" />
                    <p className="mt-4 text-healthcare-600 dark:text-healthcare-300">
                      Camera active - Show your hand gestures
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Camera feed will appear here</p>
                )}
              </div>
            </div>
            
            <Button 
              className={`${isDetecting ? 'bg-red-500 hover:bg-red-600' : 'bg-healthcare-500 hover:bg-healthcare-600'}`}
              onClick={toggleDetection}
            >
              {isDetecting ? "Stop Detection" : "Start Gesture Detection"}
            </Button>
          </div>
          
          {detectedGesture && (
            <div className="mt-6 p-4 bg-healthcare-50 dark:bg-healthcare-800 rounded-lg">
              <h3 className="font-medium mb-2">Detected Gesture:</h3>
              <p className="text-healthcare-700 dark:text-healthcare-200">{detectedGesture}</p>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-healthcare-700 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2 text-healthcare-600 dark:text-healthcare-100">Available Gestures:</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>✋ Open palm - Navigation mode</li>
                    <li>👆 Pointing up - Select item</li>
                    <li>✌️ Peace sign - Go back</li>
                    <li>👍 Thumbs up - Confirm action</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white dark:bg-healthcare-700 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2 text-healthcare-600 dark:text-healthcare-100">Tips:</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Ensure good lighting</li>
                    <li>Keep hand within camera view</li>
                    <li>Make clear, distinct gestures</li>
                    <li>Hold gesture steady for 1-2 seconds</li>
                  </ul>
                </div>
              </div>
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

export default GestureControl;
