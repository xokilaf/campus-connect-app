import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const timeSlots = [
  "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-1:30",
  "1:30-2:30", "2:30-3:30", "3:30-4:30", "4:30-5:30"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Function to add break to all schedules
const addBreaks = (data) => {
  const breakSlot = "1:00-1:30";
  const breakDetails = { subject: "BREAK", teacher: "", room: "" };

  for (const className in data) {
    for (const day of weekDays) {
      if (data[className][day]) {
        data[className][day][breakSlot] = breakDetails;
      } else {
        data[className][day] = { [breakSlot]: breakDetails };
      }
    }
  }
  return data;
};

// Class-specific timetable data
let timetableData = {
  "IT-A": {
    "Monday": {
      "10:00-11:00": { subject: "DBMS", teacher: "AZ", room: "" },
      "11:00-12:00": { subject: "OE", teacher: "PG", room: "" },
      "12:00-1:00": { subject: "AT", teacher: "JP", room: "" },
      "1:30-2:30": { subject: "Java", teacher: "SB", room: "" },
      "2:30-3:30": { subject: "Lab slots", teacher: "SQL/ADSA/ED", room: "" },
      "3:30-4:30": { subject: "EVS", teacher: "Proj Lab", room: "" }
    },
    "Tuesday": {
      "10:00-11:00": { subject: "AM", teacher: "BD", room: "" },
      "11:00-12:00": { subject: "ADSA", teacher: "KA", room: "" },
      "12:00-1:00": { subject: "Java", teacher: "SB", room: "" },
      "1:30-2:30": { subject: "OE", teacher: "PG", room: "" },
      "2:30-3:30": { subject: "EVS", teacher: "PG", room: "" },
      "3:30-4:30": { subject: "ED", teacher: "RS", room: "" },
      "4:30-5:30": { subject: "EVS", teacher: "Proj Lab", room: "" }
    },
    "Wednesday": {
      "10:00-11:00": { subject: "OE", teacher: "PG", room: "" },
      "11:00-12:00": { subject: "Java", teacher: "SB", room: "" },
      "12:00-1:00": { subject: "ED", teacher: "RS", room: "" },
      "1:30-2:30": { subject: "ADSA", teacher: "KA", room: "" },
      "2:30-3:30": { subject: "EVS", teacher: "Proj Lab", room: "" },
      "3:30-4:30": { subject: "DBMS", teacher: "AZ", room: "" }
    },
    "Thursday": {
      "10:00-11:00": { subject: "Lab slots", teacher: "ADSA/JAVA/SQL", room: "" },
      "11:00-12:00": { subject: "DBMS", teacher: "AZ", room: "" },
      "12:00-1:00": { subject: "AM", teacher: "BD", room: "" },
      "1:30-2:30": { subject: "AT", teacher: "JP", room: "" },
      "2:30-3:30": { subject: "EVS", teacher: "PG", room: "" },
      "3:30-4:30": { subject: "OE", teacher: "PG", room: "" }
    },
    "Friday": {
      "10:00-11:00": { subject: "Java", teacher: "SB", room: "" },
      "11:00-12:00": { subject: "ADSA", teacher: "KA", room: "" },
      "12:00-1:00": { subject: "AT", teacher: "JP", room: "" },
      "1:30-2:30": { subject: "ED", teacher: "RS", room: "" },
      "2:30-3:30": { subject: "AM", teacher: "BD", room: "" },
      "3:30-4:30": { subject: "EVS", teacher: "Proj Lab", room: "" },
      "4:30-5:30": { subject: "ED", teacher: "Lab 209", room: "" }
    }
  },
  "IT-B": {
    "Monday": {
      "10:00-11:00": { subject: "Lab slots", teacher: "ED/EVS", room: "" },
      "12:00-1:00": { subject: "ADSA", teacher: "KA", room: "" },
      "1:30-2:30": { subject: "DBMS", teacher: "AZ", room: "" },
      "2:30-3:30": { subject: "AT", teacher: "JP", room: "" },
      "3:30-4:30": { subject: "Lab slots", teacher: "ADSA/JAVA/SQL", room: "" },
      "4:30-5:30": { subject: "EVS", teacher: "Proj Lab", room: "" }
    },
    "Tuesday": {
      "10:00-11:00": { subject: "OE", teacher: "PG", room: "" },
      "11:00-12:00": { subject: "Java", teacher: "SB", room: "" },
      "12:00-1:00": { subject: "Java", teacher: "SB", room: "" },
      "1:30-2:30": { subject: "AT", teacher: "JP", room: "" },
      "2:30-3:30": { subject: "ED", teacher: "RS", room: "" },
      "3:30-4:30": { subject: "DBMS", teacher: "AZ", room: "" },
      "4:30-5:30": { subject: "EVS", teacher: "Proj Lab", room: "" }
    },
    "Wednesday": {
      "10:00-11:00": { subject: "DBMS", teacher: "AZ", room: "" },
      "11:00-12:00": { subject: "AM", teacher: "BD", room: "" },
      "1:30-2:30": { subject: "Lab slots", teacher: "SQL/ADSA/JAVA", room: "" },
      "3:30-4:30": { subject: "EVS", teacher: "Proj Lab", room: "" }
    },
    "Thursday": {
      "10:00-11:00": { subject: "Lab slots", teacher: "JAVA/SQL/ADSA", room: "" },
      "11:00-12:00": { subject: "AM", teacher: "BD", room: "" },
      "1:30-2:30": { subject: "ADSA", teacher: "KA", room: "" },
      "2:30-3:30": { subject: "EVS", teacher: "PG", room: "" },
      "3:30-4:30": { subject: "ED", teacher: "Lab 309", room: "" }
    },
    "Friday": {
      "10:00-11:00": { subject: "ADSA", teacher: "KA", room: "" },
      "11:00-12:00": { subject: "AT", teacher: "JP", room: "" },
      "12:00-1:00": { subject: "OE", teacher: "PG", room: "" },
      "1:30-2:30": { subject: "ED", teacher: "RS", room: "" },
      "2:30-3:30": { subject: "AM", teacher: "BD", room: "" },
      "3:30-4:30": { subject: "ED", teacher: "Lab 309", room: "" }
    }
  },
  "CSE-A": {},
  "CSE-B": {},
};

timetableData = addBreaks(timetableData);

// Faculty's personal timetable
const facultyTimetable = {
  "Dr. Smith": {
    "Monday": {
      "9:00 AM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "9:00 AM_IT": { class: "IT-A", subject: "Programming", room: "IT-101" },
    },
    "Tuesday": {
      "10:00 AM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "2:00 PM": { class: "CSE-B", subject: "Data Structures", room: "CS-103" },
    },
    "Wednesday": {
      "12:00 PM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "2:00 PM": { class: "IT-A", subject: "Programming", room: "IT-101" },
    },
    "Thursday": {
      "2:00 PM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "3:00 PM": { class: "CSE-B", subject: "Data Structures", room: "CS-103" },
    },
    "Friday": {
      "3:00 PM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "10:00 AM": { class: "IT-B", subject: "Programming", room: "IT-103" },
    },
  },
};

export default function Timetable() {
  const { user, availableClasses } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>(
    user?.role === 'student' ? user.className || '' : availableClasses[0]
  );
  const [viewType, setViewType] = useState<'class' | 'personal'>(
    user?.role === 'faculty' ? 'personal' : 'class'
  );
  const timetableRef = useRef(null);

  const handleDownloadPdf = () => {
    const input = timetableRef.current;
    if (input) {
      html2canvas(input, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
          let newWidth = pdfWidth;
          let newHeight = newWidth / ratio;
          if (newHeight > pdfHeight) {
            newHeight = pdfHeight;
            newWidth = newHeight * ratio;
          }
          const x = (pdfWidth - newWidth) / 2;
          const y = (pdfHeight - newHeight) / 2;
          pdf.addImage(imgData, 'PNG', x, y, newWidth, newHeight);
          pdf.save(`timetable-${selectedClass}.pdf`);
        });
    }
  };

  const getSubjectBadgeVariant = (subject: string) => {
    if (subject.toUpperCase() === "BREAK" || subject.toUpperCase() === "LUNCH") return "secondary";
    if (subject.includes("Lab") || subject.toUpperCase() === "SPORTS") return "destructive";
    if (subject.toUpperCase() === "LIBRARY" || subject.toUpperCase() === "ASSEMBLY" || subject.toUpperCase() === "PROJECT WORK") return "outline";
    return "default";
  };

  const getCurrentTimetable = () => {
    if (user?.role === 'faculty' && viewType === 'personal') {
      return facultyTimetable[user.name] || {};
    }
    return timetableData[selectedClass as keyof typeof timetableData] || {};
  };

  const currentTimetable = getCurrentTimetable();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
          <p className="text-muted-foreground">
            {user?.role === 'faculty' ? 'Manage class schedules and view your timetable' : 'Your weekly class schedule'}
          </p>
        </div>
        <Button onClick={handleDownloadPdf}>Download PDF</Button>
      </div>

      {user?.role === 'faculty' && (
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('personal')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewType === 'personal'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              My Schedule
            </button>
            <button
              onClick={() => setViewType('class')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewType === 'class'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Class Timetables
            </button>
          </div>

          {viewType === 'class' && (
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <Card ref={timetableRef}>
        <CardHeader>
          <CardTitle>
            {user?.role === 'faculty' && viewType === 'personal'
              ? `${user.name}'s Schedule`
              : `${selectedClass} - Weekly Schedule`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 min-w-[800px]">
              {/* Header */}
              <div className="font-semibold text-center py-3 px-2 bg-muted rounded-lg">
                Time
              </div>
              {weekDays.map((day) => (
                <div key={day} className="font-semibold text-center py-3 px-2 bg-muted rounded-lg">
                  {day}
                </div>
              ))}

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
                          <div className="border rounded-lg p-3 h-full bg-card hover:bg-accent transition-colors">
                            <Badge 
                              variant={getSubjectBadgeVariant(classData.subject || '')}
                              className="mb-2"
                            >
                              {classData.subject}
                            </Badge>
                            {user?.role === 'faculty' && viewType === 'personal' ? (
                              <>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Class: {classData.class}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Room: {classData.room}
                                </p>
                              </>
                            ) : (
                              <>
                                {classData.teacher && (
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {classData.teacher}
                                  </p>
                                )}
                                {classData.room && (
                                  <p className="text-xs text-muted-foreground">
                                    Room: {classData.room}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-lg p-3 h-full opacity-50">
                            <span className="text-xs text-muted-foreground">Free</span>
                          </div>
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
    </div>
  );
}