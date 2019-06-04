import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Ledger } from './ledger.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';
import { LEDGER_TYPE_DATA } from '../../../core/data/ledgertype';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-ledger-create-update',
  templateUrl: './ledger-create-update.component.html',
  styleUrls: ['./ledger-create-update.component.scss']
})
export class LedgerCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];
  typeData : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<LedgerCreateUpdateComponent>,
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
      this.defaults = {} as Ledger; 
    }
    this.statusData = STATUS_DATA;
    this.typeData = LEDGER_TYPE_DATA;
    this.form = this.fb.group({
      id: [LedgerCreateUpdateComponent.id++],
      name: [this.defaults.name || '',],
      address: [this.defaults.address || '',],
      remarks: [this.defaults.remarks || '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createLedger();
    } else if (this.mode === 'update') {
      this.updateLedger();
    }
  }

  createLedger() {
    const ledger = this.form.value;
    this.dialogRef.close(ledger);
  }

  updateLedger() {
    const ledger = this.form.value;
    ledger.id = this.defaults.id;

    this.dialogRef.close(ledger);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
