import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = '';
  constructor(public modal: ModalService, public elementRef: ElementRef) {}

  ngOnInit(): void {
    document.body.appendChild(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.elementRef.nativeElement);
  }

  closeModal() {
    this.modal.toggleVisible(this.modalID);
  }
}
