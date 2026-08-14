import client from './client';

export const adminApi = {
  dashboard: () => client.get('/admin/dashboard/analytics'),
  complaints: (params) => client.get('/admin/complaints', { params }),
  details: (id) => client.get(`/admin/complaints/${id}`),
  overridePriority: (id, payload) => client.post(`/admin/complaints/${id}/override-priority`, payload),
  overrideDepartment: (id, payload) => client.post(`/admin/complaints/${id}/override-department`, payload),
  reassignWorker: (id, payload) => client.post(`/admin/complaints/${id}/reassign-worker`, payload),
  overrideResolution: (id, payload) => client.post(`/admin/complaints/${id}/override-resolution`, payload),
  close: (id, payload) => client.post(`/admin/complaints/${id}/close`, payload),
};
