import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { User, UserNode } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserInfo(selectedNodes: UserNode[]): Observable<User[]> {
    return this.http.post<User[]>('/api/user/', {selectedNodes});
  }

  getDistance(selectedNodes: UserNode[]) {
    if(selectedNodes.length == 2){
      return this.http.post('/api/distance/get/', {selectedNodes});
    }else{
      return null;
    }
  }

  writePost(selectedUsers: User[], content: string) {
    return this.http.post('/api/post/write/', {
      selectedUsers,
      content
    });
  }

  getPost(selectedUsers: User[]) {
    return this.http.post('/api/post/get/', {
      selectedUsers
    }).pipe(
      pluck('posts'),
      map((posts: any[])=>posts.reverse()));
  }
}
