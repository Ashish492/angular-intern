import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { route } from './routes/route';
const routes: Routes = [
  {
    path: '',
    children: route,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
