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

const MarketEmotion = ({data}) => {

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
    const newLables = data.map(element => format(new Date(element.closeDate), 'MMM dd, yyyy')).reverse();
    setLabels(newLables)
  }, [data])

  useEffect(() => {
    if (!labels) return
    const points = {
      labels,
      datasets: [
        {
          label: 'Market Emotion',
          data: data.map(element => element.marketEmotion).reverse(),
          borderColor: 'rgb(20, 184, 166)',
          backgroundColor: 'rgba(20, 184, 166, 0.5)',
        }
      ],
    };
    setDataPoints(points)
  },[labels])

  if (!dataPoints || !labels) return <div></div>

  return <div className="w-full mr-6">
  <p className="text-xl text-white font-medium">Market Emotion</p>
  <p className="text-sm text-neutral-400 mb-6">Market energy measured from equilibrium of zero, a negative market emotion is bearish while a positive market emotion is bullish.</p>
  <Line data={dataPoints} />
  </div>
}

export default MarketEmotion;