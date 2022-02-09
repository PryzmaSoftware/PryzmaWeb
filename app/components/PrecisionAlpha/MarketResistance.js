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

const MarketResistance = ({data}) => {

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
          label: 'Market Resistance',
          data: data.map(element => element.marketResistance).reverse(),
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.5)',
        }
      ],
    };
    setDataPoints(points)
  },[labels])

  if (!dataPoints || !labels) return <div></div>

  return <div className="w-full">
  <p className="text-xl text-white font-medium">Market Resistance</p>
  <p className="text-sm text-neutral-400 mb-6">Resistance to a dominant movement in price of an asset. Increasing resistance reduces market power, while decreasing resistance increase market power.</p>
  <Line data={dataPoints} />
  </div>
}

export default MarketResistance;