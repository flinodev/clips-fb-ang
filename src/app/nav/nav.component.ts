import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  constructor(
    private modal: ModalService,
    public auth: AuthService,
    private authFs: AngularFireAuth
  ) {}

  openModal(event: Event) {
    event.preventDefault();
    this.modal.toggleVisible('auth');
  }
  async logout(event: Event) {
    event.preventDefault();
    await this.authFs.signOut();
  }
}
