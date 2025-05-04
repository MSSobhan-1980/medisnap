
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type Role = 'user' | 'admin' | 'caregiver' | 'child';

export function useAuthorization() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [dependents, setDependents] = useState<{id: string, name: string}[]>([]);
  
  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) {
        setRoles([]);
        setDependents([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch user roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesError) throw rolesError;
        
        const userRoles = rolesData?.map(r => r.role as Role) || ['user'];
        setRoles(userRoles);
        
        // If user is a caregiver, fetch their dependents
        if (userRoles.includes('caregiver')) {
          const { data: dependentsData, error: dependentsError } = await supabase
            .from('caregiver_relationships')
            .select(`
              dependent_id,
              profiles!caregiver_relationships_dependent_id_fkey (
                full_name
              )
            `)
            .eq('caregiver_id', user.id);
            
          if (dependentsError) throw dependentsError;
          
          setDependents(
            dependentsData?.map(d => ({
              id: d.dependent_id,
              name: d.profiles?.full_name || 'Unknown'
            })) || []
          );
        }
      } catch (error) {
        console.error('Error fetching authorization data:', error);
        setRoles(['user']); // Default to user role on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoles();
  }, [user]);
  
  const hasRole = (role: Role): boolean => roles.includes(role);
  
  const canAccessResource = (resourceOwnerId: string): boolean => {
    // User can access their own resources
    if (user && user.id === resourceOwnerId) return true;
    
    // Admin can access all resources
    if (hasRole('admin')) return true;
    
    // Caregiver can access dependents' resources
    if (hasRole('caregiver')) {
      return dependents.some(d => d.id === resourceOwnerId);
    }
    
    return false;
  };
  
  return {
    roles,
    hasRole,
    canAccessResource,
    isAdmin: hasRole('admin'),
    isCaregiver: hasRole('caregiver'),
    isChild: hasRole('child'),
    dependents,
    loading
  };
}
