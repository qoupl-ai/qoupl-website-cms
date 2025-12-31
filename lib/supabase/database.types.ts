/**
 * Database Types for qoupl Website
 * Auto-generated from Supabase schema
 * Last updated: December 24, 2025
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          user_id: string
          email: string
          name: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          metadata: Json
          published: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          metadata?: Json
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          metadata?: Json
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      sections: {
        Row: {
          id: string
          page_id: string
          component_type: string
          order_index: number
          content: Json
          published: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          page_id: string
          component_type: string
          order_index?: number
          content?: Json
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          page_id?: string
          component_type?: string
          order_index?: number
          content?: Json
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      global_content: {
        Row: {
          id: string
          key: string
          content: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          key: string
          content?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          key?: string
          content?: Json
          updated_at?: string
          updated_by?: string | null
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          category_id: string | null
          author: string | null
          publish_date: string | null
          read_time: number | null
          featured_image: string | null
          published: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          category_id?: string | null
          author?: string | null
          publish_date?: string | null
          read_time?: number | null
          featured_image?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          category_id?: string | null
          author?: string | null
          publish_date?: string | null
          read_time?: number | null
          featured_image?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      faq_categories: {
        Row: {
          id: string
          name: string
          slug: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          order_index?: number
          created_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          category_id: string
          question: string
          answer: string
          order_index: number
          published: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          category_id: string
          question: string
          answer: string
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          question?: string
          answer?: string
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      feature_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          image_path: string | null
          order_index: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          image_path?: string | null
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          image_path?: string | null
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      features: {
        Row: {
          id: string
          category_id: string
          title: string
          description: string
          icon: string | null
          order_index: number
          published: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          category_id: string
          title: string
          description: string
          icon?: string | null
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          title?: string
          description?: string
          icon?: string | null
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      pricing_plans: {
        Row: {
          id: string
          plan_type: string
          name: string
          price: number
          currency: string
          billing_period: string | null
          features: Json
          is_popular: boolean
          order_index: number
          published: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          plan_type: string
          name: string
          price: number
          currency?: string
          billing_period?: string | null
          features?: Json
          is_popular?: boolean
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          plan_type?: string
          name?: string
          price?: number
          currency?: string
          billing_period?: string | null
          features?: Json
          is_popular?: boolean
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      media: {
        Row: {
          id: string
          filename: string
          storage_path: string
          bucket_name: string
          file_type: string | null
          file_size: number | null
          alt_text: string | null
          category: string | null
          metadata: Json
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          filename: string
          storage_path: string
          bucket_name: string
          file_type?: string | null
          file_size?: number | null
          alt_text?: string | null
          category?: string | null
          metadata?: Json
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          filename?: string
          storage_path?: string
          bucket_name?: string
          file_type?: string | null
          file_size?: number | null
          alt_text?: string | null
          category?: string | null
          metadata?: Json
          uploaded_at?: string
          uploaded_by?: string | null
        }
      }
      waitlist_signups: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          gender: string | null
          age: number | null
          looking_for: string | null
          verified: boolean
          signup_date: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          gender?: string | null
          age?: number | null
          looking_for?: string | null
          verified?: boolean
          signup_date?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          gender?: string | null
          age?: number | null
          looking_for?: string | null
          verified?: boolean
          signup_date?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          status: string
          replied_at: string | null
          replied_by: string | null
          submitted_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          status?: string
          replied_at?: string | null
          replied_by?: string | null
          submitted_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          status?: string
          replied_at?: string | null
          replied_by?: string | null
          submitted_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      content_history: {
        Row: {
          id: string
          entity_type: string
          entity_id: string
          action: string
          snapshot: Json | null
          performed_by: string | null
          performed_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id: string
          action: string
          snapshot?: Json | null
          performed_by?: string | null
          performed_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string
          action?: string
          snapshot?: Json | null
          performed_by?: string | null
          performed_at?: string
        }
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
  }
}

// Helper types for easier usage
export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type Page = Database['public']['Tables']['pages']['Row']
export type Section = Database['public']['Tables']['sections']['Row']
export type GlobalContent = Database['public']['Tables']['global_content']['Row']
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type FaqCategory = Database['public']['Tables']['faq_categories']['Row']
export type Faq = Database['public']['Tables']['faqs']['Row']
export type FeatureCategory = Database['public']['Tables']['feature_categories']['Row']
export type Feature = Database['public']['Tables']['features']['Row']
export type PricingPlan = Database['public']['Tables']['pricing_plans']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type WaitlistSignup = Database['public']['Tables']['waitlist_signups']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
export type ContentHistory = Database['public']['Tables']['content_history']['Row']

// Insert types
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']
export type PageInsert = Database['public']['Tables']['pages']['Insert']
export type SectionInsert = Database['public']['Tables']['sections']['Insert']
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
export type FaqInsert = Database['public']['Tables']['faqs']['Insert']
export type FeatureInsert = Database['public']['Tables']['features']['Insert']
export type PricingPlanInsert = Database['public']['Tables']['pricing_plans']['Insert']
export type MediaInsert = Database['public']['Tables']['media']['Insert']
export type WaitlistSignupInsert = Database['public']['Tables']['waitlist_signups']['Insert']
export type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert']

// Update types
export type PageUpdate = Database['public']['Tables']['pages']['Update']
export type SectionUpdate = Database['public']['Tables']['sections']['Update']
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update']
export type FaqUpdate = Database['public']['Tables']['faqs']['Update']
export type FeatureUpdate = Database['public']['Tables']['features']['Update']
export type PricingPlanUpdate = Database['public']['Tables']['pricing_plans']['Update']
