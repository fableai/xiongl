import { message } from "antd"
import api from "./request"

/**
 * 创建支付意图
 * @param params 
 * @returns 
 */
export const fetchCreatePaymentIntent = async (params: {
    amount: number,
    currency: string
}): Promise<any> => {
    try {
        const response = await api.post('/System/CreatePaymentIntent', {
            amount: params.amount,
            currency: params.currency
        })

        return response
    } catch (error) {
        message.error('创建支付订单失败')

        return Promise.reject(error)
    }
}

/**
 * 获取系统参数
 * @returns 
 */
export const fetchGetSetParams = async (): Promise<any> => {
    try {
        const response = await api.post(`/System/GetSetParams`, {
            // env: window['__DEV__'] === 'development' ? 'dev' : 'prod'
            env: 'prod'
        })

        return response.data
    } catch (error) {
        message.error('查询系统参数失败')

        return Promise.reject(error)
    }
}

/**
 * 获取定价单信息
 * @returns 
 */
export const fetchGetPriceSet = async (): Promise<any> => {
    try {
        const response = await api.post(`/System/GetPriceSet`, )

        return response.data
    } catch (error) {
        message.error('查询定价单失败')

        return Promise.reject(error)
    }
}

/**
 * 支付确认
 * @returns 
 */
export const fetchPaymentConfirm = async (params: {
    priceSetGuid: string
    clientSecret: string
}): Promise<any> => {
    try {
        const response = await api.post(`/System/PaymentConfirm`, params)

        return response.data
    } catch (error) {
        message.error('支付确认失败')

        return Promise.reject(error)
    }
}