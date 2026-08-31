using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private static readonly ConcurrentDictionary<Guid, Order> _orders = new();

        public Task<IEnumerable<Order>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Order>>(_orders.Values.ToList());
        }

        public Task<Order?> GetByIdAsync(Guid id)
        {
            _orders.TryGetValue(id, out var order);
            return Task.FromResult(order);
        }

        public Task AddAsync(Order order)
        {
            if (order.Id == Guid.Empty)
            {
                order.Id = Guid.NewGuid();
            }
            _orders[order.Id] = order;
            return Task.CompletedTask;
        }

        public Task UpdateStatusAsync(Guid id, OrderStatus status)
        {
            if (_orders.TryGetValue(id, out var order))
            {
                order.Status = status;
            }
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Guid id)
        {
            _orders.TryRemove(id, out _);
            return Task.CompletedTask;
        }
    }
}
