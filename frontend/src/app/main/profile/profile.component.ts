import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from './profile.service';
import { User } from '../../../models';
import { WritePostComponent } from '../write-post/write-post.component';
import { MakeGroupComponent } from '../make-group/make-group.component';
import { concatMap, switchMap, pluck, map } from 'rxjs/operators';
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
  info: any;
  one: boolean = false
  me: boolean = false

  constructor(
    private modal: NgbModal,
    private activeModal: NgbActiveModal, 
    private profile: ProfileService,
    private auth: AuthService
    ) { }

  ngOnInit() {
    this.profile.getUserInfo(this.selectedNodes).pipe(
      switchMap((users)=>{
        this.selectedUsers = users;
        if(this.selectedNodes.length === 1){
          this.one = true;
          if(users[0].id === this.auth.userId){
            this.me = true
          }
        }
        return this.profile.getPost(this.selectedUsers);
      }),
      switchMap((posts: any[])=> {
        this.posts = posts;
        return this.profile.getProfileInfo(this.selectedNodes);
      }),
    ).subscribe((info: any) => {
      this.info = info;
      console.log(this.info)
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

  makeGroup() {
    const modalConfig: any = {
      size: 'lg',
      backdrop: "static"
    };
    const makeGroupModal = this.modal.open(MakeGroupComponent, modalConfig);
    makeGroupModal.result.then((groupInfo) =>{
      this.profile.makeGroup(this.selectedUsers, groupInfo);
    })
  }

}
