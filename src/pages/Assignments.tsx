import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Upload, Download, User, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  maxMarks: number;
  assignedBy: string;
  createdDate: string;
  attachments?: string[];
  submissions?: Submission[];
}

interface Submission {
  id: number;
  studentId: string;
  studentName: string;
  submissionDate: string;
  attachments: string[];
  marks?: number;
  feedback?: string;
}

const initialAssignments: Assignment[] = [
  {
    id: 1,
    title: "Calculus Problem Set 3",
    description: "Solve the integration problems from Chapter 5. Show all working steps and provide clear explanations for each solution.",
    subject: "Mathematics",
    dueDate: "2024-01-20",
    maxMarks: 50,
    assignedBy: "Dr. Smith",
    createdDate: "2024-01-10",
    attachments: ["problem_set_3.pdf"],
    submissions: [
      {
        id: 1,
        studentId: "1",
        studentName: "John Doe",
        submissionDate: "2024-01-18",
        attachments: ["john_calculus_solution.pdf"],
        marks: 45,
        feedback: "Excellent work! Minor error in problem 3."
      }
    ]
  },
  {
    id: 2,
    title: "Physics Lab Report - Pendulum Experiment",
    description: "Write a comprehensive lab report on the simple pendulum experiment. Include hypothesis, methodology, results, and conclusion.",
    subject: "Physics",
    dueDate: "2024-01-25",
    maxMarks: 100,
    assignedBy: "Prof. Johnson",
    createdDate: "2024-01-12",
    attachments: ["lab_report_template.docx", "experiment_data.xlsx"],
    submissions: []
  },
  {
    id: 3,
    title: "Essay: Environmental Chemistry",
    description: "Write a 2000-word essay on the impact of industrial waste on water bodies. Include recent case studies and propose solutions.",
    subject: "Chemistry",
    dueDate: "2024-01-30",
    maxMarks: 75,
    assignedBy: "Dr. Brown",
    createdDate: "2024-01-14",
    submissions: [
      {
        id: 2,
        studentId: "3",
        studentName: "Alice Johnson",
        submissionDate: "2024-01-28",
        attachments: ["environmental_chemistry_essay.pdf"],
        marks: 68,
        feedback: "Good research and analysis. Could improve on the conclusion."
      }
    ]
  }
];

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    subject: "Mathematics",
    dueDate: "",
    maxMarks: 100
  });
  const [submissions, setSubmissions] = useState<{ [key: number]: string }>({});

  const subjects = ["Mathematics", "Physics", "Chemistry", "Computer Science", "English", "Biology"];

  const getStatusBadge = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < now;
    
    if (user?.role === 'student') {
      const hasSubmitted = assignment.submissions?.some(s => s.studentId === user.id);
      if (hasSubmitted) {
        return <Badge variant="default">Submitted</Badge>;
      }
      if (isOverdue) {
        return <Badge variant="destructive">Overdue</Badge>;
      }
      return <Badge variant="secondary">Pending</Badge>;
    }
    
    return isOverdue ? <Badge variant="destructive">Overdue</Badge> : <Badge variant="default">Active</Badge>;
  };

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateAssignment = () => {
    if (!newAssignment.title.trim() || !newAssignment.description.trim() || !newAssignment.dueDate) {
      return;
    }

    const assignment: Assignment = {
      id: Date.now(),
      title: newAssignment.title,
      description: newAssignment.description,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      maxMarks: newAssignment.maxMarks,
      assignedBy: user?.name || "Faculty",
      createdDate: new Date().toISOString().split('T')[0],
      submissions: []
    };

    setAssignments([assignment, ...assignments]);
    setNewAssignment({
      title: "",
      description: "",
      subject: "Mathematics",
      dueDate: "",
      maxMarks: 100
    });
    setShowNewAssignment(false);
  };

  const handleSubmitAssignment = (assignmentId: number) => {
    const content = submissions[assignmentId];
    if (!content?.trim()) return;

    const submission: Submission = {
      id: Date.now(),
      studentId: user?.id || "1",
      studentName: user?.name || "Student",
      submissionDate: new Date().toISOString().split('T')[0],
      attachments: [`${user?.name?.replace(/\s+/g, '_')}_submission.pdf`]
    };

    setAssignments(assignments.map(a => 
      a.id === assignmentId 
        ? { ...a, submissions: [...(a.submissions || []), submission] }
        : a
    ));

    setSubmissions({ ...submissions, [assignmentId]: "" });
  };

  const getSubmissionForUser = (assignment: Assignment) => {
    return assignment.submissions?.find(s => s.studentId === user?.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">
            {user?.role === 'faculty' ? 'Manage and grade assignments' : 'View and submit assignments'}
          </p>
        </div>
        {user?.role === 'faculty' && (
          <Button onClick={() => setShowNewAssignment(true)}>
            Create Assignment
          </Button>
        )}
      </div>

      {/* Stats for faculty */}
      {user?.role === 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{assignments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {assignments.reduce((sum, a) => sum + (a.submissions?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {assignments.reduce((sum, a) => 
                  sum + (a.submissions?.filter(s => !s.marks).length || 0), 0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Graded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {assignments.reduce((sum, a) => 
                  sum + (a.submissions?.filter(s => s.marks !== undefined).length || 0), 0
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Assignment Form */}
      {showNewAssignment && user?.role === 'faculty' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Assignment title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <select
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Marks</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={newAssignment.maxMarks}
                  onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Assignment description and instructions"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateAssignment}>Create Assignment</Button>
              <Button variant="outline" onClick={() => setShowNewAssignment(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const userSubmission = getSubmissionForUser(assignment);
          const daysRemaining = getDaysRemaining(assignment.dueDate);
          
          return (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{assignment.subject}</Badge>
                      {getStatusBadge(assignment)}
                      {daysRemaining <= 3 && daysRemaining >= 0 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Due Soon
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-muted-foreground mt-2">{assignment.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {assignment.assignedBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {daysRemaining >= 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`}
                  </div>
                  <div>Max Marks: {assignment.maxMarks}</div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Attachments */}
                {assignment.attachments && assignment.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Attachments:</h4>
                    <div className="flex gap-2">
                      {assignment.attachments.map((attachment, index) => (
                        <Button key={index} size="sm" variant="outline" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Submission Section */}
                {user?.role === 'student' && (
                  <div className="border-t pt-4">
                    {userSubmission ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600">Your Submission</h4>
                        <p className="text-sm text-muted-foreground">
                          Submitted on: {new Date(userSubmission.submissionDate).toLocaleDateString()}
                        </p>
                        {userSubmission.marks !== undefined && (
                          <div className="flex items-center gap-2">
                            <Badge variant="default">
                              Graded: {userSubmission.marks}/{assignment.maxMarks}
                            </Badge>
                          </div>
                        )}
                        {userSubmission.feedback && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium">Feedback:</p>
                            <p className="text-sm">{userSubmission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="font-medium">Submit Assignment</h4>
                        <Textarea
                          placeholder="Enter your submission or notes about attached files..."
                          value={submissions[assignment.id] || ""}
                          onChange={(e) => setSubmissions({
                            ...submissions,
                            [assignment.id]: e.target.value
                          })}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitAssignment(assignment.id)}
                            disabled={daysRemaining < 0}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Submit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="h-3 w-3 mr-1" />
                            Upload File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Faculty - View Submissions */}
                {user?.role === 'faculty' && assignment.submissions && assignment.submissions.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">
                      Submissions ({assignment.submissions.length})
                    </h4>
                    <div className="space-y-3">
                      {assignment.submissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{submission.studentName}</p>
                              <p className="text-sm text-muted-foreground">
                                Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {submission.marks !== undefined ? (
                                <Badge variant="default">
                                  {submission.marks}/{assignment.maxMarks}
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending Review</Badge>
                              )}
                              <Button size="sm" variant="outline">Grade</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {user?.role === 'faculty' ? 'No assignments created yet.' : 'No assignments available.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}