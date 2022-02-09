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

const Probability = ({data}) => {

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
          label: 'Bull',
          data: data.map(element => element.probabilityUp).reverse(),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          label: 'Bear',
          data: data.map(element => element.probabilityDown).reverse(),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        },
      ],
    };
    setDataPoints(points)
  },[labels])

  if (!dataPoints || !labels) return <div></div>

  return <div className="w-full mr-6">
  <p className="text-xl text-white font-medium">Probabilities</p>
  <p className="text-sm text-neutral-400 mb-6">Next day probabiliy that the price of a stock will increase in price (Bull) or decrease in price (Bear). For example, a bull probability over 0.50 will make it more likely that the price will increase the following day. The same can be applied on the bear side.</p>
  <Line data={dataPoints} />
  </div>
}

export default Probability;