import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

// Student attendance data for faculty view
const studentAttendanceData = [
  {
    studentId: "STU001",
    studentName: "John Doe",
    subjects: [
      {
        id: 1,
        subject: "Mathematics",
        teacher: "Dr. Smith",
        totalClasses: 45,
        attended: 42,
        percentage: 93.3,
        lastAttended: "2024-01-15"
      },
      {
        id: 2,
        subject: "Physics", 
        teacher: "Prof. Johnson",
        totalClasses: 40,
        attended: 35,
        percentage: 87.5,
        lastAttended: "2024-01-14"
      }
    ]
  },
  {
    studentId: "STU002", 
    studentName: "Alice Johnson",
    subjects: [
      {
        id: 1,
        subject: "Mathematics",
        teacher: "Dr. Smith", 
        totalClasses: 45,
        attended: 38,
        percentage: 84.4,
        lastAttended: "2024-01-15"
      },
      {
        id: 2,
        subject: "Physics",
        teacher: "Prof. Johnson",
        totalClasses: 40, 
        attended: 32,
        percentage: 80.0,
        lastAttended: "2024-01-14"
      }
    ]
  }
];

// Individual student attendance (for student view)
const attendanceData = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Dr. Smith",
    totalClasses: 45,
    attended: 42,
    percentage: 93.3,
    lastAttended: "2024-01-15"
  },
  {
    id: 2,
    subject: "Physics",
    teacher: "Prof. Johnson",
    totalClasses: 40,
    attended: 35,
    percentage: 87.5,
    lastAttended: "2024-01-14"
  },
  {
    id: 3,
    subject: "Chemistry",
    teacher: "Dr. Brown",
    totalClasses: 38,
    attended: 30,
    percentage: 78.9,
    lastAttended: "2024-01-13"
  },
  {
    id: 4,
    subject: "Computer Science",
    teacher: "Mr. Wilson",
    totalClasses: 42,
    attended: 40,
    percentage: 95.2,
    lastAttended: "2024-01-15"
  },
  {
    id: 5,
    subject: "English",
    teacher: "Ms. Davis",
    totalClasses: 35,
    attended: 33,
    percentage: 94.3,
    lastAttended: "2024-01-12"
  },
  {
    id: 6,
    subject: "Biology",
    teacher: "Dr. Taylor",
    totalClasses: 32,
    attended: 25,
    percentage: 78.1,
    lastAttended: "2024-01-11"
  }
];

export default function Attendance() {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(studentAttendanceData[0]);
  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) return "default";
    if (percentage >= 80) return "secondary";
    return "destructive";
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 75) return "Warning";
    return "Critical";
  };

  // Calculate attendance based on user role
  const currentAttendanceData = user?.role === 'faculty' ? selectedStudent.subjects : attendanceData;
  const overallAttendance = Math.round(
    currentAttendanceData.reduce((sum, subject) => sum + subject.percentage, 0) / currentAttendanceData.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">
          {user?.role === 'faculty' ? 'View student attendance records' : 'Track your class attendance records'}
        </p>
      </div>

      {/* Faculty Student Selection */}
      {user?.role === 'faculty' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStudent.studentId} onValueChange={(value) => {
              const student = studentAttendanceData.find(s => s.studentId === value);
              if (student) setSelectedStudent(student);
            }}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {studentAttendanceData.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId}>
                    {student.studentName} ({student.studentId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallAttendance}%</div>
            <Progress value={overallAttendance} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Status: <Badge variant={getAttendanceBadge(overallAttendance)}>
                {getAttendanceStatus(overallAttendance)}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {currentAttendanceData.reduce((sum, subject) => sum + subject.totalClasses, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {currentAttendanceData.reduce((sum, subject) => sum + subject.attended, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total attended classes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'faculty' ? `Attendance - ${selectedStudent.studentName}` : 'Subject-wise Attendance'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Attended/Total</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Attended</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAttendanceData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.subject}</TableCell>
                  <TableCell>{record.teacher}</TableCell>
                  <TableCell>
                    {record.attended}/{record.totalClasses}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{record.percentage}%</span>
                      <Progress value={record.percentage} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getAttendanceBadge(record.percentage)}>
                      {getAttendanceStatus(record.percentage)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(record.lastAttended).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}