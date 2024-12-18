import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq: HttpRequest<any> = req.clone({ url: `${window.location.protocol}//${window.location.hostname}:8000/api/${req.url}` });
  return next(apiReq);
};
