import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    apiGetBlogList,
    apiGetBlogDetail,
    apiCreateBlog,
    apiUpdateBlog,
    apiDeleteBlog,
} from '@/services/BlogService'

export const useGetBlogListQuery = (restaurantId: string, params: any) => {
    return useQuery({
        queryKey: ['blogs', restaurantId, params],
        queryFn: () => apiGetBlogList(restaurantId, params),
        enabled: !!restaurantId,
    })
}

export const useGetBlogDetailQuery = (blogId: string, restaurantId: string) => {
    return useQuery({
        queryKey: ['blog', blogId],
        queryFn: () => apiGetBlogDetail({ blogId, restaurantId }),
        enabled: !!blogId,
    })
}

export const useCreateBlogMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiCreateBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
    })
}

export const useUpdateBlogMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            blogId,
            restaurantId,
            data,
        }: {
            blogId: string
            restaurantId: string
            data: FormData
        }) => apiUpdateBlog({ blogId, restaurantId, formData: data }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            queryClient.invalidateQueries({
                queryKey: ['blog', variables.blogId],
            })
        },
    })
}

export const useDeleteBlogMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiDeleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
    })
}
