import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'detail-profile', loadChildren: './pages/detail-profile/detail-profile.module#DetailProfilePageModule' },
  { path: 'edit-user', loadChildren: './pages/edit-user/edit-user.module#EditUserPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'matches', loadChildren: './pages/matches/matches.module#MatchesPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'register2', loadChildren: './pages/register2/register2.module#Register2PageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
