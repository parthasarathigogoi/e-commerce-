import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval } from 'date-fns';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt, FaExchangeAlt, FaShoppingCart, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import './SellerStatistics.css';

const SellerStatistics = ({ products }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });

  // Generate mock data for demonstration
  useEffect(() => {
    generateMockData();
  }, [products, timeRange]);

  const generateMockData = () => {
    // Generate sales data based on time range
    const today = new Date();
    let startDate, endDate, interval;
    
    switch(timeRange) {
      case 'day':
        startDate = subDays(today, 1);
        endDate = today;
        interval = { hours: 1 };
        break;
      case 'week':
        startDate = subDays(today, 7);
        endDate = today;
        interval = { days: 1 };
        break;
      case 'month':
        startDate = startOfMonth(today);
        endDate = today;
        interval = { days: 1 };
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        interval = { months: 1 };
        break;
      default:
        startDate = subDays(today, 7);
        endDate = today;
        interval = { days: 1 };
    }

    // Generate daily sales data
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const mockSalesData = days.map(day => {
      // Generate random sales between 500 and 5000
      const sales = Math.floor(Math.random() * 4500) + 500;
      // Generate random orders between 5 and 50
      const orders = Math.floor(Math.random() * 45) + 5;
      // Generate random visitors between 100 and 1000
      const visitors = Math.floor(Math.random() * 900) + 100;
      
      return {
        date: format(day, 'MMM dd'),
        sales,
        orders,
        visitors,
        conversion: parseFloat(((orders / visitors) * 100).toFixed(2))
      };
    });
    
    setSalesData(mockSalesData);
    
    // Generate category data
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Books', 'Toys'];
    const mockCategoryData = categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 5000) + 1000
    }));
    
    setCategoryData(mockCategoryData);
    
    // Generate top products data
    const mockTopProducts = products.slice(0, 5).map(product => ({
      id: product.id || product._id,
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 20,
      revenue: parseFloat((product.price * (Math.floor(Math.random() * 100) + 20)).toFixed(2))
    }));
    
    setTopProducts(mockTopProducts);
    
    // Generate overview statistics
    const totalSales = mockSalesData.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
    const totalVisitors = mockSalesData.reduce((sum, item) => sum + item.visitors, 0);
    
    setOverviewStats({
      totalSales,
      totalOrders,
      averageOrderValue: parseFloat((totalSales / totalOrders).toFixed(2)) || 0,
      conversionRate: parseFloat(((totalOrders / totalVisitors) * 100).toFixed(2)) || 0,
      totalCustomers: Math.floor(totalOrders * 0.7), // Assuming 70% of orders are from unique customers
      totalRevenue: totalSales
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.name === 'sales' ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="seller-statistics">
      <div className="statistics-header">
        <h2><FaChartLine /> Sales Analytics Dashboard</h2>
        <div className="time-range-selector">
          <FaCalendarAlt />
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="statistics-overview">
        <div className="stat-card">
          <div className="stat-icon sales-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p>{formatCurrency(overviewStats.totalSales)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p>{overviewStats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon avg-icon">
            <FaExchangeAlt />
          </div>
          <div className="stat-content">
            <h3>Average Order</h3>
            <p>{formatCurrency(overviewStats.averageOrderValue)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon customers-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Customers</h3>
            <p>{overviewStats.totalCustomers}</p>
          </div>
        </div>
      </div>

      <div className="statistics-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine /> Overview
        </button>
        <button 
          className={activeTab === 'sales' ? 'active' : ''} 
          onClick={() => setActiveTab('sales')}
        >
          <FaChartBar /> Sales Analysis
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          <FaChartPie /> Product Performance
        </button>
      </div>

      <div className="statistics-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="chart-container">
              <h3>Sales & Orders Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="sales" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h3>Conversion Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="conversion" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} name="Conversion Rate (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="sales-tab">
            <div className="chart-container">
              <h3>Daily Sales Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h3>Visitors vs Orders</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
                  <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-tab">
            <div className="chart-container">
              <h3>Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="top-products-container">
              <h3>Top Performing Products</h3>
              <div className="top-products-list">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sales}</td>
                        <td>{formatCurrency(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerStatistics; 