import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  getTask() {
    return this.http
      .get<any>(`${environment.taskServiceApiBaseUrl}/tasks`)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  postTask(payload: object) {
    return this.http
      .post<any>(`${environment.taskServiceApiBaseUrl}/tasks`, payload)
      .pipe(
        tap((response) => {
          if (response.status === 1) {
            return response;
          } else {
            throw new Error(response.message || 'Failed to create task');
          }
        })
      );
  }

  putTask(taskId: string, payload: object) {
    return this.http
      .put<any>(`${environment.taskServiceApiBaseUrl}/tasks/${taskId}`, payload)
      .pipe(
        tap((response) => {
          if (response.status === 1) {
            return response;
          } else {
            throw new Error(response.message || 'Failed to update task');
          }
        })
      );
  }

  getUsersList() {
    return this.http
      .get<any>(`${environment.authServiceApiBaseUrl}/auth/usersList`)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  deleteTask(taskId: string) {
    return this.http
      .delete<any>(`${environment.taskServiceApiBaseUrl}/tasks/${taskId}`)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
