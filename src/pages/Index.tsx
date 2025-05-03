
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import { useNavigate } from "react-router-dom";
import { Mic, Hand, MessageCircle, Video, AlarmClock } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFeatureClick = (feature: string) => {
    navigate(`/${feature.toLowerCase().replace(/\s+/g, '-')}`);
    
    toast({
      title: `${feature} Feature`,
      description: "This feature is coming soon!",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-healthcare-700 dark:text-healthcare-100">
            Healthcare Assistance for All
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered healthcare assistant provides accessible medical support for everyone, 
            including those with special needs.
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Mic className="w-full h-full" />}
            title="Voice-based Symptom Checker"
            description="Describe your symptoms verbally and get AI-powered assessments"
            onClick={() => handleFeatureClick("Voice Symptom Checker")}
          />
          
          <FeatureCard
            icon={<Hand className="w-full h-full" />}
            title="Gesture Control"
            description="Navigate the interface with hand gestures for physical accessibility"
            onClick={() => handleFeatureClick("Gesture Control")}
          />
          
          <FeatureCard
            icon={<MessageCircle className="w-full h-full" />}
            title="AI Medical Chat"
            description="Chat with our AI medical assistant for health information and guidance"
            onClick={() => handleFeatureClick("Medical Chat")}
          />
          
          <FeatureCard
            icon={<Video className="w-full h-full" />}
            title="Video Consultation"
            description="Schedule and conduct video calls with healthcare professionals"
            onClick={() => handleFeatureClick("Video Consultation")}
          />
          
          <FeatureCard
            icon={<AlarmClock className="w-full h-full" />}
            title="Medicine Reminder"
            description="Set up reminders for medications and medical appointments"
            onClick={() => handleFeatureClick("Medicine Reminder")}
            className="md:col-span-2 lg:col-span-1"
          />
        </section>
        
        <section className="mt-12 bg-healthcare-50 dark:bg-healthcare-800 rounded-xl p-6 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-healthcare-700 dark:text-healthcare-100">
            Accessibility Features
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start gap-2">
              <div className="bg-healthcare-200 dark:bg-healthcare-700 p-1 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-healthcare-700 dark:text-healthcare-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-200">Voice commands for hands-free navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-healthcare-200 dark:bg-healthcare-700 p-1 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-healthcare-700 dark:text-healthcare-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-200">Screen reader compatible interface</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-healthcare-200 dark:bg-healthcare-700 p-1 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-healthcare-700 dark:text-healthcare-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-200">High contrast mode for visual impairments</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-healthcare-200 dark:bg-healthcare-700 p-1 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-healthcare-700 dark:text-healthcare-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-200">Gesture recognition for physical limitations</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-healthcare-200 dark:bg-healthcare-700 p-1 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-healthcare-700 dark:text-healthcare-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-200">Multilingual support</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-healthcare-200 dark:bg-healthcare-700 p-1 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-healthcare-700 dark:text-healthcare-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-200">Text-to-speech for all content</span>
            </li>
          </ul>
        </section>
      </main>
      
      <footer className="bg-healthcare-100 dark:bg-healthcare-800 py-6">
        <div className="container mx-auto px-4 text-center text-healthcare-700 dark:text-healthcare-100">
          <p>&copy; {new Date().getFullYear()} CareAssist AI Bridge. All rights reserved.</p>
          <p className="mt-2 text-sm text-healthcare-500 dark:text-healthcare-300">
            This is a demo application. Not for actual medical use.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
