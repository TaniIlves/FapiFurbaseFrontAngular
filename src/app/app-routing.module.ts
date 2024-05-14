import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminGuard } from './guards/admin.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';


const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AdminGuard] },
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // { path: 'profile', component: ProfileComponent },
  { path: 'page-not-found-404', component: NotFoundComponent },
  { path: '**', redirectTo: '/page-not-found-404' },
  { path: 'access-denied', component: AccessDeniedComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
