import { useLocation  } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CheckoutSuccess = () => {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (location.state?.successMessage) {
      setShowAlert(true);

      const timer = setTimeout(() => {
        setShowAlert(false);
        }, 5000);

    window.history.replaceState({}, document.title);
    
    return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div>
      {showAlert && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
        <div className="bg-emerald-500 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center space-x-3">

            <div>
            <p className="font-bold text-lg">{location.state.successMessage}</p>
            <p className="text-sm opacity-90">Gracias por tu compra</p>
            </div>
        </div>
        </div>
        )}
    </div>
  );
};

export default CheckoutSuccess;