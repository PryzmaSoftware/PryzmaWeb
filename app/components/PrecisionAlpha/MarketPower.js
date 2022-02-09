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

const MarketPower = ({data}) => {

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
          label: 'Market Power',
          data: data.map(element => element.marketPower).reverse(),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        }
      ],
    };
    setDataPoints(points)
  },[labels])

  if (!dataPoints || !labels) return <div></div>

  return <div className="w-full mr-6">
  <p className="text-xl text-white font-medium">Market Power</p>
  <p className="text-sm text-neutral-400 mb-6">The ability of the overall market to increase or decrease the price of a stock. The higher above the equilibrium, being zero, the more the financial market has an impact on the price of the asset.</p>
  <Line data={dataPoints} />
  </div>
}

export default MarketPower;