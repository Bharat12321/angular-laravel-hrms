import { Component, OnInit } from '@angular/core';
import { ROUTE_TRANSITION } from '../app.animation';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'vr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class DashboardComponent implements OnInit {

  width = {
    single: (100) + '%',
    double: (100 / 2) + '%',
    triple: (100 / 3) + '%',
  };

  constructor(
    private toastr: ToastrService,
    private router: Router
    ) { }

  ngOnInit() {
    
  }
}
