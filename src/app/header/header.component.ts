import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../core/auth.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, TooltipModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  username: string | null = null;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  logOutProcess() {
    this.authService.logout().subscribe({
      next: (response) => {
        if (response?.status !== 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'LogOut Successful',
            detail: 'You have been logged out successfully.',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'LogOut failed',
            detail: response?.message,
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'LogOut Failed',
          detail: err.message || 'Unexpected error occurred',
        });
      },
    });
  }
}
