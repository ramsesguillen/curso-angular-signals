import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import type { Gif } from '../../interfaces/gif.interface';
import { GifServiceService } from '../../services/GifService.service';
import { ListComponent } from "../../components/gif/list/list.component";

@Component({
  selector: 'app-search-page',
  imports: [ListComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchPageComponent {
  gifService = inject(GifServiceService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifService.searchGifs(query).subscribe(response => {

      this.gifs.set(response);
    })
  }
}
