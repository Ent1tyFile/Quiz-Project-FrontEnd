import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizFormComponent } from './quiz-form/quiz-form.component';
import { HomeComponent } from './home/home.component';
import { TakeQuizComponent } from './take-quiz/take-quiz.component';
import { CreatedQuizzesComponent } from './created-quizzes/created-quizzes.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    title: 'Home',
    path: '',
    component: HomeComponent,
  },
  {
    title: 'Take Quiz',
    path: 'take-quiz/:code',
    component: TakeQuizComponent,
    canActivate: [authGuard],
  },
  {
    title: 'Create Quiz',
    path: 'create-quiz',
    component: QuizFormComponent,
    canActivate: [authGuard],
  },
  {
    title: 'My Quizzes',
    path: 'created-quizzes',
    component: CreatedQuizzesComponent,
    canActivate: [authGuard],
  },
  {
    title: 'Edit Quiz',
    path: 'edit-quiz/:code',
    component: QuizFormComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
