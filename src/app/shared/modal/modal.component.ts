import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  @Input() modalID = '';
  constructor(public modal: ModalService, public elementRef: ElementRef) {}
  ngOnInit(): void {
    document.body.appendChild(this.elementRef.nativeElement);
  }

  closeModal() {
    this.modal.toggleVisible(this.modalID);
  }
}
