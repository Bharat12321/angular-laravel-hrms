import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Category } from './category.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-category-create-update',
  templateUrl: './category-create-update.component.html',
  styleUrls: ['./category-create-update.component.scss']
})
export class CategoryCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<CategoryCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Category; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [CategoryCreateUpdateComponent.id++],
      name: [this.defaults.name || '',],
      class: [ '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createCategory();
    } else if (this.mode === 'update') {
      this.updateCategory();
    }
  }

  createCategory() {
    const category = this.form.value;
    this.dialogRef.close(category);
  }

  updateCategory() {
    const category = this.form.value;
    category.id = this.defaults.id;

    this.dialogRef.close(category);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
