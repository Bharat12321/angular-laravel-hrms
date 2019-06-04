import { Component, Inject, OnInit ,ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Attachment } from './attachment.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-attachment-create-update',
  templateUrl: './attachment-create-update.component.html',
  styleUrls: ['./attachment-create-update.component.scss']
})
export class AttachmentCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];
  types : Object[];


  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<AttachmentCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute, private cd: ChangeDetectorRef,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

      this.service.getAll('/attachment/createupdate').subscribe(data => {
      this.types = data.types;
    });
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Attachment; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [AttachmentCreateUpdateComponent.id++],
      type_id: [this.defaults.type_id || '',],
      number: [this.defaults.number || '',],
      taggable_type: ['Employee'],
      taggable_id: [localStorage.getItem('employeeId')],
      expiry_date: [this.defaults.expiry_date || '',],
      file: [null],
      remarks: [this.defaults.remarks || ''],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createAttachment();
    } else if (this.mode === 'update') {
      this.updateAttachment();
    }
  }

  createAttachment() {
    const attachment = this.form.value;
    this.dialogRef.close(attachment);
  }

  updateAttachment() {
    const attachment = this.form.value;
    attachment.id = this.defaults.id;

    this.dialogRef.close(attachment);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
  onFileChange(event) {
    let reader = new FileReader();
   
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.form.patchValue({
          file: reader.result
        });
        
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
}
