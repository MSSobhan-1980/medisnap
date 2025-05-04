
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper functions to create stored procedures for common operations
 */
export const createRPCFunctions = async () => {
  try {
    // Create RPC for getting user roles
    try {
      await (supabase as any).rpc('create_get_user_roles_function', {});
    } catch (error) {
      console.error('Failed to create get_user_roles_function:', error);
    }
    
    // Create RPC for getting caregiver dependents
    try {
      await (supabase as any).rpc('create_get_caregiver_dependents_function', {});
    } catch (error) {
      console.error('Failed to create get_caregiver_dependents_function:', error);
    }
    
    // Create RPC for user meal detections
    try {
      await (supabase as any).rpc('create_get_user_meal_detections_function', {});
    } catch (error) {
      console.error('Failed to create get_user_meal_detections_function:', error);
    }
    
    // Create RPC for deleting user meal detections
    try {
      await (supabase as any).rpc('create_delete_user_meal_detections_function', {});
    } catch (error) {
      console.error('Failed to create delete_user_meal_detections_function:', error);
    }
    
    // Create RPC for inserting user consents
    try {
      await (supabase as any).rpc('create_insert_user_consents_function', {});
    } catch (error) {
      console.error('Failed to create insert_user_consents_function:', error);
    }
    
    console.log('Successfully created RPC functions');
  } catch (error) {
    console.error('Error creating RPC functions:', error);
  }
};
