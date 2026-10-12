import { http } from './httpClient.js'

export async function getOrchids() {
  const { data } = await http.get('/')
  return data
}

export async function getOrchid(id) {
  const { data } = await http.get(`/${id}`)
  return data
}

export async function createOrchid(orchid) {
  const { data } = await http.post('/', orchid)
  return data
}

export async function updateOrchid(id, orchid) {
  const { data } = await http.put(`/${id}`, orchid)
  return data
}

export async function deleteOrchid(id) {
  await http.delete(`/${id}`)
}
