import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { BlogDetailsComponent } from './blogs/blog-details/blog-details.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'blog',
    canActivate: [AuthGuard],
    component: BlogComponent,
  },
  {
    path: 'blog/:id',
    canActivate: [AuthGuard],
    component: BlogDetailsComponent,
  },
  { path: 'not-found', component: ErrorPageComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
