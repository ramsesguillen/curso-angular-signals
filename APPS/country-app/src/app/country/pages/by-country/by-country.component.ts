import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';

import { CountryService } from '../../services/country.service';
import { ListComponent } from "../../components/list/list.component";
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-country',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-country.component.html',
})
export class ByCountryComponent {

  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';


  query = signal(this.queryParam);

    countryResource = rxResource({
      request: () => ({ query: this.query() }),
      loader: ({request}) => {
        if (!request.query) return of([]);

        this.router.navigate(['/country/by-country'], {
          queryParams: {
            query: this.query()
          }
        });

        return this.countryService.searchByCountry(request.query)
      }
    });
}
