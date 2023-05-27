import { Component, OnInit, inject } from '@angular/core';
import { Quiz } from '../models';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-created-quizzes',
  templateUrl: './created-quizzes.component.html',
  styleUrls: ['./created-quizzes.component.scss'],
})
export class CreatedQuizzesComponent implements OnInit {
  quizzes: Quiz[] = [];

  api = inject(ApiService);

  ngOnInit(): void {
    this.loadQuizzes();
  }

  async loadQuizzes() {
    const quizzes = await this.api.getCreatedQuizzes();
    this.quizzes = quizzes;
  }

  deleteQuiz(quiz: Quiz) {
    this.api.deleteQuiz({ code: quiz.code! }).then(() => {
      this.quizzes = this.quizzes.filter((q) => q !== quiz);
    });
  }
}
