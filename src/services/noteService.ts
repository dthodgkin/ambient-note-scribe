import { format } from "date-fns";

export interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  fileName: string;
}

export const saveNote = async (
  title: string,
  date: Date,
  content: string,
  editingNoteId: string | null,
  notes: Note[]
): Promise<Note[]> => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const hash = generateHash();
  const todoTxtContent = `x ${formattedDate} ${title} #hash:${hash}\n${content}\n`;
  
  // Create a Blob with the content
  const blob = new Blob([todoTxtContent], { type: "text/plain" });
  
  // Create a download link and trigger it
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ambient_ideas.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  // Update notes array
  const newNote: Note = {
    id: editingNoteId || hash,
    title,
    date: formattedDate,
    content,
    fileName: "ambient_ideas.txt",
  };

  const updatedNotes = editingNoteId
    ? notes.map((n) => (n.id === editingNoteId ? newNote : n))
    : [newNote, ...notes];

  // Save to localStorage
  localStorage.setItem("ambientNotes", JSON.stringify(updatedNotes));

  return updatedNotes;
};

const generateHash = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};