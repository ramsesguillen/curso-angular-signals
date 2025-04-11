import { Component, computed, input } from '@angular/core';

import { Country } from '../../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'country-information-page',
  imports: [DecimalPipe],
  templateUrl: './information-page.component.html',
})
export class InformationPageComponent {
  country = input.required<Country>();

  currentYear = computed(() => {
    return new Date().getFullYear()
  });
}
