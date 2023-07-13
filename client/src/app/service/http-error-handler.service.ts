import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
export type HandleError = <T>(
  result?: T
) => (error: HttpErrorResponse) => Observable<T>;
@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {
  constructor(private toast: ToastrService) {}
  createHandleError =
    (customMessage = '', customMessageTitle = 'Error') =>
    <T>(result = {} as T) =>
      this.handleError(customMessageTitle, customMessage, result);
  handleError<T>(
    customMessageTitle: string,
    customMessage: string,
    result = {} as T
  ) {
    return (error: HttpErrorResponse): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      const message =
        customMessage || error.error instanceof ErrorEvent
          ? error.error.message
          : `server returned code ${error.status} with body "${error.error}"`;
      this.toast.error(message, customMessageTitle);
      // Let the app keep running by returning a safe result.
      return of(result);
    };
  }
}
