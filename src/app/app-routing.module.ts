import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { EstilosComponent } from './pages/estilos/estilos.component';
import { ArtistasComponent } from './pages/artistas/artistas.component';
import { ContactosComponent } from './pages/contactos/contactos.component';
import { TiendaOnlineComponent } from './pages/tienda-online/tienda-online.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaintSectionComponent } from './components/paint-section/paint-section.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ArtistaSectionComponent } from './components/artista-section/artista-section.component';
import { CartComponent } from './components/cart/cart.component';
import { SelectRolComponent } from './components/select-rol/select-rol.component';
import { CallbackComponent } from './callback/callback.component';
import { ArtistaViewComponent } from './components/artista-view/artista-view.component';
import { UpdateBioComponent } from './components/update-bio/update-bio.component';
import { UpdateObrasComponent } from './components/update-obras/update-obras.component';
import { UsuarioViewComponent } from './components/usuario-view/usuario-view.component';
import { UpdateBioUserComponent } from './components/update-bio-user/update-bio-user.component';
import { CompraDialogComponent } from './components/compra-dialog/compra-dialog.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'estilos', component: EstilosComponent },
  { path: 'artistas', component: ArtistasComponent },
  { path: 'contactos', component: ContactosComponent },
  { path: 'tienda', component: TiendaOnlineComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'paint-section',component:PaintSectionComponent},
  {path: 'product-card',component:ProductCardComponent},
  {path: 'artista-section',component:ArtistaSectionComponent},
  {path: 'cart',component:CartComponent},
  {path: 'select-rol',component:SelectRolComponent},
  { path: 'callback', component: CallbackComponent },
  { path: 'artista-view', component: ArtistaViewComponent },
  { path: 'usuario-view', component: UsuarioViewComponent },
  { path: 'update-bio', component: UpdateBioComponent },
  { path: 'update-obras', component: UpdateObrasComponent },
  { path: 'update-obras/:id', component: UpdateObrasComponent },  
  { path: 'update-bio-user', component: UpdateBioUserComponent },  
  { path: 'compra-dialog', component: CompraDialogComponent },   
  { path: 'admin', component: AdminComponent }, 
  { path: 'password-reset', component: PasswordResetComponent }, 
  { path: '**', redirectTo: '' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }