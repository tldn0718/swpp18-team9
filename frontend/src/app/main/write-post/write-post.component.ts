import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-write-post',
  templateUrl: './write-post.component.html',
  styleUrls: ['./write-post.component.css']
})
export class WritePostComponent implements OnInit {

  @ViewChild('file') file: ElementRef;

  content: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onFileChange(e: any) {
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
      content: this.content, 
      imageForm: this.makeImageForm(this.file.nativeElement.files)
    });
  }

}
