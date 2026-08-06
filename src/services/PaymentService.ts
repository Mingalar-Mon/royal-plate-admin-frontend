import { PaymentMethod } from '@/@types/restaurant'
import ApiService from './ApiService'
import { PASSWORD, USER_NAME } from '@/constants/api.constant'
import { GetPaymentMethodsResponse } from '@/@types/paymentMethods'

export async function apiGetPaymentMethods() {
    return ApiService.fetchDataWithAxios<GetPaymentMethodsResponse>({
        url: `/payment-methods`,
        method: 'get',
        auth: {
            username: USER_NAME,
            password: PASSWORD,
        },
    })
}
