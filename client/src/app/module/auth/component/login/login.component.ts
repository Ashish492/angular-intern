import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.buildFormControl();
  }
  buildFormControl() {
    this.form = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  getControls(name: string) {
    return this.form.get(name);
  }
  login() {
    this.loading = true;
    this._auth.login(this.form.value).subscribe({
      next: (result) => {
        this._auth.setAuthToken(result.token);
        this.router.navigateByUrl('/user');
      },
      error: (err) => {
        this.loading = false;
        this.toast.error('username or password incorrect', 'error');
      },
    });
  }
}
