import { message } from 'antd';
import axios from 'axios';
import useGlobalStore from '@/store';
import { RouteNames } from '../router';

export const baseURL = '/api'

const api = axios.create({
    baseURL,
    timeout: 60000,
})

api.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return config;
    }
)

api.interceptors.response.use(
    response => {
        if (!response.data.isSuccess) {
            return Promise.reject(response.data);
        }

        return response.data;
    },
    error => {
        if (error.response.status === 401) {
            useGlobalStore.getState().logout()

            window.location.href = `${RouteNames.Login}?return_url=${window.location.pathname}`;
        } else {
            message.error('请求异常', error);
        }
        
        // 错误处理
        return Promise.reject(error);
    }
)
export default api