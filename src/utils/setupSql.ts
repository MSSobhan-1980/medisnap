
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets up the required SQL functions and procedures for the application.
 * This should be run once after the database is set up.
 */
export const setupRequiredSqlFunctions = async () => {
  try {
    // Create get_user_roles function
    try {
      const getUserRolesResult = await (supabase as any).rpc('exec_sql', {
        sql_statement: `
          CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID)
          RETURNS TABLE (role TEXT) AS $$
          BEGIN
            RETURN QUERY SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = user_uuid;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (getUserRolesResult.error) {
        console.error('Error creating get_user_roles function:', getUserRolesResult.error);
      }
    } catch (error) {
      console.error('Failed to create get_user_roles function:', error);
    }
    
    // Create get_caregiver_dependents function
    try {
      const getCaregiverDependentsResult = await (supabase as any).rpc('exec_sql', {
        sql_statement: `
          CREATE OR REPLACE FUNCTION public.get_caregiver_dependents(caregiver_uuid UUID)
          RETURNS TABLE (dependent_id UUID, full_name TEXT) AS $$
          BEGIN
            RETURN QUERY 
            SELECT cr.dependent_id, p.full_name 
            FROM public.caregiver_relationships cr
            LEFT JOIN public.profiles p ON p.id = cr.dependent_id
            WHERE cr.caregiver_id = caregiver_uuid;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (getCaregiverDependentsResult.error) {
        console.error('Error creating get_caregiver_dependents function:', getCaregiverDependentsResult.error);
      }
    } catch (error) {
      console.error('Failed to create get_caregiver_dependents function:', error);
    }
    
    // Create get_user_meal_detections function
    try {
      const getUserMealDetectionsResult = await (supabase as any).rpc('exec_sql', {
        sql_statement: `
          CREATE OR REPLACE FUNCTION public.get_user_meal_detections(user_uuid UUID)
          RETURNS SETOF public.meal_detections AS $$
          BEGIN
            RETURN QUERY SELECT * FROM public.meal_detections WHERE user_id = user_uuid;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (getUserMealDetectionsResult.error) {
        console.error('Error creating get_user_meal_detections function:', getUserMealDetectionsResult.error);
      }
    } catch (error) {
      console.error('Failed to create get_user_meal_detections function:', error);
    }
    
    // Create delete_user_meal_detections function
    try {
      const deleteUserMealDetectionsResult = await (supabase as any).rpc('exec_sql', {
        sql_statement: `
          CREATE OR REPLACE FUNCTION public.delete_user_meal_detections(user_uuid UUID)
          RETURNS void AS $$
          BEGIN
            DELETE FROM public.meal_detections WHERE user_id = user_uuid;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (deleteUserMealDetectionsResult.error) {
        console.error('Error creating delete_user_meal_detections function:', deleteUserMealDetectionsResult.error);
      }
    } catch (error) {
      console.error('Failed to create delete_user_meal_detections function:', error);
    }
    
    // Create insert_user_consents function
    try {
      const insertUserConsentsResult = await (supabase as any).rpc('exec_sql', {
        sql_statement: `
          CREATE OR REPLACE FUNCTION public.insert_user_consents(consent_data JSONB)
          RETURNS void AS $$
          BEGIN
            INSERT INTO public.user_consents (user_id, feature_id, consent_id, granted, granted_at)
            SELECT 
              (x->>'user_id')::uuid,
              x->>'feature_id',
              x->>'consent_id',
              (x->>'granted')::boolean,
              (x->>'granted_at')::timestamptz
            FROM jsonb_array_elements(consent_data) AS x
            ON CONFLICT (user_id, feature_id, consent_id) 
            DO UPDATE SET 
              granted = EXCLUDED.granted,
              granted_at = EXCLUDED.granted_at;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (insertUserConsentsResult.error) {
        console.error('Error creating insert_user_consents function:', insertUserConsentsResult.error);
      }
    } catch (error) {
      console.error('Failed to create insert_user_consents function:', error);
    }
    
    // Create exec_sql helper function if it doesn't exist
    try {
      const createExecSqlResult = await (supabase as any).rpc('exec_sql', {
        sql_statement: `
          CREATE OR REPLACE FUNCTION public.exec_sql(sql_statement text)
          RETURNS json AS $$
          BEGIN
            EXECUTE sql_statement;
            RETURN json_build_object('success', true);
          EXCEPTION WHEN OTHERS THEN
            RETURN json_build_object('success', false, 'error', SQLERRM);
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (createExecSqlResult.error) {
        console.error('Error creating exec_sql function:', createExecSqlResult.error);
      }
    } catch (error) {
      console.error('Failed to create exec_sql function:', error);
    }
    
    toast.success('Database functions set up successfully');
    return true;
  } catch (error) {
    console.error('Error setting up SQL functions:', error);
    toast.error('Failed to set up database functions');
    return false;
  }
};
