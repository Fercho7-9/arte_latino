import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBioUserComponent } from './update-bio-user.component';

describe('UpdateBioUserComponent', () => {
  let component: UpdateBioUserComponent;
  let fixture: ComponentFixture<UpdateBioUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBioUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateBioUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
