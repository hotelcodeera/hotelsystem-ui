import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisterStudentComponent } from './unregister-student.component';

describe('UnregisterStudentComponent', () => {
  let component: UnregisterStudentComponent;
  let fixture: ComponentFixture<UnregisterStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisterStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnregisterStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
