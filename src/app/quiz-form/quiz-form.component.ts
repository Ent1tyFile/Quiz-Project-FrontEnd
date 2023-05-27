import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Answer, Question } from '../models';
import { inject } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss'],
})
export class QuizFormComponent implements OnInit {
  quizTitle = '';
  questions: Question[] = [
    {
      title: '',
      answers: [
        {
          value: '',
          correct: true,
        },
      ],
    },
  ];

  @ViewChild('quizTitleInputRef') quizTitleInputRef!: ElementRef;

  api = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  quizCode: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this.quizCode = code;
        this.loadQuiz(code);
      }
    });
  }

  async loadQuiz(code: string) {
    const quiz = await this.api.getCreatedQuiz({ code });
    this.quizTitle = quiz.title;
    this.questions = quiz.questions;
  }

  selectCorrectAnswer(question: Question, answer: Answer) {
    question.answers.forEach((q) => (q.correct = false));
    answer.correct = !answer.correct;
  }

  addNewAnswer(question: Question) {
    const template = {
      value: '',
      correct: false,
    };
    const selectedQuestion = this.questions.find((q) => q === question);
    selectedQuestion!.answers = [...selectedQuestion!.answers, template];
  }

  removeAnswer(question: Question, answer: Answer) {
    question.answers = question.answers.filter((a) => a !== answer);
    if (!question.answers.find((a) => a.correct))
      question.answers[0].correct = true;
  }

  addNewQuestion() {
    const template = {
      title: '',
      answers: [
        {
          value: '',
          correct: true,
        },
      ],
    };
    this.questions = [...this.questions, template];
  }

  removeQuestion(question: Question) {
    this.questions = this.questions.filter((q) => q !== question);
  }

  submit() {
    if (!this.quizTitle) {
      this.quizTitleInputRef.nativeElement.focus();
      return;
    }
    if (this.quizCode) {
      this.api.updateQuiz({
        code: this.quizCode,
        title: this.quizTitle,
        questions: this.questions,
      });
      return;
    }
    this.api
      .createQuiz({ title: this.quizTitle, questions: this.questions })
      .then(() => {
        this.router.navigateByUrl('/created-quizzes');
      });
  }

  getChar(idx: number) {
    return String.fromCharCode(65 + idx);
  }
}
