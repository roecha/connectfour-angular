import { GameComponent } from './components/game/game.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'login', component : LoginComponent },
  { path: 'home', component : GameListComponent, canActivate: [AuthGuard] },
  { path: 'gids/:gid', component : GameComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch : 'full' }

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
