import { useState } from 'react';

const ADMIN_USER = 'dalirium';
const ADMIN_PASS = 'Dali2025!';
const SESSION_KEY = 'admin_auth';

const AdminGuard = ({ children }) => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [form, setForm] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.user === ADMIN_USER && form.pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  if (authed) return children;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Dalirium</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Usuario</label>
            <input
              type="text"
              value={form.user}
              onChange={(e) => setForm({ ...form, user: e.target.value })}
              required
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-amber-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={form.pass}
              onChange={(e) => setForm({ ...form, pass: e.target.value })}
              required
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-amber-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-bold transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminGuard;
