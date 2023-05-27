import { Component, OnInit, inject } from '@angular/core';
import { Question } from '../models';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.scss'],
})
export class TakeQuizComponent implements OnInit {
  quizTitle = '';
  questions: any[] = [];
  quizCode = '';

  quizResult: any = null;

  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quizCode = params['code'];
      this.loadQuiz(params['code']);
    });
  }

  async loadQuiz(code: string) {
    const quiz = await this.api.getQuiz({ code });
    this.quizTitle = quiz.title;
    this.questions = quiz.questions.map((q) => ({ ...q, selected: null }));
  }

  get numAnswered() {
    return this.questions.filter((q) => q.selected !== null).length;
  }

  get numCorrect() {
    if (!this.quizResult) return null;
    return Object.values(this.quizResult).filter(
      ({ correct, selected }: any) => correct === selected
    ).length;
  }

  getChar(idx: number) {
    return String.fromCharCode(65 + idx);
  }

  async submit() {
    const answers = Object.fromEntries(
      this.questions.map((q, idx) => [idx, q.selected])
    );
    this.quizResult = await this.api.submitQuiz({
      code: this.quizCode,
      answers,
    });
  }
}
