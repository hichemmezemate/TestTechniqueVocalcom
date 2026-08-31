import React from 'react';
import { OrderStatus as StatusEnum } from '../types';

interface OrderStatusProps {
  status: StatusEnum;
  onStatusChange: (newStatus: StatusEnum) => void;
  disabled?: boolean;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ status, onStatusChange, disabled }) => {
  const getStatusClass = (s: StatusEnum) => {
    switch (s) {
      case StatusEnum.Pending:
        return 'status-pending';
      case StatusEnum.Completed:
        return 'status-completed';
      case StatusEnum.Cancelled:
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusLabel = (s: StatusEnum) => {
    switch (s) {
      case StatusEnum.Pending:
        return 'En attente';
      case StatusEnum.Completed:
        return 'Complétée';
      case StatusEnum.Cancelled:
        return 'Annulée';
      default:
        return s;
    }
  };

  return (
    <div className="status-container">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusEnum)}
        className={`status-select ${getStatusClass(status)}`}
        disabled={disabled}
        aria-label="Modifier le statut de la commande"
      >
        <option value={StatusEnum.Pending}>{getStatusLabel(StatusEnum.Pending)}</option>
        <option value={StatusEnum.Completed}>{getStatusLabel(StatusEnum.Completed)}</option>
        <option value={StatusEnum.Cancelled}>{getStatusLabel(StatusEnum.Cancelled)}</option>
      </select>
    </div>
  );
};
export default OrderStatus;
