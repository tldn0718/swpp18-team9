import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { map } from 'rxjs/operators';
import { User } from '../../../models';
import { ProfileService } from '../profile/profile.service';
import { AuthService } from '../../auth';
import { GraphService } from '../graph';

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

  myProfile: any;

  constructor(
    private search: SearchService, 
    private profile: ProfileService,
    private auth: AuthService,
    private graph: GraphService
    ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const userId = parseInt(this.auth.userId);
    this.profile.getProfileInfo([{id:userId, label: 'my_profile'}]).subscribe((info: any)=>{
      console.log('info', info);
      this.myProfile = info;
    });
  }

  joinedAlready(groupName: string) {
    return this.myProfile.groups.includes(groupName);
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

  joinGroup(groupId: number) {
    this.search.join(groupId).subscribe(()=>{
      console.log('joined group');
    });
  }

  showGroup(groupId: number) {
    this.graph.makeGroupNetwork(groupId).subscribe((res)=>{
      console.log('res from make group', res);
    })
  }

}
