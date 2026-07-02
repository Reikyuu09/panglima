const BASE_URL = 'http://localhost:3000/api';

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
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: getAuthHeaders(),
      ...options,
    });

    // Cek content-type untuk tahu response-nya JSON atau HTML
    const contentType = res.headers.get('content-type');
    
    // Jika response bukan JSON (misalnya HTML dari Vite dev server)
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Response bukan JSON:', text.substring(0, 200));
      throw {
        status: res.status,
        message: `Server mengembalikan response tidak valid. Pastikan backend running dan proxy sudah dikonfigurasi di vite.config.js`,
        data: null
      };
    }

    // Parse JSON
    const data = await res.json();
    
    if (!res.ok) {
      if (res.status === 401) {
        console.log('Token tidak valid/expired, auto-logout...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
      throw {
        status: res.status,
        message: data.message || data.pesan || 'Terjadi kesalahan',
        data: data
      };
    }

    return data;
  } catch (error) {
    // Jika error karena network (backend mati)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        status: 0,
        message: 'Tidak dapat terhubung ke server. Pastikan backend sudah running di port 3000.',
        data: null
      };
    }
    throw error;
  }
}

// ====================
// Auth API
// ====================
export const authAPI = {
  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () =>
    request('/auth/logout', { method: 'POST' }),
};

// ====================
// Parkir API
// ====================
export const parkirAPI = {
  getAll: () => request('/parkir'),
  getById: (id) => request(`/parkir/${id}`),
  checkIn: (body) =>
    request('/parkir/checkin', { method: 'POST', body: JSON.stringify(body) }),
  keluar: (body) =>
    request('/parkir/keluar', { method: 'POST', body: JSON.stringify(body) }),
  // ✅ NEW: Cari kendaraan by plat nomor
  cari: (plat_nomor) =>
    request('/parkir/cari', { method: 'POST', body: JSON.stringify({ plat_nomor }) }),
};

// ====================
// Kendaraan API
// ====================
export const kendaraanAPI = {
  getAll: () => request('/parkir/kendaraan'),
  create: (body) =>
    request('/parkir/kendaraan', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/parkir/kendaraan/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) =>
    request(`/parkir/kendaraan/${id}`, { method: 'DELETE' }),
};

// ====================
// Pembayaran API
// ====================
export const pembayaranAPI = {
  getAll: () => request('/pembayaran'),
  getByParkirId: (id) => request(`/pembayaran/parkir/${id}`),
  proses: (body) =>
    request('/pembayaran/proses', { method: 'POST', body: JSON.stringify(body) }),
};

// ====================
// Laporan API
// ====================
export const laporanAPI = {
  getRiwayat: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return request(`/laporan/riwayat?${params.toString()}`);
  },
};

// ====================
// Users API
// ====================
export const usersAPI = {
  getAll: () => request('/users'),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};