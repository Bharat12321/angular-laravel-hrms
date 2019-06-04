import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Due } from './due.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-due-create-update',
  templateUrl: './due-create-update.component.html',
  styleUrls: ['./due-create-update.component.scss']
})
export class DueCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  organizations : Object[];
  types : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<DueCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
      this.service.getAll('/due/createupdate').subscribe(data => {
      this.organizations = data.organizations;
      this.types = data.types;
    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Due; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [DueCreateUpdateComponent.id++],
      code: [this.defaults.code || '',],
      first_name: [this.defaults.first_name || '',],
      middle_name: [this.defaults.middle_name || '',],
      last_name: [this.defaults.last_name || '',],
      //country_id: [this.defaults.country_id || '',],
      //category_id: [this.defaults.category_id || '',],
      //course_id: [this.defaults.course_id || '',],
      //batch_id: [this.defaults.batch_id || '',],
      gender: [this.defaults.gender || '',],
      //dob: [this.defaults.dob || '',],
      email_id: [this.defaults.email_id || '',],
      blood_group: [this.defaults.blood_group || '',],
      birth_place: [this.defaults.birth_place || '',],
      religion: [this.defaults.religion || '',],
      //admission_date: [this.defaults.admission_date || '',],
      languages: [this.defaults.languages || '',],
      mobile_no: [this.defaults.mobile_no || '',],
      passport_no: [this.defaults.passport_no || '',],
      height: [this.defaults.height || '',],
      weight: [this.defaults.weight || '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createDue();
    } else if (this.mode === 'update') {
      this.updateDue();
    }
  }

  createDue() {
    const due = this.form.value;
    this.dialogRef.close(due);
  }

  updateDue() {
    const due = this.form.value;
    due.id = this.defaults.id;

    this.dialogRef.close(due);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
