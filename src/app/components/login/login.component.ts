import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) { }
  mode: string = 'login';

  @Input()
  set setmode(value: string) {
    this.mode = value;
    if (value === 'logout') {
      //this.usersService.logout();
      this.router.navigate(['userManagement', 'login']);
    }
  }

  email: string = '';
  password: string = '';
  error: string = '';

  async login() {
    if (!this.email || !this.password) {
      this.error= 'Los campos no pueden estar vacios.';
      return;
    }

  }

  async register() {
    if (!this.email || !this.password) {
      this.error= 'Los campos no pueden estar vacios.';
      return;
    }

  }
}
