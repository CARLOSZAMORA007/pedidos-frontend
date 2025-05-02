import { useState, useEffect } from 'react';
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
        size,
      });
      setMessage(response.data.accepted ? 'Orden aceptada' : 'Orden no aceptada');
      fetchOrders();
    } catch (error) {
      setMessage('Error al crear la orden, puede que hayas escrito mal o no hay ese tamaño');
      console.error('Error creating order', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container">
      <div className="panel">
        <h1 className="title">Gestión de Órdenes</h1>

        <div className="section">
          <h2>Nueva Orden</h2>
          <div>
            <label className="label" htmlFor="drinkName">Nombre de la bebida</label>
            <input
              id="drinkName"
              type="text"
              placeholder="Ej: Latte, Té Verde..."
              value={drinkName}
              onChange={(e) => setDrinkName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="size">Tamaño</label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="select"
            >
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>
          <button onClick={createOrder} className="button">
            Crear Orden
          </button>
          {message && <p className="message">{message}</p>}
        </div>

        <h2 className="section-title">Órdenes Existentes</h2>
        <div className="order-list">
          {orders.length === 0 && <p className="message">No hay órdenes registradas aún.</p>}
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p><strong>Bebida:</strong> {order.drinkName}</p>
              <p><strong>Tamaño:</strong> {order.size}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
