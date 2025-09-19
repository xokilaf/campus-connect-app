import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timetableData = {
  "Monday": {
    "9:00 AM": { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
    "10:00 AM": { subject: "Physics", teacher: "Prof. Johnson", room: "205" },
    "11:00 AM": { subject: "Break", teacher: "", room: "" },
    "12:00 PM": { subject: "Chemistry", teacher: "Dr. Brown", room: "301" },
    "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
    "2:00 PM": { subject: "English", teacher: "Ms. Davis", room: "102" },
    "3:00 PM": { subject: "Computer Science", teacher: "Mr. Wilson", room: "401" },
    "4:00 PM": { subject: "Lab", teacher: "Mr. Wilson", room: "Lab-A" },
  },
  "Tuesday": {
    "9:00 AM": { subject: "Physics", teacher: "Prof. Johnson", room: "205" },
    "10:00 AM": { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
    "11:00 AM": { subject: "Break", teacher: "", room: "" },
    "12:00 PM": { subject: "English", teacher: "Ms. Davis", room: "102" },
    "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
    "2:00 PM": { subject: "Chemistry", teacher: "Dr. Brown", room: "301" },
    "3:00 PM": { subject: "Biology", teacher: "Dr. Taylor", room: "302" },
    "4:00 PM": { subject: "Sports", teacher: "Coach Lee", room: "Ground" },
  },
  "Wednesday": {
    "9:00 AM": { subject: "Computer Science", teacher: "Mr. Wilson", room: "401" },
    "10:00 AM": { subject: "Chemistry", teacher: "Dr. Brown", room: "301" },
    "11:00 AM": { subject: "Break", teacher: "", room: "" },
    "12:00 PM": { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
    "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
    "2:00 PM": { subject: "Physics", teacher: "Prof. Johnson", room: "205" },
    "3:00 PM": { subject: "English", teacher: "Ms. Davis", room: "102" },
    "4:00 PM": { subject: "Library", teacher: "", room: "Library" },
  },
  "Thursday": {
    "9:00 AM": { subject: "Biology", teacher: "Dr. Taylor", room: "302" },
    "10:00 AM": { subject: "English", teacher: "Ms. Davis", room: "102" },
    "11:00 AM": { subject: "Break", teacher: "", room: "" },
    "12:00 PM": { subject: "Computer Science", teacher: "Mr. Wilson", room: "401" },
    "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
    "2:00 PM": { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
    "3:00 PM": { subject: "Physics", teacher: "Prof. Johnson", room: "205" },
    "4:00 PM": { subject: "Lab", teacher: "Dr. Taylor", room: "Lab-B" },
  },
  "Friday": {
    "9:00 AM": { subject: "Chemistry", teacher: "Dr. Brown", room: "301" },
    "10:00 AM": { subject: "Biology", teacher: "Dr. Taylor", room: "302" },
    "11:00 AM": { subject: "Break", teacher: "", room: "" },
    "12:00 PM": { subject: "Physics", teacher: "Prof. Johnson", room: "205" },
    "1:00 PM": { subject: "Lunch", teacher: "", room: "" },
    "2:00 PM": { subject: "Computer Science", teacher: "Mr. Wilson", room: "401" },
    "3:00 PM": { subject: "Mathematics", teacher: "Dr. Smith", room: "101" },
    "4:00 PM": { subject: "Assembly", teacher: "", room: "Auditorium" },
  },
};

export default function Timetable() {
  const getSubjectBadgeVariant = (subject: string) => {
    if (subject === "Break" || subject === "Lunch") return "secondary";
    if (subject === "Lab" || subject === "Sports") return "destructive";
    if (subject === "Library" || subject === "Assembly") return "outline";
    return "default";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
        <p className="text-muted-foreground">Your weekly class schedule</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
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
                    const classData = timetableData[day as keyof typeof timetableData]?.[time];
                    return (
                      <div key={`${day}-${time}`} className="p-2">
                        {classData ? (
                          <div className="border rounded-lg p-3 h-full bg-card hover:bg-accent transition-colors">
                            <Badge 
                              variant={getSubjectBadgeVariant(classData.subject)}
                              className="mb-2"
                            >
                              {classData.subject}
                            </Badge>
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