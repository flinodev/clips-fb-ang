import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  constructor(private modal: ModalService) {}

  openModal(event: Event) {
    event.preventDefault();
    this.modal.toggleVisible('auth');
  }
}
