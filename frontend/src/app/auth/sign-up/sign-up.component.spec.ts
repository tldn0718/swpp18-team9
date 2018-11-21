import { tick, async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { SignUpComponent } from './sign-up.component';
import { CoreModule } from 'src/app/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  let modal = jasmine.createSpyObj('NgbActiveModal', ['close']);

  let auth = jasmine.createSpyObj('AuthService', ['signUp']);
  auth.signUp.withArgs('c', 'c', 'c', 'c').and.returnValue(of(null));
  auth.signUp.withArgs('w', 'w', 'w', 'w').and.returnValue(throwError('error'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      imports: [
        CoreModule
      ],
      providers: [
        { provide: NgbActiveModal, useValue: modal },
        { provide: AuthService, useValue: auth },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#signUpDisabled getter should return true for u, p, f, l = null', ()=>{
    component.username = '';
    component.password = '';
    component.firstName = '';
    component.lastName = '';
    expect(component.signUpDisabled).toBeTruthy();
  });

  it('#signUpDisabled getter should return false for u, p, f, l = not null', ()=>{
    component.username = 'u';
    component.password = 'p';
    component.firstName = 'f';
    component.lastName = 'l';
    expect(component.signUpDisabled).toBeFalsy();
  });

  it('#closemodal should call modal.close', ()=>{
    component.closeModal('reason');
    modal.close.and.returnValue('');
    expect(modal.close).toHaveBeenCalledWith('reason');
  });

  it('#signUp should close modal with message: Sign Up Success', ()=>{
    component.username = 'c';
    component.password = 'c';
    component.firstName = 'c';
    component.lastName = 'c';
    component.signUp();
    expect(modal.close).toHaveBeenCalledWith('Sign Up Success');
  });

  it('#signUp should display error message', fakeAsync(()=>{
    component.username = 'w';
    component.password = 'w';
    component.firstName = 'w';
    component.lastName = 'w';
    component.signUp();
    expect(component.errorMessage).toBe('Sign Up Error');
    tick(5000);
    expect(component.errorMessage).toBeNull();
  }));

});
