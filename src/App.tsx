
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VoiceSymptomChecker from "./pages/VoiceSymptomChecker";
import GestureControl from "./pages/GestureControl";
import MedicalChat from "./pages/MedicalChat";
import VideoConsultation from "./pages/VideoConsultation";
import MedicineReminder from "./pages/MedicineReminder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voice-symptom-checker" element={<VoiceSymptomChecker />} />
          <Route path="/gesture-control" element={<GestureControl />} />
          <Route path="/medical-chat" element={<MedicalChat />} />
          <Route path="/video-consultation" element={<VideoConsultation />} />
          <Route path="/medicine-reminder" element={<MedicineReminder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
