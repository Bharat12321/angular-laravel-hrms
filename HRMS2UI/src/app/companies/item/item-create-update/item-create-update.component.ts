import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Item } from './item.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-item-create-update',
  templateUrl: './item-create-update.component.html',
  styleUrls: ['./item-create-update.component.scss']
})
export class ItemCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];
  item_Category : Object[];
  item_manufcaturer:Object[];
  item_shelf:Object[];
  item_row:Object[];
  item_col:Object[];
  item_uom:Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<ItemCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

 this.service.getAll('/items').subscribe(data => {
      this.item_Category = data.item_Category;
      this.item_manufcaturer = data.item_manufcaturer;
      this.item_shelf = data.item_shelf;
      this.item_row = data.item_row;
      this.item_col = data.item_col;
       this.item_uom = data.item_uom;

    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Item; 
    }   
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [ItemCreateUpdateComponent.id++],
      itemname: [this.defaults.itemname || '',],
      itemcode: [this.defaults.itemcode || '',],
      barcode: [this.defaults.barcode || '',],
      item_category_id: [this.defaults.item_category_id || null],
      item_manufacturar_id: [this.defaults.item_manufacturar_id || null],
      item_shelf_id: [this.defaults.item_shelf_id ||null],
      item_row_id: [this.defaults.item_row_id ||null],
      item_col_id: [this.defaults.item_col_id ||null],
      uom_id:  [this.defaults.uom_id ||null],
      rol:  [this.defaults.rol ||null],
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
