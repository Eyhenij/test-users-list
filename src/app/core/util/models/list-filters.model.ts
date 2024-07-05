export interface IListFilters<T> {
    search: string;
    sort: string;
    sortDirection: 'asc' | 'desc';
}
