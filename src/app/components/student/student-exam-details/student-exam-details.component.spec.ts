import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamDetailsComponent } from './student-exam-details.component';

describe('StudentExamDetailsComponent', () => {
  let component: StudentExamDetailsComponent;
  let fixture: ComponentFixture<StudentExamDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentExamDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
