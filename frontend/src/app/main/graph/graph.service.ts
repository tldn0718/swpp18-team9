import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Node, Edge, Data, Network, DataSet } from 'vis';
import { User, Friend } from '../../../models';

@Injectable()
export class GraphService {

  graphOptions: any = {};

  constructor(private http: HttpClient) { }

  // server API

  getFriends() {
    return this.http.get('/api/friend')
  }


  // utilities

  transformUserToNode(users: User[]): Node[] {
    return users.map((user) => { 
      return {id: user.id, label: user.name};
    });
  }

  transformFriendToEdge(friends: Friend[]): Edge[] {
    return friends.map((friend) => { 
      return {from: friend.user_1, to: friend.user_2};
    });
  }

  makeMockNetwork(container: HTMLElement) {
    const mockNodes: DataSet<Node> = new DataSet([
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}
    ]);
    const mockEdges: DataSet<Edge> = new DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ]);
    const mockData = {
        nodes: mockNodes,
        edges: mockEdges
    };
    return of(new Network(container, mockData, this.graphOptions));
  }

  makeFriendNetwork(container: HTMLElement) {
    return this.getFriends().pipe(
      map((res: {users: User[], friends: Friend[]}) => {
        const users = res.users;
        const friends = res.friends;
        const graphData: Data = {
          nodes: this.transformUserToNode(users), 
          edges: this.transformFriendToEdge(friends)
        };
        return new Network(container, graphData, this.graphOptions);
      })
    );
  }
}
