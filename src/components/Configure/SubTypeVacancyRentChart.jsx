import PropTypes from "prop-types";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);


// VARIABLES FOR THEME CONSISTANCY
const DEEPBLUE = "#000759";
const DARKBLUE = "#25408F";
const MEDIUMBLUE = "#1C54F4";
const LIGHTBLUE = "#4D93FF";
const PALEBLUE = "#C3E6FF";
const ORANGE = "#FA6609"
const MEDIUMBLUEGREY = "#7B8BBD";
const TRANSPARENCY75 = "BF";
const TRANSPARENCY50 = "80";
const TRANSPARENCY25 = "40";

function VacancyRentChart(chartData) {
  // console.log(chartData.chartData)
  const data = chartData?.chartData?.data

  const labels = chartData?.chartData?.labels

  const ChartData = {
    labels: labels,
    datasets: [      
      {
        type:'line', 
        label: 'Vacancy Rate',
        backgroundColor: PALEBLUE,
        borderColor: PALEBLUE,
        borderWidth: 2,
        pointStyle: false,
        fill: false,
        data: data?.Vacancy,
        yAxisID: 'y2'
      },
      {
        type:'bar', 
        label: 'Rental Rate',
        backgroundColor: LIGHTBLUE,
        borderColor: LIGHTBLUE,
        borderWidth: 1,
        data: data?.RentalRate,
        yAxisID: 'y'
      },
    ]
  }
  const Options = {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        bottom: 40 // or more depending on your offset
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxHeight:'2'
        }
      },
      title: {
        display: true,
        text: 'Market Graph'
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function(value, index) {
            const label = labels[index];
            const [quarter, year] = label.split(' ');
            return [quarter, year];
          }
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          // Use the callback function to append a '%' sign
          callback: function(value, index, ticks) {
              return value + '%'; 
          }
        },
      },
      y2: {
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        position: 'right',
        max: 25,
        min: 0,
        grid: {
          drawOnChartArea: false // only want the grid lines for one axis to show up
        },
        ticks: {
          // Use the callback function to append a '%' sign
          callback: function(value, index, ticks) {
              return value + '%'; 
          }
        },
      }
    }
  }

  return (
    <div style={{display:'flex', height:'100%', justifyContent:'center', width:'100%'}}>
      <Chart style={{height:"3.5in", width:"5in"}}
        id="chart"
        data={ChartData}
        options={Options}
      ></Chart>
    </div>
  );
}

VacancyRentChart.propTypes = {
  chartData: PropTypes.object.isRequired
};

export default VacancyRentChart;