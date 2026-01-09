import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User, AuthState } from './types';
import { hasRoutePermission } from './permissions';

// Get demo users from environment variables
const getDemoUsers = () => {
  try {
    const demoUsersEnv = process.env.DEMO_USERS || process.env.NEXT_PUBLIC_DEMO_USERS;
    if (demoUsersEnv) {
      const users = JSON.parse(demoUsersEnv);
      const mockUsers: Record<string, { password: string; user: User }> = {};
      
      Object.entries(users).forEach(([email, userData]: [string, any]) => {
        mockUsers[email] = {
          password: userData.password,
          user: {
            id: Object.keys(mockUsers).length + 1 + '',
            email,
            name: userData.name,
            role: userData.role
          }
        };
      });
      
      return mockUsers;
    }
  } catch (error) {
    console.warn('Failed to parse DEMO_USERS from environment, using fallback');
  }
  
  // Fallback mock users if env parsing fails
  return {
    'admin@trf.com': {
      password: 'admin123',
      user: { id: '1', email: 'admin@trf.com', name: 'Admin User', role: 'ADMIN' }
    },
    'gate@trf.com': {
      password: 'gate123',
      user: { id: '2', email: 'gate@trf.com', name: 'Gate User', role: 'GATE' }
    },
    'inventory@trf.com': {
      password: 'inventory123',
      user: { id: '3', email: 'inventory@trf.com', name: 'Inventory User', role: 'INVENTORY' }
    }
  };
};

const MOCK_USERS = getDemoUsers();

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      
      login: async (email: string, password: string, role?: Role) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockUser = MOCK_USERS[email];
        if (!mockUser || mockUser.password !== password) {
          throw new Error('Invalid credentials');
        }
        
        // Allow role override for demo purposes
        const user = role ? { ...mockUser.user, role } : mockUser.user;
        set({ user });
        try {
          document.cookie = `trf_role=${user.role}; Path=/; SameSite=Lax`;
          document.cookie = `trf_uid=${user.id}; Path=/; SameSite=Lax`;
          document.cookie = `trf_name=${encodeURIComponent(user.name)}; Path=/; SameSite=Lax`;
        } catch {}
      },
      
      logout: () => {
        set({ user: null });
        try {
          document.cookie = 'trf_role=; Path=/; Max-Age=0; SameSite=Lax';
          document.cookie = 'trf_uid=; Path=/; Max-Age=0; SameSite=Lax';
          document.cookie = 'trf_name=; Path=/; Max-Age=0; SameSite=Lax';
        } catch {}
      },
      
      hasRole: (roles: Role | Role[]) => {
        const user = get().user;
        if (!user) return false;
        
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role) || user.role === 'ADMIN';
      }
    }),
    {
      name: 'trf-auth-storage',
      partialize: (state) => ({ user: state.user }),
      skipHydration: false
    }
  )
);
// Re-export for existing imports
export { hasRoutePermission };