import { ChangeDetectorRef,AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import * as numeral from 'numeral';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'vr-advanced-pie-chart',
  templateUrl: './advanced-pie-chart.component.html',
  styleUrls: ['./advanced-pie-chart.component.scss']
})
export class AdvancedPieChartComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  labels = [];
  backgroundColor = ['#009688', '#2196F3', '#9C27B0', '#00BCD4', '#F44336', '#FF9800'];
  data = [].sort((a, b) => b - a);
  total = this.data.reduce((pv, cv) => pv + cv, 0);

  chartData:any 

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private service: DataService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {

    this.service.getAll('/dashboard/studentCourseGraph').subscribe(data => {
      this.labels = data.label;
      this.data = data.count;
      this.chartData = {
        labels: this.labels,
        datasets: [{
          backgroundColor: this.backgroundColor,
          borderColor: 'transparent',
          data: this.data,
        }]
      };
      this.total = this.data.reduce((pv, cv) => pv + cv, 0);
      this.ref.detectChanges();
      if (isPlatformBrowser(this.platformId)) {
        const ctx = this.canvas.nativeElement.getContext('2d');

        const chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'doughnut',

          // The data for our dataset
          data: this.chartData,

          // Configuration options go here
          options: {
            cutoutPercentage: 70,
            legend: {
              display: false
            }
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    
  }

  getPercentageValue(value) {
    return numeral(value / this.total).format('0%');
  }
}
