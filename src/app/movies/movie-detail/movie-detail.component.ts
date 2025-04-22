import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MovieDetail } from '../../models/moviedetail.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: MovieDetail | null = null;
  comments: Comment[] = [];
  newComment = '';
  isLoggedIn = false;
  movieId: number | null = null;
  constructor(private readonly route: ActivatedRoute, private readonly api: ApiService) {}

  ngOnInit(): void {console.log(localStorage);
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadComments(this.movieId);
    this.api.getMovieDetail(this.movieId).subscribe((data) => {
      this.movie = data;
    });
  }

  getPosterUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  getProfileUrl(path: string): string {
    return path ? `https://image.tmdb.org/t/p/w185${path}` : '/assets/no-avatar.png';
  }

  getImageUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w780${path}`;
  }

  getGenreNames(): string {
    return this.movie?.genres?.map(g => g.name).join(', ') ?? '';
  }
  
  loadComments(movieId: number) {
    this.api.getComments(movieId).subscribe({
      next: (data) => this.comments = data,
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  submitComment(): void {
    if (!this.movieId || !this.newComment.trim()) return;

    const comment = {
      movieId: this.movieId,
      content: this.newComment
    };
    console.log(comment);
    this.api.postComment(comment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments(this.movieId!);  // Reload comments after posting
      },
      error: (err) => console.error('Failed to post comment', err)
    });
  }}