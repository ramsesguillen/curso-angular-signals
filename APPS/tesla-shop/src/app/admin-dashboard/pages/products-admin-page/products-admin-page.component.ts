import { Component, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { PaginationService } from 'src/shared/components/pagination/pagination.service';
import { Product } from '@products/interfaces/product.interface';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/Product.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  router = inject(Router);

  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      perPage: this.productsPerPage()
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9,
        limit: request.perPage
      });
    }
  });

  refirectEffect = effect(() => {
    if (this.productsResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });

  onChangePerPage(event: Event ) {
    const selectElement = event.target as HTMLSelectElement;
    this.productsPerPage.set(+selectElement.value)
  }
}
