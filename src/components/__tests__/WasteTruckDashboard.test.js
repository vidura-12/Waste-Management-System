import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import WasteTruckDashboard from '../../pages/WasteTruckDashboard';

// Mock axios
jest.mock('axios');

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }) => (
    <div data-testid="bar-chart">
      <div data-testid="chart-labels">{data.labels.join(',')}</div>
      <div data-testid="chart-data">{data.datasets[0].data.join(',')}</div>
    </div>
  ),
}));

// Mock flowbite-react Table components
jest.mock('flowbite-react', () => ({
  Table: {
    Head: ({ children }) => <thead>{children}</thead>,
    HeadCell: ({ children }) => <th>{children}</th>,
    Body: ({ children }) => <tbody>{children}</tbody>,
    Row: ({ children }) => <tr>{children}</tr>,
    Cell: ({ children }) => <td>{children}</td>,
  },
}));

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

describe('WasteTruckDashboard Unit Tests', () => {
  const mockSchedules = [
    {
      scheduleID: 'SCH001',
      wasteType: 'organic',
      address: '123 Main St',
      amount: '10',
      date: '2024-01-15T00:00:00.000Z',
      remarks: 'Kitchen waste',
    },
    {
      scheduleID: 'SCH002',
      wasteType: 'recyclable',
      address: '456 Oak Ave',
      amount: '5',
      date: '2024-01-16T00:00:00.000Z',
      remarks: '',
    },
    {
      scheduleID: 'SCH003',
      wasteType: 'organic',
      address: '789 Pine Rd',
      amount: '8',
      date: '2024-01-17T00:00:00.000Z',
      remarks: 'Garden waste',
    },
    {
      scheduleID: 'SCH004',
      wasteType: 'eWaste',
      address: '321 Elm St',
      amount: '3',
      date: '2024-01-18T00:00:00.000Z',
      remarks: 'Old electronics',
    },
  ];

  const mockApiResponse = {
    data: {
      organicWaste: 18,
      recyclableWaste: 5,
      eWaste: 3,
      scheduleDetails: mockSchedules,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with title and chart', async () => {
    axios.get.mockResolvedValueOnce(mockApiResponse);

    render(<WasteTruckDashboard />);

    expect(screen.getByText('Waste Truck Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Accepted Schedules')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  test('fetches data and updates chart correctly', async () => {
    axios.get.mockResolvedValueOnce(mockApiResponse);

    render(<WasteTruckDashboard />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/customer/getAcceptedSchedules'
      );
    });

    // Check if chart data is calculated correctly
    // 2 organic, 1 recyclable, 1 eWaste
    await waitFor(() => {
      const chartData = screen.getByTestId('chart-data');
      expect(chartData.textContent).toBe('2,1,1'); // organicCount, recyclableCount, ewasteCount
    });

    await waitFor(() => {
      const chartLabels = screen.getByTestId('chart-labels');
      expect(chartLabels.textContent).toBe('Organic,Recyclable,E-waste');
    });
  });

  test('displays schedule table with correct data', async () => {
    axios.get.mockResolvedValueOnce(mockApiResponse);

    render(<WasteTruckDashboard />);

    await waitFor(() => {
      // Check table headers
      expect(screen.getByText('Schedule ID')).toBeInTheDocument();
      expect(screen.getByText('Waste Type')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Remarks')).toBeInTheDocument();
    });

    // Check schedule data
    await waitFor(() => {
      expect(screen.getByText('SCH001')).toBeInTheDocument();
      expect(screen.getByText('organic')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Kitchen waste')).toBeInTheDocument();

      expect(screen.getByText('SCH004')).toBeInTheDocument();
      expect(screen.getByText('eWaste')).toBeInTheDocument();
      expect(screen.getByText('321 Elm St')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Old electronics')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<WasteTruckDashboard />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/customer/getAcceptedSchedules'
      );
    });

    // Component should not crash and should log error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching accepted schedules:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  test('calculates waste type counts correctly', async () => {
    axios.get.mockResolvedValueOnce(mockApiResponse);

    render(<WasteTruckDashboard />);

    await waitFor(() => {
      // Verify the chart data reflects correct counts
      const chartData = screen.getByTestId('chart-data');
      expect(chartData.textContent).toBe('2,1,1'); // 2 organic, 1 recyclable, 1 eWaste
    });
  });

  test('formats dates in table correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        organicWaste: 10,
        recyclableWaste: 5,
        eWaste: 3,
        scheduleDetails: [mockSchedules[0]],
      },
    });

    render(<WasteTruckDashboard />);

    await waitFor(() => {
      // Check if date is formatted properly
      const dateElement = screen.getByText(/1\/15\/2024/); // Local date format
      expect(dateElement).toBeInTheDocument();
    });
  });

  test('handles empty remarks correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        organicWaste: 5,
        recyclableWaste: 5,
        eWaste: 0,
        scheduleDetails: [mockSchedules[1]], // This one has empty remarks
      },
    });

    render(<WasteTruckDashboard />);

    await waitFor(() => {
      expect(screen.getByText('-')).toBeInTheDocument(); // Empty remarks display as dash
    });
  });

  test('initializes with default chart data', () => {
    axios.get.mockResolvedValueOnce(mockApiResponse);

    render(<WasteTruckDashboard />);

    // Initially, chart should show zeros
    expect(screen.getByTestId('chart-data').textContent).toBe('0,0,0');
  });
});