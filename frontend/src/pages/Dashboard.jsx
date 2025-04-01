import { useContext, useEffect, useState } from "react";
import ShopContext from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { shop, logoutShop } = useContext(ShopContext);
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [warehousesRes, inventoryRes] = await Promise.all([
          axios.get("http://localhost:5000/api/warehouse", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/inventory", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setWarehouses(warehousesRes.data);
        setInventory(inventoryRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logoutShop();
    navigate("/login");
  };

  const getInventoryForWarehouse = (warehouseId) => {
    return inventory.filter((item) => item.warehouseId === warehouseId);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {shop?.name}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="space-y-8">
        {warehouses.map((warehouse) => (
          <div key={warehouse._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">
              {warehouse.name} - {warehouse.location}
            </h2>
            <p className="text-gray-600 mb-4">
              Capacity: {warehouse.capacity} units
            </p>

            <h3 className="text-xl font-medium mb-3">Inventory</h3>
            {getInventoryForWarehouse(warehouse._id).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border">Product</th>
                      <th className="py-2 px-4 border">SKU</th>
                      <th className="py-2 px-4 border">Quantity</th>
                      <th className="py-2 px-4 border">Price</th>
                      <th className="py-2 px-4 border">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getInventoryForWarehouse(warehouse._id).map((item) => (
                      <tr key={item._id}>
                        <td className="py-2 px-4 border text-center">
                          {item.productName}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {item.sku}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          ${item.price}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {item.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No inventory in this warehouse</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;