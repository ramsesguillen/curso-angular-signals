import { Injectable, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class PaginationService {
    private activatedRoute = inject(ActivatedRoute);

    currentPage = toSignal(
        this.activatedRoute.queryParamMap.pipe(
            map( params => (params.get('page') ? +params.get('page')! : 1)),
            map((page) => (isNaN(page) ? 1 : page))
        ),
        {
            initialValue: 1,
        }
    );
}
