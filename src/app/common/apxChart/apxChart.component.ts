import { Component, OnInit, ViewChild, Input } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexPlotOptions
} from "ng-apexcharts";
import { Width } from "ngx-owl-carousel-o/lib/services/carousel.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  tooltip: any;
};

@Component({
  selector: "app-apxChart",
  templateUrl: "./apxChart.component.html",
  styleUrls: ["./apxChart.component.css"]
})
export class ApxChartComponent {
  @Input() public data?: any;

  loaded: Boolean = false;
  chartType: any = '';
  @ViewChild("chart", { static: true }) chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(){
    this.data = {};
  }

  ngOnInit() {
    let seriesData: { data: any; name?: any; }[] = [];
    let yAxisAxes = {
      tickAmount: 8,
      min: 0,
      max: 1,
      labels: {
        style : {
          fontSize: '0.66rem'
        }
      },
      title: {
        text: "Score"
      },
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      },
      tooltip: {
        enabled: false,
        offsetX: 0,
      }
    }
    let xAxisAxes = {
      min: 0,
      max: 100,
      labels: {
        style : {
          fontSize: '0.66rem'
        }
      }
    }
    let hasNegativeValue = false;
    if ( this.data ) {
      this.chartType = this.data.chartType;
      if( this.data.chartType === 'lineSD'){
        let height = (10.42*document.body.clientWidth)/100;
        this.chartOptions = {
          series: this.data.data,
          chart: {
            height: height,
            type: "line",
            toolbar: {
              show: false
            }
          },
          stroke: {
            curve: "straight"
          },
          colors: this.data.colors,
          grid: {
            show: false
          },
          xaxis: {
            tickAmount: this.data.maxX > 10 ? 10 : this.data.maxX,
            min: 0,
            max:this.data.maxX,
            labels: {
              style : {
                fontSize: '0.66rem'
              }
            }
          },
          yaxis: {
            tickAmount:2,
            labels: {
              formatter: function(val, index) {
                return val === 1 ? 'male' : val === 2 ? 'female' : '';
              },
              style : {
                fontSize: '0.66rem'
              }
            }
          },
          legend: {
            show: false
          },
          tooltip: {
            enabled: false
          },
        };
      } else if(this.data.chartType === 'areaRC') {
        let seriesDataSet: any = [];
        this.data.data.forEach((series: any, index: number) => {
          seriesDataSet.push({
            x: series.timeOffset,
            y: series.score.toFixed(2)}
          );
        });

        yAxisAxes.max = 100;
        let height = 300;
        let width = this.data.width;
        let max = (seriesDataSet.length/2);
        console.log(max);
        this.chartOptions = {
          series: [
            {
              name: "Score",
              data: seriesDataSet
            }
          ],
          chart: {
            height: height,
            width: width,
            type: 'area',
            toolbar: {
              show: false
            }
          },
          // colors: this.data.colors,
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth"
          },
          grid: {
            borderColor: "#ffffff"
          },
          markers: {
            size: 3
          },
          tooltip: {
            enabled: true,
            style: {
              fontSize: '0.66rem'
            },
            x: {
              formatter: function(value: any) {
                return "Image | " + value + " sec"
              }
            }
          },
          
          
          xaxis: {
            tickAmount: 5,
            min: 0,
            max: max,
            tooltip: {
              enabled: false
            },
            title: {
              text: "Seconds"
            },
            labels: {
              rotate: 0,
              style : {
                fontSize: '0.66rem'
              }
            }
          },
          yaxis: yAxisAxes,
          legend: {
            show: false
          }
        };
        this.loaded = true;
      } else {
        this.data.data.forEach((series: any,index: number) => {
          seriesData.push({
            name: this.data.keys[index],
            data: series
          });

          if( !hasNegativeValue ) {
            hasNegativeValue = series.some( (v: number) => v < 0);
          }
        });

        if( hasNegativeValue ) {
          yAxisAxes.min = -1;
        } 

        let height = (24.31*document.body.clientWidth)/100;

        this.chartOptions = {
          series: seriesData,
          chart: {
            height: height,
            type: this.data.chartType,
            toolbar: {
              show: false
            }
          },
          colors: this.data.colors,
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth"
          },
          grid: {
            borderColor: "#ffffff"
          },
          markers: {
            size: 4
          },
          tooltip: {
            enabled: true,
            style: {
              fontSize: '0.66rem'
            }
          },
          xaxis: {
            categories: this.data.time,
            tooltip: {
              enabled: false
            },
            labels: {
              style : {
                fontSize: '0.66rem'
              }
            }
          },
          yaxis: yAxisAxes,
          legend: {
            show: false
          }
        };
      }


      this.loaded = true;
    }
    
  }
}