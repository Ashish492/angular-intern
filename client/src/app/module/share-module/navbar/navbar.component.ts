import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private _auth: AuthService) {}
  ngOnInit() {}
  handleLogOut() {
    if (confirm('do you want to logout')) {
      this._auth.logOut();
    }
  }
}
