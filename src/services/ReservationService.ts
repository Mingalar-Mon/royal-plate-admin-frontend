import type {
    ReservationStatus,
    User,
} from '@/views/reservations/types/reservation.type'
import ApiService from './ApiService'
import { Paginator } from '@/@types/common_type'
import { Dish } from '@/@types/dish'
import { OnSortParam } from '@/components/shared/DataTable'

type TableType = 'family' | 'vip' | 'standard'
type TableStatus = 'active' | 'inactive' | 'maintenance'
export type ReservationItem = {
    id: string
    quantity: number
    unitPrice: number
    dish: Dish
}
type Table = {
    id: string
    type: TableType
    capacity: number
    durationMinutes: number
    tableFee: number
    status: TableStatus
    services: string[] | null
    created_at: string
    updated_at: string
}

export type GetReservationResponse = {
    success: boolean
    data: {
        id: string
        reservationNumber: string
        reservationDate: string
        startingTime: string
        endingTime: string
        status: ReservationStatus
        remark: string | null
        tax?: number
        totalPrice?: number
        created_at: string
        updated_at: string
        confirmed_at: string | null
        seated_at: string | null
        complete_at: string | null
        table: Table
        user: User
        reservationItems: {
            id: string
            quantity: number
            unitPrice: number
            dish: Dish
        }[]
    }
}

export type Reservation = {
    id: string
    reservationNumber?: string
    reservationDate: string
    startingTime: string
    endingTime: string
    status: ReservationStatus
    remark: string | null
    tax?: number
    totalPrice?: number
    created_at: string
    updated_at: string
    confirmed_at?: string | null
    seated_at?: string | null
    complete_at?: string | null
    terminated_at?: string | null
    table: Table
    user: User
    reservationItems: {
        id: string
        quantity: number
        unitPrice: number
        dish: Dish
    }[]
}

export type GetReservationListResponse = {
    success: boolean
    paginator: Paginator
    data: {
        id: string
        reservationNumber?: string
        reservationDate: string
        startingTime: string
        endingTime: string
        status: ReservationStatus
        remark: string | null
        tax?: number
        totalPrice?: number
        created_at: string
        updated_at: string
        user: User
        table: Table
        reservationItems: {
            id: string
            quantity: number
            unitPrice: number
            dish: Dish
        }[]
    }[]
}

interface GetReservationsParams {
    restaurantId: string
    pageIndex: number
    pageSize: number
    status?: string
    search?: string
    sort?: OnSortParam
    dateFrom?: string
    dateTo?: string
}
export async function apiGetReservations(params: GetReservationsParams) {
    return ApiService.fetchDataWithAxios<GetReservationListResponse>({
        url: `/reservation/get-reservations/${params.restaurantId}`,
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            status: params.status || undefined,
            search: params.search || undefined,
            sortKey: params.sort?.key,
            sortOrder: params.sort?.order,
            dateFrom: params.dateFrom || undefined,
            dateTo: params.dateTo || undefined,
        },
    })
}

export async function apiGetReservation(reservationId: string) {
    return ApiService.fetchDataWithAxios<GetReservationResponse>({
        url: `/reservation/get-reservation/${reservationId}`,
        method: 'get',
    })
}

/*
create reservation
{
    "success": true,
    "data": [
        {
            "id": "ca89724d-0785-49e9-968b-406609254313",
            "reservationDate": "2026-05-15",
            "startingTime": "2026-05-14T18:30:00.000Z",
            "endingTime": "2026-05-14T20:00:00.000Z",
            "status": "pending",
            "remark": null,
            "created_at": "2026-05-15T07:04:48.322Z",
            "updated_at": "2026-05-15T07:04:48.322Z",
            "table": {
                "id": "e3ad6d37-5e66-4262-ae14-4531d33c41d7",
                "type": "family",
                "capacity": 7,
                "durationMinutes": 90,
                "tableFee": 10000,
                "status": "active",
                "services": null,
                "created_at": "2026-05-15T06:45:45.157Z",
                "updated_at": "2026-05-15T06:45:45.157Z"
            },
            "reservationItems": [
                {
                    "id": "e24bb6fe-7433-4414-8c8d-7c913b6cd427",
                    "quantity": 3,
                    "unitPrice": 6000,
                    "dish": {
                        "id": "87ccf2bb-0518-4c3e-aa8f-a3efeb639f14",
                        "name": "Shan Burger",
                        "coverImageUrl": "dishes/cover/1778576874759-Burger.png",
                        "price": 6000,
                        "detailImageUrls": [
                            "dishes/details/1778568632554-shan-noodle-1.png",
                            "dishes/details/1778568632635-shan-noodle-2.png"
                        ],
                        "availableForOrder": true,
                        "description": "A very delicious noodles with two detail image ",
                        "preparationTime": 14,
                        "created_at": "2026-05-12T06:50:32.831Z",
                        "updated_at": "2026-05-12T14:47:53.114Z"
                    }
                },
                {
                    "id": "3194cb93-2b6c-4e01-af22-1540e20b7f1a",
                    "quantity": 2,
                    "unitPrice": 2000,
                    "dish": {
                        "id": "3caaa595-5063-4f72-bed6-225e2eb19cbb",
                        "name": "Burger",
                        "coverImageUrl": "dishes/cover/1778611278141-burger-3.jpg",
                        "price": 2000,
                        "detailImageUrls": [
                            "dishes/details/1778611279538-burger-1.jpg",
                            "dishes/details/1778611279612-burger-2.jpg",
                            "dishes/details/1778611279679-Burger.png"
                        ],
                        "availableForOrder": true,
                        "description": "American Style Burger",
                        "preparationTime": 15,
                        "created_at": "2026-05-12T18:41:19.772Z",
                        "updated_at": "2026-05-12T18:41:19.772Z"
                    }
                }
            ]
        }
    ],
    "message": "Reservation and pre-order submitted successfully."
}

*/

export type UpdateReservationStatusResponse = {
    success: boolean
    data?: Reservation
    message: string
}

export async function apiUpdateReservationStatus({
    reservationId,
    status,
}: {
    reservationId: string
    status: ReservationStatus
}) {
    return ApiService.fetchDataWithAxios<UpdateReservationStatusResponse>({
        url: `/reservation/update-status/${reservationId}`,
        method: 'patch',
        data: { status },
    })
}
