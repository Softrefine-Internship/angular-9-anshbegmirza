import { Component, OnInit } from '@angular/core';
import { BlogsDataService } from '../blogs-data.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blogs: any[] = [];
  loadingBlogs: boolean = false;
  constructor(private blogsDataService: BlogsDataService) {}

  ngOnInit(): void {
    this.loadInitialBlogs();
  }

  // Load initial blogs
  loadInitialBlogs(): void {
    this.loadingBlogs = true;
    this.blogsDataService.getBlogs();
    this.blogsDataService.blogsData.subscribe(
      (data) => {
        this.blogs = data;
        this.loadingBlogs = false;
      },
      (error) => {
        console.error('Loading Error', error);
        this.loadingBlogs = false;
      }
    );
  }

  // Load more blogs when the user scrolls
  loadMoreBlogs(): void {
    this.blogsDataService.loadMoreBlogs();
  }

  // Check if the user has scrolled to the bottom of the page
  onScroll(): void {
    this.loadMoreBlogs();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Load more blogs when the user is near the bottom of the page
    if (windowHeight + scrollTop >= documentHeight - 100) {
      this.loadMoreBlogs();
    }
  }
}
