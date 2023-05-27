import { Injectable, inject } from '@angular/core';
import { Credentials, Question, Quiz } from './models';
import { TokenService } from './token.service';
import { NotificationService } from './notification.service';

const API_URL = 'http://127.0.0.1:5000';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  commonHeaders = {
    'Content-Type': 'application/json',
  };

  tokenStorage = inject(TokenService);
  notification = inject(NotificationService);

  constructor() {}

  get authHeader() {
    const token = this.tokenStorage.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : null;
  }

  private handleHttpResponse = async (res: Response) => {
    const json = await res.json();
    if (res.status >= 400) {
      this.notification.error(json.message);
    }
    return json;
  };

  async register({ login, password }: Credentials) {
    // return { result: '', error: null };
    return fetch(API_URL + '/register', {
      method: 'POST',
      body: JSON.stringify({ username: login, password }),
      headers: this.commonHeaders,
    }).then(this.handleHttpResponse);
  }

  async login({ login, password }: Credentials) {
    return fetch(API_URL + '/login', {
      method: 'POST',
      body: JSON.stringify({ username: login, password }),
      headers: this.commonHeaders,
    })
      .then(this.handleHttpResponse)
      .then((res) => res.access_token);
  }

  async createQuiz({
    title,
    questions,
  }: {
    title: string;
    questions: Question[];
  }) {
    const packet = {
      quiz_name: title,
      questions: Object.assign(
        {},
        questions.map(({ title, answers }) => ({
          title,
          answers: Object.assign({}, answers),
        }))
      ),
    };

    return fetch(API_URL + '/quiz', {
      method: 'POST',
      body: JSON.stringify(packet),
      headers: {
        ...this.commonHeaders,
        ...this.authHeader,
      },
    })
      .then(this.handleHttpResponse)
      .then((res) => {
        this.notification.success(
          `Successfully created! Code: ${res.quiz_identifier}`
        );
        return res as Quiz;
      });
  }

  async updateQuiz({
    code,
    title,
    questions,
  }: {
    code: string;
    title: string;
    questions: Question[];
  }) {
    const packet = {
      quiz_name: title,
      questions: Object.assign(
        {},
        questions.map(({ title, answers }) => ({
          title,
          answers: Object.assign({}, answers),
        }))
      ),
    };

    return fetch(API_URL + '/edit_quiz/' + code, {
      method: 'POST',
      body: JSON.stringify(packet),
      headers: {
        ...this.commonHeaders,
        ...this.authHeader,
      },
    })
      .then(this.handleHttpResponse)
      .then((res) => {
        this.notification.success(res.message);
        return res as Quiz;
      });
  }

  async getQuiz({ code }: any) {
    return fetch(API_URL + '/take-quiz/' + code, {
      method: 'GET',
      headers: {
        ...this.commonHeaders,
        ...this.authHeader,
      },
    })
      .then(this.handleHttpResponse)
      .then(
        (res) =>
          ({
            title: res.quiz_name,
            questions: Object.values(res.questions).map(
              ({ answers, title }: any) => ({
                title,
                answers: Object.values(answers),
              })
            ),
          } as Quiz)
      );
  }

  async getCreatedQuizzes() {
    return fetch(API_URL + '/my_quizzes', {
      method: 'GET',
      headers: {
        ...this.commonHeaders,
        ...this.authHeader,
      },
    })
      .then(this.handleHttpResponse)
      .then((res) =>
        res.map((quiz: any) => ({
          date: quiz['created_at'],
          code: quiz['quiz_identifier'],
          title: quiz['quiz_name'],
        }))
      );
  }

  async getCreatedQuiz({ code }: { code: string }) {
    return fetch(API_URL + '/manage-quiz/' + code, {
      method: 'GET',
      headers: {
        ...this.commonHeaders,
        ...this.authHeader,
      },
    })
      .then(this.handleHttpResponse)
      .then(
        (res) =>
          ({
            title: res.quiz_name,
            questions: Object.values(res.questions).map(
              ({ answers, title }: any) => ({
                title,
                answers: Object.values(answers),
              })
            ),
          } as Quiz)
      );
  }

  async deleteQuiz({ code }: { code: string }) {
    return fetch(API_URL + '/delete-quiz/' + code, {
      method: 'POST',
      headers: {
        ...this.commonHeaders,
        ...this.authHeader,
      },
    })
      .then(this.handleHttpResponse)
      .then((res) => this.notification.success(res.message));
  }

  submitQuiz({ code, answers }: any) {
    return fetch(API_URL + '/submit-quiz/' + code, {
      method: 'POST',
      headers: {
        ...this.commonHeaders,
        ...this.authHeader,
      },
      body: JSON.stringify({
        answered_questions: answers,
      }),
    }).then(this.handleHttpResponse);
  }
}
