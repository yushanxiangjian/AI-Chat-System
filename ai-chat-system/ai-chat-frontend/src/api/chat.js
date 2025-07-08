import axios from 'axios'

export const askChat = (messages) => {
  return axios.post('/api/proxy/ask', { messages }).then(res => res.data)
}
