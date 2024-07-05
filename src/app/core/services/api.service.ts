import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    readonly #http: HttpClient = inject(HttpClient);
    readonly #apiUrl: string = 'api.github.com';

    private get headers(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }

    public get<R, T extends {} = {}>(
        url: string,
        params: T | HttpParams = new HttpParams(),
        headers: HttpHeaders = this.headers
    ): Observable<R> {
        if (!(params instanceof HttpParams)) {
            params = new HttpParams({ fromObject: params });
        }

        return this.#http.get<R>(`${this.#apiUrl}/${url}`, { headers, params });
    }

    public post<R, T extends {}>(
        url: string,
        data: T,
        params: T | HttpParams = new HttpParams(),
        headers: HttpHeaders = this.headers
    ): Observable<R> {
        if (!(params instanceof HttpParams)) {
            params = new HttpParams({ fromObject: params });
        }

        const isFormData: boolean = data instanceof FormData;

        return this.#http.post<R>(`${this.#apiUrl}/${url}`, isFormData ? data : JSON.stringify(data), {
            headers: isFormData ? undefined : headers,
            params,
        });
    }
}
