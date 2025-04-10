'use client';

import { useEffect, useState, useRef } from 'react';
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
import { Line } from 'react-chartjs-2';
import { fetchCumulativePoints } from '@/app/lib/data';
import { CumulativePoints } from '@/app/lib/definitions';
import { Chip } from '@heroui/react';
import clsx from 'clsx';

// Register the custom plugin
const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart: any, args: any, options: any) {
    const legendContainer = document.getElementById(options.containerID);
    if (!legendContainer) return;

    // Generate the HTML for our legend
    legendContainer.innerHTML = chart.data.datasets
      .map(
        (dataset: any) => `
          <div class="inline-flex mr-2 mb-2 sm:mb-1 bg-background-900 rounded-full border border-background-800 px-2 py-1">
            <div class="inline-flex items-center justify-center rounded-small px-1 h-5 text-small font-semibold text-white">
              <span class="mr-2 rounded-full w-2 h-2" style="background-color: ${dataset.borderColor}"></span>
              ${dataset.label}
            </div>
          </div>
        `
      )
      .join('');
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  htmlLegendPlugin // Register our custom plugin
);

export default function TrackChart() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: any[];
  }>({ labels: [], datasets: [] });
  const legendContainerId = 'chart-legend-container';

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCumulativePoints();

      // Get unique users
      const users = [...new Set(data.map((item) => item.user_name))];

      // Get unique event names for labels
      const labels = [
        ...new Set(data.map((item) => item.event_name.replace('GP de', ''))),
      ];

      // Generate random colors for each user
      const colors = [
        '#C92A2A', // Red
        '#F59F00', // Yellow
        '#0B7285', // Teal
        '#2ECC71', // Green
        '#45B7D1', // Blue
        '#96CEB4', // Mint
        '#D4A5A5', // Pink
        '#9B59B6', // Purple
        '#3498DB', // Bright Blue
        '#E67E22', // Orange
      ];

      // Create datasets for each user
      const datasets = users.map((userName) => {
        const userPoints = data.filter((item) => item.user_name === userName);
        const colorIndex = (userPoints[0].user_id - 1) % colors.length;
        return {
          label: userName,
          data: userPoints.map((point) => point.cumulative_points),
          borderColor: colors[colorIndex],
          backgroundColor: 'transparent',
          tension: 0,
        };
      });

      setChartData({
        labels,
        datasets,
      });
    };

    loadData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      htmlLegend: {
        containerID: legendContainerId,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: '#ffffff20',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      x: {
        grid: {
          color: '#ffffff20',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
    elements: {
      line: {
        tension: 0,
      },
      point: {
        radius: 4,
      },
    },
  };

  return (
    <div className='w-full bg-background-900 p-6 rounded-lg border border-background-800 mb-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='hidden sm:block text-xl font-semibold text-gray-100'>
          Progreso
        </h2>
        <div id={legendContainerId} className='flex flex-wrap gap-2'></div>
      </div>
      <div style={{ height: '300px' }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
