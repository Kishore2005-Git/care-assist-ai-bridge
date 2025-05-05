
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setGoogleApiKey } from "@/utils/translationService";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export function ApiKeySettings() {
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(false);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    try {
      setGoogleApiKey(apiKey);
      toast.success("Google Translate API key saved successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save API key");
      console.error("Error saving API key:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-white dark:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
          Set Translation API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google Translate API Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enter your Google Cloud Translate API key to enable multilingual features.
            </p>
            <p className="text-xs text-muted-foreground">
              You can get an API key from the Google Cloud Console.
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-healthcare-500 hover:text-healthcare-600 ml-1"
              >
                Learn more
              </a>
            </p>
          </div>
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter Google Translate API key"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveApiKey}>Save API Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
