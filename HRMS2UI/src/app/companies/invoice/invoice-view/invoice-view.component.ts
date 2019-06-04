import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'vr-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  data : any;
  types : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<InvoiceViewComponent>,
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
      this.defaults = {}; 
    }
    var invoiceId=this.defaults;
      this.service.get('/invoice/'+invoiceId).subscribe(data => {  
        this.data = data;
      });
  }
  print(): void {
      let printContents, popupWin;
      printContents = document.getElementById('print-section').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
            <style>
            .person{
  width: 800px;
  min-width: 800px;
  height: 1100px;
  max-height: 1100px;
}
.left {
  width: 400px;
  float: left;

}
.picture {
  height: 50px;
  width: 220px;

}

.left > div , .left div p {
  text-align: left !important;
  line-height: 3px !important;
  display: block !important;
}


.right {
  float: right;
  width: 400px;
}
.right > div , .right div p {
  text-align: right !important;
  line-height: 3px !important;
  display: block !important;
}
.billto {
  width: 600px !important;
}
.info {

    font-size: 14px;

}
.names .name{
   font-weight: 500;
}

.info .values {
  margin-left: 24px;
}

.info .name,.info  .value {
  padding: 8px 0;
}
.feesHead{
  color: #FFF !important;
  background: #0a94d9 !important;
  -webkit-print-color-adjust: exact; 
  margin-left: -24px;
  padding-left: 24px;
  margin-right: -24px;
  padding-right: 24px;
}
.fees {
  width: 700px;
}
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
  }

  createMedical() {
    const medical = this.form.value;
    this.dialogRef.close(medical);
  }

  updateMedical() {
    const medical = this.form.value;
    medical.id = this.defaults.id;

    this.dialogRef.close(medical);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
