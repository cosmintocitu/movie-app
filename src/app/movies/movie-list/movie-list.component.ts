import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Movie } from '../../models/movie.model';
import { GENRE_MAP, GENRE_LIST } from '../../models/genre-map'; // Add GENRE_LIST
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  searchTitle = '';
  selectedGenres: number[] = [];
  showGenreDropdown = false;

  // Track separate page numbers for each mode
  currentPageTopRated = 1;
  currentPageLatest = 1;
  currentPageSearch = 1;

  totalPagesTopRated = 1;
  totalPagesLatest = 1;
  totalPagesSearch = 1;

  viewMode: 'top-rated' | 'latest' | 'search' = 'top-rated';
  genreList = GENRE_LIST; // Array of {id: number, name: string}

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  get currentPage(): number {
    if (this.viewMode === 'top-rated') return this.currentPageTopRated;
    if (this.viewMode === 'latest') return this.currentPageLatest;
    return this.currentPageSearch;
  }

  get totalPages(): number {
    if (this.viewMode === 'top-rated') return this.totalPagesTopRated;
    if (this.viewMode === 'latest') return this.totalPagesLatest;
    return this.totalPagesSearch;
  }

  loadMovies(): void {
    const page = this.currentPage;
    
    switch (this.viewMode) {
      case 'top-rated':
        this.api.getPopularMovies(page).subscribe({
          next: (res) => {
            this.movies = res.results;
            this.totalPagesTopRated = res.total_Pages;
          },
          error: (err) => console.error('Failed to load top rated movies', err)
        });
        break;
  
      case 'latest':
        this.api.getLatestMovies(page).subscribe({
          next: (res) => {
            this.movies = res.results;
            this.totalPagesLatest = res.total_Pages;
          },
          error: (err) => console.error('Failed to load latest movies', err)
        });
        break;
  
      case 'search':{
        const genreId = this.selectedGenres.length > 0 ? this.selectedGenres[0] : null;
        this.api.searchMovies(this.searchTitle.trim(), genreId, page).subscribe({
          next: (res) => {
            this.movies = res.results;
            this.totalPagesSearch = res.total_Pages;
            
            // If no results, consider showing a message
            if (res.results.length === 0) {
              console.log('No movies found matching your criteria');
            }
          },
          error: (err) => console.error('Search failed', err)
        });
        break;
      }
      default:
        console.warn('Unknown view mode:', this.viewMode);
        break;
    }
  }

  toggleGenre(genreId: number): void {
    const index = this.selectedGenres.indexOf(genreId);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres = [genreId]; // Single selection
    }
  }

  search(): void {
    if (this.searchTitle.trim() || this.selectedGenres.length > 0) {
      this.viewMode = 'search';
      this.currentPageSearch = 1;
      this.loadMovies();
    }
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.selectedGenres = [];
    this.viewMode = 'top-rated'; // or whatever default view you want
    this.loadMovies();
  }

  toggleView(mode: 'top-rated' | 'latest') {
    this.viewMode = mode;
    this.loadMovies();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      if (this.viewMode === 'top-rated') this.currentPageTopRated++;
      else if (this.viewMode === 'latest') this.currentPageLatest++;
      else this.currentPageSearch++;
      this.loadMovies();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      if (this.viewMode === 'top-rated') this.currentPageTopRated--;
      else if (this.viewMode === 'latest') this.currentPageLatest--;
      else this.currentPageSearch--;
      this.loadMovies();
    }
  }

  getGenreNames(ids: number[]): string {
    return ids?.map((id) => GENRE_MAP[id]).filter(Boolean).join(', ') || 'N/A';
  }

  getReleaseYear(date: string): string {
    return date ? new Date(date).getFullYear().toString() : 'N/A';
  }
}