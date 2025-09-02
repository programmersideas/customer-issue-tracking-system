import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import IssueForm from '@/components/IssueForm';
import IssueList from '@/components/IssueList';
import { Issue, User, mockIssues } from '@/lib/mockData';
import { Plus, Home, User as UserIcon, LogOut, Phone, MapPin, Mail } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Load issues from localStorage or use mock data
    const savedIssues = localStorage.getItem('issues');
    if (savedIssues) {
      const allIssues = JSON.parse(savedIssues);
      setIssues(allIssues.filter((issue: Issue) => issue.userId === user.id));
    } else {
      const userIssues = mockIssues.filter(issue => issue.userId === user.id);
      setIssues(userIssues);
    }
  }, [user.id]);

  const handleSubmitIssue = (newIssue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedIssues = [...issues, issue];
    setIssues(updatedIssues);

    // Save to localStorage
    const savedIssues = localStorage.getItem('issues');
    const allIssues = savedIssues ? JSON.parse(savedIssues) : mockIssues;
    const newAllIssues = [...allIssues, issue];
    localStorage.setItem('issues', JSON.stringify(newAllIssues));

    setShowIssueForm(false);
    setActiveTab('issues');
  };

  const getStatusCounts = () => {
    const counts = {
      submitted: issues.filter(i => i.status === 'submitted').length,
      inProgress: issues.filter(i => i.status === 'in-progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      closed: issues.filter(i => i.status === 'closed').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (showIssueForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Submit New Issue</h1>
            <Button variant="outline" onClick={() => setShowIssueForm(false)}>
              Back to Dashboard
            </Button>
          </div>
          <IssueForm
            onSubmit={handleSubmitIssue}
            onCancel={() => setShowIssueForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Federal Housing Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowIssueForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Issue
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="issues">My Issues</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusCounts.submitted}</div>
                  <Badge variant="secondary" className="mt-1">Pending Review</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusCounts.inProgress}</div>
                  <Badge className="mt-1 bg-purple-100 text-purple-800">Being Worked On</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusCounts.resolved}</div>
                  <Badge className="mt-1 bg-green-100 text-green-800">Completed</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{issues.length}</div>
                  <Badge variant="outline" className="mt-1">All Time</Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Issues</CardTitle>
                <CardDescription>Your latest submitted issues</CardDescription>
              </CardHeader>
              <CardContent>
                <IssueList issues={issues.slice(0, 3)} />
                {issues.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab('issues')}>
                      View All Issues
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>All My Issues</CardTitle>
                <CardDescription>Track the status of all your submitted issues</CardDescription>
              </CardHeader>
              <CardContent>
                <IssueList issues={issues} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user.name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Housing Address</Label>
                  <Input id="address" value={user.address} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={user.phone} disabled />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>For urgent issues, contact: emergency@federalhousing.gov</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Emergency hotline: (555) 911-HELP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Office hours: Monday - Friday, 8:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}