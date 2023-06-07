import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffOrdersComponent } from './staff-orders.component';

describe('StaffOrdersComponent', () => {
  let component: StaffOrdersComponent;
  let fixture: ComponentFixture<StaffOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
