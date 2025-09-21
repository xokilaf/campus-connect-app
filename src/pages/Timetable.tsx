import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Class-specific timetable data
const initialTimetableData = {
  "IT-A": {
    "Monday": {
      "9:00 AM": { subject: "Programming", teacher: "Dr. Prakash Raj", room: "IT-101" },
      "10:00 AM": { subject: "Web Development", teacher: "Prof. Arjun Menon", room: "IT-201" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Database Management", teacher: "Dr. Umair Khan", room: "IT-301" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Software Engineering", teacher: "Ms. Anjali Rao", room: "IT-102" },
      "3:00 PM": { subject: "System Analysis", teacher: "Mr. Rohan Joshi", room: "IT-401" },
      "4:00 PM": { subject: "Programming Lab", teacher: "Mr. Rohan Joshi", room: "Lab-A" },
    },
    "Tuesday": {
      "9:00 AM": { subject: "Web Development", teacher: "Prof. Arjun Menon", room: "IT-201" },
      "10:00 AM": { subject: "Programming", teacher: "Dr. Prakash Raj", room: "IT-101" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Software Engineering", teacher: "Ms. Anjali Rao", room: "IT-102" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Database Management", teacher: "Dr. Umair Khan", room: "IT-301" },
      "3:00 PM": { subject: "Network Security", teacher: "Dr. Ayush Kalse", room: "IT-302" },
      "4:00 PM": { subject: "Sports", teacher: "Coach Lee", room: "Ground" },
    },
    // ... (rest of the data remains the same)
  },
  // ... (rest of the classes)
};

export default function Timetable() {
  const { user, availableClasses } = useAuth();
  const [timetableData, setTimetableData] = useState(initialTimetableData);
  const [selectedClass, setSelectedClass] = useState<string>(
    user?.role === 'student' ? user.className || '' : availableClasses[0]
  );
  const [viewType, setViewType] = useState<'class' | 'personal'>(
    user?.role === 'faculty' ? 'personal' : 'class'
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ day: string; time: string; } | null>(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedTeacher, setEditedTeacher] = useState("");
  const [editedRoom, setEditedRoom] = useState("");

  const handleEditClick = (day: string, time: string) => {
    const classData = currentTimetable[day]?.[time];
    if (classData) {
      setEditingSlot({ day, time });
      setEditedSubject(classData.subject);
      setEditedTeacher(classData.teacher);
      setEditedRoom(classData.room);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveChanges = () => {
    if (editingSlot) {
      const { day, time } = editingSlot;
      const updatedTimetable = { ...timetableData };
      updatedTimetable[selectedClass as keyof typeof timetableData][day][time] = {
        subject: editedSubject,
        teacher: editedTeacher,
        room: editedRoom,
      };
      setTimetableData(updatedTimetable);
      setIsEditDialogOpen(false);
      setEditingSlot(null);
    }
  };

  const getSubjectBadgeVariant = (subject: string) => {
    if (subject === "Break" || subject === "Lunch") return "secondary";
    if (subject === "Lab" || subject === "Sports" || subject.includes("Lab")) return "destructive";
    if (subject === "Library" || subject === "Assembly" || subject === "Project Work") return "outline";
    return "default";
  };

  const getCurrentTimetable = () => {
    if (user?.role === 'faculty' && viewType === 'personal') {
      // Implement faculty personal timetable view if needed
      return {};
    }
    return timetableData[selectedClass as keyof typeof timetableData] || {};
  };

  const currentTimetable = getCurrentTimetable();

  // ... (handleDownload function remains the same)

  return (
    <div className="space-y-6">
       {/* Header and download button */}

      {user?.role === 'faculty' && (
         // View type buttons and class selector
      )}

      <Card>
        <CardHeader>
           {/* Card Title */}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 min-w-[800px]">
              {/* Header */}
              {/* ... */}

              {/* Time slots */}
              {timeSlots.map((time) => (
                <>
                  <div key={time} className="font-medium text-center py-4 px-2 bg-muted/50 rounded-lg">
                    {time}
                  </div>
                  {weekDays.map((day) => {
                    const classData = currentTimetable[day]?.[time];
                    return (
                      <div key={`${day}-${time}`} className="p-2">
                        {classData ? (
                          <div className="border rounded-lg p-3 h-full bg-card hover:bg-accent transition-colors relative">
                             {/* Badge and class data */}
                            {user?.role === 'faculty' && viewType === 'class' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="absolute top-2 right-2"
                                onClick={() => handleEditClick(day, time)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        ) : (
                           {/* Free slot */}
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timetable Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label>Subject</label>
              <Input value={editedSubject} onChange={(e) => setEditedSubject(e.target.value)} />
            </div>
            <div>
              <label>Teacher</label>
              <Input value={editedTeacher} onChange={(e) => setEditedTeacher(e.target.value)} />
            </div>
            <div>
              <label>Room</label>
              <Input value={editedRoom} onChange={(e) => setEditedRoom(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
