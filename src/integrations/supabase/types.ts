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
      caregiver_relationships: {
        Row: {
          caregiver_id: string
          created_at: string
          dependent_id: string
          id: string
        }
        Insert: {
          caregiver_id: string
          created_at?: string
          dependent_id: string
          id?: string
        }
        Update: {
          caregiver_id?: string
          created_at?: string
          dependent_id?: string
          id?: string
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
      meal_detections: {
        Row: {
          analysis: Json | null
          created_at: string
          id: string
          image_url: string | null
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          user_id: string
        }
        Update: {
          analysis?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medication_reminders: {
        Row: {
          created_at: string
          family_member_id: string | null
          id: string
          is_enabled: boolean | null
          medication_id: string
          reminder_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_member_id?: string | null
          id?: string
          is_enabled?: boolean | null
          medication_id: string
          reminder_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_member_id?: string | null
          id?: string
          is_enabled?: boolean | null
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
          start_date: string
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
          start_date?: string
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
          start_date?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_id: string
          feature_id: string
          granted: boolean
          granted_at: string
          id: string
          user_id: string
        }
        Insert: {
          consent_id: string
          feature_id: string
          granted?: boolean
          granted_at?: string
          id?: string
          user_id: string
        }
        Update: {
          consent_id?: string
          feature_id?: string
          granted?: boolean
          granted_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
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
