import { ActivatedRoute, Router } from '@angular/router';
import { Component, Signal, inject, linkedSignal, resource, signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';

import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';
import { ListComponent } from "../../components/list/list.component";
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { rxResource } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, ListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';


  query = signal(this.queryParam);

  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({request}) => {
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-capital'], {
        queryParams: {
          query: this.query()
        }
      });

      return this.countryService.searchByCapital(request.query)
    }
  });
  // countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async ({request}) => {
  //     if (!request.query) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   }
  // });

  // isLoading = signal(false);
  // isError = signal<string|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {
  //   if (this.isLoading()) return undefined;

  //   this.isLoading.set(true);
  //   this.isError.set(null);
  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //     }
  //   });
  // }
}
