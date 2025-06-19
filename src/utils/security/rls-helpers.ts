
/**
 * Helper functions for Row Level Security (RLS) policies
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a user has a specific role
 * @param userId User ID to check
 * @param role Role to check
 * @returns Boolean indicating if user has the role
 */
export const hasRole = async (userId: string, role: 'user' | 'admin' | 'caregiver' | 'child'): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role)
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (err) {
    console.error('Error checking role:', err);
    return false;
  }
};

/**
 * Checks if a user is a caregiver for another user
 * @param caregiverId The potential caregiver's user ID
 * @param dependentId The potential dependent's user ID
 * @returns Boolean indicating if caregiver relationship exists
 */
export const isCaregiverFor = async (caregiverId: string, dependentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('caregiver_relationships')
      .select('*')
      .eq('caregiver_id', caregiverId)
      .eq('dependent_id', dependentId)
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (err) {
    console.error('Error checking caregiver relationship:', err);
    return false;
  }
};

/**
 * Gets all dependents for a caregiver
 * @param caregiverId The caregiver's user ID
 * @returns Array of dependent user IDs
 */
export const getDependentsForCaregiver = async (caregiverId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('caregiver_relationships')
      .select('dependent_id')
      .eq('caregiver_id', caregiverId);
      
    if (error) throw error;
    return data?.map(row => row.dependent_id) || [];
  } catch (err) {
    console.error('Error getting dependents:', err);
    return [];
  }
};
