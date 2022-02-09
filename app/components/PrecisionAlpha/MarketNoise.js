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

const MarketNoise = ({data}) => {

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
    const newLables = data.map(element => element.closeDate).reverse();
    setLabels(newLables)
  }, [data])

  useEffect(() => {
    if (!labels) return
    const points = {
      labels,
      datasets: [
        {
          label: 'Market Noise',
          data: data.map(element => element.marketNoise).reverse(),
          borderColor: 'rgb(217, 70, 239)',
          backgroundColor: 'rgba(217, 70, 239, 0.5)',
        }
      ],
    };
    setDataPoints(points)
  },[labels])

  if (!dataPoints || !labels) return <div></div>

  return <div className="w-full">
  <p className="text-xl text-white font-medium">Market Noise</p>
  <p className="text-sm text-neutral-400 mb-6">Noise reduces the efficiency of market power. As market noise goes down, market power becomes stronger and more efficient, on the other hand, if market noise goes up, market power becomes less efficient.</p>
  <Line data={dataPoints} />
  </div>
}

export default MarketNoise;