using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Backend.Controllers;
using Backend.Dtos;
using Backend.Entities;
using Backend.Repositories;

namespace Backend.Tests
{
    [TestClass]
    public class OrdersControllerTests
    {
        private Mock<IOrderRepository> _mockRepository = null!;
        private OrdersController _controller = null!;

        [TestInitialize]
        public void SetUp()
        {
            _mockRepository = new Mock<IOrderRepository>();
            _controller = new OrdersController(_mockRepository.Object);
        }

        [TestMethod]
        public async Task GetAll_ReturnsAllOrders()
        {
            // Arrange
            var orders = new List<Order>
            {
                new() { Id = Guid.NewGuid(), ClientName = "Jean Dupont", TotalAmount = 150.50, Status = OrderStatus.Pending },
                new() { Id = Guid.NewGuid(), ClientName = "Marie Curie", TotalAmount = 250.00, Status = OrderStatus.Completed }
            };
            _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(orders);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var returnedOrders = okResult.Value as IEnumerable<OrderDto>;
            Assert.IsNotNull(returnedOrders);
            Assert.AreEqual(2, returnedOrders.Count());
        }

        [TestMethod]
        public async Task GetById_ExistingId_ReturnsOkWithOrder()
        {
            // Arrange
            var orderId = Guid.NewGuid();
            var order = new Order { Id = orderId, ClientName = "Jean Dupont", TotalAmount = 150.50, Status = OrderStatus.Pending };
            _mockRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);

            // Act
            var result = await _controller.GetById(orderId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var returnedOrder = okResult.Value as OrderDto;
            Assert.IsNotNull(returnedOrder);
            Assert.AreEqual(orderId, returnedOrder.Id);
            Assert.AreEqual("Jean Dupont", returnedOrder.ClientName);
        }

        [TestMethod]
        public async Task GetById_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var orderId = Guid.NewGuid();
            _mockRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync((Order?)null);

            // Act
            var result = await _controller.GetById(orderId);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
        }

        [TestMethod]
        public async Task Create_ValidOrder_ReturnsCreated()
        {
            // Arrange
            var orderDto = new OrderDto
            {
                ClientName = "Test Client",
                TotalAmount = 99.99,
                Status = OrderStatus.Pending
            };

            // Act
            var result = await _controller.Create(orderDto);

            // Assert
            var createdResult = result.Result as CreatedAtActionResult;
            Assert.IsNotNull(createdResult);
            var returnedDto = createdResult.Value as OrderDto;
            Assert.IsNotNull(returnedDto);
            Assert.AreEqual("Test Client", returnedDto.ClientName);
            Assert.AreNotEqual(Guid.Empty, returnedDto.Id);
            _mockRepository.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
        }

        [TestMethod]
        public async Task Create_InvalidClientName_ReturnsBadRequest()
        {
            // Arrange
            var orderDto = new OrderDto
            {
                ClientName = "", // Invalid
                TotalAmount = 99.99,
                Status = OrderStatus.Pending
            };
            _controller.ModelState.AddModelError("ClientName", "Le nom du client est requis.");

            // Act
            var result = await _controller.Create(orderDto);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
        }

        [TestMethod]
        public async Task Create_InvalidTotalAmount_ReturnsBadRequest()
        {
            // Arrange
            var orderDto = new OrderDto
            {
                ClientName = "Client",
                TotalAmount = -5.00, // Invalid
                Status = OrderStatus.Pending
            };
            _controller.ModelState.AddModelError("TotalAmount", "Le montant total doit être supérieur à 0.");

            // Act
            var result = await _controller.Create(orderDto);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
        }

        [TestMethod]
        public async Task UpdateStatus_ExistingOrder_ReturnsNoContent()
        {
            // Arrange
            var orderId = Guid.NewGuid();
            var order = new Order { Id = orderId, ClientName = "Jean Dupont", TotalAmount = 150.50, Status = OrderStatus.Pending };
            var updateDto = new UpdateOrderStatusDto { Status = OrderStatus.Completed };

            _mockRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);

            // Act
            var result = await _controller.UpdateStatus(orderId, updateDto);

            // Assert
            var noContentResult = result as NoContentResult;
            Assert.IsNotNull(noContentResult);
            _mockRepository.Verify(r => r.UpdateStatusAsync(orderId, OrderStatus.Completed), Times.Once);
        }

        [TestMethod]
        public async Task UpdateStatus_NonExistingOrder_ReturnsNotFound()
        {
            // Arrange
            var orderId = Guid.NewGuid();
            var updateDto = new UpdateOrderStatusDto { Status = OrderStatus.Completed };
            _mockRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync((Order?)null);

            // Act
            var result = await _controller.UpdateStatus(orderId, updateDto);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
        }

        [TestMethod]
        public async Task Delete_ExistingOrder_ReturnsNoContent()
        {
            // Arrange
            var orderId = Guid.NewGuid();
            var order = new Order { Id = orderId, ClientName = "Jean Dupont", TotalAmount = 150.50, Status = OrderStatus.Pending };

            _mockRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order);

            // Act
            var result = await _controller.Delete(orderId);

            // Assert
            var noContentResult = result as NoContentResult;
            Assert.IsNotNull(noContentResult);
            _mockRepository.Verify(r => r.DeleteAsync(orderId), Times.Once);
        }

        [TestMethod]
        public async Task Delete_NonExistingOrder_ReturnsNotFound()
        {
            // Arrange
            var orderId = Guid.NewGuid();
            _mockRepository.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync((Order?)null);

            // Act
            var result = await _controller.Delete(orderId);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
        }
    }
}
