import { Service } from '@angular/core';
import { Observable, defer, delay } from 'rxjs';

/**
 * Temporary HTTP adapter used while the API is not available. Repositories keep
 * their endpoint and request shape, so they can later switch to HttpClient.
 */
@Service()
export class MockHttpClient {
  get<T>(url: string, resolve: () => T): Observable<T> {
    return this.request('GET', url, undefined, resolve);
  }

  post<TRequest, TResponse>(
    url: string,
    body: TRequest,
    resolve: (body: TRequest) => TResponse,
  ): Observable<TResponse> {
    return this.request('POST', url, body, resolve);
  }

  private request<TBody, TResponse>(
    _method: 'GET' | 'POST',
    _url: string,
    body: TBody,
    resolve: (body: TBody) => TResponse,
  ): Observable<TResponse> {
    return defer(() => Promise.resolve(resolve(body))).pipe(delay(280));
  }
}
