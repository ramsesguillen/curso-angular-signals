import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';

import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";
import { ProductsService } from '@products/services/Product.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  productIdSlog = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlog}),
    loader: ({ request }) => {
      return this.productService.getProduct(request.idSlug);
    }
  });
}
