import { Gender, Product, ProductResponse } from '@products/interfaces/product.interface';
import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { User } from '@auth/interfaces/user.interface';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;
    gender?: string;
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {
    private http = inject(HttpClient);

    private productsCache = new Map<string, ProductResponse>();
    private productCache = new Map<string, Product>();

    getProducts(options: Options): Observable<ProductResponse> {
        const { limit = 9, offset = 0, gender = '' } = options;
        const key = `${limit}-${offset}-${gender}`;

        if (this.productsCache.has(key)) {
            return of(this.productsCache.get(key)!);
        }

        return this.http.get<ProductResponse>(`${baseUrl}/products`, {
            params: {
                limit,
                offset,
                gender
            }
        }).pipe(
            tap(console.log),
            tap((resp) => this.productsCache.set(key, resp))
        )
    }

    getProduct(idSlug: string): Observable<Product> {
        if (this.productCache.has(idSlug)) {
            return of(this.productCache.get(idSlug)!);
        }
        return this.http.get<ProductResponse>(`${baseUrl}/products/${idSlug}`).pipe(
            tap(console.log),
            tap((resp) => this.productCache.set(idSlug, resp))
        )
    }
    getProductById(id: string): Observable<Product> {

        if (id === 'new') {
            return of(emptyProduct);
        }
        if (this.productCache.has(id)) {
            return of(this.productCache.get(id)!);
        }
        return this.http.get<ProductResponse>(`${baseUrl}/products/${id}`).pipe(
            tap(console.log),
            tap((resp) => this.productCache.set(id, resp))
        )
    }

    createProduct(productLike: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(`${baseUrl}/products`, productLike)
        .pipe(
            tap(product => this.updateProductCache(product))
        )
    }
    updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
        return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
        .pipe(
            tap(product => this.updateProductCache(product))
        )
    }

    updateProductCache(product: Product) {
        const productId = product.id;

        this.productCache.set(productId, product);

        this.productsCache.forEach(productResponse => {
            productResponse.products = productResponse.products.map(currentProduct => {
                return currentProduct.id === productId ? product : currentProduct;
            })
        })
    }
}
