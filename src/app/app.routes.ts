import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MovieListComponent } from './movies/movie-list/movie-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movies', component: MovieListComponent },
  {
    path: 'movie/:id',
    loadComponent: () => import('./movies/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
  }
];
