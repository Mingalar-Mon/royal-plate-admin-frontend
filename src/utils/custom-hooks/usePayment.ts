import { apiGetPaymentMethods } from '@/services/PaymentService'
import { useQuery } from '@tanstack/react-query'

export const useGetPaymentMethods = () => {
    return useQuery({
        queryKey: ['payment_methods'],
        queryFn: apiGetPaymentMethods,
    })
}
