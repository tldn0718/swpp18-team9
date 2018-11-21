import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { GraphService } from './graph.service';
import { AuthService } from '../../auth';
import { Network } from 'vis';

describe('GraphService', () => {

  let service: GraphService;

  let fakeUsers = [{id: 1, label: 'user1'}, {id:2, label: 'user2'}];
  let fakeFriends = [{from: 1, to: 2}];

  let http = jasmine.createSpyObj('HttpClient', ['get']);
  http.get
    .withArgs('/api/friend').and.returnValue(of({users: fakeUsers, friends: fakeFriends}))
    .withArgs('/api/friend/1/').and.returnValue(of({users: fakeUsers, friends: fakeFriends}))

  let auth = jasmine.createSpyObj('AuthService', ['userId']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GraphService,
        {provide: HttpClient, useValue: http},
        {provide: AuthService, useValue: auth}
      ]
    });
    service = TestBed.get(GraphService);
  });

  it('should be created', () => {
    const service: GraphService = TestBed.get(GraphService);
    expect(service).toBeTruthy();
  });

  it('#initializeNetwork should set nodes to fakeUsers and edges to fakeFriends', ()=>{
    const div = document.createElement('div');
    const graphOptions: any = {
      interaction: {
        multiselect: true
      }
    };
    const network = new Network(div, {nodes: fakeUsers, edges: fakeFriends}, graphOptions);
    service.initializeNetwork(div).subscribe(()=>{
      expect(service.nodes).toEqual(fakeUsers);
      expect(service.edges).toEqual(fakeFriends);
    });
  });

  it('#makeAllNetwork should set nodes to fakeUsers and edges to fakeFriends', ()=>{
    const div = document.createElement('div');
    const graphOptions: any = {
      interaction: {
        multiselect: true
      }
    };
    const network = new Network(div, {nodes: fakeUsers, edges: fakeFriends}, graphOptions);
    service.network = network;
    service.makeAllNetwork().subscribe(()=>{
      expect(service.nodes).toEqual(fakeUsers);
      expect(service.edges).toEqual(fakeFriends);
    });
  });

  it('#makeLevelNetwork should set nodes to fakeUsers and edges to fakeFriends', ()=>{
    const div = document.createElement('div');
    const graphOptions: any = {
      interaction: {
        multiselect: true
      }
    };
    const network = new Network(div, {nodes: fakeUsers, edges: fakeFriends}, graphOptions);
    service.network = network;
    service.makeLevelNetwork(1).subscribe(()=>{
      expect(service.nodes).toEqual(fakeUsers);
      expect(service.edges).toEqual(fakeFriends);
    });
  });

  it('#getFriends should set nodes to fakeUsers and edges to fakeFriends', ()=>{
    service.getFriends().subscribe(()=>{
      expect(service.nodes).toEqual(fakeUsers);
      expect(service.edges).toEqual(fakeFriends);
    });
  });

  it('#getLevel(1) should set nodes to fakeUsers and edges to fakeFriends', ()=>{
    service.getLevel(1).subscribe(()=>{
      expect(service.nodes).toEqual(fakeUsers);
      expect(service.edges).toEqual(fakeFriends);
    });
  });

  it('#getUsers([1]) should filter out user 2', ()=>{
    service.nodes = fakeUsers;
    expect(service.getUsers([1])).toEqual([{id: 1, label: 'user1'}]);
  });

  it('#getClickedNodes should return an observable', ()=>{
    expect(service.getClickedNodes()).toBeTruthy();
  });

  it('#unselectAll should unselect all selected nodes in the network', ()=>{
    const div = document.createElement('div');
    const graphOptions: any = {
      interaction: {
        multiselect: true
      }
    };
    const network = new Network(div, {nodes: fakeUsers, edges: fakeFriends}, graphOptions);
    service.network = network;
    service.unselectAll();
    expect(service.network.getSelectedNodes()).toEqual([]);
  });

});
