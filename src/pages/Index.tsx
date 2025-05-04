
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { HealthMetrics } from "@/components/HealthMetrics";
import { RecentActivities } from "@/components/RecentActivities";
import { EmergencyCall } from "@/components/EmergencyCall";
import { useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Adjust main content based on sidebar state for desktop
  const mainContentClass = !sidebarOpen ? "md:ml-16" : "md:ml-64";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 container mx-auto px-4 py-8 transition-all duration-300 ${mainContentClass}`}>
        <section className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-healthcare-700 dark:text-healthcare-100">
            Your Health Dashboard
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Monitor your vital signs and manage your healthcare needs in one place.
          </p>
        </section>
        
        <section>
          <HealthMetrics />
        </section>
        
        <section>
          <RecentActivities />
        </section>
        
        <section>
          <EmergencyCall />
        </section>
      </main>
      
      <footer className="bg-healthcare-100 dark:bg-healthcare-800 py-6">
        <div className="container mx-auto px-4 text-center text-healthcare-700 dark:text-healthcare-100">
          <p>&copy; {new Date().getFullYear()} Medibridge. All rights reserved.</p>
          <p className="mt-2 text-sm text-healthcare-500 dark:text-healthcare-300">
            This is a demo application. Not for actual medical use.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
