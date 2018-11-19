import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { CoreModule } from 'src/app/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async(() => {
    const modalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const authSpy = jasmine.createSpyObj('AuthService', ['signUp']);
    TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      imports: [
        CoreModule
      ],
      providers: [
        { provide: NgbActiveModal, useValue: modalSpy },
        { provide: AuthService, useValue: authSpy },
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
});
