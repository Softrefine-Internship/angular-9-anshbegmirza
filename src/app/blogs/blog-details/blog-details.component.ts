import { BlogsDataService } from './../blogs-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit {
  blog: any;
  constructor(
    private route: ActivatedRoute,
    private blogsDataService: BlogsDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogsDataService.fetchBlogByID(id).subscribe((res) => {
        this.blog = res.blog;
        // console.log(this.blog);
      });
    }
  }
}
