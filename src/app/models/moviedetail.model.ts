export interface MovieDetail {
    id: number;
    title: string;
    overview: string;
    release_Date: string;
    runtime?: number;
    poster_Path: string;
    genres: { id: number; name: string }[];
    cast: { id: number; name: string; character: string; profilePath: string }[];
    imageGallery: string[];
  }
  