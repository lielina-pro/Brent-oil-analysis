const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  getPrices: (start, end) => {
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    const qs = params.toString()
    return get(`/prices${qs ? `?${qs}` : ''}`)
  },
  getPricesSummary: () => get('/prices/summary'),
  getVolatility: (window = 30) => get(`/prices/volatility?window=${window}`),
  getEvents: () => get('/events'),
  getEventCategories: () => get('/events/categories'),
  getChangepoints: () => get('/changepoints'),
}
