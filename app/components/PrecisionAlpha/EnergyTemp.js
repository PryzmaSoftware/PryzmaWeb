import {useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {format} from 'date-fns'

const EnergyTemp = ({data}) => {
  
  const options = {stacked: false, scales: {
    energy: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    temp: {
      type: 'linear',
      display: true,
      position: 'right',

      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
    x: {
      beginAtZero: true
  }
  }}

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const [labels, setLabels] = useState(null);
  const [dataPoints, setDataPoints] = useState(null);

  useEffect(() => {
    const newLabels = data.map(element => element.closeDate).reverse()
    setLabels(newLabels)
  }, [data])

  console.log(labels)
  console.log(data)

  useEffect(() => {
    if (!labels) return
    const points = {
      labels,
      datasets: [
        {
          label: 'Free Energy',
          data: data.map(element => element.marketFreeEnergy).reverse(),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          yAxisID: 'energy'
        },
        {
          label: 'Temperature',
          data: data.map(element => element.marketTemperature).reverse(),
          borderColor: 'rgb(236, 72, 153)',
          backgroundColor: 'rgba(236, 72, 153, 0.5)',
          yAxisID: 'temp'
        },
      ],
    };
    setDataPoints(points)
  },[labels])

  if (!dataPoints || !labels) return <div></div>

  return <div className="w-full">
  <p className="text-xl text-white font-medium">Merket Free Energy & Temperature</p>
  <p className="text-sm text-neutral-400 mb-6">The energy available to do useful price movement work. As the free energy drops, the price and temperature will move up (direction of dominant probability) over an extended number of days and weeks while things heat up.</p>
  <Line data={dataPoints} options={options} />
  </div>
}

export default EnergyTemp;