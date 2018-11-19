import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { AuthService } from '../../auth';
import { SidebarComponent } from './sidebar.component';
import { RouterLinkDirectiveStub } from 'src/testing/router-link-directive-stub';
import { RouterOutletStubComponent } from 'src/testing/stub-component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  let auth = jasmine.createSpyObj('AuthService', ['signOut']);
  auth.signOut.and.returnValue(of());
  let router = jasmine.createSpyObj('Router', ['navigate']);

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
});
