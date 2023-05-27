import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Credentials, User } from './models';
import { BehaviorSubject, Subject } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = inject(ApiService);
  tokenStorage = inject(TokenService);
  router = inject(Router);

  user$ = new BehaviorSubject<User>(null);

  private exp = 0;

  private tokenExpirationObserver: any = null;
  private validateTokenExp = () => {
    if (this.exp < Date.now()) {
      this.tokenStorage.purgeAccessToken();
      // this.router.navigateByUrl('/');
      return;
    }
  };

  constructor() {
    const token = this.tokenStorage.getAccessToken();
    if (!token) return;

    const { login, exp } = this.getPayloadFromJWT(token);
    this.user$.next({ login });
    this.exp = exp;

    this.tokenExpirationObserver = setInterval(this.validateTokenExp, 5000);
  }

  private getPayloadFromJWT(jwt: string) {
    const [, payload] = jwt.split('.');
    const parsed = JSON.parse(atob(payload));
    return { login: parsed.sub.username, exp: parsed.exp * 1000 };
  }

  async login({ login, password }: Credentials) {
    const jwt = await this.api.login({ login, password });
    if (!jwt) return;

    this.tokenStorage.setAccessToken(jwt);

    const { exp } = this.getPayloadFromJWT(jwt);
    this.exp = exp;
    this.user$.next({ login });

    this.tokenExpirationObserver = setInterval(this.validateTokenExp, 5000);
  }

  logout() {
    this.tokenStorage.purgeAccessToken();
    this.user$.next(null);
    clearInterval(this.tokenExpirationObserver);
    this.tokenExpirationObserver = null;
  }

  getUser() {
    return this.user$;
  }
}
