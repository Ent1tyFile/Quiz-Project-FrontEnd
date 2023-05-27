import { Component, ElementRef, ViewChild } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  quizCode = '';

  router = inject(Router);
  @ViewChild('quizCodeInputRef') quizCodeInputRef!: ElementRef;

  takeQuiz() {
    if (!this.quizCode) {
      this.quizCodeInputRef.nativeElement.focus();
      return;
    }
    this.router.navigate(['take-quiz', this.quizCode]);
  }
}
