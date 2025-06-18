export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          application_id: number
          badge_url: string
          created_at: string
          description: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          application_id: number
          badge_url: string
          created_at?: string
          description: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          application_id?: number
          badge_url?: string
          created_at?: string
          description?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_user_data: {
        Row: {
          application_id: number
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id: number
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: number
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_user_data_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          base_price_monthly: number
          created_at: string
          description: string
          icon_url: string
          id: number
          landing_page_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          base_price_monthly: number
          created_at?: string
          description: string
          icon_url: string
          id?: number
          landing_page_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          base_price_monthly?: number
          created_at?: string
          description?: string
          icon_url?: string
          id?: number
          landing_page_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          primary_user_id: string
          relationship: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          primary_user_id: string
          relationship: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          primary_user_id?: string
          relationship?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          id: string
          logged_at: string
          medication_id: string
          new_status: string
          notes: string | null
          old_status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          logged_at?: string
          medication_id: string
          new_status: string
          notes?: string | null
          old_status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          logged_at?: string
          medication_id?: string
          new_status?: string
          notes?: string | null
          old_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_reminders: {
        Row: {
          created_at: string
          family_member_id: string | null
          id: string
          is_enabled: boolean
          medication_id: string
          reminder_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_member_id?: string | null
          id?: string
          is_enabled?: boolean
          medication_id: string
          reminder_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_member_id?: string | null
          id?: string
          is_enabled?: boolean
          medication_id?: string
          reminder_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_reminders_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_reminders_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          family_member_id: string | null
          frequency: string
          id: string
          instructions: string | null
          name: string
          notes: string | null
          start_date: string | null
          status: string | null
          time: string
          timing: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          family_member_id?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          name: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          time: string
          timing?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          family_member_id?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          name?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          time?: string
          timing?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_scans: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          extracted_medications: Json | null
          id: string
          image_url: string
          ocr_text: string | null
          processing_status: string | null
          scan_date: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          extracted_medications?: Json | null
          id?: string
          image_url: string
          ocr_text?: string | null
          processing_status?: string | null
          scan_date?: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          extracted_medications?: Json | null
          id?: string
          image_url?: string
          ocr_text?: string | null
          processing_status?: string | null
          scan_date?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          preferred_language: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          preferred_language?: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          preferred_language?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_remedies: {
        Row: {
          created_at: string
          id: string
          personal_notes: string | null
          remedy_details: Json
          remedy_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          personal_notes?: string | null
          remedy_details: Json
          remedy_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          personal_notes?: string | null
          remedy_details?: Json
          remedy_name?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string
          id: number
          interval: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          interval: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          interval?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      symptom_sessions: {
        Row: {
          ai_analysis: string | null
          created_at: string
          id: string
          identified_issues: Json | null
          recommended_remedies: Json | null
          selected_symptoms: string[]
          session_date: string
          user_id: string | null
        }
        Insert: {
          ai_analysis?: string | null
          created_at?: string
          id?: string
          identified_issues?: Json | null
          recommended_remedies?: Json | null
          selected_symptoms: string[]
          session_date?: string
          user_id?: string | null
        }
        Update: {
          ai_analysis?: string | null
          created_at?: string
          id?: string
          identified_issues?: Json | null
          recommended_remedies?: Json | null
          selected_symptoms?: string[]
          session_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: number
          created_at: string
          earned_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_id: number
          created_at?: string
          earned_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: number
          created_at?: string
          earned_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_health_profiles: {
        Row: {
          age: number | null
          allergies: string[] | null
          created_at: string
          gender: string | null
          id: string
          medical_conditions: string[] | null
          preferred_remedy_types: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          allergies?: string[] | null
          created_at?: string
          gender?: string | null
          id?: string
          medical_conditions?: string[] | null
          preferred_remedy_types?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          allergies?: string[] | null
          created_at?: string
          gender?: string | null
          id?: string
          medical_conditions?: string[] | null
          preferred_remedy_types?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_remedy_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          notes: string | null
          rating: number | null
          remedy_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          notes?: string | null
          rating?: number | null
          remedy_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          notes?: string | null
          rating?: number | null
          remedy_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          application_id: number
          created_at: string
          end_date: string | null
          id: string
          start_date: string
          status: string
          stripe_subscription_id: string | null
          subscription_plan_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id: number
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string
          status: string
          stripe_subscription_id?: string | null
          subscription_plan_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: number
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_plan_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
