import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { registerCartPurchases } from "../../services/bookService";

const CheckoutSelected = () => {
  const { items, totalPrice, clear } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setPurchaseError(null);

    try {
      // Registrar cada libro del carrito como compra en el API
      const result = await registerCartPurchases(items);

      if (result.failed > 0) {
        const detail = result.errors.map((e) => `• ${e.item}: ${e.reason}`).join("\n");
        console.warn(
          `Compras: ${result.succeeded} exitosas, ${result.failed} fallidas de ${result.total}\n${detail}`,
        );
        // Si TODAS fallaron, mostrar error en pantalla sin navegar
        if (result.succeeded === 0) {
          setPurchaseError(
            `No se pudo registrar la compra. Detalle: ${result.errors[0]?.reason ?? "error desconocido"}`,
          );
          return;
        }
      }

      // Limpiar carrito y navegar al home con mensaje de éxito
      clear();
      navigate("/", {
        state: {
          successMessage: "Pedido realizado con éxito",
        },
      });
    } catch (err) {
      console.error("Error al registrar compra:", err);
      setPurchaseError(
        "Hubo un error al procesar la compra. Por favor, intenta de nuevo.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="border rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Artículos</h2>
        <hr class="border-b border-gray-400"></hr>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-3 last:border-b-0"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.img}
                alt={item.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.author}</p>
                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <div>
          <div className="flex justify-between items-center text-2xl font-bold py-3">
            <span>Total a Pagar:</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          {purchaseError && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 text-center">
              {purchaseError}
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-xl flex items-center justify-center gap-2 transition-colors"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Procesando compra...
              </>
            ) : (
              "Confirmar y Pagar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSelected;
