import "./App.css";
import { useState, useEffect } from "react"; // 
import Header from "./components/header";
import Footer from "./components/footer";
import CartPanel from "./components/cart/CartPanel";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import CheckoutPage from "./pages/CheckoutPage";
import SplashScreen from "./components/ui/SplashScreen"; //

function App() {
  const [loading, setLoading] = useState(true); // Estado inicial en true

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Se oculta tras 2 segundos
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Si está cargando, solo mostramos el Splash
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <CartPanel />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/register" element={<Register />} />
              <Route
                path="/login/forgotpassword"
                element={<ForgotPassword />}
              />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;