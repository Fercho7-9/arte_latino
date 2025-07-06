import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  activeTab: 'users' | 'artista' | 'admin' | 'actions' = 'users';
  users: any[] = [];
  artists: any[] = [];
  admins: any[] = [];
  adminActions: any[] = [];
  showBlockDialog = false;
  showPasswordDialog = false;
  showDeleteDialog = false;
  blockReason = '';
  newPassword = '';
  selectedEntity: any = null;
  selectedEntityType: 'user' | 'artista' = 'user';
  filterRole: string = 'todos';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshAllData();
  }

  refreshAllData() {
    this.loadUsers();
    this.loadArtists();
    this.loadAdmins();
    this.loadAdminActions();
  }

  get filteredUsers() {
    if (this.filterRole === 'todos') {
      return this.users.filter(user => user.rol === 'usuario');
    }
    return this.users.filter(user => user.rol === this.filterRole);
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          blockStatus: user.blockStatus || {
            isBlocked: false,
            blockReason: '',
            blockedAt: null
          }
        }));
      },
      error: (error) => {
        console.error('Error loading users:', error);
        alert('Error al cargar usuarios');
      }
    });
  }

  loadArtists() {
    this.adminService.getAllArtists().subscribe({
      next: (artists) => {
        this.artists = artists.map(artist => ({
          ...artist,
          blockStatus: artist.blockStatus || {
            isBlocked: false,
            blockReason: '',
            blockedAt: null
          }
        }));
      },
      error: (error) => {
        console.error('Error loading artists:', error);
        alert('Error al cargar artistas');
      }
    });
  }

  loadAdmins() {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.admins = users.filter(user => user.rol === 'admin').map(admin => ({
          ...admin,
          blockStatus: admin.blockStatus || {
            isBlocked: false,
            blockReason: '',
            blockedAt: null
          }
        }));
      },
      error: (error) => {
        console.error('Error loading admins:', error);
        alert('Error al cargar administradores');
      }
    });
  }

  loadAdminActions() {
    this.adminService.getAdminActions().subscribe({
      next: (actions) => this.adminActions = actions,
      error: (error) => {
        console.error('Error loading admin actions:', error);
        alert('Error al cargar acciones');
      }
    });
  }

  openBlockDialog(entity: any, type: 'user' | 'artista') {
    this.selectedEntity = entity;
    this.selectedEntityType = type;
    this.blockReason = '';
    this.showBlockDialog = true;
  }

  openPasswordDialog(entity: any, type: 'user' | 'artista') {
    this.selectedEntity = entity;
    this.selectedEntityType = type;
    this.newPassword = '';
    this.showPasswordDialog = true;
  }

  openDeleteDialog(entity: any, type: 'user' | 'artista') {
    this.selectedEntity = entity;
    this.selectedEntityType = type;
    this.showDeleteDialog = true;
  }

  confirmPasswordChange() {
    if (!this.newPassword.trim()) {
      alert('Por favor, ingrese una nueva contraseña');
      return;
    }

    const email = this.selectedEntity.email || this.selectedEntity.correo;
    if (!email) {
      alert('No se pudo obtener el correo electrónico');
      return;
    }

    this.adminService.resetPassword(email, this.newPassword)
      .pipe(finalize(() => this.showPasswordDialog = false))
      .subscribe({
        next: () => {
          alert('Contraseña actualizada con éxito');
          this.refreshAllData();
        },
        error: (error) => {
          console.error('Error resetting password:', error);
          alert('Error al actualizar la contraseña');
        }
      });
  }

  confirmBlock() {
    if (!this.blockReason.trim()) {
      alert('Por favor, ingrese una razón para el bloqueo');
      return;
    }

    const action = this.selectedEntityType === 'user' 
      ? this.blockUser(this.selectedEntity._id, this.blockReason)
      : this.blockArtist(this.selectedEntity._id, this.blockReason);

    this.showBlockDialog = false;
  }

  confirmDelete() {
    if (this.selectedEntityType === 'user') {
      this.adminService.deleteUser(this.selectedEntity._id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user._id !== this.selectedEntity._id);
          this.showDeleteDialog = false;
          alert('Usuario eliminado con éxito');
          this.refreshAllData();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Error al eliminar el usuario');
        }
      });
    } else {
      this.adminService.deleteArtist(this.selectedEntity._id).subscribe({
        next: () => {
          this.artists = this.artists.filter(artist => artist._id !== this.selectedEntity._id);
          this.showDeleteDialog = false;
          alert('Artista eliminado con éxito');
          this.refreshAllData();
        },
        error: (error) => {
          console.error('Error deleting artist:', error);
          alert('Error al eliminar el artista');
        }
      });
    }
  }

  blockUser(userId: string, reason: string) {
    this.adminService.blockUser(userId, reason).subscribe({
      next: () => {
        alert('Usuario bloqueado con éxito');
        this.refreshAllData();
      },
      error: (error) => {
        console.error('Error blocking user:', error);
        alert('Error al bloquear el usuario');
      }
    });
  }

  unblockUser(userId: string) {
    this.adminService.unblockUser(userId).subscribe({
      next: () => {
        alert('Usuario desbloqueado con éxito');
        this.refreshAllData();
      },
      error: (error) => {
        console.error('Error unblocking user:', error);
        alert('Error al desbloquear el usuario');
      }
    });
  }

  blockArtist(artistId: string, reason: string) {
    this.adminService.blockArtist(artistId, reason).subscribe({
      next: () => {
        alert('Artista bloqueado con éxito');
        this.refreshAllData();
      },
      error: (error) => {
        console.error('Error blocking artist:', error);
        alert('Error al bloquear el artista');
      }
    });
  }

  unblockArtist(artistId: string) {
    this.adminService.unblockArtist(artistId).subscribe({
      next: () => {
        alert('Artista desbloqueado con éxito');
        this.refreshAllData();
      },
      error: (error) => {
        console.error('Error unblocking artist:', error);
        alert('Error al desbloquear el artista');
      }
    });
  }
 
  verPerfil(entity: any) {
    const id = entity._id || entity.id;
    
    if (this.activeTab === 'artista') {
      this.router.navigate(['/artista-view'], { 
        queryParams: { id, isAdmin: true }
      });
    } else {
      this.router.navigate(['/usuario-view'], { 
        queryParams: { id, isAdmin: true }
      });
    }
  }
}