import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Class-specific timetable data
const timetableData = {
  "CSE-A": {
    "Monday": {
      "9:00 AM": { subject: "Data Structures", teacher: "Dr. Smith", room: "CS-101" },
      "10:00 AM": { subject: "Computer Networks", teacher: "Prof. Johnson", room: "CS-205" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Database Systems", teacher: "Dr. Brown", room: "CS-301" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Software Engineering", teacher: "Ms. Davis", room: "CS-102" },
      "3:00 PM": { subject: "Operating Systems", teacher: "Mr. Wilson", room: "CS-401" },
      "4:00 PM": { subject: "Programming Lab", teacher: "Mr. Wilson", room: "Lab-A" },
    },
    "Tuesday": {
      "9:00 AM": { subject: "Computer Networks", teacher: "Prof. Johnson", room: "CS-205" },
      "10:00 AM": { subject: "Data Structures", teacher: "Dr. Smith", room: "CS-101" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Software Engineering", teacher: "Ms. Davis", room: "CS-102" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Database Systems", teacher: "Dr. Brown", room: "CS-301" },
      "3:00 PM": { subject: "Machine Learning", teacher: "Dr. Taylor", room: "CS-302" },
      "4:00 PM": { subject: "Sports", teacher: "Coach Lee", room: "Ground" },
    },
    "Wednesday": {
      "9:00 AM": { subject: "Operating Systems", teacher: "Mr. Wilson", room: "CS-401" },
      "10:00 AM": { subject: "Database Systems", teacher: "Dr. Brown", room: "CS-301" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Data Structures", teacher: "Dr. Smith", room: "CS-101" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Computer Networks", teacher: "Prof. Johnson", room: "CS-205" },
      "3:00 PM": { subject: "Software Engineering", teacher: "Ms. Davis", room: "CS-102" },
      "4:00 PM": { subject: "Library", teacher: "", room: "Library" },
    },
    "Thursday": {
      "9:00 AM": { subject: "Machine Learning", teacher: "Dr. Taylor", room: "CS-302" },
      "10:00 AM": { subject: "Software Engineering", teacher: "Ms. Davis", room: "CS-102" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Operating Systems", teacher: "Mr. Wilson", room: "CS-401" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Data Structures", teacher: "Dr. Smith", room: "CS-101" },
      "3:00 PM": { subject: "Computer Networks", teacher: "Prof. Johnson", room: "CS-205" },
      "4:00 PM": { subject: "Programming Lab", teacher: "Dr. Taylor", room: "Lab-B" },
    },
    "Friday": {
      "9:00 AM": { subject: "Database Systems", teacher: "Dr. Brown", room: "CS-301" },
      "10:00 AM": { subject: "Machine Learning", teacher: "Dr. Taylor", room: "CS-302" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Computer Networks", teacher: "Prof. Johnson", room: "CS-205" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Operating Systems", teacher: "Mr. Wilson", room: "CS-401" },
      "3:00 PM": { subject: "Data Structures", teacher: "Dr. Smith", room: "CS-101" },
      "4:00 PM": { subject: "Project Work", teacher: "", room: "CS-401" },
    },
  },
  "ECE-A": {
    "Monday": {
      "9:00 AM": { subject: "Circuit Analysis", teacher: "Dr. Kumar", room: "EC-101" },
      "10:00 AM": { subject: "Digital Electronics", teacher: "Prof. Sharma", room: "EC-205" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Signals & Systems", teacher: "Dr. Patel", room: "EC-301" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Communication Systems", teacher: "Ms. Gupta", room: "EC-102" },
      "3:00 PM": { subject: "Control Systems", teacher: "Mr. Singh", room: "EC-401" },
      "4:00 PM": { subject: "Electronics Lab", teacher: "Mr. Singh", room: "EC-Lab" },
    },
    "Tuesday": {
      "9:00 AM": { subject: "Digital Electronics", teacher: "Prof. Sharma", room: "EC-205" },
      "10:00 AM": { subject: "Circuit Analysis", teacher: "Dr. Kumar", room: "EC-101" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Communication Systems", teacher: "Ms. Gupta", room: "EC-102" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Signals & Systems", teacher: "Dr. Patel", room: "EC-301" },
      "3:00 PM": { subject: "Microprocessors", teacher: "Dr. Verma", room: "EC-302" },
      "4:00 PM": { subject: "Sports", teacher: "Coach Lee", room: "Ground" },
    },
    "Wednesday": {
      "9:00 AM": { subject: "Control Systems", teacher: "Mr. Singh", room: "EC-401" },
      "10:00 AM": { subject: "Signals & Systems", teacher: "Dr. Patel", room: "EC-301" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Circuit Analysis", teacher: "Dr. Kumar", room: "EC-101" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Digital Electronics", teacher: "Prof. Sharma", room: "EC-205" },
      "3:00 PM": { subject: "Communication Systems", teacher: "Ms. Gupta", room: "EC-102" },
      "4:00 PM": { subject: "Library", teacher: "", room: "Library" },
    },
    "Thursday": {
      "9:00 AM": { subject: "Microprocessors", teacher: "Dr. Verma", room: "EC-302" },
      "10:00 AM": { subject: "Communication Systems", teacher: "Ms. Gupta", room: "EC-102" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Control Systems", teacher: "Mr. Singh", room: "EC-401" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Circuit Analysis", teacher: "Dr. Kumar", room: "EC-101" },
      "3:00 PM": { subject: "Digital Electronics", teacher: "Prof. Sharma", room: "EC-205" },
      "4:00 PM": { subject: "Electronics Lab", teacher: "Dr. Verma", room: "EC-Lab" },
    },
    "Friday": {
      "9:00 AM": { subject: "Signals & Systems", teacher: "Dr. Patel", room: "EC-301" },
      "10:00 AM": { subject: "Microprocessors", teacher: "Dr. Verma", room: "EC-302" },
      "11:00 AM": { subject: "Break", teacher: "", room: "" },
      "12:00 PM": { subject: "Digital Electronics", teacher: "Prof. Sharma", room: "EC-205" },
      "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
      "2:00 PM": { subject: "Control Systems", teacher: "Mr. Singh", room: "EC-401" },
      "3:00 PM": { subject: "Circuit Analysis", teacher: "Dr. Kumar", room: "EC-101" },
      "4:00 PM": { subject: "Project Work", teacher: "", room: "EC-401" },
    },
  },
};

// Faculty's personal timetable
const facultyTimetable = {
  "Dr. Smith": {
    "Monday": {
      "9:00 AM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "10:00 AM": { class: "CSE-B", subject: "Data Structures", room: "CS-102" },
      "12:00 PM": { class: "IT-A", subject: "Mathematics", room: "IT-101" },
    },
    "Tuesday": {
      "10:00 AM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "2:00 PM": { class: "CSE-B", subject: "Data Structures", room: "CS-102" },
      "3:00 PM": { class: "IT-B", subject: "Mathematics", room: "IT-102" },
    },
    "Wednesday": {
      "12:00 PM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "9:00 AM": { class: "IT-A", subject: "Mathematics", room: "IT-101" },
    },
    "Thursday": {
      "2:00 PM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "10:00 AM": { class: "IT-B", subject: "Mathematics", room: "IT-102" },
    },
    "Friday": {
      "3:00 PM": { class: "CSE-A", subject: "Data Structures", room: "CS-101" },
      "9:00 AM": { class: "CSE-B", subject: "Data Structures", room: "CS-102" },
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

  const getSubjectBadgeVariant = (subject: string) => {
    if (subject === "Break" || subject === "Lunch") return "secondary";
    if (subject === "Lab" || subject === "Sports" || subject.includes("Lab")) return "destructive";
    if (subject === "Library" || subject === "Assembly" || subject === "Project Work") return "outline";
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
        <p className="text-muted-foreground">
          {user?.role === 'faculty' ? 'Manage class schedules and view your timetable' : 'Your weekly class schedule'}
        </p>
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

      <Card>
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
                              variant={getSubjectBadgeVariant(
                                user?.role === 'faculty' && viewType === 'personal'
                                  ? classData.subject || ''
                                  : classData.subject || ''
                              )}
                              className="mb-2"
                            >
                              {user?.role === 'faculty' && viewType === 'personal'
                                ? classData.subject
                                : classData.subject}
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