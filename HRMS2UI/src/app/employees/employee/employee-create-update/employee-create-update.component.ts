import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Employee } from './employee.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';
import { GENDER_DATA } from '../../../core/data/gender';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-employee-create-update',
  templateUrl: './employee-create-update.component.html',
  styleUrls: ['./employee-create-update.component.scss']
})
export class EmployeeCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  genderData : Object[];
  countries : Object[];
  departments : Object[];
  designations : Object[];
  categories : Object[];
  workingStatus : Object[];
  employmentTypes : Object[];
  joiningTypes : Object[];
  employeeGrades : Object[];
  payrollCenter : Object[];
  organizations : Object[];
  classes : Object[];
  sponsors : Object[];
  banks : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<EmployeeCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
      this.service.getAll('/employee/createupdate').subscribe(data => {
      this.countries = data.countries;
      this.departments = data.departments;
      this.designations = data.designations;
      this.categories = data.categories;
      this.workingStatus = data.workingStatus;
      this.employmentTypes = data.employmentTypes;
      this.joiningTypes = data.joiningTypes;
      this.employeeGrades = data.employeeGrades;
      this.payrollCenter = data.payrollCenter;
      this.organizations = data.organizations;
      this.classes = data.classes;
      this.sponsors = data.sponsors;
      this.banks = data.banks;
    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Employee; 
    }
    this.statusData = STATUS_DATA;
    this.genderData = GENDER_DATA;
    this.form = this.fb.group({
      id: [EmployeeCreateUpdateComponent.id++],
      code: [this.defaults.code || '',],
      name: [this.defaults.name || '',],
      arabic_name: [this.defaults.arabic_name || '',],
      date_of_birth: [this.defaults.date_of_birth || '',],
      email: [this.defaults.email || '',],
      contact_number: [this.defaults.contact_number || '',],
      country_id: [this.defaults.country_id || 634,],
      joining_date: [this.defaults.joining_date || '',],
      joining_type_id: [this.defaults.joining_type_id || null,],
      type_id: [this.defaults.type_id || null,],
      organization_id: [this.defaults.organization_id || '1',],
      class_id: [this.defaults.class_id || null,],
      department_id: [this.defaults.department_id || null,],
      designation_id: [this.defaults.designation_id || null,],
      category_id: [this.defaults.category_id || null,],
      gender: [this.defaults.gender || ''],
      grade_id: [this.defaults.grade_id || null,],
      sponsor_id: [this.defaults.sponsor_id || null,],
      bank_id: [this.defaults.bank_id || null,],
      account_number: [this.defaults.account_number || null,],
      iban: [this.defaults.iban || null,],
      salary: [this.defaults.salary || '',],
      working_status_id: [this.defaults.working_status_id || null,],
      payroll_center_id: [this.defaults.payroll_center_id || null,],
      remarks: [this.defaults.remarks || ''],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createEmployee();
    } else if (this.mode === 'update') {
      this.updateEmployee();
    }
  }

  createEmployee() {
    const employee = this.form.value;
    this.dialogRef.close(employee);
  }

  updateEmployee() {
    const employee = this.form.value;
    employee.id = this.defaults.id;

    this.dialogRef.close(employee);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
