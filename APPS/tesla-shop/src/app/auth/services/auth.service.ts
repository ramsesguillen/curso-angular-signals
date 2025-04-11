import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { HttpClient } from '@angular/common/http';
import { User } from '@auth/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseURL = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User|null>(null);
    private _token = signal<string|null>(localStorage.getItem('token'));
    private http = inject(HttpClient);


    checkStatusResource = rxResource({
        loader: () => this.checkStatus()
    });

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';
        if (this._user()) {
            return 'authenticated';
        }

        return 'not-authenticated';
    });

    user = computed(() => this._user());
    token = computed(() => this._token());
    isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);


    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseURL}/auth/login`, {
            email,
            password
        }).pipe(
            map((resp) =>  this.handleAuthSuccess(resp)),
            catchError((error: any) => {
                return this.handleAuthError(error);
            })
        )
    }
    register(email: string, password: string, fullName: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseURL}/auth/register`, {
            email,
            password,
            fullName
        }).pipe(
            map((resp) =>  this.handleAuthSuccess(resp)),
            catchError((error: any) => {
                return this.handleAuthError(error);
            })
        )
    }

    checkStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return of(false);
        }
        return this.http.get<AuthResponse>(`${baseURL}/auth/check-status`).pipe(
            map((resp) =>  this.handleAuthSuccess(resp)),
            catchError((error: any) => {
                return this.handleAuthError(error);
            })
        );
    }

    logout() {
        this._authStatus.set('not-authenticated');
        this._user.set(null);
        this._token.set(null);

        localStorage.removeItem('token')
    }

    private handleAuthSuccess(resp: AuthResponse) {
        this._authStatus.set('authenticated');
        this._user.set(resp.user);
        this._token.set(resp.token);

        localStorage.setItem('token', resp.token);

        return true;
    }

    private handleAuthError(error: any) {
        this.logout();
        return of(false);
    }

}
