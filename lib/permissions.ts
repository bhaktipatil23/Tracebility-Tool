import { Role } from './types';

export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/': ['ADMIN', 'GATE', 'SEG', 'INVENTORY', 'SALES', 'FINANCE', 'AUDITOR'],
  '/material-in': ['GATE', 'ADMIN', 'AUDITOR'],
  '/lots': ['GATE', 'ADMIN', 'AUDITOR'],

  '/material-out': ['INVENTORY', 'ADMIN'],
  '/partners': ['ADMIN', 'SALES'],
  '/inventory': ['INVENTORY', 'SALES', 'ADMIN', 'AUDITOR'],

  '/compliance': ['AUDITOR', 'ADMIN'],
  '/config': ['ADMIN']
};

export function hasRoutePermission(path: string, userRole?: Role): boolean {
  if (!userRole) return false;
  if (userRole === 'ADMIN') return true;
  const permissions = ROUTE_PERMISSIONS[path];
  return permissions ? permissions.includes(userRole) : false;
}




