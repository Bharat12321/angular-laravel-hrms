import { Http , RequestOptions , Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt'; 
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';

import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

@Injectable()
export class AuthService {
  currentUser: any; 

  constructor(private http: Http, private toastr: ToastrService) {
    let token = localStorage.getItem('token');
    if (token) {
      let jwt = new JwtHelper();
      this.currentUser = jwt.decodeToken(token);
    }
  }

  login(credentials) { 
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let options = new RequestOptions({ headers: headers });

     this.toastr.info( 'Login user information' , 'Login');
    return this.http.post(environment.apiEndPoint+'/auth/login', JSON.stringify(credentials), options)
    .map(response => {
      let result = response.json();
      
      if (result && result.token) {
        localStorage.setItem('token', result.token);
        if(result.user.taggable_type == ''){
          localStorage.setItem('user_type','Admin');
        }else{
          localStorage.setItem('user_type',result.user.taggable_type);
        }
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('permissions', result.permissions);

        let jwt = new JwtHelper();
        this.currentUser = jwt.decodeToken(localStorage.getItem('token'));

       this.toastr.success( 'User Login Successfully' , 'Login');
        return result.user; 
      }
      else {
        this.toastr.error( 'Invaild User Credentails. Try Again' , 'Login');
        return false; 
      }
    })
    .catch(this.handleError);
  }

  logout() { 
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    localStorage.removeItem('permissions');
    this.currentUser = null;
  }

  isLoggedIn() { 
    return tokenNotExpired('token');
  }

  handleError(error: Response | any) {
    if (error.status === 403){
      return Observable.throw(new BadInput(error.json()));
    }
    if (error.status === 400){
      return Observable.throw(new BadInput(error.json()));
    }
  
    if (error.status === 404){
      return Observable.throw(new NotFoundError(error.json()));
    }
    
    return Observable.throw(new AppError(error.json()));
  }
}

