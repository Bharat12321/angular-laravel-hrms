import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Course } from './course.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-course-create-update',
  templateUrl: './course-create-update.component.html',
  styleUrls: ['./course-create-update.component.scss']
})
export class CourseCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];
  courseTypeData : Object[];

  courses : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<CourseCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
      this.service.getAll('/company_course/createupdate').subscribe(data => {
      this.courses = data.courses;
    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Course; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [CourseCreateUpdateComponent.id++],
      company_id: [localStorage.getItem('companyId')],
      course_id: [this.defaults.course_id || null,],
      quantity: [this.defaults.quantity || null],
      date: [this.defaults.date || ''],
      discount: [this.defaults.discount || null],
      remarks: [this.defaults.amount || ''],
      status: [this.defaults.status || '0']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createCourse();
    } else if (this.mode === 'update') {
      this.updateCourse();
    }
  }

  createCourse() {
    const course = this.form.value;
    this.dialogRef.close(course);
  }

  updateCourse() {
    const course = this.form.value;
    course.id = this.defaults.id;

    this.dialogRef.close(course);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
