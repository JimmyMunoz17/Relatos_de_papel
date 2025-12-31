import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext';

const CheckoutSelected = () => {
  const { items, totalPrice, clear} = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    clear();
    navigate('/', {
      state: {
        successMessage: 'Pedido realizado con éxito'
      }
    });
  };

  return (
    <div>
      <div className="border rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Artículos</h2>
          <hr class="border-b border-gray-400"></hr>
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b py-3 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <img src={item.img} alt={item.title} className="w-16 h-24 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.author}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div>
              <div className="flex justify-between items-center text-2xl font-bold py-3">
                <span>Total a Pagar:</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-lg font-bold text-xl">
                Confirmar y Pagar
              </button>
            </div>
        </div>
    </div>
  );
};

export default CheckoutSelected;