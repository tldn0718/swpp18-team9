import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.css']
})
export class InfoWindowComponent implements OnInit {

  @Input() profiles: any[];
  @Output() cancelSelected: EventEmitter<void> = new EventEmitter();

  confirmed: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  confirmProfiles() {
    this.confirmed = true;
  }

  cancelProfiles() {
    this.cancelSelected.emit();
  }

}
