import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray,  FormControl, } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../reducers/index';
import { Role } from './role.model';

import { BadInput } from '../../../../common/bad-input';
import { NotFoundError } from '../../../../common/not-found-error';
import { AppError } from '../../../../common/app-error';


import { DataService } from '../../../../services/data.service';
import { STATUS_DATA } from '../../../../core/data/status';


@Component({
  selector: 'vr-role-create-update',
  templateUrl: './role-create-update.component.html',
  styleUrls: ['./role-create-update.component.scss']
})
export class RoleCreateUpdateComponent implements OnInit {

  static id = 100;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  permissions: any;
  dataLoaded: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<RoleCreateUpdateComponent>,
              private fb: FormBuilder,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

    if (this.defaults) {
      this.mode = 'update';
      this.service.getAll('/user/role/update/'+this.defaults.id).subscribe(data => {
        this.permissions = data.permissions;
        this.form = this.fb.group({
          id: [RoleCreateUpdateComponent.id++],
          name: [this.defaults.name || '',],
          permissions   : this.fb.array(this.permissions.map(x => x.access)),
        });
        this.dataLoaded = true;
      });
    } else {
      this.defaults = {} as Role;
      this.service.getAll('/user/role/create').subscribe(data => {
        this.permissions = data.permissions;
        this.form = this.fb.group({
          id: [RoleCreateUpdateComponent.id++],
          name: [this.defaults.name || '',],
          permissions   : this.fb.array(this.permissions.map(x => x.access)),
        });
        this.dataLoaded = true;
      });
    }

  }

  save() {

    if (this.mode === 'create') {
      this.createRole();
    } else if (this.mode === 'update') {
      this.updateRole();
    }
  }
convertToValue(key: string) {

  return this.form.value[key].map((x, i) => x && this[key][i]).filter(x => !!x);
}


/*  onChange(event) {
    const permissions = <FormArray>this.form.get('permissions') as FormArray;
    console.log(permissions);
    if(event.checked) {
      permissions.push(new FormControl(event.source.value))
    } else {
      const i = permissions.controls.findIndex(x => x.value === event.source.value);
      permissions.removeAt(i);
    }
  }
*/
  createRole() {
    const role = this.form.value;
    this.dialogRef.close(role);
  }

  updateRole() {
    const role = this.form.value;
    role.id = this.defaults.id;

    this.dialogRef.close(role);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
