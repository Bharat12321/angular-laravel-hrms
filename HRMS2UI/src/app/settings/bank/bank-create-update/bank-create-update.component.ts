import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Bank } from './bank.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';



@Component({
  selector: 'vr-bank-create-update',
  templateUrl: './bank-create-update.component.html',
  styleUrls: ['./bank-create-update.component.scss']
})
export class BankCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<BankCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Bank; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [BankCreateUpdateComponent.id++],
      code: [this.defaults.code || '',],
      name: [this.defaults.name || '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createBank();
    } else if (this.mode === 'update') {
      this.updateBank();
    }
  }

  createBank() {
    const bank = this.form.value;
    this.dialogRef.close(bank);
  }

  updateBank() {
    const bank = this.form.value;
    bank.id = this.defaults.id;

    this.dialogRef.close(bank);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
