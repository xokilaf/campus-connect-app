import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/auth/LoginForm";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import NotesSharing from "./pages/NotesSharing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notes" element={<NotesSharing />} />
        <Route path="/timetable" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Timetable</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/assignments" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Assignments</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/attendance" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Attendance</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/forum" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Doubt Forum</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/fees" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Fee Tracking</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/maintenance" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Maintenance</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="/certificates" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Certificates</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
