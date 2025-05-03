
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { AlarmClock, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  days: string[];
}

const MedicineReminder = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Daily",
      time: "08:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Daily",
      time: "09:00",
      days: ["Monday", "Wednesday", "Friday"],
    },
  ]);
  
  const [newMedication, setNewMedication] = useState<Omit<Medication, "id">>({
    name: "",
    dosage: "",
    frequency: "Daily",
    time: "",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddMedication = () => {
    // Basic validation
    if (!newMedication.name || !newMedication.dosage || !newMedication.time) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const medication: Medication = {
      id: Date.now(),
      ...newMedication,
    };
    
    setMedications((prev) => [...prev, medication]);
    setDialogOpen(false);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "Daily",
      time: "",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    });
    
    toast({
      title: "Reminder Added",
      description: `Medication reminder for ${medication.name} has been set.`,
    });
  };
  
  const handleDeleteMedication = (id: number) => {
    setMedications((prev) => prev.filter((medication) => medication.id !== id));
    toast({
      title: "Reminder Removed",
      description: "The medication reminder has been deleted.",
    });
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
          Medicine Reminder
        </h2>
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600 dark:text-gray-300">
            Set up reminders for your medications and never miss a dose.
          </p>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-500 hover:bg-healthcare-600">
                <Plus className="h-5 w-5 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication Reminder</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="medication-name">Medication Name</Label>
                  <Input
                    id="medication-name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    placeholder="e.g. Aspirin"
                  />
                </div>
                
                <div>
                  <Label htmlFor="medication-dosage">Dosage</Label>
                  <Input
                    id="medication-dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    placeholder="e.g. 81mg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="medication-frequency">Frequency</Label>
                  <Select
                    value={newMedication.frequency}
                    onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="medication-time">Time</Label>
                  <Input
                    id="medication-time"
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                  />
                </div>
                
                <Button 
                  className="w-full bg-healthcare-500 hover:bg-healthcare-600" 
                  onClick={handleAddMedication}
                >
                  Add Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {medications.length === 0 ? (
          <Card className="p-8 text-center">
            <AlarmClock className="h-12 w-12 mx-auto text-healthcare-400 mb-4" />
            <h3 className="text-xl font-medium text-healthcare-600 dark:text-healthcare-300 mb-2">No reminders set</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't added any medication reminders yet.
            </p>
            <Button 
              variant="outline" 
              className="mx-auto border-healthcare-300 text-healthcare-600"
              onClick={() => setDialogOpen(true)}
            >
              Add Your First Reminder
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((medication) => (
              <Card key={medication.id} className="overflow-hidden border-healthcare-100">
                <div className="bg-healthcare-50 dark:bg-healthcare-800 py-2 px-4 flex justify-between items-center">
                  <h3 className="font-semibold text-healthcare-700 dark:text-healthcare-100">
                    {medication.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteMedication(medication.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dosage</p>
                      <p className="font-medium">{medication.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Frequency</p>
                      <p className="font-medium">{medication.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium flex items-center">
                        <AlarmClock className="h-3.5 w-3.5 mr-1" />
                        {new Date(`2000-01-01T${medication.time}:00`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Days</p>
                      <p className="font-medium">
                        {medication.frequency === "Daily"
                          ? "Every day"
                          : medication.days.map((day) => day.substring(0, 1)).join(", ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-healthcare-50 dark:bg-healthcare-800 rounded-lg max-w-3xl mx-auto">
          <h3 className="font-medium mb-2 text-healthcare-700 dark:text-healthcare-100">Reminder Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Allow notifications</span>
              <div className="bg-healthcare-500 w-12 h-6 rounded-full relative cursor-pointer">
                <div className="absolute bg-white w-5 h-5 rounded-full right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Sound alerts</span>
              <div className="bg-healthcare-500 w-12 h-6 rounded-full relative cursor-pointer">
                <div className="absolute bg-white w-5 h-5 rounded-full right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Reminder advance notice</span>
              <select className="bg-white dark:bg-healthcare-700 border border-gray-300 dark:border-healthcare-600 rounded px-2 py-1 text-sm">
                <option value="0">At time of dose</option>
                <option value="5">5 minutes before</option>
                <option value="10">10 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
              </select>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-healthcare-100 dark:bg-healthcare-800 py-6">
        <div className="container mx-auto px-4 text-center text-healthcare-700 dark:text-healthcare-100">
          <p>&copy; {new Date().getFullYear()} CareAssist AI Bridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MedicineReminder;
