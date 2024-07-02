import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = environment.tmdbApiKey;
  constructor(private http: HttpClient) {}

  getMovies(
    year: number,
    genreIds: number[] = [],
    page: number = 1
  ): Observable<any> {
    let genreParam = genreIds.length
      ? `&with_genres=${genreIds.join(',')}`
      : '';
    return this.http.get(
      `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=${page}&vote_count.gte=100${genreParam}`
    );
  }

  getGenres(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}`
    );
  }
}
