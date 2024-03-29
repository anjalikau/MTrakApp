import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationError, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { AccountService } from '_services/account.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,private toastr: ToastrService , private accountServices: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      
      catchError(error => {
        console.log(request);
        if(error) {
          console.log(error);
          switch (error.status) {
            case 400:
              if(error.error.errors) {
                const modelStatusErrors = [];
                console.log(error);
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modelStatusErrors.push(error.error.errors[key]);                    
                  }
                }
                throw modelStatusErrors.flat();
              }
              else {
                this.toastr.error(error.error);
                //this.toastr.error(error.statusText,error.status);
              }
              break;
            case 401:  
              this.toastr.error(error.error);
              if(!this.accountServices.loggedIn()) {
                this.accountServices.logout();
                this.accountServices.decodedToken = null;
                this.router.navigateByUrl('/');
              }
             
              //this.toastr.error(error.statusText,error.status);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras:NavigationExtras = {state: {error: error.error}}
              //console.log(navigationExtras);
              this.router.navigateByUrl('/server-error',navigationExtras);
              break;
            default:
              this.toastr.error("Somthing unexpected went wrong");
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
