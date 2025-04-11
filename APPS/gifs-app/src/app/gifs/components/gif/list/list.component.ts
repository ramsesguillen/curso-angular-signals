import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Gif } from 'src/app/gifs/interfaces/gif.interface';
import { ItemComponent } from "../item/item.component";

@Component({
  selector: 'gif-list',
  imports: [ItemComponent],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  gifs = input.required<Gif[]>();

}
