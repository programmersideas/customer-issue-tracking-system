import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import IssueList from '@/components/IssueList';
import { Issue, User, mockIssues, mockUsers, statuses, priorities, categories } from '@/lib/mockData';
import { Shield, Users, AlertTriangle, CheckCircle, Clock, LogOut, Search, Filter } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Load issues from localStorage or use mock data
    const savedIssues = localStorage.getItem('issues');
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    } else {
      setIssues(mockIssues);
      localStorage.setItem('issues', JSON.stringify(mockIssues));
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const handleUpdateStatus = (issueId: string, newStatus: string) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus as Issue['status'], updatedAt: new Date().toISOString() }
        : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem('issues', JSON.stringify(updatedIssues));
  };

  const handleAssignIssue = (issueId: string, assignee: string) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, assignedTo: assignee, updatedAt: new Date().toISOString() }
        : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem('issues', JSON.stringify(updatedIssues));
  };

  const getStatistics = () => {
    const total = issues.length;
    const submitted = issues.filter(i => i.status === 'submitted').length;
    const inProgress = issues.filter(i => i.status === 'in-progress').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const critical = issues.filter(i => i.priority === 'critical').length;
    const high = issues.filter(i => i.priority === 'high').length;

    return { total, submitted, inProgress, resolved, critical, high };
  };

  const stats = getStatistics();

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Federal Housing Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Administrator
              </Badge>
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
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="issues">Manage Issues</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <Badge variant="outline" className="mt-1">All Time</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.submitted}</div>
                  <Badge className="mt-1 bg-blue-100 text-blue-800">New</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <Badge className="mt-1 bg-purple-100 text-purple-800">Active</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.resolved}</div>
                  <Badge className="mt-1 bg-green-100 text-green-800">Complete</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Critical</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.critical}</div>
                  <Badge className="mt-1 bg-red-100 text-red-800">Urgent</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.high}</div>
                  <Badge className="mt-1 bg-orange-100 text-orange-800">Important</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Recent Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Issues
                </CardTitle>
                <CardDescription>Latest submitted issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <IssueList 
                  issues={issues.slice(0, 5)} 
                  isAdmin={true}
                  onUpdateStatus={handleUpdateStatus}
                  onAssignIssue={handleAssignIssue}
                />
                {issues.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab('issues')}>
                      View All Issues
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search issues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">&nbsp;</label>
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues List */}
            <Card>
              <CardHeader>
                <CardTitle>All Issues ({filteredIssues.length})</CardTitle>
                <CardDescription>Manage and track all housing issues</CardDescription>
              </CardHeader>
              <CardContent>
                <IssueList 
                  issues={filteredIssues} 
                  isAdmin={true}
                  onUpdateStatus={handleUpdateStatus}
                  onAssignIssue={handleAssignIssue}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage housing residents and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.name}</h3>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{user.phone}</p>
                        <p className="text-xs text-gray-500">
                          Issues: {issues.filter(i => i.userId === user.id).length}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}