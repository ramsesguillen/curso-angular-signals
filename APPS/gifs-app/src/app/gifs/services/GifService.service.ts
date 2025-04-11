import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';

import type { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

const GIF_KEY = 'gifs';

function loadFromLocalStorage() {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
}

@Injectable({
  providedIn: 'root'
})
export class GifServiceService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i+=3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

  constructor() {
    this.loadTrendingGifs();
    const subs = of([1, 2, 3, 4]).pipe(map(item => console.log(item)))
    subs.subscribe();
  }


  safeGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return undefined;

    this.trendingGifsLoading.set(true);
    this.http.get<GiphyResponse>(`${environment.gihpyUrl}/gifs/trending`, {
      params: {
        api_key: environment.apiKey,
        limit: 20,
        offset: this.trendingPage() * 20
      }
    }).subscribe((response) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
      this.trendingGifs.update((prev) => [...prev, ...gifs]);
      this.trendingGifsLoading.set(false);
      this.trendingPage.update(prev => prev + 1);
    });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.gihpyUrl}/gifs/search`, {
      params: {
        api_key: environment.apiKey,
        limit: 20,
        q: query
      }
    }).pipe(
      map(({ data }) => data),
      map((item) => {
        console.log(item);
        return GifMapper.mapGiphyItemsToGifArray(item);
      }),
      tap(items => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: items
        }));
      })
    );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
