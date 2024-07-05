import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { UsersListStoreService } from './data-access/users-list-store.service';
import { UsersListApiService } from './data-access/users-list-api.service';
import { MatTableModule } from '@angular/material/table';
import { IUser } from '@users-list/util';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: true,
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UsersListStoreService, UsersListApiService],
    imports: [MatTableModule, MatFormField, MatInput, MatIconButton, MatIcon, ReactiveFormsModule, MatLabel]
})
export default class UsersListComponent implements OnInit {
    readonly #store: UsersListStoreService = inject(UsersListStoreService);
    readonly #fb: FormBuilder = inject(FormBuilder);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    readonly displayedColumns: (keyof IUser)[] = ['id', 'name', 'email', 'phone', 'website'];
    readonly dataSource: Signal<IUser[]> = computed(() => {
        return this.#store.entities() ?? [];
    });


    public control: FormControl<string>;

    public ngOnInit(): void {
        this.#initForm();

        if (!this.#store.entities().length) {
            this.#store.getList();
        }
    }

    public trackByFn(index: number, item: any): number {
        return item.id;
    }

    public onUserClick(id: string): void {
        this.#store.getOneById(id);
    }

    public onSearchClear(): void {
        this.control.setValue('');
    }

    #initForm(): void {
        this.control = this.#fb.nonNullable.control<string>('');

        this.control.valueChanges.pipe(
            takeUntilDestroyed(this.#destroyRef)
        ).subscribe((value: string) => {
            this.#store.setFilters({ search: value });
            this.#store.getList();
        });
    }
}
