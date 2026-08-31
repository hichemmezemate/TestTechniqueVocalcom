export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Order {
  id: string;
  clientName: string;
  totalAmount: number;
  status: OrderStatus;
}

export interface CreateOrderDto {
  clientName: string;
  totalAmount: number;
  status: OrderStatus;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
