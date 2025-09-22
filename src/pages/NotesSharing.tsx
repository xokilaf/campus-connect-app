import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  BookOpen,
  Upload,
  Search,
  Filter,
  Download,
  Star,
  Eye,
  Calendar,
  User,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  author: string;
  authorRole: 'student' | 'faculty';
  uploadDate: string;
  views: number;
  rating: number;
  tags: string[];
  fileSize: string;
  fileType: string;
}

// Mock notes data
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Data Structures - Trees and Graphs',
    description: 'Comprehensive notes covering binary trees, AVL trees, and graph algorithms with examples.',
    subject: 'Data Structures',
    author: 'Dr. Priya Sharma',
    authorRole: 'faculty',
    uploadDate: '2024-03-10',
    views: 245,
    rating: 4.8,
    tags: ['algorithms', 'trees', 'graphs'],
    fileSize: '2.4 MB',
    fileType: 'PDF',
  },
  {
    id: '2',
    title: 'Database Systems - Normalization',
    description: 'Detailed explanation of database normalization forms with practical examples.',
    subject: 'Database Systems',
    author: 'Prof. Devang Mehta',
    authorRole: 'faculty',
    uploadDate: '2024-03-08',
    views: 189,
    rating: 4.5,
    tags: ['normalization', 'DBMS', 'SQL'],
    fileSize: '1.8 MB',
    fileType: 'PDF',
  },
  {
    id: '3',
    title: 'Operating Systems - Process Scheduling',
    description: 'Notes on various process scheduling algorithms and their implementations.',
    subject: 'Operating Systems',
    author: 'Prof. Vikram Singh',
    authorRole: 'faculty',
    uploadDate: '2024-03-05',
    views: 156,
    rating: 4.7,
    tags: ['scheduling', 'processes', 'algorithms'],
    fileSize: '3.2 MB',
    fileType: 'PDF',
  },
  {
    id: '4',
    title: 'Computer Networks - TCP/IP Protocol',
    description: 'Detailed study of TCP/IP protocol stack and network communication.',
    subject: 'Computer Networks',
    author: 'Dr. Sneha Verma',
    authorRole: 'faculty',
    uploadDate: '2024-03-03',
    views: 203,
    rating: 4.6,
    tags: ['networking', 'TCP', 'IP', 'protocols'],
    fileSize: '2.1 MB',
    fileType: 'PDF',
  },
];

const subjects = ['All Subjects', 'Data Structures', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering'];

export default function NotesSharing() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New note form state
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    subject: '',
    tags: '',
  });

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleUploadNote = () => {
    if (!newNote.title || !newNote.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      description: newNote.description,
      subject: newNote.subject,
      author: user?.name || 'Unknown',
      authorRole: user?.role || 'faculty',
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      rating: 0,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      fileSize: '1.2 MB',
      fileType: 'PDF',
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', description: '', subject: '', tags: '' });
    setIsUploadOpen(false);
    toast.success('Note uploaded successfully!');
  };

  const handleDownload = (note: Note) => {
    toast.success(`Downloading "${note.title}"`);
    // In a real app, this would trigger a file download
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span>Notes Sharing</span>
          </h1>
          <p className="text-muted-foreground">
            Share and discover study materials from your peers and faculty
          </p>
        </div>
        
        {user?.role === 'faculty' && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Upload Notes</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Notes</DialogTitle>
                <DialogDescription>
                  Share your study materials with the campus community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={newNote.subject} onValueChange={(value) => setNewNote({ ...newNote, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.slice(1).map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the notes"
                    value={newNote.description}
                    onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="algorithms, examples, theory"
                    value={newNote.tags}
                    onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">File Upload</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleUploadNote} className="flex-1">
                    Upload Notes
                  </Button>
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes by title, author, or content..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {note.description}
                  </CardDescription>
                </div>
                <Badge variant={'default'}>
                  {'Faculty'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{note.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(note.uploadDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{note.views} views</span>
                    </span>
                    <span>{note.fileSize} • {note.fileType}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {getRatingStars(note.rating)}
                    </div>
                    <span>{note.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(note)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toast.info('Preview feature coming soon!')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No notes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
}