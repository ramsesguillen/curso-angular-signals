import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of, tap, throwError } from 'rxjs';

import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { HttpClient } from '@angular/common/http';
import type { RESTCountry } from '../interfaces/rest-countries.interfaces';

const API_URL = 'https://restcountries.com/v3.1'

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();


  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
    .pipe(
      map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),
      tap(countries => this.queryCacheCapital.set(query, countries)),
        catchError(error => {
          console.log(error);

          return throwError(() => new Error(`No se pudo obtener países con ese query ${query}`));
        })
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(
      map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),
      tap(countries => this.queryCacheCountry.set(query, countries)),
        catchError(error => {
          console.log(error);

          return throwError(() => new Error(`No se pudo obtener países con ese query ${query}`));
        })
      );
  }
  searchByAlphaCode(code: string) {

    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`)
    .pipe(
      map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),
      map( countries => countries.at(0)),
        catchError(error => {
          console.log(error);

          return throwError(() => new Error(`No se pudo obtener países con ese code ${code}`));
        })
      );
  }

  searchByRegion(region: string): Observable<Country[]> {
    region = region.toLowerCase();

    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`)
    .pipe(
      map((restCountries) => CountryMapper.mapRestCountryArrayToCountryArray(restCountries)),
      tap(countries => this.queryCacheRegion.set(region, countries)),
        catchError(error => {
          console.log(error);

          return throwError(() => new Error(`No se pudo obtener países con ese region ${region}`));
        })
      );
  }
}
