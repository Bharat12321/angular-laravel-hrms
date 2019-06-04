import { Component, Input, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ROUTE_TRANSITION } from '../../app.animation';
import {ActivatedRoute ,Router } from '@angular/router';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';


import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { ToastrService } from 'ngx-toastr';


import { DataService } from '../../services/data.service';


@Component({
  selector: 'vr-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class InvoiceViewComponent implements OnInit {

  invoice_id:number;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  @Input() student: Object[];
  
  constructor(
    private service: DataService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private route:ActivatedRoute,
    private dialog: MatDialog, private toastr: ToastrService ) {
    
  }


  ngOnInit() {
      this.isLoadingResults = true;
      this.route.params.subscribe( params =>
          {
            this.invoice_id = params['id'];
          }
      );
      this.service.get('/invoice/'+this.invoice_id).subscribe(data => {  
        this.student = data;
        this.isLoadingResults = false;
        this.ref.detectChanges();
    });
  }
}
