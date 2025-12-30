import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-black">
      {/* Icono o Logo con animación de pulso */}
      <div className="text-6xl mb-4 animate-pulse">
        📚
      </div>
      
      {/* Nombre de tu marca */}
      <h1 className="text-2xl font-bold tracking-widest uppercase animate-bounce">
        Relatos de Papel
      </h1>
      
      {/* Barra de carga*/}
      <div className="w-48 h-1 bg-gray-100 mt-6 rounded-full overflow-hidden">
        <div className="h-full bg-black animate-[loading_2s_ease-in-out_infinite]"></div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;