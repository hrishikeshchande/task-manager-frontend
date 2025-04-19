import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred.';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad request.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            localStorage.removeItem('token');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Access denied.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Internal server error.';
            break;
          default:
            errorMessage = `Unexpected error: ${error.message}`;
            break;
        }
      }
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
