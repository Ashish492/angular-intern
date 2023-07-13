import { Routes } from '@angular/router';
import { MainComponent } from '../layout/main/main.component';
import { NotFoundComponent } from '../component/not-found/not-found.component';
import { authGuard } from '../guard/auth.guard';
export const route: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../module/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user',
    canActivate: [authGuard],
    component: MainComponent,
    loadChildren: () =>
      import('../module/user/user.module').then((m) => m.UserModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
