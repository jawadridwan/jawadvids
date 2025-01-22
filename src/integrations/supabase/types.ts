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
      audit_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          record_id: string
          table_name: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id: string
          table_name: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      comment_reactions: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          type?: string
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          parent_id: string | null
          reply_count: number | null
          updated_at: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          reply_count?: number | null
          updated_at?: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          reply_count?: number | null
          updated_at?: string
          user_id?: string
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
            referencedRelation: "profiles"
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
          content: string | null
          created_at: string | null
          id: string
          type: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      hashtags: {
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
      notifications: {
        Row: {
          content: Json
          created_at: string
          id: string
          read: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          read?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          read?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          avg_watch_duration: number | null
          avg_watch_percentage: number | null
          comments_count: number | null
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
      playlist_videos: {
        Row: {
          added_at: string
          playlist_id: string
          position: number
          video_id: string
        }
        Insert: {
          added_at?: string
          playlist_id: string
          position: number
          video_id: string
        }
        Update: {
          added_at?: string
          playlist_id?: string
          position?: number
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_videos_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          profile_picture_url: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          profile_picture_url?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          profile_picture_url?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          id: string
          type: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          type: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          type?: string
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_hashtags: {
        Row: {
          hashtag_id: string
          video_id: string
        }
        Insert: {
          hashtag_id: string
          video_id: string
        }
        Update: {
          hashtag_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_hashtags_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          available_qualities: Json | null
          created_at: string | null
          default_quality: string | null
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          available_qualities?: Json | null
          created_at?: string | null
          default_quality?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          available_qualities?: Json | null
          created_at?: string | null
          default_quality?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
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
        ]
      }
      watch_later: {
        Row: {
          added_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          added_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_later_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watch_later_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
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
