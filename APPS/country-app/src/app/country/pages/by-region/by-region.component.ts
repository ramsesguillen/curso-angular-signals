import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';

import { CountryService } from '../../services/country.service';
import { ListComponent } from "../../components/list/list.component";
import type { Region } from '../../interfaces/region.type';
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

function validateQueryParam(queryParam: string) {
  queryParam = queryParam.toLowerCase();

  const validaRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    aurope: 'Europe',
    aceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validaRegions[queryParam] ?? 'Americas';
}

@Component({
  selector: 'app-by-region',
  imports: [ListComponent],
  templateUrl: './by-region.component.html',
})
export class ByRegionComponent {
  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  region = signal<Region | null>(validateQueryParam(this.queryParam));

  countryResource = rxResource({
    request: () => ({ region: this.region() }),
    loader: ({request}) => {
      if (!request.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          query: this.region()
        }
      });

      return this.countryService.searchByRegion(request.region)
    }
  });

}
