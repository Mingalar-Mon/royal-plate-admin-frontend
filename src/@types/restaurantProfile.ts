import {
    Cuisine,
    Owner,
    PaymentMethod,
    Restaurant,
    RestaurantProfile,
} from './restaurant'

export type GetRestaurantProfileResponse = {
    success: boolean
    data: RestaurantProfile & {
        cuisines: Cuisine[]
        paymentMethods: PaymentMethod[]
        restaurant: Restaurant
    }
    message: string
}

export type UpdateRestaurantProfileResponse = {
    success: boolean
    data: RestaurantProfile & {
        cuisines: Cuisine[]
        paymentMethods: PaymentMethod[]
    }
    message: string
}

export type CreateRestaurantProfileResponse = {
    success: boolean
    data: [RestaurantProfile & { owner: Owner }]
    message: string
}
/*
 {
    "success": true,
    "data": [
        {
            "id": "78bb5378-1a0d-4921-a10e-177efd34baf0",
            "description": "damnnnn, do i really have to type over 20 characters . damn ittttt.",
            "openingHour": 540,
            "closingHour": 1080,
            "contactNumber": "+959965275898",
            "websiteUrl": "https://mingalarmon.com",
            "parking": true,
            "dressCode": "Casual",
            "accessibility": "",
            "cuisines": [
                {
                    "id": "9334b4df-f2ee-4927-becd-e129c99dfeaf",
                    "name": "Shan",
                    "image": "cuisines/1778146275712-shan.png",
                    "description": "Shan Noodle, Dumplin, Baozi",
                    "created_at": "2026-05-07T09:31:16.791Z",
                    "updated_at": "2026-05-07T09:31:16.791Z"
                }
            ],
            "paymentMethods": [
                {
                    "id": "d8d02202-b81f-41f8-bac8-fd4fe8e58ced",
                    "name": "Kpay",
                    "image": "kpay-logo.png"
                }
            ],
            "restaurant": {
                "id": "62027174-8805-4059-9840-b0fd69b19b79",
                "name": "Ice Berry",
                "address": "45 ward, North Dagon, Yangon",
                "imageUrls": [
                    "restaurants/gallery/1778161677930-restaurant-1.png",
                    "restaurants/gallery/1778161678066-restaurant-2.png",
                    "restaurants/gallery/1778161678126-restaurant-3.png",
                    "restaurants/gallery/1778161678201-restaurant-4.png",
                    "restaurants/gallery/1778408699714-restaurant-5.png",
                    "restaurants/gallery/1778408700600-restaurant-5.png"
                ],
                "startingPrice": 20000,
                "endingPrice": 500000,
                "latitude": "16.8929458",
                "longitude": "96.1926949",
                "created_at": "2026-05-07T13:47:58.276Z",
                "updated_at": "2026-05-10T18:12:53.384Z"
            }
        }
    ],
    "message": "Profile created successfully"
}

*/
