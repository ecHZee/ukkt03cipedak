export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      album: {
        Row: {
          bidang_id: string | null;
          cover_id: string | null;
          created_at: string;
          created_by: string | null;
          deskripsi: string | null;
          disetujui_oleh: string | null;
          id: string;
          is_dummy: boolean;
          judul: string;
          kegiatan_id: string | null;
          slug: string;
          status: Database["public"]["Enums"]["status_konten"];
          tanggal: string | null;
          terbit_at: string | null;
          updated_at: string;
        };
        Insert: {
          bidang_id?: string | null;
          cover_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deskripsi?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          judul: string;
          kegiatan_id?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["status_konten"];
          tanggal?: string | null;
          terbit_at?: string | null;
          updated_at?: string;
        };
        Update: {
          bidang_id?: string | null;
          cover_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deskripsi?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          judul?: string;
          kegiatan_id?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["status_konten"];
          tanggal?: string | null;
          terbit_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "album_bidang_id_fkey";
            columns: ["bidang_id"];
            isOneToOne: false;
            referencedRelation: "bidang";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "album_cover_id_fkey";
            columns: ["cover_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "album_kegiatan_id_fkey";
            columns: ["kegiatan_id"];
            isOneToOne: false;
            referencedRelation: "kegiatan";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_log: {
        Row: {
          aksi: string;
          id: number;
          record_id: string | null;
          sebelum: Json | null;
          sesudah: Json | null;
          tabel: string;
          user_id: string | null;
          waktu: string;
        };
        Insert: {
          aksi: string;
          id?: never;
          record_id?: string | null;
          sebelum?: Json | null;
          sesudah?: Json | null;
          tabel: string;
          user_id?: string | null;
          waktu?: string;
        };
        Update: {
          aksi?: string;
          id?: never;
          record_id?: string | null;
          sebelum?: Json | null;
          sesudah?: Json | null;
          tabel?: string;
          user_id?: string | null;
          waktu?: string;
        };
        Relationships: [];
      };
      berita: {
        Row: {
          bidang_id: string | null;
          cover_id: string | null;
          created_at: string;
          created_by: string | null;
          disetujui_oleh: string | null;
          id: string;
          is_dummy: boolean;
          isi: string | null;
          judul: string;
          kegiatan_id: string | null;
          pinned: boolean;
          ringkasan: string | null;
          slug: string;
          status: Database["public"]["Enums"]["status_konten"];
          terbit_at: string | null;
          updated_at: string;
        };
        Insert: {
          bidang_id?: string | null;
          cover_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          isi?: string | null;
          judul: string;
          kegiatan_id?: string | null;
          pinned?: boolean;
          ringkasan?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["status_konten"];
          terbit_at?: string | null;
          updated_at?: string;
        };
        Update: {
          bidang_id?: string | null;
          cover_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          isi?: string | null;
          judul?: string;
          kegiatan_id?: string | null;
          pinned?: boolean;
          ringkasan?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["status_konten"];
          terbit_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "berita_bidang_id_fkey";
            columns: ["bidang_id"];
            isOneToOne: false;
            referencedRelation: "bidang";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "berita_cover_id_fkey";
            columns: ["cover_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "berita_kegiatan_id_fkey";
            columns: ["kegiatan_id"];
            isOneToOne: false;
            referencedRelation: "kegiatan";
            referencedColumns: ["id"];
          },
        ];
      };
      bidang: {
        Row: {
          created_at: string;
          deskripsi: string | null;
          fokus: string[];
          id: string;
          ikon: string | null;
          nama_resmi: string;
          nama_singkat: string;
          slug: string;
          tagline: string | null;
          updated_at: string;
          urutan: number;
        };
        Insert: {
          created_at?: string;
          deskripsi?: string | null;
          fokus?: string[];
          id?: string;
          ikon?: string | null;
          nama_resmi: string;
          nama_singkat: string;
          slug: string;
          tagline?: string | null;
          updated_at?: string;
          urutan?: number;
        };
        Update: {
          created_at?: string;
          deskripsi?: string | null;
          fokus?: string[];
          id?: string;
          ikon?: string | null;
          nama_resmi?: string;
          nama_singkat?: string;
          slug?: string;
          tagline?: string | null;
          updated_at?: string;
          urutan?: number;
        };
        Relationships: [];
      };
      dokumen: {
        Row: {
          akses: Database["public"]["Enums"]["akses_dokumen"];
          bidang_id: string | null;
          created_at: string;
          created_by: string | null;
          disetujui_oleh: string | null;
          id: string;
          is_dummy: boolean;
          judul: string;
          kategori: string;
          kegiatan_id: string | null;
          status: Database["public"]["Enums"]["status_konten"];
          storage_path: string | null;
          tahun: number;
          tanggal: string | null;
          terbit_at: string | null;
          ukuran_bytes: number | null;
          updated_at: string;
        };
        Insert: {
          akses?: Database["public"]["Enums"]["akses_dokumen"];
          bidang_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          judul: string;
          kategori: string;
          kegiatan_id?: string | null;
          status?: Database["public"]["Enums"]["status_konten"];
          storage_path?: string | null;
          tahun: number;
          tanggal?: string | null;
          terbit_at?: string | null;
          ukuran_bytes?: number | null;
          updated_at?: string;
        };
        Update: {
          akses?: Database["public"]["Enums"]["akses_dokumen"];
          bidang_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          judul?: string;
          kategori?: string;
          kegiatan_id?: string | null;
          status?: Database["public"]["Enums"]["status_konten"];
          storage_path?: string | null;
          tahun?: number;
          tanggal?: string | null;
          terbit_at?: string | null;
          ukuran_bytes?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dokumen_bidang_id_fkey";
            columns: ["bidang_id"];
            isOneToOne: false;
            referencedRelation: "bidang";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dokumen_kegiatan_id_fkey";
            columns: ["kegiatan_id"];
            isOneToOne: false;
            referencedRelation: "kegiatan";
            referencedColumns: ["id"];
          },
        ];
      };
      kegiatan: {
        Row: {
          bidang_id: string | null;
          cover_id: string | null;
          created_at: string;
          created_by: string | null;
          disetujui_oleh: string | null;
          id: string;
          is_dummy: boolean;
          isi: string | null;
          judul: string;
          lokasi: string | null;
          mulai: string | null;
          periode_id: string | null;
          ringkasan: string | null;
          rutin: string | null;
          selesai: string | null;
          slug: string;
          status: Database["public"]["Enums"]["status_konten"];
          tahap: Database["public"]["Enums"]["tahap_kegiatan"];
          terbit_at: string | null;
          updated_at: string;
        };
        Insert: {
          bidang_id?: string | null;
          cover_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          isi?: string | null;
          judul: string;
          lokasi?: string | null;
          mulai?: string | null;
          periode_id?: string | null;
          ringkasan?: string | null;
          rutin?: string | null;
          selesai?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["status_konten"];
          tahap?: Database["public"]["Enums"]["tahap_kegiatan"];
          terbit_at?: string | null;
          updated_at?: string;
        };
        Update: {
          bidang_id?: string | null;
          cover_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disetujui_oleh?: string | null;
          id?: string;
          is_dummy?: boolean;
          isi?: string | null;
          judul?: string;
          lokasi?: string | null;
          mulai?: string | null;
          periode_id?: string | null;
          ringkasan?: string | null;
          rutin?: string | null;
          selesai?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["status_konten"];
          tahap?: Database["public"]["Enums"]["tahap_kegiatan"];
          terbit_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "kegiatan_bidang_id_fkey";
            columns: ["bidang_id"];
            isOneToOne: false;
            referencedRelation: "bidang";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "kegiatan_cover_id_fkey";
            columns: ["cover_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "kegiatan_periode_id_fkey";
            columns: ["periode_id"];
            isOneToOne: false;
            referencedRelation: "periode";
            referencedColumns: ["id"];
          },
        ];
      };
      media: {
        Row: {
          album_id: string | null;
          bidang_id: string | null;
          caption: string | null;
          created_at: string;
          created_by: string | null;
          embed_url: string | null;
          id: string;
          is_dummy: boolean;
          jenis: Database["public"]["Enums"]["jenis_media"];
          lebar: number | null;
          mime: string | null;
          storage_path: string | null;
          tinggi: number | null;
          ukuran_bytes: number | null;
          updated_at: string;
          urutan: number;
        };
        Insert: {
          album_id?: string | null;
          bidang_id?: string | null;
          caption?: string | null;
          created_at?: string;
          created_by?: string | null;
          embed_url?: string | null;
          id?: string;
          is_dummy?: boolean;
          jenis: Database["public"]["Enums"]["jenis_media"];
          lebar?: number | null;
          mime?: string | null;
          storage_path?: string | null;
          tinggi?: number | null;
          ukuran_bytes?: number | null;
          updated_at?: string;
          urutan?: number;
        };
        Update: {
          album_id?: string | null;
          bidang_id?: string | null;
          caption?: string | null;
          created_at?: string;
          created_by?: string | null;
          embed_url?: string | null;
          id?: string;
          is_dummy?: boolean;
          jenis?: Database["public"]["Enums"]["jenis_media"];
          lebar?: number | null;
          mime?: string | null;
          storage_path?: string | null;
          tinggi?: number | null;
          ukuran_bytes?: number | null;
          updated_at?: string;
          urutan?: number;
        };
        Relationships: [
          {
            foreignKeyName: "media_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "album";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_bidang_id_fkey";
            columns: ["bidang_id"];
            isOneToOne: false;
            referencedRelation: "bidang";
            referencedColumns: ["id"];
          },
        ];
      };
      pengaturan: {
        Row: {
          keterangan: string | null;
          key: string;
          publik: boolean;
          updated_at: string;
          value: Json;
        };
        Insert: {
          keterangan?: string | null;
          key: string;
          publik?: boolean;
          updated_at?: string;
          value: Json;
        };
        Update: {
          keterangan?: string | null;
          key?: string;
          publik?: boolean;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      pengurus: {
        Row: {
          bidang_id: string | null;
          created_at: string;
          foto_path: string | null;
          gelar: string | null;
          grup: Database["public"]["Enums"]["struktur_grup"];
          id: string;
          instagram: string | null;
          izin_foto: boolean;
          izin_instagram: boolean;
          jabatan: string;
          nama: string;
          periode_id: string;
          rt: string | null;
          updated_at: string;
          urutan: number;
        };
        Insert: {
          bidang_id?: string | null;
          created_at?: string;
          foto_path?: string | null;
          gelar?: string | null;
          grup: Database["public"]["Enums"]["struktur_grup"];
          id?: string;
          instagram?: string | null;
          izin_foto?: boolean;
          izin_instagram?: boolean;
          jabatan: string;
          nama: string;
          periode_id: string;
          rt?: string | null;
          updated_at?: string;
          urutan?: number;
        };
        Update: {
          bidang_id?: string | null;
          created_at?: string;
          foto_path?: string | null;
          gelar?: string | null;
          grup?: Database["public"]["Enums"]["struktur_grup"];
          id?: string;
          instagram?: string | null;
          izin_foto?: boolean;
          izin_instagram?: boolean;
          jabatan?: string;
          nama?: string;
          periode_id?: string;
          rt?: string | null;
          updated_at?: string;
          urutan?: number;
        };
        Relationships: [
          {
            foreignKeyName: "pengurus_bidang_id_fkey";
            columns: ["bidang_id"];
            isOneToOne: false;
            referencedRelation: "bidang";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pengurus_periode_id_fkey";
            columns: ["periode_id"];
            isOneToOne: false;
            referencedRelation: "periode";
            referencedColumns: ["id"];
          },
        ];
      };
      periode: {
        Row: {
          aktif: boolean;
          created_at: string;
          id: string;
          label: string;
          nomor_sk: string | null;
          tanggal_pelantikan: string | null;
          tanggal_sk: string | null;
          updated_at: string;
        };
        Insert: {
          aktif?: boolean;
          created_at?: string;
          id?: string;
          label: string;
          nomor_sk?: string | null;
          tanggal_pelantikan?: string | null;
          tanggal_sk?: string | null;
          updated_at?: string;
        };
        Update: {
          aktif?: boolean;
          created_at?: string;
          id?: string;
          label?: string;
          nomor_sk?: string | null;
          tanggal_pelantikan?: string | null;
          tanggal_sk?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          aktif: boolean;
          bidang_id: string | null;
          created_at: string;
          email_kontak: string | null;
          harus_ganti_password: boolean;
          id: string;
          izin_kontribusi: boolean;
          nama_tampilan: string;
          no_hp: string | null;
          pengurus_id: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
          username: string | null;
        };
        Insert: {
          aktif?: boolean;
          bidang_id?: string | null;
          created_at?: string;
          email_kontak?: string | null;
          harus_ganti_password?: boolean;
          id: string;
          izin_kontribusi?: boolean;
          nama_tampilan: string;
          no_hp?: string | null;
          pengurus_id?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          aktif?: boolean;
          bidang_id?: string | null;
          created_at?: string;
          email_kontak?: string | null;
          harus_ganti_password?: boolean;
          id?: string;
          izin_kontribusi?: boolean;
          nama_tampilan?: string;
          no_hp?: string | null;
          pengurus_id?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_bidang_id_fkey";
            columns: ["bidang_id"];
            isOneToOne: false;
            referencedRelation: "bidang";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_pengurus_id_fkey";
            columns: ["pengurus_id"];
            isOneToOne: false;
            referencedRelation: "pengurus";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      atur_izin_kontribusi: {
        Args: { p_izin: boolean; p_profil: string };
        Returns: undefined;
      };
      bidang_akun_saya: { Args: never; Returns: string };
      bidang_saya: { Args: never; Returns: string };
      bidang_slug_saya: { Args: never; Returns: string };
      boleh_kelola: {
        Args: { p_bidang: string; p_pembuat: string };
        Returns: boolean;
      };
      boleh_terbit: {
        Args: { p_bidang: string; p_pembuat: string };
        Returns: boolean;
      };
      boleh_tulis_folder: {
        Args: { p_bucket: string; p_nama: string };
        Returns: boolean;
      };
      is_bph: { Args: never; Returns: boolean };
      is_pengurus: { Args: never; Returns: boolean };
      is_super_admin: { Args: never; Returns: boolean };
      kontributor_saya: { Args: never; Returns: boolean };
      peran_dari_pengurus: {
        Args: { p_pengurus: string };
        Returns: {
          bidang_id: string;
          role: Database["public"]["Enums"]["app_role"];
        }[];
      };
      peran_saya: {
        Args: never;
        Returns: Database["public"]["Enums"]["app_role"];
      };
      selesai_ganti_password: { Args: never; Returns: undefined };
      ubah_foto_saya: {
        Args: { p_foto_path: string; p_izin: boolean };
        Returns: undefined;
      };
      ubah_profil_saya: {
        Args: { p_email: string; p_hp: string; p_nama: string };
        Returns: undefined;
      };
    };
    Enums: {
      akses_dokumen: "publik" | "anggota" | "bph";
      app_role: "super_admin" | "admin" | "anggota";
      jenis_media: "foto" | "video" | "embed";
      status_konten: "draft" | "review" | "terbit";
      struktur_grup: "penasihat" | "bph" | "bidang";
      tahap_kegiatan: "rencana" | "berjalan" | "selesai" | "batal";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      akses_dokumen: ["publik", "anggota", "bph"],
      app_role: ["super_admin", "admin", "anggota"],
      jenis_media: ["foto", "video", "embed"],
      status_konten: ["draft", "review", "terbit"],
      struktur_grup: ["penasihat", "bph", "bidang"],
      tahap_kegiatan: ["rencana", "berjalan", "selesai", "batal"],
    },
  },
} as const;
