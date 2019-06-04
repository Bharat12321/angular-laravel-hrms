import { ChangeDetectorRef,AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { isPlatformBrowser } from '@angular/common';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-nationality-widget',
  templateUrl: './nationality-widget.component.html',
  styleUrls: ['./nationality-widget.component.scss']
})
export class NationalityWidgetComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  nationalityWidgetData : object[];

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private service: DataService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.service.getAll('/dashboard/studentNationalityGraph').subscribe(data => {
      this.nationalityWidgetData = data;
      this.ref.detectChanges();
      if (isPlatformBrowser(this.platformId)) {
        const ctx = this.canvas.nativeElement.getContext('2d');

        new Chart(ctx, {
          type: 'bar',
          data: this.nationalityWidgetData,
          options: {
            responsive: true,
            scales: {
              xAxes: [{
                stacked: true,
                gridLines: {
                  color: '#F7F7F7'
                }
              }],
              yAxes: [{
                stacked: true,
                gridLines: {
                  color: '#F7F7F7'
                },
              }]
            },
            legend: {
              display: false
            },
            tooltips: {
              mode: 'index',
              intersect: false
            }
          }
        });
      }
    });
  }

  ngAfterViewInit() {

  }

}
