import { Navigate } from "react-router-dom";

const Register = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        <form action="#" className="border border-default p-5">
          <h1 class="text-2xl font-semibold text-heading mb-6">
            Crear una cuenta
          </h1>
          <InputForm
            label="Nombre"
            id="name"
            name="name"
            type="text"
            placeholder="Nombre"
            required
          ></InputForm>
          <InputForm
            label="Apellido"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Apellido"
            required
          ></InputForm>
          <InputForm
            label="Correo Electrónico"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            required
          ></InputForm>
          <InputForm
            label="Contraseña"
            id="password"
            name="password"
            type="password"
            placeholder="**********"
            required
          ></InputForm>
          <InputForm
            label="Confirmar Contraseña"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="**********"
            required
          ></InputForm>
          <div class="flex items-start my-6">
            <div class="flex items-center">
              <input
                id="checkbox-remember"
                type="checkbox"
                value=""
                required
                class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
              ></input>
              <label
                for="checkbox-remember"
                class="ms-2 text-sm font-medium text-heading"
              >
                Acepto Términos y Condiciones y las Políticas de Privacidad y
                Tratamiento de Datos.
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Crear cuenta
          </button>
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
              src="/public/assets/img_credit_card.png"
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
              src="/public/assets/img_security.png"
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
              src="/public/assets/img_truck.png"
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
  );
};

function InputForm({
  label,
  id,
  name,
  type,
  autoComplete,
  placeholder,
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
          class="bg-neutral-secondary-medium rounded-md bg-white/5 border text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          required={required}
        />
      </div>
    </>
  );
}

export default Register;
