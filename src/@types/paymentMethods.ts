import { PaymentMethod } from './restaurant'

export type GetPaymentMethodsResponse = {
    success: boolean
    data: PaymentMethod[]
    message: string
}
