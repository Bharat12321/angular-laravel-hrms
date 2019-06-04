import { Component, Inject, OnInit ,ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild, Input, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Sale } from './sale.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';

import { ChildComponent } from '../child/child.component'
import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';
import { SaleService } from 'app/services/sale.service';

export class InvoiceItem {
  item_id = null;
  employee_id=null;
  sale_type_id=null;
  qty = 0;
  cost = 0;
  total = 0;
}

@Component({
  selector: 'vr-sale-create-update',
  templateUrl: './sale-create-update.component.html',
  styleUrls: ['./sale-create-update.component.scss']
})
export class SaleCreateUpdateComponent implements OnInit {

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  index: number = 0;

  componentsReferences = [];

  static id = 100;
  statusData : Object[];

  items : Object[];
  employees : Object[];
  companies : Object[];
  saletype: Object[];
  modes : Object[];
  payment :boolean;
  item_display :boolean;
  serviceType :String;
  salesItems:Object ={};

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  @Input() defaults:any;

  constructor(
              // @Inject(MAT_DIALOG_DATA) public defaults: any,
              // private dialogRef: MatDialogRef<SaleCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private CFR: ComponentFactoryResolver,
              private store: Store<fromRoot.State>,
              private saleService : SaleService
              ) {

    
  }


  ngOnInit() {

      this.service.getAll('/sale/createupdate').subscribe(data => {
      this.companies = data.companies;
      this.items = data.items;
      this.modes = data.modes;
      this.saletype = data.saletype;
      this.employees = data.employees;
    });
    if (this.defaults) {
      this.mode = 'update';
      this.payment = false;
      this.item_display = true;
    } else {
      this.defaults = {} as Sale; 
      this.payment = true;
      this.item_display = true;
    }
    this.statusData = STATUS_DATA;

    var hey = [{"item_id":1,"employee_id":3, "employees": { "id": 1, "name": "bharat"}, "salesItems": { "id": 1, "name": "test_i"},"items": { "id": 1, "name": "test_i"}, "sale_type_id":44,"qty":1,"cost":100,"total":100},{"item_id":1,"employee_id":3,"sale_type_id":46,"qty":2,"cost":200,"total":400}];

    console.log("Details ");
    console.log(this.defaults.details);

    var details_data = [];
  

    if ( this.defaults.details ){
      details_data = this.defaults.details;
    }else{
      details_data = [];
    }

    this.form = this.fb.group({
      id: [SaleCreateUpdateComponent.id++],
      company_id: [this.defaults.company_id || null,],
      employee_id: [this.defaults.employee_id || null,],
      sale_type_id: [this.defaults.sale_type_id || null,],
      name: [this.defaults.name || '',],
      payment_type: [this.defaults.payment_type || 'Pay Now',],
      date: [this.defaults.date || new Date(),],
      sub_total: [this.defaults.total_price || 0,],
      discount: [this.defaults.discount || 0,],
      total: [this.defaults.total || 0,],
      mode_id: [this.defaults.mode_id || null,],
      reference: [this.defaults.reference || null,],
      paid_amount: [this.defaults.paid_amount || 0,],
      due_amount: [this.defaults.due_amount || 0,],
      remarks: [this.defaults.remarks || '',],
      status: [this.defaults.status || '1'],
      invoiceItems: this.fb.array(details_data),
      // invoiceItems: this.fb.array([
      //  [{"item_id":1,"employee_id":3, "employees": { "id": 1, "name": "bharat"}, "salesItems": { "id": 1, "name": "test_i"},"items": { "id": 1, "name": "test_i"}, "sale_type_id":44,"qty":1,"cost":100,"total":100}],
      //  [{"item_id":1,"employee_id":3, "employees": { "id": 1, "name": "bharat"}, "salesItems": { "id": 1, "name": "test_i"},"items": { "id": 1, "name": "test_i"}, "sale_type_id":44,"qty":1,"cost":100,"total":100}],
      //  [{"item_id":1,"employee_id":3, "employees": { "id": 1, "name": "bharat"}, "salesItems": { "id": 1, "name": "test_i"},"items": { "id": 1, "name": "test_i"}, "sale_type_id":44,"qty":1,"cost":100,"total":100}]
      // ]),        
    });

    // const toSelect = this.employees.find(c => c.id == 3);
    // this.employees.get('employees').setValue(toSelect);


   this.form.valueChanges.subscribe(data => this.updateChange());
   this.addItem();
  }

  save() {
    if (this.mode === 'create') {
      this.createSale();
    } else if (this.mode === 'update') {
      this.updateSale();
    }
  }
  changePayment(event)
  {
    if(event.value === 'Pay Now'){
      this.payment = true;
    }else{
      this.payment = false;
    }
  }
  createSale() {
    const sale = this.form.value;
    console.log("In Create Sale");
    console.log(sale);
    // this.dialogRef.close(sale);
    this.saleService.sendUpdatedData(sale);
  }

  updateSale() {
    const sale = this.form.value;
    sale.id = this.defaults.id;
    // this.dialogRef.close(sale);
    this.saleService.sendUpdatedData(sale);
  }

  get invoiceItems(): FormArray {
    return this.form.get('invoiceItems') as FormArray;
  };

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  addItem() {
    this.invoiceItems.push(this.fb.group(new InvoiceItem()));
    console.log("Add Item");
    console.log(this.invoiceItems);
  }

  removeItem(item) {
    console.log("Remove Item");
    console.log(this.invoiceItems);
    
    let i = this.invoiceItems.controls.indexOf(item);

    if(i != -1) {
      this.invoiceItems.controls.splice(i, 1);
      let items = this.form.get('invoiceItems') as FormArray;
      console.log("Items in remove :-");
      console.log(items);
      let data = {invoiceItems: items};
      console.log("Data in remove :-");
      console.log(data);      
      this.updateForm(data);
    }
  }
  priceItem(item)
  {
      let url = '/stock/';
      if(this.serviceType == 'Service'){
          url = '/service/'
      }
      if(this.serviceType == 'Package'){
          url = '/package/'
      }

      this.service.get(url+item.value.item_id).subscribe(data => {
        let i = this.invoiceItems.controls.indexOf(item);
        let items = this.form.get('invoiceItems') as FormArray;
        items.value[i].cost = parseFloat(data.price);
        items.value[i].qty = (items.value[i].qty)?items.value[i].qty:1;
        let edata = {invoiceItems: items.value};
        this.updateForm(edata);
    });
  }
    salesTypeChange(event, item, index)
    {
        console.log(event.value, event.source.triggerValue, index);
        //this.item =

        this.serviceType = event.source.triggerValue;
        let url = '/stock';
        if(this.serviceType == 'Service'){
            url = '/services'
        }
        if(this.serviceType == 'Package'){
            url = '/packages'
        }

         this.service.getAll(url).subscribe(data => {
             this.salesItems[index] = data.items;
        });
    }

  updateChange(){
    let items = this.form.get('invoiceItems') as FormArray;
    let edata = {invoiceItems: items.value};
    this.updateForm(edata);
  }
  updateForm(data) {
    const items = data.invoiceItems;
    let sub = 0;
    for(let i of items){
      i.total = i.qty*i.cost;
      sub += i.total;
    }
    this.form.value.sub_total = sub;
   // let valonfly = (this.form.value.vat_per)?this.form.value.vat_per:this.vat;
  //  const vat = Math.round(sub * (valonfly / 100));
   // this.form.value.vat = vat;
    this.form.value.total = sub  - this.form.value.discount;
    this.form.value.paid_amount = sub - this.form.value.discount;
  }
  calculateDue(){
    this.form.value.due_amount = this.form.value.total - this.form.value.paid_amount;
  }


  cancelRequest(){
    this.saleService.notifyCancelRequest()
  }
}
