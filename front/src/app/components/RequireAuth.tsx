import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAppContext, type UserRole } from '../context/AppContext';

type RequireAuthProps = {
  children: ReactElement;
  allowedRoles?: UserRole[];
};

export function getDashboardPathForRole(role: UserRole): string {
  if (role === 'super_admin') {
    return '/dashboard/superadmin';
  }
  if (role === 'guide') {
    return '/dashboard/guide';
  }
  if (role === 'driver') {
    return '/dashboard/driver';
  }
  return '/home';
}

export default function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const location = useLocation();
  const { authMode, userRole } = useAppContext();

  if (authMode !== 'login') {
    const redirectTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={getDashboardPathForRole(userRole)} replace />;
  }

  return children;
}
