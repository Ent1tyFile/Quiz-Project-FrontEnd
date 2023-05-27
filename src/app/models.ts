export type User = {
  login: string;
} | null;

export interface Credentials {
  login: string;
  password: string;
}

export interface Answer {
  id?: number;
  value: string;
  correct?: boolean;
}

export interface Question {
  id?: number;
  title: string;
  answers: Answer[];
}

export interface Quiz {
  id?: number;
  code?: string;
  title: string;
  questions: Question[];
  date: string;
}
