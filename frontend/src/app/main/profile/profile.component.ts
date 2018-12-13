import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from './profile.service';
import { User } from '../../../models';
import { WritePostComponent } from '../write-post/write-post.component';
import { concatMap, pluck, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService  } from '../../auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedNodes: any[];
  selectedUsers: User[];
  posts: any[] = [];
  distance: any;

  constructor(
    private modal: NgbModal,
    private activeModal: NgbActiveModal, 
    private profile: ProfileService,
    private auth: AuthService
    ) { }

  ngOnInit() {
    this.profile.getUserInfo(this.selectedNodes).pipe(
      concatMap((users)=>{
        this.selectedUsers = users;
        if(this.selectedNodes.length==1){
          this.selectedNodes.concat(this.auth.user);
          this.distance = this.profile.getDistance(this.selectedNodes);
        }
        else{
          this.distance = this.profile.getDistance(this.selectedNodes);
        }
        console.log('selected users', this.selectedUsers);
        return this.profile.getPost(this.selectedUsers);
      }),
    ).subscribe((posts: any[]) => {
      this.posts = posts;
      console.log('posts', this.posts);
    });
  }

  closeModal(reason: string) {
    this.activeModal.close(reason);
  }

  writePost() {
    const modalConfig: any = {
      size: 'lg',
      backdrop: "static"
    };
    const writePostModal = this.modal.open(WritePostComponent, modalConfig);
    writePostModal.result.then((postContent)=>{
      this.profile.writePost(this.selectedUsers, postContent).pipe(
        concatMap((res: any)=>{
          if(res.message == 'success') return this.profile.getPost(this.selectedUsers);
          else return throwError('Write post failed');
        }),
      ).subscribe({
        next: (posts: any[]) => { this.posts = posts; },
        error: (msg: string) => { console.error(msg); }
      });
    }).catch((dismissedReason: string)=>{
      console.log(dismissedReason);
    });
  }

}
