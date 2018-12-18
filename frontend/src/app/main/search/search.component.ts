import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { map } from 'rxjs/operators';
import { User } from '../../../models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: string = '';
  showResult: boolean = false;
  profiles: any[] = [];
  groups: any[] = [];

  constructor(private search: SearchService) { }

  ngOnInit() {
  }

  searchUser() {
    this.search.search(this.searchTerm)
    .subscribe((searchResult: any)=>{
      this.profiles = searchResult.persons;
      this.groups = searchResult.groups
      this.showResult = true;
    });
  }

  cancelSearch() {
    this.showResult = false;
    this.searchTerm = '';
  }

}
