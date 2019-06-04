import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Organization } from './organization.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-organization-create-update',
  templateUrl: './organization-create-update.component.html',
  styleUrls: ['./organization-create-update.component.scss']
})
export class OrganizationCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  countries : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<OrganizationCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
      this.service.getAll('/organization_unit/createupdate').subscribe(data => {
      this.countries = data.countries;
    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Organization; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [OrganizationCreateUpdateComponent.id++],
      code: [this.defaults.code || '',],
      name: [this.defaults.name || '',],
      company_name: [this.defaults.company_name || '',],
      country_id: [this.defaults.country_id || 634,],
      city: [this.defaults.city || ''],
      address: [this.defaults.address || ''],
      pin_code: [this.defaults.pin_code || ''],
      remarks: [this.defaults.remarks || ''],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createOrganization();
    } else if (this.mode === 'update') {
      this.updateOrganization();
    }
  }

  createOrganization() {
    const organization = this.form.value;
    this.dialogRef.close(organization);
  }

  updateOrganization() {
    const organization = this.form.value;
    organization.id = this.defaults.id;

    this.dialogRef.close(organization);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
