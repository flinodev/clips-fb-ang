import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClips from '../../models/clips';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip!: IClips | null;
  @Output() update = new EventEmitter();

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating clip.';
  inSubmission = false;

  clipID = new FormControl('', { nonNullable: true });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  editForm = new FormGroup({
    clipID: this.clipID,
    title: this.title,
  });
  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    console.log(this.activeClip);
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  ngOnChanges() {
    if (!this.activeClip) return;
    this.showAlert = false;
    this.inSubmission = false;
    this.clipID.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    if (!this.activeClip) return;
    this.showAlert = true;
    this.inSubmission = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';
    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      this.showAlert = true;
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong! Try again later.';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.showAlert = true;
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success update clip.';
  }
}
