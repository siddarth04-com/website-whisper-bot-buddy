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
      activities: {
        Row: {
          created_at: string | null
          currency: string
          description: string | null
          destination_id: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          price: number
          rating: number | null
          type: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          description?: string | null
          destination_id?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          price?: number
          rating?: number | null
          type: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          description?: string | null
          destination_id?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          price?: number
          rating?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string | null
          emergency_contact: string
          emergency_phone: string
          end_date: string
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          qr_code_data: Json | null
          special_requests: string | null
          start_date: string
          status: string
          total_amount: number
          tour_id: string
          travelers: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string | null
          emergency_contact: string
          emergency_phone: string
          end_date: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          qr_code_data?: Json | null
          special_requests?: string | null
          start_date: string
          status?: string
          total_amount: number
          tour_id: string
          travelers?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          emergency_contact?: string
          emergency_phone?: string
          end_date?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          qr_code_data?: Json | null
          special_requests?: string | null
          start_date?: string
          status?: string
          total_amount?: number
          tour_id?: string
          travelers?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_counts"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      plan_activities: {
        Row: {
          activity_id: string | null
          activity_type: string
          created_at: string | null
          day_number: number
          id: string
          plan_id: string | null
        }
        Insert: {
          activity_id?: string | null
          activity_type: string
          created_at?: string | null
          day_number: number
          id?: string
          plan_id?: string | null
        }
        Update: {
          activity_id?: string | null
          activity_type?: string
          created_at?: string | null
          day_number?: number
          id?: string
          plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_activities_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_counts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string
          created_at: string | null
          destination: string
          id: string
          images: string[] | null
          user_id: string | null
        }
        Insert: {
          caption: string
          created_at?: string | null
          destination: string
          id?: string
          images?: string[] | null
          user_id?: string | null
        }
        Update: {
          caption?: string
          created_at?: string | null
          destination?: string
          id?: string
          images?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          activity_id: string | null
          created_at: string | null
          currency: string
          id: string
          price: number
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          price: number
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          price?: number
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          travel_preferences: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          travel_preferences?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          travel_preferences?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      travel_plans: {
        Row: {
          budget: number
          created_at: string | null
          destination_id: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          user_id: string | null
        }
        Insert: {
          budget: number
          created_at?: string | null
          destination_id?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          user_id?: string | null
        }
        Update: {
          budget?: number
          created_at?: string | null
          destination_id?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_plans_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_coins: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reason: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reason: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reason?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_passes: {
        Row: {
          created_at: string | null
          discount_percentage: number
          expiry_date: string
          first_use_completed: boolean
          id: string
          is_active: boolean
          pass_type: string
          purchase_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage: number
          expiry_date: string
          first_use_completed?: boolean
          id?: string
          is_active?: boolean
          pass_type: string
          purchase_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number
          expiry_date?: string
          first_use_completed?: boolean
          id?: string
          is_active?: boolean
          pass_type?: string
          purchase_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      posts_with_counts: {
        Row: {
          caption: string | null
          comments_count: number | null
          created_at: string | null
          destination: string | null
          id: string | null
          images: string[] | null
          likes_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_current_price: {
        Args: { activity_id: string }
        Returns: {
          price: number
          currency: string
        }[]
      }
      get_user_coins: {
        Args: { user_uuid: string }
        Returns: number
      }
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
