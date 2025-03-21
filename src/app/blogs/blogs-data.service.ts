import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogsDataService {
  private offset: number = 0;
  private limit: number = 10;
  private apiUrl: string = `https://api.slingacademy.com/v1/sample-data/blog-posts`;

  private blogsDataSubject = new BehaviorSubject<any[]>([]);
  blogsData = this.blogsDataSubject.asObservable();

  private isLoading = false;
  private hasMoreData = true;

  constructor(private http: HttpClient) {}

  // Fetch blogs list from the API
  private fetchData(): Observable<any> {
    const apiUrl = `${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`;
    return this.http.get<any>(apiUrl);
  }

  // Fetch blog by ID
  fetchBlogByID(id: any): Observable<any> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this.http.get(apiUrl);
  }

  // Load initial blogs
  getBlogs(): void {
    if (this.isLoading || this.blogsDataSubject.value.length > 0) return; // Prevent multiple calls or reloading if data already exists
    this.isLoading = true;

    this.fetchData().subscribe({
      next: (response) => {
        this.blogsDataSubject.next(response.blogs);
        this.offset += this.limit;

        this.isLoading = false;
        this.hasMoreData = response.blogs.length === this.limit;
      },
      error: (error) => {
        console.error('Error fetching blogs:', error);
        this.isLoading = false;
      },
    });
  }

  // Load more blogs for infinite scrolling
  loadMoreBlogs(): void {
    if (this.isLoading || !this.hasMoreData) return; // Prevent multiple calls or loading if no more data is available
    this.isLoading = true;

    this.fetchData().subscribe({
      next: (response) => {
        const currentBlogs = this.blogsDataSubject.value;

        const newBlogs = [...currentBlogs, ...response.blogs];

        this.blogsDataSubject.next(newBlogs);
        this.offset += this.limit;

        this.isLoading = false;
        this.hasMoreData = response.blogs.length === this.limit;
      },
      error: (error) => {
        console.error('Error fetching more blogs:', error);
        this.isLoading = false;
      },
    });
  }

  // Reset function.
  reset(): void {
    this.offset = 0;
    this.blogsDataSubject.next([]);
    this.hasMoreData = true;
  }
}
