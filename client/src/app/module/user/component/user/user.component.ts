import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  users: User[] = [];
  edit: boolean = false;
  form!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = false;
  private currentId: string = '';
  private httpSubscription!: Subscription;
  constructor(
    private _fb: FormBuilder,
    private _user: UserService,
    private _toast: ToastrService
  ) {}
  ngOnDestroy(): void {
    this.httpSubscription && this.httpSubscription.unsubscribe();
  }
  ngOnInit() {}
  getControls(controlName: string) {
    return this.form.get(controlName);
  }
  editClickHandler(row: User) {
    this.currentId = row.id;
    this.edit = true;
    this.form.patchValue(row);
  }
  addUser() {
    this.loading = true;
    this._user.addUser(this.form.value).subscribe({
      next: (data) => {
        this.users.unshift(data);
        this._toast.info('user added', 'success');
        this.loading = false;
        document.getElementById('cancel')?.click();
        this.form.reset();
      },
      error: (err) => {
        this._toast.error('unable to add user', 'error');
        this.loading = false;
      },
    });
  }
  editHandler() {
    this.loading = true;
    this._user.editUser(this.currentId, this.form.value).subscribe({
      next: (data) => {
        let currentUser = this.users.find((user) => user.id === this.currentId);
        currentUser = data;
        // this.users = [...this.users]
        this.loading = false;
        document.getElementById('cancel')?.click();
        this._toast.error('user data updated', 'success');
      },
      error: (error) => {
        this.loading = false;
        this._toast.error('unable to edit data', 'error');
      },
    });
  }
  deleteHandler(id: string) {
    this.currentId = id;
    if (window.prompt('do yo want to delete')) {
      this.loading = true;
      this._user.deleteUser(this.currentId).subscribe({
        next: (data) => {
          this.users = this.users.filter((user) => user.id !== this.currentId);
          // this.users = [...this.users]
          this._toast.error('user deleted', 'success');
        },
        error: (error) => {
          this._toast.error('unable to delete data', 'error');
        },
      });
    }
  }
  loadUsers() {
    this.loadingData = true;
    this.httpSubscription = this._user.getUsers().subscribe({
      next: (users) => {
        this.loadingData = false;
        this.users = users;
      },
      error: (err) => {
        this._toast;
      },
    });
  }
  buildForm() {
    this.form = this._fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', Validators.email],
    });
  }
}
