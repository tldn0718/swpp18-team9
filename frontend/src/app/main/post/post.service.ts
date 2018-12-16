import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getAuthor(userId: number) {
    return this.http.get(`/api/profile/one/${userId}/`);
  }

  getComments(postId: number) {
    return this.http.get(`/api/post/${postId}/comment/`);
  }

  submitComment(postId: number, content: string, userId: number) {
    return this.http.post(`/api/post/${postId}/comment/`, {
      postId,
      content,
      userId
    });
  }

  likePost(postId: number, userId: number) {
    return this.http.post(`/api/post/${postId}/like/`, {userId});
  }
}
