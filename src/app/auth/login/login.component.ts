import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { FloatLabel } from 'primeng/floatlabel';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabel,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginProcess() {
    if (this.loginForm.invalid) {
      if (this.loginForm.controls['username'].invalid) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Missing Username',
          detail: 'Please enter your username',
        });
        return;
      }

      if (this.loginForm.controls['password'].invalid) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Missing Password',
          detail: 'Please enter your password',
        });
        return;
      }

      return;
    }

    const payload = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: (response) => {
        if (response?.status !== 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: `Welcome, ${payload.username}`,
          });

          this.router.navigate(['/dashboard']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: response?.message,
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.message || 'Unexpected error occurred',
        });
      },
    });
  }
}
