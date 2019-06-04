import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Packages } from './package.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-package-create-update',
  templateUrl: './item-package-update.component.html',
  styleUrls: ['./item-package-update.component.scss']
})
export class PackageCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];
  package_Category : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<PackageCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

 this.service.getAll('/items').subscribe(data => {
      this.package_Category = data.package_Category;
    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Packages; 
    }   
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [PackageCreateUpdateComponent.id++],
      name: [this.defaults.name || '',],
      description: [this.defaults.description || '',],
      package_category: [this.defaults.package_category || null],
      price: [this.defaults.price || null],
      sessions: [this.defaults.sessions ||null],
      status: [this.defaults.status || '0']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createItem();
    } else if (this.mode === 'update') {
      this.updateItem();
    }
  }

  createItem() {
    const item = this.form.value;
    this.dialogRef.close(item);
  }

  updateItem() {
    const item = this.form.value;
    item.id = this.defaults.id;

    this.dialogRef.close(item);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
