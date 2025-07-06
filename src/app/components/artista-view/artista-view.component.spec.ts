import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaViewComponent } from './artista-view.component';

describe('ArtistaViewComponent', () => {
  let component: ArtistaViewComponent;
  let fixture: ComponentFixture<ArtistaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistaViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
