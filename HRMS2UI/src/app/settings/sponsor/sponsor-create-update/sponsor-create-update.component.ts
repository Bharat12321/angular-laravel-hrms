import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Sponsor } from './sponsor.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';



@Component({
  selector: 'vr-sponsor-create-update',
  templateUrl: './sponsor-create-update.component.html',
  styleUrls: ['./sponsor-create-update.component.scss']
})
export class SponsorCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<SponsorCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Sponsor; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [SponsorCreateUpdateComponent.id++],
      code: [this.defaults.code || '',],
      name: [this.defaults.name || '',],
      company_name: [this.defaults.company_name || '',],
      employer_eid: [this.defaults.employer_eid || '',],
      payer_eid: [this.defaults.payer_eid || '',],
      id_expiry_date: [this.defaults.id_expiry_date || '',],
      remarks: [this.defaults.remarks || '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createSponsor();
    } else if (this.mode === 'update') {
      this.updateSponsor();
    }
  }

  createSponsor() {
    const sponsor = this.form.value;
    this.dialogRef.close(sponsor);
  }

  updateSponsor() {
    const sponsor = this.form.value;
    sponsor.id = this.defaults.id;

    this.dialogRef.close(sponsor);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
