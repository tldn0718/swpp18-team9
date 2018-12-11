import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from './profile.service';
import { User } from '../../../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedNodes: any[];
  selectedUsers: User[];

  constructor(private activeModal: NgbActiveModal, private profile: ProfileService) { }

  ngOnInit() {
    this.profile.getUserInfo(this.selectedNodes).subscribe((users: User[]) => {
      this.selectedUsers = users;
    });
  }

  closeModal(reason: string) {
    this.activeModal.close(reason);
  }

  writePost() {

  }

}
