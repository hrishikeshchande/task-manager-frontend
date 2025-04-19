import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { HeaderComponent } from '../header/header.component';
import { DashboardService } from './dashboard.service';
import { AuthService } from '../core/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TableModule,
    DropdownModule,
    CommonModule,
    HeaderComponent,
    Tooltip,
    Button,
    ConfirmDialog,
    DialogModule,
    FloatLabel,
    InputTextModule,
    ReactiveFormsModule,
    DatePicker,
    Select,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [ConfirmationService],
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  columns: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'title', header: 'Title' },
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status' },
    { field: 'dueDate', header: 'Due Date' },
    { field: 'assignedTo', header: 'Assigned To' },
    { field: 'createByName', header: 'Created By' },
  ]; 
  statusOption: any[] = [
    { label: 'Pending', value: 'Pending' },
    { label: 'InProgress', value: 'InProgress' },
    { label: 'Done', value: 'Done' },
  ];
  userDropdownOptions: any[] = [];
  userList: any[] = [];
  selectedRowData: any = {};
  visible: boolean = false;
  logInUserRole: string | null = null;
  taskForm!: FormGroup;
  logUserDetails: any = null;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getLoginUserRole();
    this.loadTask();
    this.logInUserRole === 'Admin' ? this.loadUsers() : this.getUserDetails();
  }
  getUserDetails() {
    try {
      this.userList = [
        {
          id: this.authService.getUserNameIdentifier(),
          name: this.authService.getUsername(),
        },
      ];
    } catch {
      this.messageService.add({
        severity: 'warn',
        summary: 'Failed to Load Users Details',
        detail: 'Could not fetch users details.',
      });
    }
  }
  initializeForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: ['', Validators.required],
    });
  }
  getLoginUserRole() {
    this.logInUserRole = this.authService.getUserRole();
  }
  loadTask() {
    this.dashboardService.getTask().subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.tasks = response;
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'No Tasks Found',
            detail: 'No tasks were returned from the server.',
          });
          this.tasks = [];
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Load Tasks',
          detail:
            err.message || 'An unexpected error occurred while fetching tasks.',
        });
      },
    });
  }
  loadUsers() {
    this.dashboardService.getUsersList().subscribe({
      next: (res) => {
        if (res.length !== 0) {
          this.userList = res.map(
            (user: { id: any; username: any }) => ({
              id: user.id,
              name: user.username,
            })
          );
          this.userDropdownOptions = res.map((user: { username: any; id: any; }) => ({
            label: user.username,
            value: user.id
          }));          
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Users not found',
            detail: res.message || 'Could not fetch users.',
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'User Load Error',
          detail: err.message || 'An error occurred while fetching users.',
        });
      },
    });
  }

  capitalize(text: string | null | undefined): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  }

  getUserNameById(userId: string): string {
    return this.userList.find((user) => user.id === userId)?.name || userId;
  }

  editRow(rowData: any) {
    this.selectedRowData = { ...rowData };

    this.taskForm.patchValue({
      title: rowData.title,
      description: rowData.description,
      dueDate: new Date(rowData.dueDate),
      status: rowData.status,
      assignedTo:
        this.userList.find((user) => user.name === rowData.assignedTo)?.id ||
        rowData.assignedTo,
    });
    if (
      this.logInUserRole === 'Admin' ||
      rowData?.createById === this.userList[0]?.id
    ) {
      this.taskForm.enable();
    } else {
      Object.keys(this.taskForm.controls).forEach((controlName) => {
        if (controlName === 'status') {
          this.taskForm.get(controlName)?.enable();
        } else {
          this.taskForm.get(controlName)?.disable();
        }
      });
    }
    this.visible = true;
  }

  addNewTask() {
    this.selectedRowData = null;
    Object.keys(this.taskForm.controls).forEach((control) => {
      this.taskForm.get(control)?.enable();
    });
    this.taskForm.reset();
    this.visible = true;
  }
  deleteRow(event: Event, rowData: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete the task: ${rowData.title}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'No, Keep It',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Yes, Delete',
        severity: 'danger',
      },
      accept: () => {
        this.deleteTask(rowData);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Deletion Cancelled',
          detail: 'The task was not deleted.',
        });
      },
    });
  }

  async deleteTask(rowData: any) {
    this.dashboardService.deleteTask(rowData.id).subscribe({
      next: async (response) => {
        if (response?.status === 1) {
          await this.loadTask();
          this.tasks = this.tasks.filter((task) => task.id !== rowData.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Task Deleted',
            detail:
              response.message ||
              `Task titled "${rowData.title}" deleted successfully.`,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Delete Failed',
            detail:
              response.message ||
              `Failed to delete task titled "${rowData.title}".`,
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            err.message ||
            'An unexpected error occurred while deleting the task.',
        });
      },
    });
  }
  cancledTask() {
    this.taskForm.reset();
    this.visible = false;
  }
  async saveTask() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;

    if (this.selectedRowData) {
      const updatedTask = { ...this.selectedRowData, ...formValue };
      const taskId = this.selectedRowData.id;

      this.dashboardService.putTask(taskId, updatedTask).subscribe({
        next: (res) => {
          if (res.id) {
            this.messageService.add({
              severity: 'success',
              summary: 'Task Updated',
              detail: res.message || 'The task was updated successfully.',
            });
            this.visible = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: res.message || 'Failed to update the task.',
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err.message || 'Failed to update the task.',
          });
        },
      });
    } else {
      this.dashboardService.postTask(formValue).subscribe({
        next: (res) => {
          if (res.id) {
            this.messageService.add({
              severity: 'success',
              summary: 'Task Created',
              detail: res.message || 'A new task was created successfully.',
            });
            this.visible = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Creation Failed',
              detail: res.message || 'Failed to create the task.',
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: err.message || 'Failed to create the task.',
          });
        },
      });
    }
    await this.loadTask();
  }
}
