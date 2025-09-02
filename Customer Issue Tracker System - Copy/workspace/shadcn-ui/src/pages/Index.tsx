import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import { User } from '@/lib/mockData';

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUserId', user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return <UserDashboard user={currentUser} onLogout={handleLogout} />;
}