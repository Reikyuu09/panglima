const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getAuthHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw { status: res.status, message: data.message || 'Terjadi kesalahan', data };
  }
  return data;
}

// Auth
export const authAPI = {
  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () =>
    request('/auth/logout', { method: 'POST' }),
};

// Parkir
export const parkirAPI = {
  getAll: () => request('/parkir'),
  getById: (id) => request(`/parkir/${id}`),
  checkIn: (body) =>
    request('/parkir/checkin', { method: 'POST', body: JSON.stringify(body) }),
  keluar: (body) =>
    request('/parkir/keluar', { method: 'POST', body: JSON.stringify(body) }),
};

// Kendaraan
export const kendaraanAPI = {
  getAll: () => request('/parkir/kendaraan'),
  create: (body) =>
    request('/parkir/kendaraan', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/parkir/kendaraan/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) =>
    request(`/parkir/kendaraan/${id}`, { method: 'DELETE' }),
};

// Pembayaran
export const pembayaranAPI = {
  getAll: () => request('/pembayaran'),
  getByParkirId: (id) => request(`/pembayaran/parkir/${id}`),
  proses: (body) =>
    request('/pembayaran/proses', { method: 'POST', body: JSON.stringify(body) }),
};

// Laporan
export const laporanAPI = {
  getRiwayat: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return request(`/laporan/riwayat?${params.toString()}`);
  },
};

// Users
export const usersAPI = {
  getAll: () => request('/users'),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};
