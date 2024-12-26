import React, { useState, useEffect } from "react";
import { fetchStocks, getPortfolioValue, addStock, updateStock, deleteStock } from "./api";

// CSS styling for 3D animation and general layout
import './Dashboard.css'; // Assuming you have a Dashboard.css file for styling

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    fetchStocks().then((response) => setStocks(response.data));
    getPortfolioValue().then((response) => setPortfolioValue(response.data));
  }, []);

  const handleDelete = (id) => {
    deleteStock(id).then(() => {
      setStocks(stocks.filter((stock) => stock.id !== id));
    });
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setShowModal(true); // Show modal for editing
  };

  const handleAddNewStock = () => {
    setSelectedStock(null); // Reset selected stock for adding new stock
    setShowModal(true); // Show modal for adding a new stock
  };

  const handleSave = () => {
    fetchStocks().then((response) => setStocks(response.data));
    setShowModal(false); // Close modal after saving
    window.location.reload(); // Refresh the page after adding/updating the stock
  };

  // Stock Form Handling
  const handleFormSubmit = (e, formData) => {
    e.preventDefault();
    const apiCall = selectedStock
      ? updateStock(selectedStock.id, formData)
      : addStock(formData);

    apiCall.then(() => handleSave());
  };

  // Filtering stocks based on search query
  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <body>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Portfolio Dashboard</h1>
        <h2 className="portfolio-value">Total Value: ${portfolioValue.toFixed(2)}</h2>

        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by stock name or ticker"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Button to add new stock */}
        <div className="form-container">
          <button className="add-stock-button" onClick={handleAddNewStock}>
            Add New Stock
          </button>
        </div>

        {/* Stock Table */}
        <div className="table-container">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Ticker</th>
                <th>Quantity</th>
                <th>Buy Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <tr key={stock.id} className="stock-row">
                    <td>{stock.name}</td>
                    <td>{stock.ticker}</td>
                    <td>{stock.quantity}</td>
                    <td>${stock.buyPrice}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(stock)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(stock.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No stocks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Add/Edit Form */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h3>{selectedStock ? "Edit Stock" : "Add New Stock"}</h3>
              <StockForm
                stock={selectedStock}
                onSave={handleSave}
                onSubmit={handleFormSubmit}
              />
              <button onClick={() => setShowModal(false)} className="close-modal">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </body>
  );
};

const StockForm = ({ stock, onSave, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    quantity: 1,
    buyPrice: "",
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        name: stock.name,
        ticker: stock.ticker,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
      });
    }
  }, [stock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form className="stock-form" onSubmit={(e) => onSubmit(e, formData)}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Stock Name"
        required
      />
      <input
        type="text"
        name="ticker"
        value={formData.ticker}
        onChange={handleChange}
        placeholder="Ticker"
        required
      />
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
        min="1"
      />
      <input
        type="number"
        name="buyPrice"
        value={formData.buyPrice}
        onChange={handleChange}
        placeholder="Buy Price"
        required
        min="0"
        step="0.01"
      />
      <button type="submit">{stock ? "Update" : "Add"} Stock</button>
    </form>
  );
};

export default Dashboard;
