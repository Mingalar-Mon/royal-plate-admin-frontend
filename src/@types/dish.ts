import { Paginator } from './common_type'
import { Cuisine } from './restaurant'

export type Dish = {
    id: string
    name: string
    coverImage: {
        key: string
        url: string
    }
    detailImages: {
        key: string
        url: string
    }[]
    price: number
    availableForOrder: boolean
    description?: string
    preparationTime: number
    created_at: string
    updated_at: string
}

export type CreateDishResponse = {
    success: true
    data: Omit<Dish, 'coverImage' | 'detailImages'> &
        {
            coverImageUrl: string
            detailImageUrls: string[]
            restaurant: { id: string }
            description: string | null
            preparationTime: number | null
        }[]

    message: string
}
/*
{
    "success": true,
    "data": [
        {
            "name": "Shan Noodles",
            "coverImageUrl": "dishes/cover/1778567883256-shan-noodle-cover.png",
            "price": 6000,
            "detailImageUrls": [
                "dishes/details/1778567884305-shan-noodle-1.png",
                "dishes/details/1778567884397-shan-noodle-2.png",
                "dishes/details/1778567884471-shan-noodle-3.png"
            ],
            "availableForOrder": true,
            "description": "A very delicious noodles",
            "preparationTime": 15,
            "restaurant": {
                "id": "b99b65ce-fef3-4fc1-aaf6-1e5c565eaa3a"
            },
            "id": "21a371d3-0e32-4ff5-aeae-bbeea4a52237",
            "created_at": "2026-05-12T06:38:04.673Z",
            "updated_at": "2026-05-12T06:38:04.673Z"
        }
    ],
    "message": "Dish created successfully"
}
*/

export type UpdateDishResponse = {
    success: boolean
    data: Dish
    message: string
}

export type GetDishListResponse = {
    success: boolean
    paginator: Paginator
    data: {
        id: string
        name: string
        coverImage: {
            key: string
            url: string
        }
        detailImages: {
            key: string
            url: string
        }[]
        price: number
        availableForOrder: boolean
        description?: string
        preparationTime: number
        created_at: string
        updated_at: string
        cuisine: Cuisine
    }[]
    /*
    Dish &
        {
            cuisine: Cuisine
        }[]
    */
    message: string
}

export type GetDishResponse = {
    success: boolean
    data: Dish & { cuisine: Cuisine }
    message: string
}

export type DeleteDishResponse = {
    success: boolean
    data: {
        name: string
        coverImageUrl: string
        price: 2000
        detailImageUrls: string[]
        availableForOrder: boolean
        description: string | null
        preparationTime: string | null
        created_at: string
        updated_at: string
    }
    message: string
}

/* update dish 
{
    "success": true,
    "data": {
        "id": "c245dd4d-a235-4563-aa19-1974468e11ce",
        "name": "Sandwich",
        "coverImageUrl": "dishes/cover/1780299801574-sandwich-1.png",
        "price": "3000",
        "detailImageUrls": [
            "dishes/details/1780299802028-sandwich-2.png",
            "dishes/details/1780299803373-sandwich.png"
        ],
        "availableForOrder": true,
        "description": "American Sandwich",
        "preparationTime": "30",
        "created_at": "2026-06-01T07:43:23.492Z",
        "updated_at": "2026-06-01T07:51:42.830Z",
        "cuisine": {
            "id": "9e4bb71e-102b-4cc5-ba58-ff86a665303c"
        }
    },
    "message": "Dish was updated successfully."
}
*/
