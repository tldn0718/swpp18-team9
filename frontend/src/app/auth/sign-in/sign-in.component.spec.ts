import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { SignInComponent } from './sign-in.component';
import { CoreModule } from 'src/app/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let router;
  let auth;
  let modal;

  beforeEach(async(() => {

    router = jasmine.createSpyObj('Router', ['navigate']);
    auth = jasmine.createSpyObj('AuthService', ['signIn']);
    modal = jasmine.createSpyObj('NgbModal', ['open']);

    auth.signIn.withArgs('correct', 'correct').and.returnValue(of(null));
    auth.signIn.withArgs('wrong', 'wrong').and.returnValue(throwError({status: 401}));
    auth.signIn.withArgs('error', 'error').and.returnValue(throwError({status: 400}));

    TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
      imports: [
        CommonModule,
        CoreModule,
      ],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: NgbModal, useValue: modal }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should navigate user to /main if logged in', ()=>{
    spyOn(sessionStorage, 'getItem').and.returnValue('logged_in');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('#ngOnInit should stay if not logged in', ()=>{
    spyOn(sessionStorage, 'getItem').and.returnValue(undefined);
    component.ngOnInit();
    expect().nothing();
  });

  it('#loginDisabled getter should return true if username and password are null', ()=>{
    component.username = '';
    component.password = '';
    expect(component.loginDisabled).toBeTruthy();
  });

  it('#loginDisabled getter should return true if password is null', ()=>{
    component.username = 'username';
    component.password = '';
    expect(component.loginDisabled).toBeTruthy();
  });

  it('#loginDisabled getter should return true if username is null', ()=>{
    component.username = '';
    component.password = 'password';
    expect(component.loginDisabled).toBeTruthy();
  });

  it('#loginDisabled getter should return false if username and password are not null', ()=>{
    component.username = 'username';
    component.password = 'password';
    expect(component.loginDisabled).toBeFalsy();
  });

  it('#signIn should navigate to main page', ()=>{
    component.username = 'correct';
    component.password = 'correct';
    component.signIn();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('#signIn should display error message', fakeAsync(()=>{
    component.username = 'wrong';
    component.password = 'wrong';
    component.signIn();
    expect(component.errorMessage).toBe('Incorrect Sign In Information');
    tick(5000);
    expect(component.errorMessage).toBeNull();
  }));

  it('#signIn should not do anything', ()=>{
    component.username = 'error';
    component.password = 'error';
    component.signIn();
    expect().nothing();
  });

  it('#signUp should call modal.open', ()=>{
    modal.open.and.returnValue('signUpModal');
    component.signUp();
    expect(modal.open).toHaveBeenCalled();
  });

});
