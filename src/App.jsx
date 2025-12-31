import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import CartPanel from "./components/cart/CartPanel";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import CheckoutPage from "./pages/CheckoutPage";
import SplashScreen from "./components/ui/SplashScreen";

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const splashShown = sessionStorage.getItem("splashShown");
    if (!splashShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        setLoading(false);
        sessionStorage.setItem("splashShown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setUser(null);
    setTimeout(() => {
      navigate("/login");
      setIsLoggingOut(false);
    }, 100);
  };

  const isPublicRoute = [
    "/login",
    "/login/register",
    "/login/forgotpassword",
  ].includes(location.pathname);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <SplashScreen />;
    }

    if (isLoggingOut) {
      return <Navigate to="/login" replace />;
    }

    if (!user) {
      const defaultUser = {
        id: 1,
        name: "user",
        email: "user@example.com",
        avatar: null,
      };
      handleLogin(defaultUser);
      return <SplashScreen />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    if (
      ["/login", "/login/register", "/login/forgotpassword"].includes(
        location.pathname
      ) &&
      user
    ) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  if (loading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <CartProvider>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login onLogin={handleLogin} />
                </PublicRoute>
              }
            />
            <Route
              path="/login/register"
              element={
                <PublicRoute>
                  <Register onLogin={handleLogin} />
                </PublicRoute>
              }
            />
            <Route
              path="/login/forgotpassword"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
