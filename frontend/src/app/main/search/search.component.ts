import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: string = '';
  showResult: boolean = false;
  profiles: any[] = [];

  constructor(private search: SearchService) { }

  ngOnInit() {
  }

  searchUser() {
    this.search.search(this.searchTerm).subscribe((res)=>{
      this.profiles = res;
      this.showResult = true;

    });
  }

  cancelSearch() {
    this.showResult = false;
  }

}
