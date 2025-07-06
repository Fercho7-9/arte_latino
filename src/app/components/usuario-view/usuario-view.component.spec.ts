import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioViewComponent } from './usuario-view.component';

describe('UsuarioViewComponent', () => {
  let component: UsuarioViewComponent;
  let fixture: ComponentFixture<UsuarioViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
