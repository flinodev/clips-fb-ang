import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import IClips from '../../models/clips';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClips[] = [];
  activeClip: IClips | null = null;
  sort$: BehaviorSubject<string>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });
    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    // this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal(event: Event, clip: IClips) {
    event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleVisible('editClip');
  }

  update(event: IClips) {
    this.clips.forEach((clip, index) => {
      if (clip.docID === event.docID) {
        this.clips[index].title = event.title;
      }
    });
  }

  delete(event: Event, clipToDelete: IClips) {
    event.preventDefault();
    this.clipService.deleteClip(clipToDelete);
    this.clips.forEach((clip, index) => {
      if (clip.docID === clipToDelete.docID) {
        this.clips.splice(index, 1);
      }
    });
  }
}
