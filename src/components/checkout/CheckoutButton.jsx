import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CheckoutButton = () => {
  const { items } = useCart();

  return (
    <div>
       {items.length > 0 && (
          <div>
            {
              <Link to="/checkout" className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-center rounded">
                Proceder al Checkout
              </Link>
            }
          </div>
        )}
    </div>
  );
};

export default CheckoutButton;