const ForgotPassword = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        <form action="#" className="border border-default p-5">
          <h1 class="text-2xl font-semibold text-heading mb-6">
            Restablecer su contraseña
          </h1>
          <InputForm
            label="Correo Electrónico"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            required
          ></InputForm>
          <button
            type="submit"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Restablecer Contraseña
          </button>
          <div class="text-sm pt-2 font-medium text-body">
            ¿No estás registrado?{" "}
            <a href="/login/register" class="text-fg-brand hover:underline">
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
              src="https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207071/Relatos%20de%20papel/img_credit_card_aa4j3t.png"
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
              src="https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207066/Relatos%20de%20papel/img_security_iajovh.png"
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
              src="https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207067/Relatos%20de%20papel/img_truck_nzmp2h.png"
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

export default ForgotPassword;
