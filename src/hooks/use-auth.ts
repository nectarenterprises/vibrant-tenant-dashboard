
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  return {
    user: auth.user,
    signOut: auth.signOut,
    session: auth.session
  };
};
