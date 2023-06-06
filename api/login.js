import request from './request'

export const login = (data) => request.post('/api/v1/login', data)