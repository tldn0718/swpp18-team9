import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-write-post',
  templateUrl: './write-post.component.html',
  styleUrls: ['./write-post.component.css']
})
export class WritePostComponent implements OnInit {

  content: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal(reason: string) {
    this.activeModal.dismiss(reason);
  }

  submit() {
    this.activeModal.close(this.content);
  }

}
