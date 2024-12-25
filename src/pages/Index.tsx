import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title || !note || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const todoTxtContent = `x ${formattedDate} ${title}\n${note}`;
      
      // Create a Blob with the content
      const blob = new Blob([todoTxtContent], { type: "text/plain" });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formattedDate}-${title.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Note Saved",
        description: "Your ambient music idea has been saved successfully.",
      });

      // Clear the form
      setTitle("");
      setNote("");
      setDate(new Date());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#221F26] to-[#403E43] p-4 sm:p-6 md:p-8">
      <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-black/20 backdrop-blur-xl border-[#8B5CF6]/30 shadow-lg shadow-purple-500/10">
        <h1 className="text-3xl font-semibold text-white mb-8 animate-fade-in">Ambient Music Ideas</h1>
        
        <div className="space-y-6">
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Label htmlFor="title" className="text-lg text-white/90">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-[#8B5CF6]/30 text-white transition-all duration-200 focus:border-[#D946EF] focus:ring-[#D946EF]/30 hover:bg-white/10"
              placeholder="Enter your idea title..."
            />
          </div>

          <div className="space-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Label className="text-lg text-white/90">Date</Label>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/5 border-[#8B5CF6]/30 text-white hover:bg-white/10"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
              {isCalendarOpen && (
                <div className="absolute top-full mt-2 z-50 bg-[#221F26]/95 backdrop-blur-xl border border-[#8B5CF6]/30 rounded-lg shadow-lg animate-fade-in">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setIsCalendarOpen(false);
                    }}
                    className="rounded-md"
                    classNames={{
                      day_selected: "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]",
                      day_today: "bg-accent text-accent-foreground",
                      day: "text-white hover:bg-white/10",
                      head_cell: "text-white/60",
                      cell: "text-white/90",
                      nav_button: "hover:bg-white/10",
                      nav_button_previous: "hover:bg-white/10",
                      nav_button_next: "hover:bg-white/10",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Label htmlFor="note" className="text-lg text-white/90">
              Note
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[200px] bg-white/5 border-[#8B5CF6]/30 text-white transition-all duration-200 focus:border-[#D946EF] focus:ring-[#D946EF]/30 hover:bg-white/10"
              placeholder="Write your ambient music idea here..."
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-all duration-200 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <Save className="mr-2" />
            Save Note
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;