import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'vr-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  data : any;
  types : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<ReceiptViewComponent>,
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
    var reciptId=this.defaults;
      this.service.get('/sale/'+reciptId).subscribe(data => {  
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

}
.headdiv{
  position: relative;
}
.headdiv h1{

      text-align: center;
    padding: 90px 0px;
}
.receipthead{
  position: absolute;
    left: 0;
    right: 0;
    width: 25%;
    margin: auto;
    height: 200px;
    top: 0;
    bottom: 0;
}
.left {
  width: 400px;
  float: left;

}
.left > div , .left div p {
  text-align: left !important;
  line-height: 1px !important;
  display: block !important;
}
.picture {
  height: 50px;
  width: 220px;

}

.left > div , .left div p {
  text-align: left !important;
  line-height: 1px !important;
  display: block !important;
}


.right {
  float: right;
  width: 400px;
}
.right > div , .right div p {
  text-align: right !important;
  line-height: 1px !important;
  display: block !important;
}
.billto {
  width: 560px !important;
}
.info {

    font-size: 16px;

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
  margin-left: -24px;
  padding-left: 24px;
  margin-right: -24px;
  padding-right: 24px;
}
.fees {
  width: 700px;
}
.receipt{
  border: 2px solid #000;
    padding: 0px 20px;
    width: 100%;
    height: auto;
}
.receipt  > div {
  width: 150px;
  text-align: center;
}
.receipt  > div p {
  line-height: 0.5px;
}
.cash {
  width: 500px !important;
  text-align: left !important;
  margin-top: -20px;
}
.cashdate {
  text-align: left !important;
  margin-top: -20px;
}
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}<br/><hr>${printContents}</body>
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
