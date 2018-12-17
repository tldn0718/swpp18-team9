import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-make-group',
  templateUrl: './make-group.component.html',
  styleUrls: ['./make-group.component.css']
})
export class MakeGroupComponent implements OnInit {


  name: string;
  motto: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }


  closeModal(reason: string) {
    this.activeModal.dismiss(reason);
  }

  makeImageForm(file: File[]) {
    let form = new FormData();
    for(let i = 0; i < file.length; i++) {
      form.append(`image${i}`, file[0]);
    }
    return form;
  }

  submit() {
    this.activeModal.close({
      name: this.name, 
      motto: this.motto
    });
  }

}
