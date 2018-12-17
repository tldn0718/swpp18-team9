import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeGroupComponent } from './make-group.component';

describe('MakeGroupComponent', () => {
  let component: MakeGroupComponent;
  let fixture: ComponentFixture<MakeGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
