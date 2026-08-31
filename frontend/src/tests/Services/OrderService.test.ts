import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../../Services/OrderService';
import { OrderStatus } from '../../types';

describe('OrderService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should fetch orders successfully', async () => {
    const mockOrders = [
      { id: '1', clientName: 'Alice', totalAmount: 50, status: OrderStatus.Pending },
    ];
    
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockOrders,
    });

    const result = await OrderService.getAllOrders();
    expect(fetch).toHaveBeenCalledWith('http://localhost:5005/api/orders');
    expect(result).toEqual(mockOrders);
  });

  it('should throw error when fetch fails', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await expect(OrderService.getAllOrders()).rejects.toThrow(
      'Erreur lors de la récupération des commandes : Internal Server Error'
    );
  });
});
