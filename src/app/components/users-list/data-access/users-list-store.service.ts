import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IListFilters, IListResponse, RequestStatus, RequestStatusEnum } from '@core';
import { catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { IUser } from '@users-list/util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsersListApiService } from './users-list-api.service';

const defaultFilters: IListFilters<IUser> = {
    search: '',
    sort: 'name',
    sortDirection: 'asc'
};

@Injectable()
export class UsersListStoreService {
    readonly #apiService: UsersListApiService = inject(UsersListApiService);


    readonly #entities: WritableSignal<IUser[]> = signal<IUser[]>([]);
    public readonly entities: Signal<IUser[]> = this.#entities.asReadonly();

    readonly #activeEntity: WritableSignal<IUser | null> = signal<IUser | null>(null);
    public readonly activeEntity: Signal<IUser | null> = this.#activeEntity.asReadonly();

    readonly #filters: WritableSignal<IListFilters<IUser>> = signal<IListFilters<IUser>>(defaultFilters);
    public readonly filters: Signal<IListFilters<IUser>> = this.#filters.asReadonly();

    readonly #requestStatus: WritableSignal<RequestStatus> = signal<RequestStatus>(RequestStatusEnum.INITIAL);
    public readonly requestStatus: Signal<RequestStatus> = this.#requestStatus.asReadonly();

    readonly #getListSource: Subject<void> = new Subject<void>();
    readonly #getOneByIdSource: Subject<string> = new Subject<string>();

    constructor() {
        this.#getListSource.asObservable().pipe(
            tap(() => this.#requestStatus.set(RequestStatusEnum.PENDING)),
            switchMap(() => this.#apiService.getList(this.#filters().search)),
            catchError(() => {
                this.#requestStatus.set(RequestStatusEnum.ERROR);
                return EMPTY;
            }),
            takeUntilDestroyed()
        ).subscribe((res: IListResponse<IUser>) => {
            this.#entities.set(res.data);
            this.#requestStatus.set(RequestStatusEnum.SUCCESS);
        });

        this.#getOneByIdSource.asObservable().pipe(
            tap(() => this.#requestStatus.set(RequestStatusEnum.PENDING)),
            switchMap((id: string) => this.#apiService.getOneById(id)),
            catchError(() => {
                this.#requestStatus.set(RequestStatusEnum.ERROR);
                return EMPTY;
            }),
            takeUntilDestroyed()
        ).subscribe((user: IUser) => {
            this.#activeEntity.set(user);
        });
    }

    public getList(): void {
        this.#getListSource.next();
    }

    public getOneById(id: string): void {
        this.#getOneByIdSource.next(id);
    }

    public setFilters(filters: Partial<IListFilters<IUser>>): void {
        this.#filters.set({ ...this.#filters(), ...filters });
    }
}
