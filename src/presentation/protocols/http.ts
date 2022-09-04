export interface HttpRequest<T> {
  body: T
}

export interface HttpResponse<T> {
  statusCode: number
  body?: T
}

export interface Controller<T, R> {
  handle: (httpRequest: HttpRequest<T>) => Promise<HttpResponse<R>>
}
