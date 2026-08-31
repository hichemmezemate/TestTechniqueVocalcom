import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderForm from '../../Components/OrderForm';
import { OrderStatus } from '../../types';

describe('OrderForm Component', () => {
  it('should disable submit button when form is empty/invalid', () => {
    render(<OrderForm onAddOrder={async () => {}} />);
    
    const submitButton = screen.getByRole('button', { name: /ajouter la commande/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when valid clientName and totalAmount are provided', () => {
    render(<OrderForm onAddOrder={async () => {}} />);
    
    const clientInput = screen.getByLabelText(/nom du client/i);
    const amountInput = screen.getByLabelText(/montant total/i);
    const submitButton = screen.getByRole('button', { name: /ajouter la commande/i });

    fireEvent.change(clientInput, { target: { value: 'Jean Dupont' } });
    fireEvent.change(amountInput, { target: { value: '150.50' } });

    expect(submitButton).toBeEnabled();
  });

  it('should call onAddOrder and reset fields on submit', async () => {
    const mockAddOrder = vi.fn().mockResolvedValue(undefined);
    render(<OrderForm onAddOrder={mockAddOrder} />);
    
    const clientInput = screen.getByLabelText(/nom du client/i);
    const amountInput = screen.getByLabelText(/montant total/i);
    const selectStatus = screen.getByLabelText(/statut initial/i);
    const submitButton = screen.getByRole('button', { name: /ajouter la commande/i });

    fireEvent.change(clientInput, { target: { value: 'Jean Dupont' } });
    fireEvent.change(amountInput, { target: { value: '150.50' } });
    fireEvent.change(selectStatus, { target: { value: OrderStatus.Completed } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddOrder).toHaveBeenCalledWith({
        clientName: 'Jean Dupont',
        totalAmount: 150.5,
        status: OrderStatus.Completed,
      });
    });

    // Check that inputs are reset
    expect(clientInput).toHaveValue('');
    expect(amountInput).toHaveValue(null);
  });
});
