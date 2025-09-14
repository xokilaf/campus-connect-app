import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  CreditCard,
  Wrench,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const quickStats = [
  {
    title: 'Notes Shared',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: BookOpen,
    color: 'text-primary',
  },
  {
    title: 'Assignments Due',
    value: '3',
    change: 'This week',
    trend: 'warning',
    icon: FileText,
    color: 'text-warning',
  },
  {
    title: 'Attendance Rate',
    value: '94%',
    change: '+2%',
    trend: 'up',
    icon: Users,
    color: 'text-accent',
  },
  {
    title: 'Forum Posts',
    value: '12',
    change: 'Active',
    trend: 'neutral',
    icon: MessageSquare,
    color: 'text-secondary',
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'assignment',
    title: 'Data Structures Assignment submitted',
    time: '2 hours ago',
    icon: CheckCircle2,
    color: 'text-accent',
  },
  {
    id: 2,
    type: 'note',
    title: 'New notes shared in Computer Networks',
    time: '4 hours ago',
    icon: BookOpen,
    color: 'text-primary',
  },
  {
    id: 3,
    type: 'forum',
    title: 'Question answered in Doubt Forum',
    time: '6 hours ago',
    icon: MessageSquare,
    color: 'text-secondary',
  },
  {
    id: 4,
    type: 'schedule',
    title: 'Class schedule updated',
    time: '1 day ago',
    icon: Calendar,
    color: 'text-muted-foreground',
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Database Systems Assignment',
    dueDate: 'Tomorrow',
    priority: 'high',
    course: 'CS 301',
  },
  {
    id: 2,
    title: 'Operating Systems Quiz',
    dueDate: 'In 3 days',
    priority: 'medium',
    course: 'CS 401',
  },
  {
    id: 3,
    title: 'Software Engineering Project',
    dueDate: 'Next week',
    priority: 'low',
    course: 'CS 501',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your campus activities today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>
                    {stat.change}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Your latest campus interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/forum">View All Activity</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Upcoming Tasks</span>
            </CardTitle>
            <CardDescription>
              Don't miss these important deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.course}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityColor(task.priority) as any}>
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {task.dueDate}
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/assignments">View All Assignments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access your most used features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link to="/notes">
                <BookOpen className="h-6 w-6" />
                <span>Share Notes</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link to="/timetable">
                <Calendar className="h-6 w-6" />
                <span>View Schedule</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link to="/forum">
                <MessageSquare className="h-6 w-6" />
                <span>Ask Doubts</span>
              </Link>
            </Button>
            {user?.role === 'student' && (
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link to="/certificates">
                  <Award className="h-6 w-6" />
                  <span>Certificates</span>
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}