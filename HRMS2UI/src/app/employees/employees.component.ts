import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ROUTE_TRANSITION } from '../app.animation';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute ,Router } from '@angular/router';

import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';


import { DataService } from '../services/data.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'vr-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class EmployeesComponent implements OnInit {

  employee_id:number;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  login: boolean;
  image: string;
  employee: any;
  userType: string;

  width = {
    single: (100) + '%',
    double: (100 / 2) + '%',
    triple: (100 / 3) + '%',
  };

  constructor(
    private service: DataService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private route:ActivatedRoute,
    private toastr: ToastrService
    ) { }

   ngOnInit() {
      this.isLoadingResults = true;
      this.route.params.subscribe( params =>
          {
            this.employee_id = params['id'];
            localStorage.setItem('employeeId', this.employee_id.toString());
          }
      );
      this.userType = localStorage.getItem('user_type');
      this.service.get('/employee/'+this.employee_id).subscribe(data => {  
        this.employee = data;
        let file = this.employee.profiles[0];
        this.login = (this.employee.users[0].status === 1)?true:false;
        if(file !== undefined){
          this.image = environment.imageEndPoint + file.location;
        }else{
          this.image = "assets/img/demo/avatars/noavatar.png";
        }
        this.isLoadingResults = false;
        this.ref.detectChanges();
    });
  }

  generateInvoice() {
    this.isLoadingResults = true;
    this.service.get('/employee/invoice/'+localStorage.getItem('employeeId')).subscribe(
    newStudent => {
      if(newStudent){

      this.toastr.success( 'Invoice Generated Successfully');
    }else{

      this.toastr.success( 'Nothing to generate Invoice');
    }
      this.isLoadingResults = false;
        this.ref.detectChanges();
    },
    (error: AppError) => {
      
      this.toastr.error( 'Invoice Not Generated');
    });
  }
  fileChange(event) {
      let fileList: FileList = event.target.files;
      if(fileList.length > 0) {
          let file: File = fileList[0];
          let formData:FormData = new FormData();
          formData.append('file', file, file.name);
          formData.append('taggable_type', 'Employee');
          formData.append('taggable_id', localStorage.getItem('employeeId'));
          this.service.file('/profile',formData).subscribe(
          profile => {
            if(profile){
              this.image = environment.imageEndPoint + profile.location;
            this.isLoadingResults = false;
              this.ref.detectChanges();
            }
          },
          (error: AppError) => {
          });
      }
  }
  enableDisbaleLogin() {
    this.login = !this.login;
    this.service.update('/employee/user/'+localStorage.getItem('employeeId'),{status:this.login}).subscribe(
    newStudent => {
    },
    (error: AppError) => {
      //this.toastr.error( 'Invoice Not Generated');
    });
  }
}
