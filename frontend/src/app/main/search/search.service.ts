import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  search(searchTerm: string) {
    return of([
      {id:100, label: "Test1"},
      {id:101, label: "Test2"},
    ]); // TODO: delete after implementation
  }
}
