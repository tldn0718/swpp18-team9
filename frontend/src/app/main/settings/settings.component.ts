import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  options: any;

  constructor(private settings: SettingsService) { }

  ngOnInit() {
    this.settings.getOptions().subscribe(options => {
      this.options = options;
    });
  }

  toggleOption(option: string) {
    this.options[option] = !this.options[option];
  }

  save() {
    this.settings.saveOptions(this.options);
  }

}
