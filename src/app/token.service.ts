import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getAccessToken() {
    return localStorage.getItem('JWT');
  }

  setAccessToken(token: string) {
    return localStorage.setItem('JWT', token);
  }

  purgeAccessToken() {
    localStorage.removeItem('JWT');
  }
}
