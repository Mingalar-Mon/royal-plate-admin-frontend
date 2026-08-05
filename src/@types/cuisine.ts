export interface Cuisine {
    id: string
    name: string
    description: string
    created_at: string
    updated_at: string
    image: {
        key: string
        url: string
    }
}

export type GetCuisineResponse = {
    success: boolean
    paginator: {
        totalItems: number
        totalPages: number
        pageSize: number
        currentPage: number
    }
    data: Cuisine[]
    message: string
}

export type GetCuisineDetailResponse = {
    success: boolean
    data: Cuisine
    message: string
}

// ======= Get Cuisine Detail ===========\
/*
{
    "success": true,
    "data": {
        "id": "9334b4df-f2ee-4927-becd-e129c99dfeaf",
        "name": "Shan",
        "description": "Shan Noodle, Dumplin, Baozi",
        "created_at": "2026-05-07T09:31:16.791Z",
        "updated_at": "2026-05-07T09:31:16.791Z",
        "image": "https://sgp1.digitaloceanspaces.com/royal-plate-object-storage/cuisines/1778146275712-shan.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO8012YGNLG8HJ9H2FVQ%2F20260527%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20260527T052342Z&X-Amz-Expires=3600&X-Amz-Signature=ff4ca98d6c21ae27d33d9082ef6db6451fe489a7d4b8bc2a4eb76c50bd1849d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
    },
    "message": "Cuisine Detail"
}
*/

// ====== Create Cuisine ==========
/*
{
    "success": true,
    "data": [
        {
            "name": "Chinese",
            "image": "cuisines/1779827853857-chinese.jpg",
            "description": null,
            "id": "8890011c-daf1-44c7-9308-5424415a39d7",
            "created_at": "2026-05-26T20:37:35.937Z",
            "updated_at": "2026-05-26T20:37:35.937Z"
        }
    ],
    "message": "Cuisine was created successfully"
}
*/
