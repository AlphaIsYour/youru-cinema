// app/lib/api.ts

// Kita definisikan tipe data untuk anime agar TypeScript bisa bantu kita
export type Anime = {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
    };
  };
  score: number;
};

// Fungsi untuk mengambil data anime terpopuler
export const getTopAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");

    if (!response.ok) {
      // Jika API gagal merespon dengan baik, kita lempar error
      throw new Error("Failed to fetch top anime from Jikan API");
    }

    const data = await response.json();

    // API Jikan membungkus hasilnya dalam properti 'data'
    return data.data;
  } catch (error) {
    // Menangkap error jaringan atau error dari 'throw' di atas
    console.error("Error fetching top anime:", error);
    // Mengembalikan array kosong jika terjadi error agar aplikasi tidak crash
    return [];
  }
};

export type AnimeDetail = Anime & {
  synopsis: string;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  year: number;
  episodes: number;
};

// Fungsi untuk mengambil detail anime berdasarkan ID
export const getAnimeById = async (id: string): Promise<AnimeDetail | null> => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch anime details");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching anime with id ${id}:`, error);
    return null; // Kembalikan null jika terjadi error
  }
};

export const getSeasonNowAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/seasons/now?limit=20"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch season now anime");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching season now anime:", error);
    return [];
  }
};
