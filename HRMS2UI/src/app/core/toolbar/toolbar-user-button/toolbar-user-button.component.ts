import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef ,AfterViewInit} from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../../../settings/auth/change-password/change-password.component';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../../app.animation';

import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-toolbar-user-button',
  templateUrl: './toolbar-user-button.component.html',
  styleUrls: ['./toolbar-user-button.component.scss']
})
export class ToolbarUserButtonComponent implements OnInit, AfterViewInit {

  isOpen: boolean;
  name : string;
  constructor(
    private router: Router, 
    private service: DataService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    let user = localStorage.getItem('user');
    let userObj = JSON.parse(user);
    this.name = userObj.name;
  }

  ngAfterViewInit(

    ) {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    localStorage.removeItem('permissions');
    this.router.navigate(['/auth/login']);
  }
  changePassword()
  {
    this.dialog.open(ChangePasswordComponent).afterClosed().subscribe((result: any) => {
      if (result) {
        this.service.update('/user/changePassword',result).subscribe(
        newFee => {
          },
          (error: AppError) => {
            if (error instanceof BadInput) {
               //this.form.setErrors(error.originalError);
            }
            else throw error;
          });
      }
    });
  }
  onClickOutside() {
    this.isOpen = false;
  }
}
