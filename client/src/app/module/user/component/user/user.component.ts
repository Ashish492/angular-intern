import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../model/user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription, debounceTime, throttleTime } from 'rxjs';
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
  private searchSubscription!: Subscription;
  searchControl: FormControl = new FormControl('');
  searchForm!: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _user: UserService,
    private _toast: ToastrService
  ) {}
  ngOnDestroy(): void {
    this.httpSubscription && this.httpSubscription.unsubscribe();
    this.searchSubscription && this.searchSubscription.unsubscribe();
  }
  search(name: any) {}
  ngOnInit() {
    this.buildForm();
    this.loadUsers();
    this.searchHandler();
  }
  getControls(controlName: string) {
    return this.form.get(controlName);
  }
  private filterByName(name: string) {
    const regex = new RegExp(name, 'i');
    this.users = this.users.filter((user) => regex.test(user.name));
  }
  private searchHandler() {
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Debounce for 300ms
        throttleTime(500) // Throttle for 500ms
      )
      .subscribe((value: string) => {
        this.loadUsers(value);
      });
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
        (this.users = [data, ...this.users]),
          this._toast.info('user added', 'success');
        this.loading = false;
        document.getElementById('close')?.click();
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
        let currentUser = this.users.findIndex(
          (user) => user.id == this.currentId
        );
        if (currentUser !== -1) {
          this.users[currentUser] = data;
        }
        this.loading = false;
        document.getElementById('close')?.click();
        this._toast.success('user data updated', 'success');
      },
      error: (error) => {
        this.loading = false;
        this._toast.error('unable to edit data', 'error');
      },
    });
  }
  deleteHandler(id: string) {
    this.currentId = id;
    if (window.confirm('do yo want to delete')) {
      this.loading = true;
      this._user.deleteUser(this.currentId).subscribe({
        next: (data) => {
          this.users = this.users.filter((user) => user.id !== this.currentId);
          // this.users = [...this.users]
          this._toast.success('user deleted', 'success');
        },
        error: (error) => {
          this._toast.error('unable to delete data', 'error');
        },
      });
    }
  }
  loadUsers(value: string | null = null) {
    this.loadingData = true;
    this.httpSubscription = this._user.getUsers(value).subscribe({
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
