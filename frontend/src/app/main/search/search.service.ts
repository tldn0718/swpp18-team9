import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  search(searchTerm: string) {
    return this.http.get(`/api/search/${searchTerm}`);
  }

  join(groupId: number) {
    return this.http.put(`/api/group/${groupId}/`, {});
  }
}
