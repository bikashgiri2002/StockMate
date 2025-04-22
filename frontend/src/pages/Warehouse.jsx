import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/warehouse`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWarehouses(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", location: "", capacity: "" });
    setIsEditing(false);
    setCurrentId(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/warehouse/${currentId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Warehouse updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/warehouse`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Warehouse added successfully");
      }

      resetForm();
      fetchWarehouses();
      setIsFormOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (warehouse) => {
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      capacity: warehouse.capacity,
    });
    setCurrentId(warehouse._id);
    setIsEditing(true);
    setIsFormOpen(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?"))
      return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/warehouse/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Warehouse deleted successfully");
      fetchWarehouses();
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting warehouse");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name && formData.location && Number(formData.capacity) > 0;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Warehouse Management</h2>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> Add Warehouse
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
            {success}
          </div>
        )}

        {isFormOpen && (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? "Edit Warehouse" : "Add New Warehouse"}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`flex justify-center items-center gap-2 w-full py-2 px-4 rounded-md text-white ${
                  isEditing
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                } ${
                  loading || !isFormValid ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : isEditing ? (
                  <>
                    <FiEdit /> Update Warehouse
                  </>
                ) : (
                  <>
                    <FiPlus /> Add Warehouse
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Warehouse List */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold">Warehouse List</h3>
          </div>

          {loading && warehouses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Loading warehouses...
            </div>
          ) : warehouses.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No warehouses found. Add your first warehouse to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {warehouse.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {warehouse.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {warehouse.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(warehouse)}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 p-1"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(warehouse._id)}
                          className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
