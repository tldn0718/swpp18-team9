import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  options: any = {
    notification: false,
    public: false
  };

  constructor() { }

  getOptions() {
    return of(this.options);
  }

  saveOptions(options: any) {
    // set options here
  }
}
