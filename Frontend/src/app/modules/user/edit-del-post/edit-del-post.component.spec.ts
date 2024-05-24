import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDelPostComponent } from './edit-del-post.component';

describe('EditDelPostComponent', () => {
  let component: EditDelPostComponent;
  let fixture: ComponentFixture<EditDelPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDelPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDelPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
