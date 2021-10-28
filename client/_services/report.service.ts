import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

var usertoken: any;
if (localStorage.length > 0) {
  // usertoken = JSON.parse(localStorage.getItem('token'));
  usertoken = localStorage.getItem('token');
  //console.log(usertoken);
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' +  usertoken
  })
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
 reportUrl = "http://localhost:56138/Report/SetValues";

constructor(private http: HttpClient) { }

loadReport() {
  var obj = {
    ReportName: "CCSReport"
  } 
  console.log(obj);
  return this.http.post(this.reportUrl, obj, httpOptions );
  // return this.http.get(this.reportUrl).pipe(map(
  //   data => {
    
    
  //       }
  //      )
  //     );

}

}
