const paymentMethodImages: Record<string, string> = {
    cash: '/images/payments/cash.png',
    card: '/images/payments/card.png',
    mobile: '/images/payments/mobile.png',
}

const PaymentMethodImage = ({
    paymentMehod,
    className,
}: {
    paymentMehod: string
    className?: string
}) => {
    const src =
        paymentMethodImages[paymentMehod] || '/images/payments/default.png'
    return <img src={src} alt={paymentMehod} className={className} />
}

export default PaymentMethodImage
