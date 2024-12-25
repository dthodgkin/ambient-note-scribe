import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-ambient-soft to-ambient-muted p-4 sm:p-6 md:p-8">
      <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-ambient-border">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Ambient Music Ideas</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="transition-all duration-200 border-ambient-border/30 focus:border-ambient-border"
              placeholder="Enter your idea title..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border border-ambient-border/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-lg">
              Note
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[200px] transition-all duration-200 border-ambient-border/30 focus:border-ambient-border"
              placeholder="Write your ambient music idea here..."
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;