import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Save } from "lucide-react";
import { format, parse } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  fileName: string;
}

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem("ambientNotes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

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
      const fileName = `${formattedDate}-${title.toLowerCase().replace(/\s+/g, "-")}.txt`;
      
      // Create a Blob with the content
      const blob = new Blob([todoTxtContent], { type: "text/plain" });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Save to localStorage
      const newNote: Note = {
        id: editingNoteId || Date.now().toString(),
        title,
        date: formattedDate,
        content: note,
        fileName,
      };

      const updatedNotes = editingNoteId
        ? notes.map((n) => (n.id === editingNoteId ? newNote : n))
        : [newNote, ...notes];

      setNotes(updatedNotes);
      localStorage.setItem("ambientNotes", JSON.stringify(updatedNotes));

      toast({
        title: editingNoteId ? "Note Updated" : "Note Saved",
        description: `Your ambient music idea has been ${editingNoteId ? 'updated' : 'saved'} successfully.`,
      });

      // Clear the form
      setTitle("");
      setNote("");
      setDate(new Date());
      setEditingNoteId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNoteClick = (selectedNote: Note) => {
    setTitle(selectedNote.title);
    setNote(selectedNote.content);
    setDate(parse(selectedNote.date, "yyyy-MM-dd", new Date()));
    setEditingNoteId(selectedNote.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#221F26] to-[#403E43] p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 sm:p-8 bg-black/20 backdrop-blur-xl border-[#8B5CF6]/30 shadow-lg shadow-purple-500/10">
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
              {editingNoteId ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 bg-black/20 backdrop-blur-xl border-[#8B5CF6]/30 shadow-lg shadow-purple-500/10">
          <h2 className="text-2xl font-semibold text-white mb-6 animate-fade-in">Your Notes</h2>
          <div className="overflow-hidden rounded-lg border border-[#8B5CF6]/30">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5 border-b-[#8B5CF6]/30">
                  <TableHead className="text-white/70">Date</TableHead>
                  <TableHead className="text-white/70">Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((savedNote) => (
                  <TableRow
                    key={savedNote.id}
                    className="cursor-pointer hover:bg-white/5 border-b-[#8B5CF6]/30"
                    onClick={() => handleNoteClick(savedNote)}
                  >
                    <TableCell className="text-white/90">{savedNote.date}</TableCell>
                    <TableCell className="text-white/90">{savedNote.title}</TableCell>
                  </TableRow>
                ))}
                {notes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-white/50 py-8">
                      No notes yet. Start creating your ambient music ideas!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;