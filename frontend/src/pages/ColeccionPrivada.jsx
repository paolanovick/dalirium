import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { getObrasByCategoria } from '../data/obras';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.agenciatripnow.site/dalirium';

const ColeccionPrivada = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [obras, setObras] = useState([]);
  const [form, setForm] = useState({ email: '', nombre: '', codigoAcceso: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('privada_token');
    const expiresAt = sessionStorage.getItem('privada_expires');
    
    if (token && expiresAt) {
      const now = new Date();
      const expires = new Date(expiresAt);
      
      if (now < expires) {
        setIsAuthenticated(true);
        setTimeLeft(Math.floor((expires - now) / 1000 / 60));
        loadObras();
      } else {
        sessionStorage.removeItem('privada_token');
        sessionStorage.removeItem('privada_expires');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || timeLeft === null) return;
    
    const interval = setInterval(() => {
      const expiresAt = sessionStorage.getItem('privada_expires');
      const now = new Date();
      const expires = new Date(expiresAt);
      const remaining = Math.floor((expires - now) / 1000 / 60);
      
      if (remaining <= 0) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('privada_token');
        sessionStorage.removeItem('privada_expires');
        setTimeLeft(null);
      } else {
        setTimeLeft(remaining);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, timeLeft]);

  const loadObras = async () => {
    try {
      const data = await getObrasByCategoria('coleccion-privada');
      setObras(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/accesos/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al acceder');
      }

      sessionStorage.setItem('privada_token', data.token);
      sessionStorage.setItem('privada_expires', data.expiresAt);
      setIsAuthenticated(true);
      setTimeLeft(30);
      loadObras();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <section className="pt-32 md:pt-40 pb-12 px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl md:text-5xl text-white text-center mb-6">
              Colección Privada
            </h1>
            <p className="text-white/50 text-center mb-8">
              Para acceder a esta colección exclusiva, contactanos por WhatsApp y te daremos el código de acceso.
            </p>

            <a
             href="https://wa.me/34687789792?text=Hola!%20Quisiera%20ingresar%20a%20la%20colección%20privada.%20¿Me%20darían%20el%20código?" target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg mb-8 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contactar por WhatsApp
            </a>

            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">Ya tengo el código</h2>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-white/70 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-amber-500 outline-none"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white/70 mb-2">Nombre (opcional)</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-amber-500 outline-none"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white/70 mb-2">Código de acceso *</label>
                <input
                  type="text"
                  required
                  value={form.codigoAcceso}
                  onChange={(e) => setForm({ ...form, codigoAcceso: e.target.value.toUpperCase() })}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-amber-500 outline-none uppercase"
                  placeholder="CÓDIGO"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white py-3 rounded font-bold transition-colors"
              >
                {submitting ? 'Verificando...' : 'Acceder'}
              </button>
            </form>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="pt-32 md:pt-40 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-5xl text-white">
              Colección Privada
            </h1>
            <div className="text-amber-500 text-sm">
              Tiempo restante: {timeLeft} minutos
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : obras.length === 0 ? (
            <p className="text-white/50 text-center py-20">
              No hay obras en la colección privada todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {obras.map(obra => (
                <div key={obra.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={obra.imagenPrincipal}
                    alt={obra.titulo}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white text-lg font-semibold">{obra.titulo}</h3>
                    <p className="text-amber-500">{obra.precio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default ColeccionPrivada;