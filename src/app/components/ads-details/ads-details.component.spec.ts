import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsDetailsComponent } from './ads-details.component';

describe('AdsDetailsComponent', () => {
  let component: AdsDetailsComponent;
  let fixture: ComponentFixture<AdsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
