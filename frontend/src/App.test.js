import { render, screen } from '@testing-library/react';
import App from './App';
import { CartProvider } from './context/CartContext';

test('renders app without crashing', () => {
  render(
    <CartProvider>
      <App />
    </CartProvider>
  );

  // basic check (adjust text if needed)
  const element = screen.getByText(/server|upload|order|odyssey/i);
  expect(element).toBeInTheDocument();
});