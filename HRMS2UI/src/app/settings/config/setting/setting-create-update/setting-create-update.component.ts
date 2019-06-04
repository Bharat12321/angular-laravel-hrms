import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../reducers/index';
import { Setting } from './setting.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../../core/data/status';

@Component({
  selector: 'vr-setting-create-update',
  templateUrl: './setting-create-update.component.html',
  styleUrls: ['./setting-create-update.component.scss']
})
export class SettingCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<SettingCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Setting; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [SettingCreateUpdateComponent.id++],
      name: [this.defaults.name || '',],
      description: [this.defaults.description || ''],
      sort: [this.defaults.sort || '1'],
      status: [this.defaults.status || '1'],
      config_item_id: [localStorage.getItem('configItemId')]
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createSetting();
    } else if (this.mode === 'update') {
      this.updateSetting();
    }
  }

  createSetting() {
    const setting = this.form.value;
    this.dialogRef.close(setting);
  }

  updateSetting() {
    const setting = this.form.value;
    setting.id = this.defaults.id;

    this.dialogRef.close(setting);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
