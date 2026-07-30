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

const FALLBACK_TOP_ANIME: AnimeDetail[] = [
  {
    mal_id: 5114,
    title: "Fullmetal Alchemist: Brotherhood",
    images: {
      webp: {
        image_url: "https://cdn.myanimelist.net/images/anime/1208/94745.webp",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.webp",
      },
    },
    score: 9.1,
    year: 2009,
    episodes: 64,
    synopsis: "After a horrific alchemy experiment goes wrong, brothers Edward and Alphonse Elric search for the Philosopher's Stone to restore their bodies.",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }],
    studios: [{ mal_id: 4, name: "Bones" }],
    type: "TV",
    status: "Finished Airing",
    rating: "R - 17+",
    aired: { string: "Apr 5, 2009 to Jul 4, 2010" },
  },
  {
    mal_id: 9253,
    title: "Steins;Gate",
    images: {
      webp: {
        image_url: "https://cdn.myanimelist.net/images/anime/1935/127974.webp",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1935/127974l.webp",
      },
    },
    score: 9.0,
    year: 2011,
    episodes: 24,
    synopsis: "Self-proclaimed mad scientist Rintaro Okabe accidentally discovers time travel through a modified microwave.",
    genres: [{ mal_id: 24, name: "Sci-Fi" }, { mal_id: 41, name: "Thriller" }],
    studios: [{ mal_id: 314, name: "White Fox" }],
    type: "TV",
    status: "Finished Airing",
    rating: "PG-13",
    aired: { string: "Apr 6, 2011 to Sep 28, 2011" },
  },
  {
    mal_id: 38000,
    title: "Demon Slayer: Kimetsu no Yaiba",
    images: {
      webp: {
        image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.webp",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.webp",
      },
    },
    score: 8.5,
    year: 2019,
    episodes: 26,
    synopsis: "Tanjiro Kamado sets out to become a demon slayer to turn his sister Nezuko back into a human.",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 37, name: "Supernatural" }],
    studios: [{ mal_id: 43, name: "ufotable" }],
    type: "TV",
    status: "Finished Airing",
    rating: "R - 17+",
    aired: { string: "Apr 6, 2019 to Sep 28, 2019" },
  },
  {
    mal_id: 40748,
    title: "Jujutsu Kaisen",
    images: {
      webp: {
        image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.webp",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1171/109222l.webp",
      },
    },
    score: 8.6,
    year: 2020,
    episodes: 24,
    synopsis: "A boy swallows a cursed talisman and becomes possessed by a powerful curse, joining a secret school of Jujutsu sorcerers.",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 10, name: "Fantasy" }],
    studios: [{ mal_id: 569, name: "MAPPA" }],
    type: "TV",
    status: "Finished Airing",
    rating: "R - 17+",
    aired: { string: "Oct 3, 2020 to Mar 27, 2021" },
  },
];

export const getTopAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=20", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return FALLBACK_TOP_ANIME;
    }

    const data = await response.json();
    return data.data && data.data.length > 0 ? data.data : FALLBACK_TOP_ANIME;
  } catch (error) {
    console.warn("Using fallback data for top anime due to rate limit/network:", error);
    return FALLBACK_TOP_ANIME;
  }
};

export const getAnimeById = async (id: string): Promise<AnimeDetail | null> => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const fallback = FALLBACK_TOP_ANIME.find((a) => a.mal_id.toString() === id);
      return fallback || FALLBACK_TOP_ANIME[0];
    }
    const data = await response.json();
    return data.data || FALLBACK_TOP_ANIME[0];
  } catch (error) {
    console.warn(`Error fetching anime id ${id}, using fallback:`, error);
    const fallback = FALLBACK_TOP_ANIME.find((a) => a.mal_id.toString() === id);
    return fallback || FALLBACK_TOP_ANIME[0];
  }
};

export const getSeasonNowAnime = async (): Promise<Anime[]> => {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/seasons/now?limit=20",
      {
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) {
      return FALLBACK_TOP_ANIME;
    }
    const data = await response.json();
    return data.data && data.data.length > 0 ? data.data : FALLBACK_TOP_ANIME;
  } catch (error) {
    console.warn("Using fallback data for season now anime due to rate limit/network:", error);
    return FALLBACK_TOP_ANIME;
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
    console.warn("Error getting video URL:", error);
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
