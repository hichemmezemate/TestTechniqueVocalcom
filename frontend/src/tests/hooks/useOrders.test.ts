import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOrders } from '../../hooks/useOrders';
import { OrderService } from '../../Services/OrderService';
import { OrderStatus } from '../../types';

vi.mock('../../Services/OrderService', () => ({
  OrderService: {
    getAllOrders: vi.fn(),
    createOrder: vi.fn(),
    updateOrderStatus: vi.fn(),
    deleteOrder: vi.fn(),
  },
}));

describe('useOrders Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch orders on load and calculate stats', async () => {
    const mockOrders = [
      { id: '1', clientName: 'Alice', totalAmount: 100, status: OrderStatus.Completed },
      { id: '2', clientName: 'Bob', totalAmount: 50, status: OrderStatus.Pending },
    ];
    (OrderService.getAllOrders as any).mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.stats.totalCount).toBe(2);
    expect(result.current.stats.completedCount).toBe(1);
    expect(result.current.stats.pendingCount).toBe(1);
    expect(result.current.stats.totalRevenue).toBe(100);
  });

  it('should add a new order and update stats', async () => {
    (OrderService.getAllOrders as any).mockResolvedValue([]);
    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newOrder = { id: '3', clientName: 'Charlie', totalAmount: 200, status: OrderStatus.Completed };
    (OrderService.createOrder as any).mockResolvedValue(newOrder);

    await act(async () => {
      await result.current.addOrder({
        clientName: 'Charlie',
        totalAmount: 200,
        status: OrderStatus.Completed,
      });
    });

    expect(result.current.orders).toContainEqual(newOrder);
    expect(result.current.stats.totalRevenue).toBe(200);
  });
});
