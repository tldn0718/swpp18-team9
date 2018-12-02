import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { InfoWindowComponent } from './info-window.component';
import { GraphService } from '../graph';
import { AuthService } from 'src/app/auth';

describe('InfoWindowComponent', () => {
  
  let component: InfoWindowComponent;
  let fixture: ComponentFixture<InfoWindowComponent>;

  let graphService = jasmine.createSpyObj('GraphService', ['getLevel', 'getNotifications', 'sendFriendRequest']);
  let authService = {authId: '1'};

  const fakeLevelInfo = {users: [{id: 1}]};
  graphService.getLevel.and.returnValue(of(fakeLevelInfo));

  const fakeNoti = [{sender: '1', receiver: '2'}];
  graphService.getNotifications.and.returnValue(of(fakeNoti));

  const fakeRes = {createdTime: 'fake time'};
  graphService.sendFriendRequest.and.returnValue(of(fakeRes));


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoWindowComponent ],
      providers: [
        {provide: GraphService, useValue: graphService},
        {provide: AuthService, useValue: authService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoWindowComponent);
    component = fixture.componentInstance;
    component.profiles = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should call getLevel and set friends and pending', ()=>{
    component.ngOnInit();
    expect(graphService.getLevel).toHaveBeenCalled();
  });

  it('#confirmProfiles should set confirmed to true', ()=>{
    component.confirmProfiles();
    expect(component.confirmed).toBeTruthy();
  });

  it('#cancelProfiles should make cancelSelected emit void', ()=>{
    component.cancelSelected.subscribe((res)=>{
      expect(res).toBeFalsy();
    });
    component.cancelProfiles();
  });

  it('#isPending should return true if 1 is included in pending', ()=>{
    component.pending = [1]
    expect(component.isPending(1)).toBeTruthy();
  });

  it('#isFriend should return true if 1 is included in friends', ()=>{
    component.friends = [1];
    expect(component.isFriend(1)).toBeTruthy();
  });

  it('#sendFriendRequest should call graphservice sendFriendRequest', fakeAsync(()=>{
    component.sendFriendRequest('2');
    tick();
    expect(graphService.sendFriendRequest).toHaveBeenCalled();
  }));

});
