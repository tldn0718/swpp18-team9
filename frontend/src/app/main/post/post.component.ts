import { Component, OnInit, Input } from '@angular/core';
import { Post, User } from '../../../models';
import { PostService } from './post.service';
import { AuthService } from 'src/app/auth';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input('post') post: Post;
  author: User;
  comments: any[] = [
    {id: 0, content: "test comment1", author: "Tester1"}, 
    {id: 1, content: "test comment2", author: "Tester2"}
  ];
  commentContent: string;
  images: any[];

  constructor(private postService: PostService, private auth: AuthService) { }

  ngOnInit() {
    console.log('post', this.post);
    this.images = this.post.images.filter((url)=>url!=='http://localhost:8000/media/images/')
    console.log('images', this.images);
    // get post info
    // this.postService.getAuthor(this.post.author? this.post.author : 0).subscribe((user: User)=>{
    //   this.author = user;
    // });

    // get comments
    // this.postService.getComments(this.post.id).subscribe((comments: any[])=>{
    //   this.comments = comments;
    // });
  }

  likePost() {
    this.postService.likePost(this.post.id, parseInt(this.auth.userId)).subscribe(()=>{
      // refresh post here
    })
  }

  submitComment() {
    this.postService.submitComment(this.post.id, this.commentContent, parseInt(this.auth.userId)).pipe(
      concatMap(()=> this.postService.getComments(this.post.id))
    ).subscribe((comments: any[])=>{
      this.comments = comments;
    });
  }

}
