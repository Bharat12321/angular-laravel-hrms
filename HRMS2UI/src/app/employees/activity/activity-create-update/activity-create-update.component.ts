import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Activity } from './activity.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-activity-create-update',
  templateUrl: './activity-create-update.component.html',
  styleUrls: ['./activity-create-update.component.scss']
})
export class ActivityCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  types : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<ActivityCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
      this.service.getAll('/activity/createupdate').subscribe(data => {
      this.types = data.types;
    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Activity; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [ActivityCreateUpdateComponent.id++],
      taggable_type: ['Employee'],
      taggable_id: [localStorage.getItem('employeeId')],
      type_id: [this.defaults.type_id || null,],
      date: [this.defaults.date || '',],
      notification_date: [this.defaults.notification_date || '',],
      remarks: [this.defaults.remarks || ''],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createActivity();
    } else if (this.mode === 'update') {
      this.updateActivity();
    }
  }

  createActivity() {
    const activity = this.form.value;
    this.dialogRef.close(activity);
  }

  updateActivity() {
    const activity = this.form.value;
    activity.id = this.defaults.id;

    this.dialogRef.close(activity);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
