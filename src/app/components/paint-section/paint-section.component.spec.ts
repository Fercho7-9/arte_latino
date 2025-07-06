import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintSectionComponent } from './paint-section.component';

describe('PaintSectionComponent', () => {
  let component: PaintSectionComponent;
  let fixture: ComponentFixture<PaintSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
