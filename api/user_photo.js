import request from './request'

export const addUserPhoto = (data) => request.post('/api/v1/user_photo', data)
export const updateUserPhoto = (id, data) => request.patch('/api/v1/user_photo/' + id, data)
export const deleteUserPhoto = (id) => request.delete('/api/v1/user_photo/' + id)
export const getUserPhoto = (id) => request.get('/api/v1/user_photo/' + id)
export const listUserPhoto = (data) => request.get('/api/v1/user_photo', data)

export const addUserPhotoWithAlpha = (data) => request.post('/api/v1/user_photo/create_with_alpha', data)
export const addUserPhotoWithBase64Alpha = (data) => request.post('/api/v1/user_photo/create_with_base64_alpha', data)
