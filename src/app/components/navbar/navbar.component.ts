import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ArtistaService } from '../../services/artistas/artistas.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isCartVisible: boolean = false;
  isAuthenticated: boolean = false;
  userRole: string | null = null;
  userName: string = '';
  userImage: string = 'assets/icons/default-profile.png';
  userMenuVisible: boolean = false;
  isMobileMenuVisible: boolean = false;
  private authSubscription: Subscription;
  private userDataSubscription: Subscription;
  private artistaDataSubscription: Subscription;
  private menuHovered: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private artistaService: ArtistaService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.authSubscription = this.authService.authState$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (!isAuthenticated) {
        this.resetUserData();
      }
    });

    this.userDataSubscription = this.authService.userData$.subscribe(user => {
      if (user) {
        this.updateUserInfo(user);
      }
    });

    this.artistaDataSubscription = this.artistaService.artistaData$.subscribe(artista => {
      if (artista && this.userRole === 'artista') {
        this.updateArtistaImage(artista);
      }
    });
  }

  private resetUserData(): void {
    this.userRole = null;
    this.userName = '';
    this.userImage = 'assets/icons/default-profile.png';
    this.userMenuVisible = false;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
    if (this.isAuthenticated) {
      const user = this.userService.getCurrentUser();
      this.updateUserInfo(user);
    }
  }

  private updateUserInfo(user: any): void {
    if (!user) return;

    this.userRole = user.rol || null;
    this.userName = user.name || '';

    if (this.userRole === 'artista') {
      this.artistaService.obtenerArtista().subscribe({
        next: (artistData) => {
          this.updateArtistaImage(artistData);
        },
        error: () => {
          this.userImage = 'assets/icons/default-profile.png';
        }
      });
    } else if (user.imagen) {
      this.userImage = `http://localhost:5000/${user.imagen}`;
    } else {
      this.userImage = 'assets/icons/default-profile.png';
    }
  }

  private updateArtistaImage(artista: any): void {
    if (artista?.imagen) {
      this.userImage = `http://localhost:5000/uploads/artista/${artista.imagen}`;
    } else {
      this.userImage = 'assets/icons/default-profile.png';
    }
  }

  logout(): void {
    this.authService.logout();
    this.resetUserData();
    this.router.navigate(['/home']);
  }

  toggleUserMenu(): void {
    this.userMenuVisible = !this.userMenuVisible;
  }

  goToProfile(): void {
    if (this.userRole === 'usuario') {
      this.router.navigate(['/usuario-view']);
    } else if (this.userRole === 'artista') {
      this.router.navigate(['/artista-view']);
    } else if (this.userRole === 'admin') {
      this.router.navigate(['/admin']);
    }
  }

  editProfile(): void {
    if (this.userRole === 'usuario') {
      this.router.navigate(['/update-bio-user']);
    } else if (this.userRole === 'artista') {
      this.router.navigate(['/update-bio']);
    }
  }

  toggleCart(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  toggleMenu(): void {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }

  onMouseEnterMenu(): void {
    this.menuHovered = true;
  }

  onMouseLeaveMenu(): void {
    this.menuHovered = false;
    setTimeout(() => {
      if (!this.menuHovered) {
        this.userMenuVisible = false;
      }
    }, 200);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.userMenuVisible = false;
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    if (this.artistaDataSubscription) {
      this.artistaDataSubscription.unsubscribe();
    }
  }
}