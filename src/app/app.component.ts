import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Tooltip, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService],
  standalone: true,
})
export class AppComponent implements OnInit {
  darkTheme = false;
  isUserLogIn = false;
  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    try {
      this.authService.getAuthStatusObservable().subscribe((status) => {
        this.isUserLogIn = status;
      });
      const darkModeFromStorage = localStorage.getItem('darkTheme');
      this.darkTheme = darkModeFromStorage === 'true';

      if (this.darkTheme) {
        document.querySelector('html')?.classList.add('my-app-dark');
      }
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'LogOut Failed',
        detail: 'Unexpected error occurred',
      });
    }
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('darkTheme', this.darkTheme.toString());
  }
}
