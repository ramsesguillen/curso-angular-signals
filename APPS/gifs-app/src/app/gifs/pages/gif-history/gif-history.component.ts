import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { GifServiceService } from '../../services/GifService.service';
import { ListComponent } from "../../components/gif/list/list.component";
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-gif-history',
  imports: [ListComponent],
  templateUrl: './gif-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GifHistoryComponent {
  gifService = inject(GifServiceService);

  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(params => params['query'])
    )
  )

  gifsByKey = computed(() => {
    return this.gifService.getHistoryGifs(this.query());
  });
}
