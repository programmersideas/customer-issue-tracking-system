export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address: string;
  phone: string;
}

export interface Issue {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'maintenance' | 'utilities' | 'safety' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'user',
    address: '123 Federal Housing Unit A',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@federalhousing.gov',
    role: 'admin',
    address: 'Federal Housing Administration',
    phone: '(555) 987-6543'
  }
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    userId: '1',
    title: 'Leaking Faucet in Kitchen',
    description: 'The kitchen faucet has been leaking for 3 days. Water is dripping constantly.',
    category: 'maintenance',
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    assignedTo: 'Maintenance Team A'
  },
  {
    id: '2',
    userId: '1',
    title: 'Broken Window Lock',
    description: 'The window lock in the bedroom is broken and won\'t secure properly.',
    category: 'safety',
    priority: 'high',
    status: 'submitted',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z'
  },
  {
    id: '3',
    userId: '1',
    title: 'Power Outage in Living Room',
    description: 'No electricity in the living room for the past 2 hours.',
    category: 'utilities',
    priority: 'critical',
    status: 'resolved',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T15:30:00Z',
    assignedTo: 'Electrical Team',
    resolution: 'Circuit breaker was reset and electrical connections were checked.'
  }
];

export const categories = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'safety', label: 'Safety' },
  { value: 'other', label: 'Other' }
];

export const priorities = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
];

export const statuses = [
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
];