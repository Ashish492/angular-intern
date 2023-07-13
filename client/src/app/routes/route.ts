import { Routes } from '@angular/router';
import { MainComponent } from '../layout/main/main.component';
export const route: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../module/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user',
    component: MainComponent,
    loadChildren: () =>
      import('../module/user/user.module').then((m) => m.UserModule),
  },
];
