import { http } from './httpClient.js'

export async function getOrchids() {
  const { data } = await http.get('/orchids/')
  return data
}

export async function getOrchid(id) {
  const { data } = await http.get(`/orchids/${id}`)
  return data
}

export async function createOrchid(orchid) {
  const { data } = await http.post('/orchids/', orchid)
  return data
}

export async function updateOrchid(id, orchid) {
  const { data } = await http.put(`/orchids/${id}`, orchid)
  return data
}

export async function deleteOrchid(id) {
  await http.delete(`/orchids/${id}`)
}

export async function getCategories() {
  const { data } = await http.get('/categories/')
  return data
}
