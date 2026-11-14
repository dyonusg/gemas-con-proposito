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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      codigos_mentor: {
        Row: {
          codigo: string
          correo: string | null
          creado_en: string
          creado_por: string
          usado_en: string | null
          usado_por: string | null
        }
        Insert: {
          codigo: string
          correo?: string | null
          creado_en?: string
          creado_por: string
          usado_en?: string | null
          usado_por?: string | null
        }
        Update: {
          codigo?: string
          correo?: string | null
          creado_en?: string
          creado_por?: string
          usado_en?: string | null
          usado_por?: string | null
        }
        Relationships: []
      }
      donaciones: {
        Row: {
          created_at: string
          entorno: string
          id: string
          importe_centimos: number
          mensual: boolean
          moneda: string
          proposito: string
          referencia: string
        }
        Insert: {
          created_at?: string
          entorno?: string
          id?: string
          importe_centimos: number
          mensual?: boolean
          moneda?: string
          proposito: string
          referencia: string
        }
        Update: {
          created_at?: string
          entorno?: string
          id?: string
          importe_centimos?: number
          mensual?: boolean
          moneda?: string
          proposito?: string
          referencia?: string
        }
        Relationships: []
      }
      encuestas: {
        Row: {
          acompanado: string | null
          comentario: string | null
          created_at: string
          id: string
          seguir: string | null
          sentimiento: string | null
          user_id: string
        }
        Insert: {
          acompanado?: string | null
          comentario?: string | null
          created_at?: string
          id?: string
          seguir?: string | null
          sentimiento?: string | null
          user_id: string
        }
        Update: {
          acompanado?: string | null
          comentario?: string | null
          created_at?: string
          id?: string
          seguir?: string | null
          sentimiento?: string | null
          user_id?: string
        }
        Relationships: []
      }
      estados_usuario: {
        Row: {
          estado: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          estado?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          estado?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estados_usuario_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lecciones: {
        Row: {
          actividad_familia: string | null
          cancion_titulo: string | null
          cancion_url: string | null
          cita: string | null
          cita_autor: string | null
          cita_fuente: string | null
          cita_url: string | null
          color_gema: string
          cualidad: string
          dibujo: string | null
          dinamica: string | null
          dinamica_materiales: string | null
          explicacion_virtud: string | null
          historia_autor: string | null
          historia_donde: string | null
          historia_resumen: string | null
          historia_url: string | null
          juego: string | null
          manualidad_materiales: string | null
          manualidad_pasos: string | null
          numero: number
          oracion: string | null
          oracion_estado: string | null
          oracion_fuente: string | null
          pagina_libro: number | null
        }
        Insert: {
          actividad_familia?: string | null
          cancion_titulo?: string | null
          cancion_url?: string | null
          cita?: string | null
          cita_autor?: string | null
          cita_fuente?: string | null
          cita_url?: string | null
          color_gema: string
          cualidad: string
          dibujo?: string | null
          dinamica?: string | null
          dinamica_materiales?: string | null
          explicacion_virtud?: string | null
          historia_autor?: string | null
          historia_donde?: string | null
          historia_resumen?: string | null
          historia_url?: string | null
          juego?: string | null
          manualidad_materiales?: string | null
          manualidad_pasos?: string | null
          numero: number
          oracion?: string | null
          oracion_estado?: string | null
          oracion_fuente?: string | null
          pagina_libro?: number | null
        }
        Update: {
          actividad_familia?: string | null
          cancion_titulo?: string | null
          cancion_url?: string | null
          cita?: string | null
          cita_autor?: string | null
          cita_fuente?: string | null
          cita_url?: string | null
          color_gema?: string
          cualidad?: string
          dibujo?: string | null
          dinamica?: string | null
          dinamica_materiales?: string | null
          explicacion_virtud?: string | null
          historia_autor?: string | null
          historia_donde?: string | null
          historia_resumen?: string | null
          historia_url?: string | null
          juego?: string | null
          manualidad_materiales?: string | null
          manualidad_pasos?: string | null
          numero?: number
          oracion?: string | null
          oracion_estado?: string | null
          oracion_fuente?: string | null
          pagina_libro?: number | null
        }
        Relationships: []
      }
      notas: {
        Row: {
          compartir: string
          created_at: string
          id: string
          leccion_numero: number | null
          local_id: string | null
          pregunta: string | null
          texto: string
          tipo: string
          user_id: string
        }
        Insert: {
          compartir?: string
          created_at?: string
          id?: string
          leccion_numero?: number | null
          local_id?: string | null
          pregunta?: string | null
          texto: string
          tipo: string
          user_id: string
        }
        Update: {
          compartir?: string
          created_at?: string
          id?: string
          leccion_numero?: number | null
          local_id?: string | null
          pregunta?: string | null
          texto?: string
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_leccion_numero_fkey"
            columns: ["leccion_numero"]
            isOneToOne: false
            referencedRelation: "lecciones"
            referencedColumns: ["numero"]
          },
        ]
      }
      oraciones: {
        Row: {
          fuente: string | null
          id: number
          leccion_desde: number
          leccion_hasta: number
          texto: string
        }
        Insert: {
          fuente?: string | null
          id?: number
          leccion_desde: number
          leccion_hasta: number
          texto: string
        }
        Update: {
          fuente?: string | null
          id?: number
          leccion_desde?: number
          leccion_hasta?: number
          texto?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alias: string
          alias_normalizado: string | null
          companero_id: string | null
          consentimiento_papel: boolean
          created_at: string
          fecha_nacimiento: string | null
          id: string
          mentor_id: string | null
          updated_at: string
        }
        Insert: {
          alias?: string
          alias_normalizado?: string | null
          companero_id?: string | null
          consentimiento_papel?: boolean
          created_at?: string
          fecha_nacimiento?: string | null
          id: string
          mentor_id?: string | null
          updated_at?: string
        }
        Update: {
          alias?: string
          alias_normalizado?: string | null
          companero_id?: string | null
          consentimiento_papel?: boolean
          created_at?: string
          fecha_nacimiento?: string | null
          id?: string
          mentor_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progreso_pasos: {
        Row: {
          confirmado: boolean
          confirmado_por: string | null
          dirigido_en: string
          id: string
          leccion_numero: number | null
          paso: string
          reconocimiento: string | null
          user_id: string
        }
        Insert: {
          confirmado?: boolean
          confirmado_por?: string | null
          dirigido_en?: string
          id?: string
          leccion_numero?: number | null
          paso: string
          reconocimiento?: string | null
          user_id: string
        }
        Update: {
          confirmado?: boolean
          confirmado_por?: string | null
          dirigido_en?: string
          id?: string
          leccion_numero?: number | null
          paso?: string
          reconocimiento?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progreso_pasos_leccion_numero_fkey"
            columns: ["leccion_numero"]
            isOneToOne: false
            referencedRelation: "lecciones"
            referencedColumns: ["numero"]
          },
        ]
      }
      tarjetas: {
        Row: {
          created_at: string
          estado: string
          id: string
          idea: string
          leccion_numero: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          estado?: string
          id?: string
          idea?: string
          leccion_numero?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          estado?: string
          id?: string
          idea?: string
          leccion_numero?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarjetas_leccion_numero_fkey"
            columns: ["leccion_numero"]
            isOneToOne: false
            referencedRelation: "lecciones"
            referencedColumns: ["numero"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      alias_disponible: { Args: { _alias: string }; Returns: boolean }
      canjear_codigo_mentor: { Args: { _codigo: string }; Returns: undefined }
      elegir_tipo: {
        Args: { _tipo: Database["public"]["Enums"]["app_role"] }
        Returns: undefined
      }
      generar_codigo_mentor: { Args: { _correo: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mis_acompanados: {
        Args: never
        Returns: {
          alias: string
          id: string
        }[]
      }
      vinculado_con: {
        Args: { _owner: string; _tipo: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "colaborador" | "mentor" | "responsable"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["colaborador", "mentor", "responsable"],
    },
  },
} as const
