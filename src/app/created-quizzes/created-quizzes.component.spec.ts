import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedQuizzesComponent } from './created-quizzes.component';

describe('CreatedQuizzesComponent', () => {
  let component: CreatedQuizzesComponent;
  let fixture: ComponentFixture<CreatedQuizzesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatedQuizzesComponent],
    });
    fixture = TestBed.createComponent(CreatedQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
