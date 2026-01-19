// app/lib/api.ts

export type Anime = {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  year?: number;
  episodes?: number;
};

export const getTopAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");

    if (!response.ok) {
      throw new Error("Failed to fetch top anime from Jikan API");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching top anime:", error);
    return [];
  }
};

export type AnimeDetail = Anime & {
  synopsis: string;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  type: string;
  status: string;
  rating: string;
  aired: {
    string: string;
  };
  trailer?: {
    youtube_id: string;
    url: string;
  };
};

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
    return null;
  }
};

export const getSeasonNowAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/seasons/now?limit=20",
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

export const getEpisodeVideoUrl = async (
  animeId: string,
  episodeNumber: number,
): Promise<string> => {
  try {
    const anime = await getAnimeById(animeId);

    if (anime?.trailer?.youtube_id && episodeNumber === 1) {
      return `https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`;
    }

    return "https://www.youtube.com/watch?v=LXb3EKWsInQ";
  } catch (error) {
    console.error("Error getting video URL:", error);
    return "https://www.youtube.com/watch?v=LXb3EKWsInQ";
  }
};

export function createAnimeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
