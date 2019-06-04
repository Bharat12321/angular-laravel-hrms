import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vr-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<ChangePasswordComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

    this.mode = 'create';
    this.form = this.fb.group({
      old_password: ['',],
      new_password: ['',],
      new_password_confirmation: ['',],
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createChangePassword();
    } else if (this.mode === 'update') {
      this.updateChangePassword();
    }
  }

  createChangePassword() {
    const setting = this.form.value;
    this.dialogRef.close(setting);
  }

  updateChangePassword() {
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
