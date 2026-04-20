using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SustainES_Backend.Data;
using SustainES_Backend.Models;

namespace SustainES_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. En Çok Sipariş Edilen Ürünler (Most Ordered Products)
        [HttpGet("most-ordered")]
        public async Task<IActionResult> GetMostOrdered()
        {
            var data = await _context.Orders
                .GroupBy(o => o.ProductId)
                .Select(g => new
                {
                    ProductName = _context.Products.Where(p => p.Id == g.Key).Select(p => p.ProductName).FirstOrDefault(),
                    TotalQuantity = g.Sum(o => o.Quantity)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(5)
                .ToListAsync();

            return Ok(data);
        }

        // 2. Genel İstatistikler (Total Orders, Products, Users)
        [HttpGet("stats")]
        public async Task<IActionResult> GetGeneralStats()
        {
            var totalOrders = await _context.Orders.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            
            var lastMonth = DateTime.Now.AddMonths(-1);
            var lastYear = DateTime.Now.AddYears(-1);
            var lastMonthOrders = await _context.Orders
                .Where(o => o.OrderDate >= lastMonth)
                .CountAsync();
            var lastYearOrders = await _context.Orders
                .Where(o => o.OrderDate >= lastYear)
                .CountAsync();

            return Ok(new
            {
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalUsers = totalUsers,
                LastMonthOrders = lastMonthOrders,
                LastYearOrders = lastYearOrders
            });
        }

        [HttpGet("least-ordered")]
        public async Task<IActionResult> GetLeastOrdered()
        {
            var data = await _context.Orders
                .GroupBy(o => o.ProductId)
                .Select(g => new
                {
                    ProductName = _context.Products.Where(p => p.Id == g.Key).Select(p => p.ProductName).FirstOrDefault(),
                    TotalQuantity = g.Sum(o => o.Quantity)
                })
                .OrderBy(x => x.TotalQuantity)
                .Take(5)
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("orders-last-year")]
        public async Task<IActionResult> GetOrdersLastYear()
        {
            var lastYear = DateTime.Now.AddYears(-1);
            var data = await _context.Orders
                .Where(o => o.OrderDate >= lastYear)
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            return Ok(data);
        }
    }
}