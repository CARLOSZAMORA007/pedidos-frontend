import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; 

interface Order {
  id: number;
  drinkName: string;
  size: string;
  accepted: boolean;
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drinkName, setDrinkName] = useState('');
  const [size, setSize] = useState('medium');
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  const createOrder = async () => {
    if (!drinkName) {
      setMessage('El nombre de la bebida es obligatorio');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/orders', {
        drinkName,
        size
      });
      setMessage(response.data.accepted ? 'Orden aceptada' : 'Orden no aceptada');
      fetchOrders();
    } catch (error) {
      setMessage('Error al crear la orden');
      console.error('Error creating order', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="p-8 max-w-2xl w-full bg-white bg-opacity-80 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Gestión de Órdenes</h1>

        <div className="mb-6 p-4 border rounded-lg shadow bg-white bg-opacity-90 ">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Nueva Orden</h2>
          <input
            type="text"
            placeholder="Nombre de la bebida"
            value={drinkName}
            onChange={(e) => setDrinkName(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border rounded p-2 w-full mb-4"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <button
            onClick={createOrder}
            className="w-full bg-amber-700 text-white p-2 rounded hover:bg-amber-800 transition"
          >
            Crear Orden
          </button>
          {message && <p className="mt-4 text-center font-medium text-amber-900">{message}</p>}
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Órdenes Existentes</h2>
        {orders.map((order) => (
          <div key={order.id} className="mb-3 p-4 border rounded-lg shadow bg-white bg-opacity-90">
            <p><strong>Bebida:</strong> {order.drinkName}</p>
            <p><strong>Tamaño:</strong> {order.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
