import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  mode = 'login';

  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  registerForm = new FormGroup(
    {
      login: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
      repeatPassword: new FormControl<string>('', {
        validators: Validators.required,
        updateOn: 'blur',
      }),
    },
    {
      validators: (group) =>
        group.value.password &&
        group.value.repeatPassword &&
        group.value.password !== group.value.repeatPassword
          ? { missmatch: true }
          : null,
    }
  );

  authService = inject(AuthService);
  apiService = inject(ApiService);

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.authService.login({
      login: this.loginForm.value.login!,
      password: this.loginForm.value.password!,
    });
  }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
    this.apiService
      .register({
        login: this.registerForm.value.login!,
        password: this.registerForm.value.password!,
      })
      .then(() => {
        this.mode = 'login';
      });
  }
}
