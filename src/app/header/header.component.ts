import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  auth = inject(AuthService);
  user$: BehaviorSubject<User> | null = null;

  ngOnInit(): void {
    this.user$ = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
  }
}
