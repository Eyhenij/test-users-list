import { inject, Injectable } from '@angular/core';
import { ApiService, IListResponse } from '@core';
import { Observable } from 'rxjs';
import { IUser } from '@users-list/util';

@Injectable()
export class UsersListApiService {
    readonly #apiService: ApiService = inject(ApiService);

    public getList(searchTerm: string): Observable<IListResponse<IUser>> {
        return this.#apiService.get<IListResponse<IUser>>(`search/users`, searchTerm ? { q: searchTerm } : {});
    }

    public getOneById(id: string): Observable<IUser> {
        return this.#apiService.get<IUser>(`users/${id}`);
    }
}
