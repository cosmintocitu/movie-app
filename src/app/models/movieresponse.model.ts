import { Movie } from "./movie.model";

export interface MovieResponse  {
    results: Movie[];
    page: number;
    total_Pages: number;
    total_Results: number;
  }