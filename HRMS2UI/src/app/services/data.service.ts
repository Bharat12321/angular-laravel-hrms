  import { BadInput } from './../common/bad-input';
  import { NotFoundError } from './../common/not-found-error';
  import { AppError } from './../common/app-error';
  import { Http, RequestOptions , Headers } from '@angular/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/operator/catch';
  import 'rxjs/add/operator/map';
  import 'rxjs/add/observable/throw';
  import { environment } from '../../environments/environment';
  import { ToastrService } from 'ngx-toastr';

  @Injectable()
  export class DataService {

    options: object;

    constructor( private http: Http , private toastr: ToastrService ) { 
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+localStorage.getItem('token'));
      this.options = new RequestOptions({ headers: headers });

    }

    getAll(url: string) {
      return this.http.get(environment.apiEndPoint+url,this.options)
        .map(response => response.json())
        .catch((err) => this.handleError(err))
    }

    get(url: string) {
      return this.http.get(environment.apiEndPoint+url,this.options)
        .map(response => response.json())
        .catch((err) => this.handleError(err))
    }

    create(url: string,resource) {
      return this.http.post(environment.apiEndPoint+url, JSON.stringify(resource),this.options)
        .map(response => {
           this.toastr.success( 'Data Saved Successfully');
           return response.json(); 
         })
        .catch((err) => this.handleError(err))
    }

    update(url: string,resource) {
      return this.http.patch(environment.apiEndPoint+url , JSON.stringify(resource),this.options)
        .map(response => {
           this.toastr.success( 'Data Updated Successfully');
           return response.json(); 
         })      
        .catch((err) => this.handleError(err))
    }

    delete(url: string) {
      return this.http.delete(environment.apiEndPoint+url,this.options)
        .map(response => {
           this.toastr.success( 'Data Deleted Successfully');
           return response.json(); 
         })      
        .catch((err) => this.handleError(err))
    }
    file(url: string,formData : any) {
      let headers = new Headers();
      /** In Angular 5, including the header Content-Type can invalidate your request */
      // headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      headers.append('Authorization', 'Bearer '+localStorage.getItem('token'));
      let options = new RequestOptions({ headers: headers });
      return this.http.post(environment.apiEndPoint+url, formData, options)
          .map(response => {
           this.toastr.success( 'File uploaded successfully');
           return response.json(); 
         })      
        .catch((err) => this.handleError(err))
    }

          
    private handleError(error: any) {
      if (error.status === 403){
        this.toastr.error( 'User Login Failed');
        return Observable.throw(new BadInput(error.json()));
      }
      if (error.status === 500){
        this.toastr.error( 'Something went wrong. Please Contact Administrator!');
        return Observable.throw(new BadInput(error.json()));
      }
      if (error.status === 401){
        this.toastr.error( 'Loggedin user identifiation not found. Please login again.');
        return Observable.throw(new BadInput(error.json()));
      }
      if (error.status === 422){
        this.toastr.error( 'You entered data wrongly. Please try again.');
        return Observable.throw(new BadInput(error.json()));
      }
    
      if (error.status === 404){
        this.toastr.error( 'Not found');
        return Observable.throw(new NotFoundError(error.json()));
      }
      
      //this.toastr.error( 'Something went wrong. Please Contact Administrator!');
      return Observable.throw(new AppError(error.json()));
    }
  }
