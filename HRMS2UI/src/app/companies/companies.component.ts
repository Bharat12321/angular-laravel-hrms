import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ROUTE_TRANSITION } from '../app.animation';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute ,Router } from '@angular/router';

import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';


import { DataService } from '../services/data.service';

import { InvoiceComponent } from './invoice/invoice.component';
  import { environment } from '../../environments/environment';

@Component({
  selector: 'vr-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class CompaniesComponent implements OnInit {

  company_id:number;
  type:number;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  login: boolean;
  image: string;
  name: string;
  company: any;
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
            this.company_id = params['id'];
            localStorage.setItem('companyId', this.company_id.toString());
          }
      );
      this.userType = localStorage.getItem('user_type');
      this.service.get('/company/'+this.company_id).subscribe(data => {  
        this.company = data;
        this.login = true;
        this.type = data.type;
        switch (this.type) {
          case 1:
            this.name = 'Lead';
            break;
          case 2:
            this.name = 'Client';
            break;
          case 3:
            this.name = 'Supplier';
            break;
          default:
            this.name = 'Client';
            break;
        }
        this.image = "assets/img/demo/avatars/noavatar.png";
        this.isLoadingResults = false;
        this.ref.detectChanges();
    });
  }

  generateInvoice() {
    this.isLoadingResults = true;
    this.service.get('/company/invoice/'+localStorage.getItem('companyId')).subscribe(
    newCompany => {
      if(newCompany){

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
          formData.append('taggable_type', 'Company');
          formData.append('taggable_id', localStorage.getItem('companyId'));
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
    this.service.update('/company/user/'+localStorage.getItem('companyId'),{status:this.login}).subscribe(
    newCompany => {
    },
    (error: AppError) => {
      //this.toastr.error( 'Invoice Not Generated');
    });
  }

  convertToCompany() {
    this.type = 2;
    this.service.update('/company/updateType/'+localStorage.getItem('companyId'),{type:this.type}).subscribe(
    newCompany => {
    },
    (error: AppError) => {
      //this.toastr.error( 'Invoice Not Generated');
    });
  }
}
