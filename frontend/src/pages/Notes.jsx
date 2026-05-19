import { useState, useEffect } from 'react';
import { BookOpen, Trash2 } from 'lucide-react';

export default function NotesView() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:9999/api/ai/knowledge/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:9999/api/ai/knowledge/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote, document_id: 1 })
      });
      if (res.ok) {
        setNewNote('');
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed to create note:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:9999/api/ai/knowledge/notes/${id}`, {
        method: 'DELETE'
      });
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="text-purple-400" /> My Notes
        </h2>
        
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            className="w-full h-24 bg-slate-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 ring-purple-500"
          />
          <button
            onClick={createNote}
            disabled={loading || !newNote.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs">
                {new Date(note.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-white">{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-slate-400 text-center py-8">No notes yet. Create your first note above.</p>
        )}
      </div>
    </div>
  );
}