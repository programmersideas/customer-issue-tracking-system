import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Issue, priorities, statuses, categories } from '@/lib/mockData';
import { Calendar, User, AlertTriangle } from 'lucide-react';

interface IssueListProps {
  issues: Issue[];
  isAdmin?: boolean;
  onUpdateStatus?: (issueId: string, status: string) => void;
  onAssignIssue?: (issueId: string, assignee: string) => void;
}

export default function IssueList({ issues, isAdmin = false, onUpdateStatus, onAssignIssue }: IssueListProps) {
  const getPriorityColor = (priority: string) => {
    return priorities.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No issues found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{issue.title}</CardTitle>
                <CardDescription>{getCategoryLabel(issue.category)}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(issue.priority)}>
                  {priorities.find(p => p.value === issue.priority)?.label}
                </Badge>
                <Badge className={getStatusColor(issue.status)}>
                  {statuses.find(s => s.value === issue.status)?.label}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{issue.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(issue.createdAt)}</span>
              </div>
              {issue.assignedTo && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Assigned to: {issue.assignedTo}</span>
                </div>
              )}
            </div>

            {issue.resolution && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-1">Resolution:</h4>
                <p className="text-green-700">{issue.resolution}</p>
              </div>
            )}

            {isAdmin && (
              <div className="flex gap-4 pt-4 border-t">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Update Status</label>
                  <Select
                    value={issue.status}
                    onValueChange={(value) => onUpdateStatus?.(issue.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {!issue.assignedTo && (
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Assign To</label>
                    <Select onValueChange={(value) => onAssignIssue?.(issue.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maintenance Team A">Maintenance Team A</SelectItem>
                        <SelectItem value="Maintenance Team B">Maintenance Team B</SelectItem>
                        <SelectItem value="Electrical Team">Electrical Team</SelectItem>
                        <SelectItem value="Plumbing Team">Plumbing Team</SelectItem>
                        <SelectItem value="Safety Team">Safety Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}