import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { EstilosComponent } from './pages/estilos/estilos.component';
import { ArtistasComponent } from './pages/artistas/artistas.component';
import { ContactosComponent } from './pages/contactos/contactos.component';
import { TiendaOnlineComponent } from './pages/tienda-online/tienda-online.component';

// Components
import { CarruselComponent } from './components/carrusel/carrusel.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
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
// Servicios

import { AuthGoogleService } from './auth-google.service'; // Asegúrate de importar tu servicio de autenticación
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EstilosComponent,
    ArtistasComponent,
    ContactosComponent,
    TiendaOnlineComponent,
    CarruselComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ProductCardComponent,
    PaintSectionComponent,
    ArtistaSectionComponent,
    CartComponent,
    SelectRolComponent,
    CallbackComponent,
    ArtistaViewComponent,
    UpdateBioComponent,
    UpdateObrasComponent,
    UsuarioViewComponent,
    UpdateBioUserComponent,
    CompraDialogComponent,
    AdminComponent,
    PasswordResetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),  // Importa el módulo OAuth para la autenticación
    HttpClientModule,   
    MatDialogModule,
    BrowserAnimationsModule,
  ],
  providers: [AuthGoogleService], // Agrega el servicio de autenticación
  bootstrap: [AppComponent]
})
export class AppModule { }
