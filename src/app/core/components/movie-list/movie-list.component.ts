import { Component, HostListener, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  year: number = 2012;
  genres: any[] = [];
  selectedGenres: number[] = [];
  page: number = 1;
  loading: boolean = false;

  baseImageUrl = 'https://image.tmdb.org/t/p/';
  posterSize = 'w500'; // You can choose other sizes
  backdropSize = 'w780'; // You can choose other sizes

  constructor(private movieService: MoviesService) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadGenres();
    this.loadSelectedGenresFromLocalStorage();
    this.loadMovies();
  }

  // function for load the movies
  loadMovies(): void {
    this.loading = true;
    console.log('Loading movies with genres:', this.selectedGenres);
    this.movieService
      .getMovies(this.year, this.selectedGenres, this.page)
      .subscribe((data) => {
        if (this.page === 1) {
          this.movies = data.results;
        } else {
          this.movies = this.movies.concat(data.results);
        }
        this.loading = false;
        console.log('Movies loaded:', this.movies);
      }, () => {
        this.loading = false;
      });
  }

   // function for load the genres
  loadGenres(): void {
    this.movieService.getGenres().subscribe((data) => {
      this.genres = data.genres;
      console.log('Genres loaded:', this.genres);
    });
  }

  // genres changes if refresh the page
  loadSelectedGenresFromLocalStorage(): void {
    const storedGenres = localStorage.getItem('selectedGenres');
    if (storedGenres) {
      this.selectedGenres = JSON.parse(storedGenres);
      console.log('Loaded selected genres from localStorage:', this.selectedGenres);
    }
  }

  // set genres to the local storage
  saveSelectedGenresToLocalStorage(): void {
    localStorage.setItem('selectedGenres', JSON.stringify(this.selectedGenres));
    console.log('Saved selected genres to localStorage:', this.selectedGenres);
  }

  onScrollDown(): void {
    this.page++;
    this.loadMovies();
  }

  onScrollUp(): void {
    this.page = 1;
    this.year--;
    this.movies = [];
    this.loadMovies();
  }

  onGenreChange(selectedGenreId: number): void {
    if (this.selectedGenres.includes(selectedGenreId)) {
      // Remove the genre if already selected
      this.selectedGenres = this.selectedGenres.filter(id => id !== selectedGenreId);
    } else {
      // Add the genre if not selected
      this.selectedGenres.push(selectedGenreId);
    }
    this.page = 1;
    this.movies = [];
    this.saveSelectedGenresToLocalStorage();
    this.loadMovies();
  }

  onColor(rank: number): string {
    if (rank >= 8) {
      return 'green';
    } else if (rank >= 6) {
      return 'orange';
    } else if (rank >= 3) {
      return 'red';
    } else {
      return 'gray'; // default color for ranks less than 3
    }
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll(event: any): void {
    if (this.loading) {
      return;
    }

    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight - 1) {
      // User scrolled down to the bottom
      this.onScrollDown();
    } else if (window.pageYOffset === 0) {
      // User scrolled up to the top
      this.onScrollUp();
    }
  }
}
