import getChartColorsArray from 'Components/Common/ChartsDynamicColor';
import ReactApexChart from "react-apexcharts";
import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { formatNumber } from '../utils';

interface Props {
    dataColors: any;
    series: any;
    datesArray: any;
}

const ReportsTotalPerformanceCharts: React.FC<Props> = ({ dataColors, series, datesArray }) => {
    var revenueExpensesChartsColors = getChartColorsArray(dataColors);

    const {referenceCurrency} = useSelector((state: any) => state.InitialData);

    const getYAxisMinMax = useCallback((inputSeries: any[]) => {
        let min = Infinity;
        let max = -Infinity;
      
        inputSeries.forEach((s) => {
          s.data.forEach((value: number) => {
            if (value < min) min = value;
            if (value > max) max = value;
          });
        });
      
        // Add padding (e.g., 10% of range)
        const padding = (max - min) * 0.1;
        return {
          min: min - padding,
          max: max + padding,
        };
      }, []) 

      const { min: minValueInYAxis, max: maxValueInYAxis } = useMemo(() => {
        return getYAxisMinMax(series);
      }, [series]) 

    var options:any = {
        chart: {
            height: '500',
            type: 'area',
            toolbar: {
                show: true,
                tools: {
                  download: true,
                  selection: true,
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true,
                  customIcons: [] // You can add custom buttons here
                },
                autoSelected: 'zoom' // Default selected tool
              },
              zoom: {
                enabled: true,
                type: 'y', // 'x' for categorical data
                autoScaleYaxis: true // Adjust Y-axis on zoom
              },
              selection: { enabled: true } // Enable drag-to-zoom
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        xaxis: {
            categories: datesArray
        },
        yaxis: {
            labels: {
                formatter: function (value: any) {
                    return  formatNumber(value) + " " + referenceCurrency.name;
                }
            },
            tickAmount: 20,
            min: minValueInYAxis,
            max: maxValueInYAxis
        },
        colors: revenueExpensesChartsColors,
        fill: {
            opacity: 0.6,
            colors: revenueExpensesChartsColors,
            type: 'solid'
        }
    };
  
    return (
            <React.Fragment>
                <ReactApexChart 
                    dir="ltr"
                    options={options}
                    series={series}
                    type="area"
                    height="500"
                    className="apex-charts"
                />
            </React.Fragment>
        );
}

export default ReportsTotalPerformanceCharts
