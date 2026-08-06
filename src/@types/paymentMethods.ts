export interface PaymentMethod {
    id: string
    name: string
    image: {
        key: string
        url: string
    }
}

export interface GetPaymentMethodsResponse {
    success: boolean
    data: PaymentMethod[]
    message: string
}
