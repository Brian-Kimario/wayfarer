export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string
          city: string
          description: string
          duration_h: number
          id: number
          name: string
          price: number
        }
        Insert: {
          category: string
          city: string
          description: string
          duration_h: number
          id?: never
          name: string
          price: number
        }
        Update: {
          category?: string
          city?: string
          description?: string
          duration_h?: number
          id?: never
          name?: string
          price?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          cancelled_at: string | null
          card_last4: string
          code: string
          created_at: string
          end_date: string
          flight_id: number | null
          guests: number
          id: number
          lead_guest_email: string
          lead_guest_name: string
          policy_snapshot: Json
          refund_amount: number
          room_type_id: number | null
          start_date: string
          status: string
          subtotal: number
          taxes: number
          total: number
          trip_id: number | null
          type: string
          units: number
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          card_last4: string
          code: string
          created_at?: string
          end_date: string
          flight_id?: number | null
          guests: number
          id?: never
          lead_guest_email: string
          lead_guest_name: string
          policy_snapshot: Json
          refund_amount?: number
          room_type_id?: number | null
          start_date: string
          status: string
          subtotal: number
          taxes: number
          total: number
          trip_id?: number | null
          type: string
          units: number
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          card_last4?: string
          code?: string
          created_at?: string
          end_date?: string
          flight_id?: number | null
          guests?: number
          id?: never
          lead_guest_email?: string
          lead_guest_name?: string
          policy_snapshot?: Json
          refund_amount?: number
          room_type_id?: number | null
          start_date?: string
          status?: string
          subtotal?: number
          taxes?: number
          total?: number
          trip_id?: number | null
          type?: string
          units?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      flights: {
        Row: {
          airline: string
          arrive_at: string
          depart_at: string
          dest_city: string
          dest_code: string
          duration_min: number
          flight_no: string
          id: number
          origin_city: string
          origin_code: string
          price: number
          seats_total: number
        }
        Insert: {
          airline: string
          arrive_at: string
          depart_at: string
          dest_city: string
          dest_code: string
          duration_min: number
          flight_no: string
          id?: never
          origin_city: string
          origin_code: string
          price: number
          seats_total: number
        }
        Update: {
          airline?: string
          arrive_at?: string
          depart_at?: string
          dest_city?: string
          dest_code?: string
          duration_min?: number
          flight_no?: string
          id?: never
          origin_city?: string
          origin_code?: string
          price?: number
          seats_total?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[]
          city: string
          country: string
          description: string
          distance_center_km: number
          hue: number
          id: number
          name: string
          stars: number
          type: string
        }
        Insert: {
          address: string
          amenities?: string[]
          city: string
          country: string
          description: string
          distance_center_km: number
          hue: number
          id?: never
          name: string
          stars: number
          type: string
        }
        Update: {
          address?: string
          amenities?: string[]
          city?: string
          country?: string
          description?: string
          distance_center_km?: number
          hue?: number
          id?: never
          name?: string
          stars?: number
          type?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: number
          property_id: number
          score: number
          title: string
          user_id: string | null
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: never
          property_id: number
          score: number
          title: string
          user_id?: string | null
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: never
          property_id?: number
          score?: number
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          bed_config: string
          cancellation_policy: string
          free_cancel_days: number
          id: number
          max_guests: number
          meal_plan: string
          name: string
          price_per_night: number
          property_id: number
          quantity: number
        }
        Insert: {
          bed_config: string
          cancellation_policy: string
          free_cancel_days?: number
          id?: never
          max_guests: number
          meal_plan: string
          name: string
          price_per_night: number
          property_id: number
          quantity: number
        }
        Update: {
          bed_config?: string
          cancellation_policy?: string
          free_cancel_days?: number
          id?: never
          max_guests?: number
          meal_plan?: string
          name?: string
          price_per_night?: number
          property_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_items: {
        Row: {
          activity_id: number | null
          booking_id: number | null
          day: string
          id: number
          kind: string
          note: string | null
          sort: number
          title: string
          trip_id: number
        }
        Insert: {
          activity_id?: number | null
          booking_id?: number | null
          day: string
          id?: never
          kind: string
          note?: string | null
          sort?: number
          title: string
          trip_id: number
        }
        Update: {
          activity_id?: number | null
          booking_id?: number | null
          day?: string
          id?: never
          kind?: string
          note?: string | null
          sort?: number
          title?: string
          trip_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trip_items_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget: number | null
          created_at: string
          destination: string
          end_date: string
          id: number
          name: string
          start_date: string
          travelers: number
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          destination: string
          end_date: string
          id?: never
          name: string
          start_date: string
          travelers?: number
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          destination?: string
          end_date?: string
          id?: never
          name?: string
          start_date?: string
          travelers?: number
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          property_id: number
          user_id: string
        }
        Insert: {
          property_id: number
          user_id: string
        }
        Update: {
          property_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      property_ratings: {
        Row: {
          avg_score: number | null
          property_id: number | null
          review_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _compute_refund: {
        Args: { p_booking_id: number }
        Returns: Record<string, unknown>
      }
      _flight_quote: {
        Args: { p_price: number; p_seats: number }
        Returns: {
          subtotal: number
          taxes: number
          total: number
        }[]
      }
      _rooms_left: {
        Args: {
          p_exclude?: number
          p_in: string
          p_out: string
          p_room_type_id: number
        }
        Returns: number
      }
      _stay_quote: {
        Args: { p_nights: number; p_price_per_night: number; p_rooms: number }
        Returns: {
          subtotal: number
          taxes: number
          total: number
        }[]
      }
      attach_booking_to_trip: {
        Args: { p_booking_id: number; p_trip_id: number }
        Returns: Json
      }
      cancel_booking: {
        Args: { p_booking_id: number }
        Returns: {
          code: string
          end_date: string
          id: number
          refund_amount: number
          refund_explanation: string
          start_date: string
          total: number
          type: string
          user_id: string
        }[]
      }
      create_booking: {
        Args: {
          p_card_last4: string
          p_end: string
          p_flight_id: number
          p_guests: number
          p_lead_email: string
          p_lead_name: string
          p_room_type_id: number
          p_start: string
          p_trip_id?: number
          p_type: string
          p_units: number
        }
        Returns: Json
      }
      modify_booking: {
        Args: { p_booking_id: number; p_new_in: string; p_new_out: string }
        Returns: Json
      }
      preview_cancellation: {
        Args: { p_booking_id: number }
        Returns: {
          explanation: string
          refund_amount: number
        }[]
      }
      quote_booking: {
        Args: {
          p_check_in: string
          p_check_out: string
          p_flight_id: number
          p_room_type_id: number
          p_type: string
          p_units: number
        }
        Returns: Json
      }
      search_flights: {
        Args: {
          p_dest: string
          p_from: string
          p_origin: string
          p_passengers?: number
          p_to: string
        }
        Returns: {
          airline: string
          arrive_at: string
          depart_at: string
          dest_city: string
          duration_min: number
          flight_id: number
          flight_no: string
          origin_city: string
          price: number
          seats_left: number
          subtotal: number
          taxes: number
          total: number
        }[]
      }
      stay_offers: {
        Args: {
          p_check_in: string
          p_check_out: string
          p_city?: string
          p_property_id?: number
          p_rooms: number
        }
        Returns: {
          nights: number
          price_per_night: number
          property_id: number
          room_type_id: number
          rooms_left: number
          subtotal: number
          taxes: number
          total: number
        }[]
      }
      submit_review: {
        Args: {
          p_body: string
          p_property_id: number
          p_score: number
          p_title: string
        }
        Returns: Json
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
