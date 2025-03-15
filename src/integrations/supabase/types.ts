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
      document_tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string
          floor_area: string | null
          id: string
          image_path: string | null
          incentives: Json | null
          lease_duration: string | null
          lease_expiry: string
          lease_start: string | null
          lease_type: string | null
          name: string
          next_payment_date: string
          parking_spaces: string | null
          premises_schedule: string | null
          property_type: string | null
          rental_fee: number
          security_deposit: string | null
          updated_at: string
          user_id: string
          year_built: string | null
        }
        Insert: {
          address: string
          created_at?: string
          floor_area?: string | null
          id?: string
          image_path?: string | null
          incentives?: Json | null
          lease_duration?: string | null
          lease_expiry: string
          lease_start?: string | null
          lease_type?: string | null
          name: string
          next_payment_date: string
          parking_spaces?: string | null
          premises_schedule?: string | null
          property_type?: string | null
          rental_fee: number
          security_deposit?: string | null
          updated_at?: string
          user_id: string
          year_built?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          floor_area?: string | null
          id?: string
          image_path?: string | null
          incentives?: Json | null
          lease_duration?: string | null
          lease_expiry?: string
          lease_start?: string | null
          lease_type?: string | null
          name?: string
          next_payment_date?: string
          parking_spaces?: string | null
          premises_schedule?: string | null
          property_type?: string | null
          rental_fee?: number
          security_deposit?: string | null
          updated_at?: string
          user_id?: string
          year_built?: string | null
        }
        Relationships: []
      }
      property_documents: {
        Row: {
          description: string | null
          document_type: string
          expiry_date: string | null
          file_path: string
          id: string
          is_favorite: boolean | null
          key_dates: Json | null
          last_accessed: string | null
          name: string
          notification_period: number | null
          previous_versions: Json | null
          property_id: string
          tags: Json | null
          upload_date: string
          user_id: string
          version: number | null
          version_notes: string | null
        }
        Insert: {
          description?: string | null
          document_type: string
          expiry_date?: string | null
          file_path: string
          id?: string
          is_favorite?: boolean | null
          key_dates?: Json | null
          last_accessed?: string | null
          name: string
          notification_period?: number | null
          previous_versions?: Json | null
          property_id: string
          tags?: Json | null
          upload_date?: string
          user_id: string
          version?: number | null
          version_notes?: string | null
        }
        Update: {
          description?: string | null
          document_type?: string
          expiry_date?: string | null
          file_path?: string
          id?: string
          is_favorite?: boolean | null
          key_dates?: Json | null
          last_accessed?: string | null
          name?: string
          notification_period?: number | null
          previous_versions?: Json | null
          property_id?: string
          tags?: Json | null
          upload_date?: string
          user_id?: string
          version?: number | null
          version_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      service_charge_anomalies: {
        Row: {
          category: string
          current_amount: number
          detected_at: string
          id: string
          notes: string | null
          percentage_change: number
          period_end: string
          period_start: string
          period_type: string
          previous_amount: number
          property_id: string
          resolution_date: string | null
          status: string
          user_id: string
        }
        Insert: {
          category: string
          current_amount: number
          detected_at?: string
          id?: string
          notes?: string | null
          percentage_change: number
          period_end: string
          period_start: string
          period_type: string
          previous_amount: number
          property_id: string
          resolution_date?: string | null
          status?: string
          user_id: string
        }
        Update: {
          category?: string
          current_amount?: number
          detected_at?: string
          id?: string
          notes?: string | null
          percentage_change?: number
          period_end?: string
          period_start?: string
          period_type?: string
          previous_amount?: number
          property_id?: string
          resolution_date?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_charge_anomalies_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      service_charge_data: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          period_end: string
          period_start: string
          period_type: string
          property_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          period_type: string
          property_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          property_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_charge_data_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      service_charge_queries: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string
          expected_response_date: string | null
          id: string
          potential_value: number | null
          property_id: string
          responsible_party: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description: string
          expected_response_date?: string | null
          id?: string
          potential_value?: number | null
          property_id: string
          responsible_party?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string
          expected_response_date?: string | null
          id?: string
          potential_value?: number | null
          property_id?: string
          responsible_party?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_charge_queries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      service_charge_query_comments: {
        Row: {
          comment: string
          created_at: string
          created_by: string
          id: string
          query_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          created_by: string
          id?: string
          query_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          created_by?: string
          id?: string
          query_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_charge_query_comments_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "service_charge_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      service_charge_query_documents: {
        Row: {
          file_name: string
          file_path: string
          file_type: string
          id: string
          query_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_type: string
          id?: string
          query_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          query_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_charge_query_documents_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "service_charge_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_details: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          property_id: string
          tenant_name: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          property_id: string
          tenant_name: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          property_id?: string
          tenant_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_details_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
