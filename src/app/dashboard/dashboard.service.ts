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
      .get<any>(`${environment.baseUrl}/task`)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
  postTask(payload: object) {
    return this.http
      .post<any>(`${environment.baseUrl}/task`, payload)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  putTask(taskId: string, payload: object) {
    return this.http
      .put<any>(`${environment.baseUrl}/task/${taskId}`, payload)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  deleteTask(taskId: string) {
    return this.http
      .delete<any>(`${environment.baseUrl}/task/${taskId}`)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getUsersList() {
    return this.http
      .get<any>(`${environment.baseUrl}/task/users`)
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
