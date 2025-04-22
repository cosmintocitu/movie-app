import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto, RegisterDto } from '../models/user.model';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { MovieResponse } from '../models/movieresponse.model';
import { MovieDetail } from '../models/moviedetail.model';
import { CreateComment, Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5252';

  constructor(private readonly http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred
      console.error('An error occurred:', error.error);
      return throwError(() => new Error('Network error occurred. Please check your connection.'));
    } else {
      // The backend returned an unsuccessful response code
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
      
      let userMessage = 'An unexpected error occurred.';
      if (error.status === 400) {
        userMessage = error.error?.message ?? 'Invalid request. Please check your input.';
      } else if (error.status === 401) {
        userMessage = 'Authentication required. Please login again.';
        // Optionally clear the token if unauthorized
        localStorage.removeItem('authToken');
      } else if (error.status === 403) {
        userMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        userMessage = 'The requested resource was not found.';
      } else if (error.status >= 500) {
        userMessage = 'Server error. Please try again later.';
      }
      
      return throwError(() => new Error(userMessage));
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/register`, data, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  login(data: LoginDto): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.baseUrl}/account/login`, data, { withCredentials: true })
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/logout`, {}, { 
      withCredentials: true,
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
      }),
      catchError(this.handleError)
    );
  }

  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/api/movie/popular?page=${page}`,
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getLatestMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/api/movie/latest?page=${page}`,
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError)
    );
  }

  searchMovies(title: string, genreId: number | null, page: number = 1): Observable<MovieResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (title) params = params.set('title', title);
    if (genreId) params = params.set('genreId', genreId.toString());
    
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/api/movie/search`,
      { params, withCredentials: true }
    ).pipe(
      catchError(this.handleError)
    );
  }
  
  getMovieDetail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(
      `${this.baseUrl}/api/movie/${id}/detail`, 
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getComments(movieId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.baseUrl}/api/comments/${movieId}`,
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError)
    );
  }

  postComment(comment: CreateComment): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/api/comments/`, 
      comment,
      {
        headers: this.getAuthHeaders(),
        withCredentials: true
      }
    ).pipe(
      catchError(this.handleError)
    );
  }
}