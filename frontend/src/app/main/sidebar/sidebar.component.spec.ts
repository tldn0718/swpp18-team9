import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { AuthService } from '../../auth';
import { SidebarComponent } from './sidebar.component';
import { RouterLinkDirectiveStub } from 'src/testing/router-link-directive-stub';
import { RouterOutletStubComponent } from 'src/testing/stub-component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  let auth = jasmine.createSpyObj('AuthService', ['signOut']);
  auth.signOut.and.returnValue(of('something'));
  let router = jasmine.createSpyObj('Router', ['navigate']);
  router.navigate.and.returnValue('');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        SidebarComponent,
        RouterLinkDirectiveStub,
        RouterOutletStubComponent
      ],
      providers: [
        {provide: AuthService, useValue: auth},
        {provide: Router, useValue: router},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should not do anything', ()=>{
    component.ngOnInit();
    expect().nothing();
  });

  it('#signOut should call router.navigate', ()=>{
    component.signOut();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('clicking routerlink should set link to /main', ()=>{
    const a = fixture.debugElement.query(By.css('a'))
    const routerLinkDir = fixture.debugElement.query(By.directive(RouterLinkDirectiveStub));
    a.triggerEventHandler('click', null);
    expect(routerLinkDir.injector.get(RouterLinkDirectiveStub).navigatedTo).toBe('/main');
  });
});
