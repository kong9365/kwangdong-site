export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      checklists: {
        Row: {
          completed_at: string | null
          created_at: string | null
          document_upload: boolean
          id: string
          privacy_consent: boolean
          safety_education: boolean
          security_agreement: boolean
          updated_at: string | null
          visit_request_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          document_upload?: boolean
          id?: string
          privacy_consent?: boolean
          safety_education?: boolean
          security_agreement?: boolean
          updated_at?: string | null
          visit_request_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          document_upload?: boolean
          id?: string
          privacy_consent?: boolean
          safety_education?: boolean
          security_agreement?: boolean
          updated_at?: string | null
          visit_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_visit_request_id_fkey"
            columns: ["visit_request_id"]
            isOneToOne: true
            referencedRelation: "visit_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          department: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visit_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company: string
          created_at: string | null
          department: string
          id: string
          purpose: string
          rejection_reason: string | null
          requester_id: string
          status: Database["public"]["Enums"]["visit_status"]
          updated_at: string | null
          visit_date: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company: string
          created_at?: string | null
          department: string
          id?: string
          purpose: string
          rejection_reason?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string | null
          visit_date: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company?: string
          created_at?: string | null
          department?: string
          id?: string
          purpose?: string
          rejection_reason?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string | null
          visit_date?: string
        }
        Relationships: []
      }
      visitor_info: {
        Row: {
          car_number: string | null
          created_at: string | null
          id: string
          id_document_url: string | null
          updated_at: string | null
          visit_request_id: string
          visitor_email: string | null
          visitor_name: string
          visitor_phone: string
        }
        Insert: {
          car_number?: string | null
          created_at?: string | null
          id?: string
          id_document_url?: string | null
          updated_at?: string | null
          visit_request_id: string
          visitor_email?: string | null
          visitor_name: string
          visitor_phone: string
        }
        Update: {
          car_number?: string | null
          created_at?: string | null
          id?: string
          id_document_url?: string | null
          updated_at?: string | null
          visit_request_id?: string
          visitor_email?: string | null
          visitor_name?: string
          visitor_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_info_visit_request_id_fkey"
            columns: ["visit_request_id"]
            isOneToOne: false
            referencedRelation: "visit_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "visitor"
      visit_status:
        | "REQUESTED"
        | "APPROVED"
        | "REJECTED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "visitor"],
      visit_status: [
        "REQUESTED",
        "APPROVED",
        "REJECTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
    },
  },
} as const
