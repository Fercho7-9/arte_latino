import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateObrasComponent } from './update-obras.component';

describe('UpdateObrasComponent', () => {
  let component: UpdateObrasComponent;
  let fixture: ComponentFixture<UpdateObrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateObrasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateObrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
