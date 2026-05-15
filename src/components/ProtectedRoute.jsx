import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '../store/auth';

export default function ProtectedRoute({ children }) {
  const token = getToken();
  const user = getUser();

  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  return children;
}