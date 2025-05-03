
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-white dark:bg-healthcare-800 shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-healthcare-500 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-healthcare-700 dark:text-healthcare-100">
            {isMobile ? "CareAssist" : "CareAssist AI Bridge"}
          </h1>
        </div>
        
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
