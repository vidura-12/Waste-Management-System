import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main app page with the brand name', () => {
  render(<App />);
  
  // Use getAllByText since there are multiple elements with "Green Bin"
  const brandElements = screen.getAllByText(/green bin/i);
  expect(brandElements.length).toBeGreaterThan(0);
  expect(brandElements[0]).toBeInTheDocument();
});