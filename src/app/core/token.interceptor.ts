import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const token = localStorage.getItem('token');
  const router = inject(Router);

  const isPublic = req.url.includes('/api/auth/login');

  if (isPublic) {
    return next(req);
  }

  if (!token) {
    messageService.add({
      severity: 'warn',
      summary: 'Authentication Required',
      detail: 'No token found. Please login to access this resource.',
    });
    router.navigate(['/login']);
    return next(req);
  }

  try {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  } catch (error) {
    messageService.add({
      severity: 'error',
      summary: 'Token Error',
      detail: 'There was an issue attaching the authentication token.',
    });
    return next(req);
  }
};
