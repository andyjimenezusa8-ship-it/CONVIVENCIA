import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlusIcon, UsersIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'COMMITTEE'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'COMMITTEE' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear usuario.');
    }
  };

  const toggleUserActive = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}`, { active: !user.active });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar usuario.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <UsersIcon className="w-7 h-7 text-brand-blue" />
            Gestión de Usuarios del Comité
          </h1>
          <p className="text-xs text-slate-500 mt-1">Administración de accesos y roles del sistema</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-blue text-white font-bold px-4 py-2.5 rounded-2xl text-xs hover:bg-sky-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <UserPlusIcon className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Nombre</th>
                <th className="py-3.5 px-4">Correo</th>
                <th className="py-3.5 px-4">Rol</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-brand-blue" />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-red-50 text-brand-red' : 'bg-sky-50 text-brand-blue'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircleIcon className="w-4 h-4" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-semibold">
                          <XCircleIcon className="w-4 h-4" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserActive(u)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                      >
                        {u.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Crear Nuevo Usuario</h3>
            
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rol de Usuario</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="COMMITTEE">Miembro Comité</option>
                  <option value="ADMIN">Administrador Principal</option>
                  <option value="READONLY">Solo Consulta</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-sky-700"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
