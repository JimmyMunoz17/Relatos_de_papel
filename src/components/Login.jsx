import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const email = formData.email.trim();
      const password = formData.password.trim();

      if (!email && !password) {
        const user = {
          id: 1,
          name: "user",
          email: "user@example.com",
          avatar: null,
        };
        onLogin(user);
      } else {
        const user = {
          id: 1,
          name: email ? email.split("@")[0] : "Usuario",
          email: email || "usuario@example.com",
          avatar: null,
        };
        onLogin(user);
      }
      navigate("/");
    } catch (err) {
      const user = {
        id: 1,
        name: "user",
        email: "user@example.com",
        avatar: null,
      };
      onLogin(user);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[82vh] flex flex-col justify-center py-10">
      <div className="max-w-7xl mx-auto px-4 py-10 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <form onSubmit={handleSubmit} className="border border-default p-5">
            <h1 className="text-2xl font-semibold text-heading mb-6">
              Iniciar sesión
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <InputForm
              label="Correo Electrónico"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputForm
              label="Contraseña"
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              placeholder="**********"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="flex items-start my-6">
              <div className="flex items-center">
                <input
                  id="checkbox-remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                />
                <label
                  htmlFor="checkbox-remember"
                  className="ms-2 text-sm font-medium text-heading"
                >
                  Recordarme
                </label>
              </div>
              <a
                href="/login/forgotpassword"
                className="ms-auto text-sm font-medium text-fg-brand hover:underline"
              >
                ¿Olvidó su contraseña?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
            <div className="text-sm pt-2 font-medium text-body">
              ¿No estás registrado?{" "}
              <a
                href="/login/register"
                className="text-fg-brand hover:underline"
              >
                Crear cuenta
              </a>
            </div>
          </form>
          <section className="px-10 pt-10 border border-default max-h-90">
            <h2 className="text-2xl font-semibold text-gray-900">
              Beneficios de comprar en{" "}
            </h2>
            <h3 className="text-xl pb-5 text-orange-600">
              <strong> Relatospapel.com</strong>
            </h3>
            <div className="flex gap-6 items-start">
              <img
                src="public/assets/img_credit_card.png"
                alt="Múltiples medios de pago"
                className="w-10 h-10 object-contain"
              />
              <div className="pb-5">
                <p className="font-semibold text-orange-500">
                  Múltiples medios de Pago
                </p>
                <p className="text-sm text-gray-600">
                  Paga con tarjeta crédito o débito.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <img
                src="public/assets/img_security.png"
                alt="Garantía de seguridad"
                className="w-10 h-10 object-contain"
              />
              <div className="pb-5">
                <p className="font-semibold text-orange-500">
                  Garantía de seguridad
                </p>
                <p className="text-sm text-gray-600">
                  Si tu producto falla, puedes devolverlo y te devolveremos el
                  dinero o reemplazaremos tu producto.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <img
                src="public/assets/img_truck.png"
                alt="Envíos a todo Colombia"
                className="w-10 h-10 object-contain"
              />
              <div className="pb-5">
                <p className="font-semibold text-orange-500">
                  Envíos a todo Colombia
                </p>
                <p className="text-sm text-gray-600">
                  Relatos de papel llega a la puerta de tu casa.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

function InputForm({
  label,
  id,
  name,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <>
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block mb-2.5 text-sm font-medium text-heading"
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="bg-neutral-secondary-medium rounded-md bg-white/5 border text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          required={required}
        />
      </div>
    </>
  );
}

export default Login;
