import { GetBlogDetailResponse } from '@/@types/blog'
import ApiService from './ApiService'

export async function apiGetBlogList(restaurantId: string, params: any) {
    console.log('Params: ', params)
    return ApiService.fetchDataWithAxios<any>({
        url: `restaurants/${restaurantId}/blogs/blog-list`,
        method: 'get',
        params: {
            page: params.pageIndex,
            limit: params.pageSize,
            search: params.query || undefined,
            sortKey: params.sort?.key,
            sortOrder: params.sort?.order,
        },
    })
}

export async function apiGetBlogDetail({
    restaurantId,
    blogId,
}: {
    restaurantId: string
    blogId: string
}) {
    return ApiService.fetchDataWithAxios<GetBlogDetailResponse>({
        url: `restaurants/${restaurantId}/blogs/blog-detail/${blogId}`,
        method: 'get',
    })
}

export async function apiCreateBlog({
    restaurantId,
    formData,
}: {
    restaurantId: string
    formData: FormData
}) {
    return ApiService.fetchDataWithAxios<any>({
        url: `restaurants/${restaurantId}/blogs/create`,
        method: 'post',
        data: formData, // Axios automatically binds multipart boundaries boundary maps
    })
}

export async function apiUpdateBlog({
    blogId,
    restaurantId,
    formData,
}: {
    blogId: string
    restaurantId: string
    formData: FormData
}) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/restaurants/${restaurantId}/blogs/edit/${blogId}`,
        method: 'patch',
        data: formData,
    })
}

export async function apiDeleteBlog({
    blogId,
    restaurantId,
}: {
    blogId: string
    restaurantId: string
}) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/restaurants/${restaurantId}/blogs/delete/${blogId}`,
        method: 'delete',
    })
}
