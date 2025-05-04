
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
        
        // Fetch user roles using safer approach with RPC
        try {
          const { data: rolesData, error: rolesError } = await supabase.rpc('get_user_roles', { user_uuid: user.id });
          
          if (!rolesError && rolesData) {
            const userRoles = rolesData.map((r: any) => r.role as Role);
            setRoles(userRoles.length ? userRoles : ['user']);
          } else {
            // Fallback to direct query if RPC is not available
            const { data, error } = await (supabase as any)
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id);
              
            if (error) throw error;
            
            const userRoles = data?.map((r: any) => r.role as Role) || ['user'];
            setRoles(userRoles);
          }
        } catch (error) {
          console.error('Error fetching roles:', error);
          setRoles(['user']); // Default to user role on error
        }
        
        // If user role includes caregiver, fetch dependents using safer approach
        if (roles.includes('caregiver')) {
          try {
            const { data: dependentsData, error: dependentsError } = await supabase.rpc('get_caregiver_dependents', { caregiver_uuid: user.id });
            
            if (!dependentsError && dependentsData) {
              setDependents(dependentsData.map((d: any) => ({
                id: d.dependent_id,
                name: d.full_name || 'Unknown'
              })));
            } else {
              // Fallback to direct query
              try {
                const { data, error } = await (supabase as any)
                  .from('caregiver_relationships')
                  .select(`
                    dependent_id,
                    profiles!caregiver_relationships_dependent_id_fkey (
                      full_name
                    )
                  `)
                  .eq('caregiver_id', user.id);
                  
                if (error) throw error;
                
                setDependents(
                  data?.map((d: any) => ({
                    id: d.dependent_id,
                    name: d.profiles?.full_name || 'Unknown'
                  })) || []
                );
              } catch (innerError) {
                console.error('Error in fallback dependent query:', innerError);
                setDependents([]);
              }
            }
          } catch (error) {
            console.error('Error fetching dependents:', error);
            setDependents([]);
          }
        }
      } catch (error) {
        console.error('Error fetching authorization data:', error);
        setRoles(['user']); // Default to user role on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoles();
  }, [user, roles.includes('caregiver')]);
  
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
