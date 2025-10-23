import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Close as CloseIcon,
  Note as NoteIcon,
  Bookmark as BookmarkIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface Note {
  id: string;
  time: number;
  content: string;
  timestamp: Date;
}

interface BookmarkNote {
  id: string;
  content: string;
  timestamp: Date;
}

interface Bookmark {
  id: string;
  time: number;
  title: string;
  timestamp: Date;
  notes: BookmarkNote[];
}

interface VideoSidebarProps {
  open: boolean;
  onClose: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
}

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 350,
    backgroundColor: theme.palette.background.paper,
    borderLeft: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[8],
    overflow: "hidden",
    height: "100vh",
  },
}));

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VideoSidebar: React.FC<VideoSidebarProps> = ({
  open,
  onClose,
  currentTime,
  onSeek,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [newNote, setNewNote] = useState("");
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("");
  const [newBookmarkNote, setNewBookmarkNote] = useState("");
  const [editingNote, setEditingNote] = useState<{bookmarkId: string, noteId: string} | null>(null);
  const [editNoteContent, setEditNoteContent] = useState("");
  const [editingGlobalNote, setEditingGlobalNote] = useState<string | null>(null);
  const [editGlobalNoteContent, setEditGlobalNoteContent] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        time: currentTime,
        content: newNote.trim(),
        timestamp: new Date(),
      };
      setNotes([...notes, note]);
      setNewNote("");
    }
  };

  const addBookmark = () => {
    if (newBookmarkTitle.trim()) {
      const bookmark: Bookmark = {
        id: Date.now().toString(),
        time: currentTime,
        title: newBookmarkTitle.trim(),
        timestamp: new Date(),
        notes: [],
      };
      setBookmarks([...bookmarks, bookmark]);
      setNewBookmarkTitle("");
    }
  };

  const addBookmarkNote = (bookmarkId: string) => {
    if (newBookmarkNote.trim()) {
      const note: BookmarkNote = {
        id: Date.now().toString(),
        content: newBookmarkNote.trim(),
        timestamp: new Date(),
      };
      setBookmarks(bookmarks.map(b => 
        b.id === bookmarkId ? {...b, notes: [...b.notes, note]} : b
      ));
      setNewBookmarkNote("");
    }
  };

  const deleteBookmarkNote = (bookmarkId: string, noteId: string) => {
    setBookmarks(bookmarks.map(b => 
      b.id === bookmarkId ? {...b, notes: b.notes.filter(n => n.id !== noteId)} : b
    ));
  };

  const editBookmarkNote = (bookmarkId: string, noteId: string, content: string) => {
    if (content.trim()) {
      setBookmarks(bookmarks.map(b => 
        b.id === bookmarkId ? {
          ...b, 
          notes: b.notes.map(n => n.id === noteId ? {...n, content: content.trim()} : n)
        } : b
      ));
    }
    setEditingNote(null);
    setEditNoteContent("");
  };

  const startEditingNote = (bookmarkId: string, noteId: string, currentContent: string) => {
    setEditingNote({bookmarkId, noteId});
    setEditNoteContent(currentContent);
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setEditNoteContent("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const startEditingGlobalNote = (noteId: string, currentContent: string) => {
    setEditingGlobalNote(noteId);
    setEditGlobalNoteContent(currentContent);
  };

  const editGlobalNote = (noteId: string, content: string) => {
    if (content.trim()) {
      setNotes(notes.map(n => n.id === noteId ? {...n, content: content.trim()} : n));
    }
    setEditingGlobalNote(null);
    setEditGlobalNoteContent("");
  };

  const cancelEditingGlobalNote = () => {
    setEditingGlobalNote(null);
    setEditGlobalNoteContent("");
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <SidebarDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Video Tools
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab icon={<NoteIcon />} label="Notes" />
        <Tab icon={<BookmarkIcon />} label="Bookmarks" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a note at current time..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Chip
              label={`Time: ${formatTime(currentTime)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Button
              onClick={addNote}
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              disabled={!newNote.trim()}
            >
              Add Note
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ flex: 1, overflow: "auto" }}>
          {notes.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No notes yet. Add your first note!
            </Typography>
          ) : (
            notes.map((note) => (
              <ListItem
                key={note.id}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  mb: 1,
                  p: 1.5,
                  backgroundColor: 'background.default'
                }}
              >
                {editingGlobalNote === note.id ? (
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={editGlobalNoteContent}
                      onChange={(e) => setEditGlobalNoteContent(e.target.value)}
                      size="small"
                      placeholder="Edit note content..."
                      autoFocus
                    />
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => editGlobalNote(note.id, editGlobalNoteContent)}
                        disabled={!editGlobalNoteContent.trim()}
                      >
                        Save
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={cancelEditingGlobalNote}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={formatTime(note.time)}
                        size="small"
                        clickable
                        onClick={() => onSeek(note.time)}
                        icon={<PlayIcon />}
                        color="primary"
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => startEditingGlobalNote(note.id, note.content)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteNote(note.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.5 }}>
                      {note.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {note.timestamp.toLocaleString()}
                    </Typography>
                  </>
                )}
              </ListItem>
            ))
          )}
        </List>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Bookmark title..."
            value={newBookmarkTitle}
            onChange={(e) => setNewBookmarkTitle(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Chip
              label={`Time: ${formatTime(currentTime)}`}
              size="small"
              color="secondary"
              variant="outlined"
            />
            <Button
              onClick={addBookmark}
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              disabled={!newBookmarkTitle.trim()}
            >
              Add Bookmark
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ flex: 1, overflow: "auto" }}>
          {bookmarks.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No bookmarks yet. Add your first bookmark!
            </Typography>
          ) : (
            bookmarks.map((bookmark) => (
              <Accordion key={bookmark.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <Chip
                      label={formatTime(bookmark.time)}
                      size="small"
                      clickable
                      onClick={(e) => { e.stopPropagation(); onSeek(bookmark.time); }}
                      icon={<PlayIcon />}
                      color="secondary"
                    />
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      {bookmark.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); deleteBookmark(bookmark.id); }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Add note to bookmark..."
                      value={newBookmarkNote}
                      onChange={(e) => setNewBookmarkNote(e.target.value)}
                      size="small"
                    />
                    <Button
                      onClick={() => addBookmarkNote(bookmark.id)}
                      startIcon={<AddIcon />}
                      size="small"
                      sx={{ mt: 1 }}
                      disabled={!newBookmarkNote.trim()}
                    >
                      Add Note
                    </Button>
                  </Box>
                  {bookmark.notes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                      No notes added to this bookmark yet.
                    </Typography>
                  ) : (
                    bookmark.notes.map((note) => (
                      <Box key={note.id} sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1.5, mb: 1, backgroundColor: 'background.default' }}>
                        {editingNote?.bookmarkId === bookmark.id && editingNote?.noteId === note.id ? (
                          <Box>
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              value={editNoteContent}
                              onChange={(e) => setEditNoteContent(e.target.value)}
                              size="small"
                              placeholder="Edit note content..."
                              autoFocus
                            />
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="contained"
                                onClick={() => editBookmarkNote(bookmark.id, note.id, editNoteContent)}
                                disabled={!editNoteContent.trim()}
                              >
                                Save
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={cancelEditingNote}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {note.timestamp.toLocaleString()}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => startEditingNote(bookmark.id, note.id, note.content)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => deleteBookmarkNote(bookmark.id, note.id)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                              {note.content}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </List>
      </TabPanel>
    </SidebarDrawer>
  );
};

export default VideoSidebar;