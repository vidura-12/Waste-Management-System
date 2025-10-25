import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock axios and other dependencies BEFORE importing the component
jest.mock('axios', () => ({
  post: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the icons to avoid SVG issues
jest.mock('react-icons/hi', () => ({
  HiMail: () => 'HiMail',
  HiLockClosed: () => 'HiLockClosed',
  HiUser: () => 'HiUser',
  HiPhone: () => 'HiPhone',
  HiHome: () => 'HiHome',
  HiX: () => 'HiX',
}));

jest.mock('react-icons/vsc', () => ({
  VscEyeClosed: () => 'VscEyeClosed',
  VscEye: () => 'VscEye',
}));

// Mock flowbite-react components
jest.mock('flowbite-react', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Label: ({ children, ...props }) => <label {...props}>{children}</label>,
  TextInput: ({ icon, ...props }) => <input {...props} />,
  FileInput: ({ ...props }) => <input type="file" {...props} />,
}));

// Now import the component after all mocks are set up
import axios from 'axios';
import AuthModal from '../../components/AuthModel';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

describe('AuthModal Unit Tests', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.setItem.mockClear();
    mockReload.mockClear();
  });

  // Test 1: Component doesn't render when isOpen is false
  test('does not render when isOpen is false', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthModal {...defaultProps} isOpen={false} />
      </BrowserRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  // Test 2: Renders login form by default
  test('renders login form by default', () => {
    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  // Test 3: Toggles to registration form
  test('toggles to registration form when register link is clicked', () => {
    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    const registerLink = screen.getByText(/register/i);
    fireEvent.click(registerLink);

    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  // Test 4: Closes modal when close button is clicked
  test('closes modal when close button is clicked', () => {
    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    const closeButton = screen.getByRole('button', { name: '' }); // The close button
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 5: Successful login
  test('handles successful login', async () => {
    const mockResponse = {
      data: {
        admin: false,
        driver: false,
        customer: { cusID: '123' },
        token: 'mock-token',
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    // Fill login form
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/customer/login',
        {
          email: 'test@example.com',
          password: 'Password123!',
        }
      );
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('cusID', '123');
    expect(mockOnClose).toHaveBeenCalled();
  });

  // Test 6: Login with admin role navigates to admin dashboard
  test('navigates to admin dashboard when user is admin', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    const mockResponse = {
      data: {
        admin: true,
        driver: false,
        customer: { cusID: '123' },
        token: 'mock-token',
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Admin123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  // Test 7: Registration form validation - name pattern
  test('validates name pattern during registration', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    // Switch to registration
    fireEvent.click(screen.getByText(/register/i));

    // Fill form with invalid name
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'John123' }, // Invalid - contains numbers
    });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/your address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(alertSpy).toHaveBeenCalledWith('Name should only contain letters and spaces.');
    expect(axios.post).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  // Test 8: Registration form validation - phone pattern
  test('validates phone pattern during registration', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    // Switch to registration
    fireEvent.click(screen.getByText(/register/i));

    // Fill form with invalid phone
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '123' }, // Invalid - too short
    });
    fireEvent.change(screen.getByPlaceholderText(/your address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(alertSpy).toHaveBeenCalledWith('Phone number must be 10 digits.');
    expect(axios.post).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  // Test 9: Registration form validation - password pattern
  test('validates password pattern during registration', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    // Switch to registration
    fireEvent.click(screen.getByText(/register/i));

    // Fill form with weak password
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'weak' }, // Invalid - too weak
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'weak' },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/your address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.'
    );
    expect(axios.post).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  // Test 10: Registration form validation - password mismatch
  test('validates password confirmation during registration', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    // Switch to registration
    fireEvent.click(screen.getByText(/register/i));

    // Fill form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'Different123!' }, // Different from password
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/your address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(alertSpy).toHaveBeenCalledWith('Passwords do not match!');
    expect(axios.post).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  // Test 11: Successful registration
  test('handles successful registration', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    axios.post.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    // Switch to registration
    fireEvent.click(screen.getByText(/register/i));

    // Fill form with valid data
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/your address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'https://garbage-management-system-server.vercel.app/customer/register',
        {
          name: 'John Doe',
          email: 'test@example.com',
          password: 'Password123!',
          phone: '1234567890',
          address: '123 Main St',
        }
      );
    });

    expect(alertSpy).toHaveBeenCalledWith('Registration successful! You can now log in.');
    
    // Should switch back to login form
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

    alertSpy.mockRestore();
  });

  // Test 12: Handles registration errors
  test('handles registration errors gracefully', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error('Registration failed'));

    render(
      <BrowserRouter>
        <AuthModal {...defaultProps} />
      </BrowserRouter>
    );

    // Switch to registration
    fireEvent.click(screen.getByText(/register/i));

    // Fill form with valid data
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/your address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(alertSpy).toHaveBeenCalledWith('Error registering customer');
    expect(consoleSpy).toHaveBeenCalledWith('Error registering customer');

    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});