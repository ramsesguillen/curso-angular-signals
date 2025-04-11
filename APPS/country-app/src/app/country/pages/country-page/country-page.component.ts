import { Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { InformationPageComponent } from "./information-page/information-page.component";
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-country-page',
  imports: [InformationPageComponent],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  countryService = inject(CountryService);
  location = inject(Location);


  countryResource = rxResource({
    request: () => ({ code: this.countryCode }),
    loader: ({request}) => {
        return this.countryService.searchByAlphaCode(request.code);
    },
  });


  goBack() {
    this.location.back()
  }

}
