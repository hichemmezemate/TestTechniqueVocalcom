import { OrderStatus } from '../types';
import type { Order, CreateOrderDto } from '../types';

const API_BASE_URL = 'http://localhost:5005/api/orders';

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des commandes : ${response.statusText}`);
    }
    return response.json();
  }

  static async createOrder(orderDto: CreateOrderDto): Promise<Order> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `Erreur lors de la création de la commande : ${response.statusText}`;
      throw new Error(message);
    }

    return response.json();
  }

  static async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `Erreur lors de la modification du statut : ${response.statusText}`;
      throw new Error(message);
    }
  }

  static async deleteOrder(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `Erreur lors de la suppression de la commande : ${response.statusText}`;
      throw new Error(message);
    }
  }
}
