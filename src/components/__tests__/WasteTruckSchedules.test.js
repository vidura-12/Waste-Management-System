import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import WasteTruckSchedules from '../../pages/WasteSchedule';

// Mock axios
jest.mock('axios');

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

describe('WasteTruckSchedules Unit Tests', () => {
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component with title', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        scheduleDetails: mockSchedules,
      },
    });

    render(<WasteTruckSchedules />);

    expect(screen.getByText('Waste Truck Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Schedule ID')).toBeInTheDocument();
    expect(screen.getByText('Waste Type')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Remarks')).toBeInTheDocument();
  });

  test('fetches and displays accepted schedules', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        scheduleDetails: mockSchedules,
      },
    });

    render(<WasteTruckSchedules />);

    // Wait for data to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/customer/getAcceptedSchedules'
      );
    });

    // Check if schedule data is displayed
    expect(screen.getByText('SCH001')).toBeInTheDocument();
    expect(screen.getByText('organic')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Kitchen waste')).toBeInTheDocument();

    expect(screen.getByText('SCH002')).toBeInTheDocument();
    expect(screen.getByText('recyclable')).toBeInTheDocument();
    expect(screen.getByText('456 Oak Ave')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument(); // Empty remarks
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<WasteTruckSchedules />);

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

  test('formats dates correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        scheduleDetails: [mockSchedules[0]],
      },
    });

    render(<WasteTruckSchedules />);

    await waitFor(() => {
      // Check if date is formatted properly
      const dateElement = screen.getByText(/1\/15\/2024/); // Local date format
      expect(dateElement).toBeInTheDocument();
    });
  });

  test('displays empty state when no schedules', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        scheduleDetails: [],
      },
    });

    render(<WasteTruckSchedules />);

    await waitFor(() => {
      // Table headers should still be visible
      expect(screen.getByText('Schedule ID')).toBeInTheDocument();
      expect(screen.getByText('Waste Type')).toBeInTheDocument();
      // No schedule rows should be present
      expect(screen.queryByText('SCH001')).not.toBeInTheDocument();
    });
  });
});