import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WasteSchedule from '../../pages/WasteSchedule';
import axios from 'axios';

// Mock all external dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('WasteSchedule Unit Tests', () => {
  const mockCustomerData = {
    data: {
      address: '123 Main Street, City, Country'
    }
  };

  const mockPriceData = {
    data: {
      price: '500',
      amount: '100'
    }
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock localStorage properly
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'customer123'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });

    // Mock axios
    axios.get.mockImplementation((url) => {
      if (url.includes('getCustomer')) {
        return Promise.resolve(mockCustomerData);
      }
      if (url.includes('getPriceAmount')) {
        return Promise.resolve(mockPriceData);
      }
      return Promise.reject(new Error('Not found'));
    });

    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Component renders correctly
  test('renders waste schedule form with initial state', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    // Check basic form elements
    expect(screen.getByText(/schedule type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/general schedule/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special schedule/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/waste type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remarks/i)).toBeInTheDocument();
    
    // Check that date field is not visible initially
    expect(screen.queryByLabelText(/select date/i)).not.toBeInTheDocument();
  });

  // Test 2: API calls on component mount
  test('fetches customer address and price details on mount', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/admin/getPriceAmount/general'
      );
      expect(axios.get).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/customer/getCustomer/customer123'
      );
    });

    // Check if address is populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('123 Main Street, City, Country')).toBeInTheDocument();
    });

    // Check if price and max amount are displayed
    expect(screen.getByText(/payment: 500 rupees/i)).toBeInTheDocument();
    expect(screen.getByText(/max amount: 100 kg/i)).toBeInTheDocument();
  });

  // Test 3: Schedule type change behavior
  test('shows date field when special schedule is selected', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    const specialScheduleRadio = screen.getByLabelText(/special schedule/i);
    
    await act(async () => {
      fireEvent.click(specialScheduleRadio);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/select date/i)).toBeInTheDocument();
    });
  });

  // Test 4: Amount validation
  test('validates amount does not exceed max amount', async () => {
    // Mock window.alert for validation
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    // Wait for API calls to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    const amountInput = screen.getByLabelText(/amount \(kg\)/i);
    
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '150' } }); // Exceeds max of 100
    });

    const submitButton = screen.getByRole('button', { name: /schedule/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Should call alert for exceeding amount
    expect(mockAlert).toHaveBeenCalledWith('Amount cannot exceed 100 KG.');
    
    mockAlert.mockRestore();
  });

  // Test 5: Payment method validation for special schedule
  test('requires payment method for special schedule', async () => {
    // Mock window.alert for validation
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    // Select special schedule
    const specialScheduleRadio = screen.getByLabelText(/special schedule/i);
    
    await act(async () => {
      fireEvent.click(specialScheduleRadio);
    });

    // Fill required fields except payment
    const amountInput = screen.getByLabelText(/amount \(kg\)/i);
    
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '50' } });
    });

    const submitButton = screen.getByRole('button', { name: /schedule/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Should show payment method required alert
    expect(mockAlert).toHaveBeenCalledWith('Please select a payment method.');
    
    mockAlert.mockRestore();
  });

  // Test 6: Form submission with valid data for general schedule
  test('submits form with valid data for general schedule', async () => {
    // Mock successful form submission
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Mock alert for success message
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    // Wait for initial data to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    // Fill form
    const amountInput = screen.getByLabelText(/amount \(kg\)/i);
    
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '50' } });
    });

    const addressInput = screen.getByLabelText(/address/i);
    
    await act(async () => {
      fireEvent.change(addressInput, { target: { value: 'Updated Address' } });
    });

    const wasteTypeSelect = screen.getByLabelText(/waste type/i);
    
    await act(async () => {
      fireEvent.change(wasteTypeSelect, { target: { value: 'organic' } });
    });

    const submitButton = screen.getByRole('button', { name: /schedule/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/customer/addSchedule/customer123',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
    
    mockAlert.mockRestore();
  });

  // Test 7: Error handling for API failures
  test('handles API errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    // Component should not crash when API fails
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /schedule/i })).toBeInTheDocument();
    });
  });

  // Test 8: Price and max amount display
  test('displays price and max amount from API', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/payment: 500 rupees/i)).toBeInTheDocument();
      expect(screen.getByText(/max amount: 100 kg/i)).toBeInTheDocument();
    });
  });

  // Test 9: Form reset when switching from special to general schedule
  test('resets date and payment method when switching to general schedule', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    // First select special schedule
    const specialScheduleRadio = screen.getByLabelText(/special schedule/i);
    
    await act(async () => {
      fireEvent.click(specialScheduleRadio);
    });

    // Fill date and select payment method
    const dateInput = screen.getByLabelText(/select date/i);
    
    await act(async () => {
      fireEvent.change(dateInput, { target: { value: '2024-01-01' } });
    });

    const cashPayment = screen.getByLabelText(/cash on visit/i);
    
    await act(async () => {
      fireEvent.click(cashPayment);
    });

    // Switch back to general schedule
    const generalScheduleRadio = screen.getByLabelText(/general schedule/i);
    
    await act(async () => {
      fireEvent.click(generalScheduleRadio);
    });

    // Date field should be hidden and values reset
    expect(screen.queryByLabelText(/select date/i)).not.toBeInTheDocument();
  });

  // Test 10: Form submission failure handling
  test('handles form submission failure', async () => {
    // Mock failed form submission
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Server error',
    });

    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
      render(
        <BrowserRouter>
          <WasteSchedule />
        </BrowserRouter>
      );
    });

    // Wait for initial data to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    // Fill form
    const amountInput = screen.getByLabelText(/amount \(kg\)/i);
    
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '50' } });
    });

    const submitButton = screen.getByRole('button', { name: /schedule/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error scheduling a collection!');
    });
    
    mockAlert.mockRestore();
  });
});