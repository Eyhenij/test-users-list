import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path: 'list',
        loadComponent: () => import('./users-list.component'),
        children: [
            {
                path: ':id',
                loadComponent: () => import('./components/user-details/user-details.component'),
            }
        ]
    },
];

export default routes;
