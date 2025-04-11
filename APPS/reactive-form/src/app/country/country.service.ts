import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';

import { Country } from './Interfaces/country.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CountryService {
    private http = inject(HttpClient);
    private baseUrl = 'https://restcountries.com/v3.1';

    private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

    get regions(): string[] {
        return [...this._regions];
    }


    getCountriesByRegion(region: string): Observable<Country[]> {
        if (!region) return of([]);

        const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;
        return this.http.get<Country[]>(url);
    }


    getCountryByAlphaCode(alphaCode: string):  Observable<Country> {
        const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
        return this.http.get<Country>(url);
    }

    getCountryNamesByCodeArray(countryCodes: string[]):  Observable<Country[]> {
        if (!countryCodes || countryCodes.length === 0) return of([]);

        const countriesRequests: Observable<Country>[] = [];

        countryCodes.forEach(code => {
            const request = this.getCountryByAlphaCode(code);
            countriesRequests.push(request);
        });

        return combineLatest(countriesRequests);
    }
}
