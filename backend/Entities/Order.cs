using System;
using System.Text.Json.Serialization;

namespace Backend.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum OrderStatus
    {
        Pending,
        Completed,
        Cancelled
    }

    public class Order
    {
        public Guid Id { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public double TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
    }
}
