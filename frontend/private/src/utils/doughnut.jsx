import { useRef, useEffect, useState } from 'react';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const DoughnutChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [dataByStore, setDataByStore] = useState([]);

  useEffect(() => {
    // Fetch aggregated products by store
    const fetchData = async () => {
      try {
        const response = await fetch('https://elrinconcitodesharpays-expo2025-o2f0.onrender.com/api/products/by-category'); 
        const data = await response.json();
        setDataByStore(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!dataByStore.length) return; // Wait until data is loaded

    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dataByStore.map(item => item.category),
        datasets: [
          {
            data: dataByStore.map(item => item.count),
            backgroundColor: ['#ff48bcff','#ff87d4', '#b2f1f0', '#f9e375', '#c2b6ff'], // Can generate dynamically if needed
            borderColor: 'white',
            borderWidth: 5,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 30,
            },
          },
          title: {
            display: false,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [dataByStore]);

  return (
    <div
      className='doughnutGraphic'
      style={{
        borderRadius: 25,
        boxShadow: '0px 6px 0px 2px rgba(0, 0, 0, 0.14)',
      }}
    >
      <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default DoughnutChart;
