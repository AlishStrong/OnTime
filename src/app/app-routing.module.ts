import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { BusinessHomePageComponent } from './pages/business-home-page/business-home-page.component';
import { BusinessSignupComponent } from './pages/business-signup/business-signup.component';
import { CompaniesPageComponent } from './pages/companies-page/companies-page.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToBusinessHome = () => redirectLoggedInTo(['business-home']);

// don't commit the line below
// const redirectLoggedInToBusinessHome = () => redirectLoggedInTo(['companies']);

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToBusinessHome }
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToBusinessHome }
  },
  {
    path: 'signup',
    component: BusinessSignupComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToBusinessHome }
  },
  {
    path: 'business-home',
    component: BusinessHomePageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'companies',
    component: CompaniesPageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
