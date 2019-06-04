import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Company } from './company.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-company-create-update',
  templateUrl: './company-create-update.component.html',
  styleUrls: ['./company-create-update.component.scss']
})
export class CompanyCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];
  countries : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<CompanyCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

      this.service.getAll('/company/createupdate').subscribe(data => {
        this.countries = data.countries;
      });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Company; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [CompanyCreateUpdateComponent.id++],
      name: [this.defaults.name || '',],
      code: [this.defaults.code || '',],
      address: [this.defaults.address || '',],
      city: [this.defaults.city || '',],
      pin_code: [this.defaults.pincode || '',],
      country_id: [this.defaults.country_id || 634,],
      person: [this.defaults.person || '',],
      reference: [this.defaults.reference || '',],
      phone: [this.defaults.phone || '',],
      email: [this.defaults.email || '',],
      remarks: [this.defaults.remarks || '',],
      website: [this.defaults.website || '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createCompany();
    } else if (this.mode === 'update') {
      this.updateCompany();
    }
  }

  createCompany() {
    const company = this.form.value;
    this.dialogRef.close(company);
  }

  updateCompany() {
    const company = this.form.value;
    company.id = this.defaults.id;

    this.dialogRef.close(company);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
