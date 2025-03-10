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
      api_keys: {
        Row: {
          api_key: string
          id: number
          service: string
        }
        Insert: {
          api_key: string
          id?: never
          service: string
        }
        Update: {
          api_key?: string
          id?: never
          service?: string
        }
        Relationships: []
      }
      app_analytics: {
        Row: {
          active_users: number | null
          app_name: string
          created_at: string | null
          error_count: number | null
          id: string
          performance_score: number | null
          total_views: number | null
          updated_at: string | null
          website_id: string | null
        }
        Insert: {
          active_users?: number | null
          app_name: string
          created_at?: string | null
          error_count?: number | null
          id?: string
          performance_score?: number | null
          total_views?: number | null
          updated_at?: string | null
          website_id?: string | null
        }
        Update: {
          active_users?: number | null
          app_name?: string
          created_at?: string | null
          error_count?: number | null
          id?: string
          performance_score?: number | null
          total_views?: number | null
          updated_at?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_analytics_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          parent_id: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement: {
        Row: {
          created_at: string | null
          id: string
          type: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          type: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          type?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          app_name: string
          browser_info: Json | null
          created_at: string | null
          error_message: string
          error_stack: string | null
          id: string
          user_id: string | null
          website_id: string | null
        }
        Insert: {
          app_name: string
          browser_info?: Json | null
          created_at?: string | null
          error_message: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Update: {
          app_name?: string
          browser_info?: Json | null
          created_at?: string | null
          error_message?: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_logs_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      hacking_searches: {
        Row: {
          created_at: string | null
          id: string
          search_query: string
          search_result: Json | null
          search_type: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          search_query: string
          search_result?: Json | null
          search_type: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          search_query?: string
          search_result?: Json | null
          search_type?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          avg_watch_duration: number | null
          avg_watch_percentage: number | null
          comments_count: number | null
          created_at: string | null
          id: string
          likes_count: number | null
          shares_count: number | null
          updated_at: string | null
          video_id: string | null
          views_count: number | null
        }
        Insert: {
          avg_watch_duration?: number | null
          avg_watch_percentage?: number | null
          comments_count?: number | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          shares_count?: number | null
          updated_at?: string | null
          video_id?: string | null
          views_count?: number | null
        }
        Update: {
          avg_watch_duration?: number | null
          avg_watch_percentage?: number | null
          comments_count?: number | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          shares_count?: number | null
          updated_at?: string | null
          video_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_new_arrival: boolean | null
          is_on_sale: boolean | null
          name: string
          original_price: number | null
          price: number
          search_vector: unknown | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_new_arrival?: boolean | null
          is_on_sale?: boolean | null
          name: string
          original_price?: number | null
          price: number
          search_vector?: unknown | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_new_arrival?: boolean | null
          is_on_sale?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          search_vector?: unknown | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products_collections: {
        Row: {
          collection_id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          product_id: string
        }
        Update: {
          collection_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string | null
          id: string
          type: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          type: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          type?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      real_time_events: {
        Row: {
          app_name: string
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
          website_id: string | null
        }
        Insert: {
          app_name: string
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Update: {
          app_name?: string
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "real_time_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "real_time_events_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          app_name: string
          created_at: string | null
          device_info: Json | null
          id: string
          session_end: string | null
          session_start: string | null
          user_id: string | null
          website_id: string | null
        }
        Insert: {
          app_name: string
          created_at?: string | null
          device_info?: Json | null
          id?: string
          session_end?: string | null
          session_start?: string | null
          user_id?: string | null
          website_id?: string | null
        }
        Update: {
          app_name?: string
          created_at?: string | null
          device_info?: Json | null
          id?: string
          session_end?: string | null
          session_start?: string | null
          user_id?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sessions_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      video_tags: {
        Row: {
          tag_id: string
          video_id: string
        }
        Insert: {
          tag_id: string
          video_id: string
        }
        Update: {
          tag_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_tags_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          search_vector: unknown | null
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      views: {
        Row: {
          id: string
          timestamp: string | null
          video_id: string | null
          viewer_id: string | null
          watched_duration: number | null
          watched_percentage: number | null
        }
        Insert: {
          id?: string
          timestamp?: string | null
          video_id?: string | null
          viewer_id?: string | null
          watched_duration?: number | null
          watched_percentage?: number | null
        }
        Update: {
          id?: string
          timestamp?: string | null
          video_id?: string | null
          viewer_id?: string | null
          watched_duration?: number | null
          watched_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      websites: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_videos: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          title: string
          description: string
          thumbnail_url: string
          url: string
          created_at: string
          updated_at: string
          user_id: string
          status: string
          category_id: string
          rank: number
        }[]
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
