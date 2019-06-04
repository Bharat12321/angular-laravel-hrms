import { ChangeDetectorRef,AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { isPlatformBrowser } from '@angular/common';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-gender-widget',
  templateUrl: './gender-widget.component.html',
  styleUrls: ['./gender-widget.component.scss']
})
export class GenderWidgetComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  genderWidgetData : object[];

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private service: DataService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.service.getAll('/dashboard/studentGenderGraph').subscribe(data => {
      this.genderWidgetData = data;
      this.ref.detectChanges();
      if (isPlatformBrowser(this.platformId)) {
        const ctx = this.canvas.nativeElement.getContext('2d');

        new Chart(ctx, {
          type: 'bar',
          data: this.genderWidgetData,
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
