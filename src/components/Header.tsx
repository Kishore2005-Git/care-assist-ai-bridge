
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Mic, Hand, MessageCircle, Video, AlarmClock } from "lucide-react";

export function Header() {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-white dark:bg-healthcare-800 shadow-sm py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-healthcare-500 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-healthcare-700 dark:text-healthcare-100">
            Medibridge
          </h1>
        </div>

        {!isMobile ? (
          <NavigationMenu className="flex-1 justify-center">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/voice-symptom-checker" className={navigationMenuTriggerStyle()}>
                  <Mic className="mr-2 h-4 w-4" />
                  Voice Symptom Checker
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/gesture-control" className={navigationMenuTriggerStyle()}>
                  <Hand className="mr-2 h-4 w-4" />
                  Gesture Control
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/medical-chat" className={navigationMenuTriggerStyle()}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Medical Chat
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/video-consultation" className={navigationMenuTriggerStyle()}>
                  <Video className="mr-2 h-4 w-4" />
                  Video Consultation
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/medicine-reminder" className={navigationMenuTriggerStyle()}>
                  <AlarmClock className="mr-2 h-4 w-4" />
                  Medicine Reminder
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <div className="w-full my-2">
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex flex-wrap justify-center gap-2 w-full">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-2 p-2">
                      <Link to="/voice-symptom-checker" className="flex items-center gap-2 p-2 rounded-md hover:bg-healthcare-50">
                        <Mic className="h-4 w-4" /> Voice Symptom Checker
                      </Link>
                      <Link to="/gesture-control" className="flex items-center gap-2 p-2 rounded-md hover:bg-healthcare-50">
                        <Hand className="h-4 w-4" /> Gesture Control
                      </Link>
                      <Link to="/medical-chat" className="flex items-center gap-2 p-2 rounded-md hover:bg-healthcare-50">
                        <MessageCircle className="h-4 w-4" /> Medical Chat
                      </Link>
                      <Link to="/video-consultation" className="flex items-center gap-2 p-2 rounded-md hover:bg-healthcare-50">
                        <Video className="h-4 w-4" /> Video Consultation
                      </Link>
                      <Link to="/medicine-reminder" className="flex items-center gap-2 p-2 rounded-md hover:bg-healthcare-50">
                        <AlarmClock className="h-4 w-4" /> Medicine Reminder
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="text-healthcare-600 border-healthcare-200 hover:bg-healthcare-50">
            Sign In
          </Button>
          <Button size={isMobile ? "sm" : "default"} className="bg-healthcare-500 hover:bg-healthcare-600">
            Register
          </Button>
        </div>
      </div>
    </header>
  );
}
