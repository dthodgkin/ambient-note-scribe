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
  
  // Update notes array first
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

  // Create the combined content for all notes
  const combinedContent = updatedNotes
    .map(note => `x ${note.date} ${note.title} #hash:${note.id}\n${note.content}\n`)
    .join("\n");
  
  // Create a Blob with all notes content
  const blob = new Blob([combinedContent], { type: "text/plain" });
  
  // Create a download link and trigger it
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ambient_ideas.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return updatedNotes;
};

const generateHash = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};