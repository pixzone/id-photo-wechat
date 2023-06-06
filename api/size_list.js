import request from './request'

export const listPhotoSize = (data) => request.get('/api/v1/photo_size', data)  
export const listRecommendPhotoSize = () => request.get('/api/v1/photo_size/recommend', {})  
export const listCategoryPhotoSize = () => request.get('/api/v1/photo_size/category', {})  