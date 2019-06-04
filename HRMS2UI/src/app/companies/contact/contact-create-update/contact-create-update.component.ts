import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Contact } from './contact.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-contact-create-update',
  templateUrl: './contact-create-update.component.html',
  styleUrls: ['./contact-create-update.component.scss']
})
export class ContactCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];
  countries : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<ContactCreateUpdateComponent>,
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
      this.defaults = {} as Contact; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      taggable_type: ['Company'],
      taggable_id: [localStorage.getItem('companyId')],
      id: [ContactCreateUpdateComponent.id++],
      name: [this.defaults.name || '',],
      phone: [this.defaults.phone || '',],
      email: [this.defaults.email || '',],
      remarks: [this.defaults.remarks || '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createContact();
    } else if (this.mode === 'update') {
      this.updateContact();
    }
  }

  createContact() {
    const contact = this.form.value;
    this.dialogRef.close(contact);
  }

  updateContact() {
    const contact = this.form.value;
    contact.id = this.defaults.id;

    this.dialogRef.close(contact);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
