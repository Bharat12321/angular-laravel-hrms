import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../reducers/index';
import { User } from './user.model';

import { BadInput } from '../../../../common/bad-input';
import { NotFoundError } from '../../../../common/not-found-error';
import { AppError } from '../../../../common/app-error';


import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'vr-user-create-update',
  templateUrl: './user-create-update.component.html',
  styleUrls: ['./user-create-update.component.scss']
})
export class UserCreateUpdateComponent implements OnInit {

  static id = 100;

  roles : Object[];
  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<UserCreateUpdateComponent>,
              private fb: FormBuilder,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
      this.service.getAll('/user/createupdate').subscribe(data => {
      this.roles = data.roles;
    });
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as User;
    }

    this.form = this.fb.group({
      id: [UserCreateUpdateComponent.id++],
      name: [this.defaults.name || '',],
      username: [this.defaults.username || ''],
      password: [''],
      role_id: [this.defaults.role_id || null ],
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createUser();
    } else if (this.mode === 'update') {
      this.updateUser();
    }
  }

  createUser() {
    const user = this.form.value;
    this.dialogRef.close(user);
  }

  updateUser() {
    const user = this.form.value;
    user.id = this.defaults.id;

    this.dialogRef.close(user);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
