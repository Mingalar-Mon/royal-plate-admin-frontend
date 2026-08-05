import { useParams, useNavigate } from 'react-router'
// import Container from '@/components/shared/Container'
// import Card from '@/components/ui/Card'
// import Button from '@/components/ui/Button'
// import AdaptiveCard from '@/components/shared/AdaptiveCard'
// import Spinner from '@/components/ui/Spinner'
import { useGetBlogDetailQuery } from '@/utils/custom-hooks/useBlog' // Hook path matching your clean architecture
import { useRestaurantStore } from '@/store/restaurantStore'
// import {
//     TbEdit,
//     TbArrowNarrowLeft,
//     TbEye,
//     TbCalendar,
//     TbUser,
//     TbLink,
// } from 'react-icons/tb'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'

// Core Framework Style Assets Imports for Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import {
    TbArrowNarrowLeft,
    TbEdit,
    TbEye,
    TbCalendar,
    TbUser,
    TbLink,
    TbZoom,
    TbChevronLeft,
    TbChevronRight,
    TbX,
} from 'react-icons/tb'
import {
    Navigation,
    Pagination,
    Keyboard,
    Autoplay,
    EffectFade,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import classNames from 'classnames'
import { useState } from 'react'

const BlogDetail = () => {
    const { blogId, restaurantId } = useParams()
    const navigate = useNavigate()

    // Extract your persistent restaurant ID from the Zustand store
    const restaurantIdFromStore = useRestaurantStore(
        (state) => state.activeRestaurant?.id,
    )
    const activeRestaurantId = restaurantIdFromStore || restaurantId

    // 1. Local layout timeline controllers states for the carousel galleries
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    // 1. Fetch real blog payload data structure from React Query
    const { data: blogResponse, isLoading } = useGetBlogDetailQuery(
        blogId!,
        activeRestaurantId!,
    )

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    // 2. Unpack your response data object safely
    const blog = blogResponse?.data
    if (!blog) return <div className="p-8 text-center">Blog not found</div>

    console.log(blog)

    // Parse out dynamic authorship context values from your TypeORM relations mappings
    const authorName =
        blog.authorOwner?.name || blog.authorStaff?.name || 'Unknown'
    const authorRole =
        blog.authorStaff?.role || (blog.authorOwner ? 'Owner' : '')
    const activeImages = blog.images.map((img) => img.url) || []

    return (
        <AdaptiveCard>
            <Container>
                <div className="py-6">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() =>
                                navigate(`/restaurants/${restaurantId}/blogs`)
                            }
                        >
                            Back to Blogs
                        </Button>
                        <Button
                            variant="solid"
                            icon={<TbEdit />}
                            onClick={() =>
                                navigate(
                                    `/restaurants/${restaurantId}/blogs/edit/${blog.id}`,
                                )
                            }
                        >
                            Edit Post
                        </Button>
                    </div>

                    {/*  PREMIUM RUNTIME IMAGE GALLERY CAROUSEL ASSEMBLY FRAME */}
                    {activeImages.length === 0 ? (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 flex items-center justify-center mb-6">
                            <div className="text-center">
                                <TbZoom className="text-4xl text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">
                                    No article media attachments available
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 w-full flex flex-col items-center ">
                            <div className="relative w-full flex justify-center group/container ">
                                {/* Custom Previous Navigation Trigger Button */}
                                <button className="custom-prev-button absolute left-4 top-1/2 -translate-y-1/2规则 z-10 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-full text-gray-800 dark:text-white shadow-md transition-all active:scale-95 hover:scale-105 opacity-0 group-hover/container:opacity-100">
                                    <TbChevronLeft size={24} />
                                </button>

                                {/* Custom Next Navigation Trigger Button */}
                                <button className="custom-next-button absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-full text-gray-800 dark:text-white shadow-md transition-all active:scale-95 hover:scale-105 opacity-0 group-hover/container:opacity-100">
                                    <TbChevronRight size={24} />
                                </button>

                                <div className="w-[80%] ">
                                    <Swiper
                                        modules={[
                                            Navigation,
                                            Pagination,
                                            Keyboard,
                                            Autoplay,
                                            EffectFade,
                                        ]}
                                        navigation={{
                                            nextEl: '.custom-next-button',
                                            prevEl: '.custom-prev-button',
                                        }}
                                        pagination={{ clickable: true }}
                                        keyboard={true}
                                        autoplay={{
                                            delay: 5000,
                                            disableOnInteraction: false,
                                        }}
                                        effect="fade"
                                        loop={activeImages.length > 1}
                                        className="rounded-xl overflow-hidden shadow-md "
                                        style={{ height: '400px' }}
                                        initialSlide={selectedIndex}
                                        onSlideChange={(swiper) =>
                                            setSelectedIndex(swiper.realIndex)
                                        }
                                    >
                                        {activeImages.map(
                                            (img: string, index: number) => (
                                                <SwiperSlide key={index}>
                                                    <div
                                                        className="relative h-full cursor-pointer group "
                                                        onClick={() => {
                                                            setSelectedIndex(
                                                                index,
                                                            )
                                                            setLightboxOpen(
                                                                true,
                                                            )
                                                        }}
                                                    >
                                                        {/* <img
                                                            src={img}
                                                            alt="Post content slider"
                                                            className="w-full h-full object-cover"
                                                        /> */}
                                                        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
                                                            {/* Subtle blurred background replica to fill wide margins beautifully */}
                                                            <img
                                                                src={img}
                                                                alt=""
                                                                className="absolute inset-0 w-full h-full object-cover blur-md opacity-20 pointer-events-none select-none scale-105"
                                                            />
                                                            {/* The sharp foreground image preservation node */}
                                                            <img
                                                                src={img}
                                                                alt="Post content slider"
                                                                className="relative max-w-full max-h-full object-contain z-10 select-none shadow-sm"
                                                            />
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <TbZoom className="text-white text-3xl" />
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ),
                                        )}
                                    </Swiper>
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
                                        {activeImages.length} Photos
                                    </div>
                                </div>
                            </div>

                            {/* Sync Navigation Bottom Chips Thumbnails Roll */}
                            {activeImages.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto overflow-scroll justify-center max-w-full pb-1 ">
                                    {activeImages
                                        .slice(0, 6)
                                        .map((img: string, index: number) => (
                                            <div
                                                key={index}
                                                className={classNames(
                                                    'relative shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all border dark:border-gray-800',
                                                    index === selectedIndex
                                                        ? 'ring-2 ring-primary scale-105 border-transparent'
                                                        : 'opacity-70 hover:opacity-100',
                                                )}
                                                onClick={() => {
                                                    setSelectedIndex(index)
                                                    setLightboxOpen(true)
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    className="w-full h-full object-cover"
                                                    alt="Thumbnail selection"
                                                />
                                                {index === 5 &&
                                                    activeImages.length > 6 && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                                                            <span className="text-white text-xs font-bold">
                                                                +
                                                                {activeImages.length -
                                                                    6}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Article Content Node Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 leading-tight">
                                    {blog.title}
                                </h1>
                                <hr className="mb-6 border-gray-100 dark:border-gray-800" />
                                <div
                                    className="prose prose-md sm:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            blog.content,
                                        ),
                                    }}
                                />
                            </Card>
                        </div>

                        {/* Metadata Information Metric Panel Sidebar Column */}
                        <div className="space-y-6">
                            <Card>
                                <h4 className="mb-4 text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                                    Post Engagement
                                </h4>
                                <div className="space-y-3.5 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2.5">
                                        <TbEye className="text-gray-400 text-lg" />
                                        <span>
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {blog.viewCount || 0}
                                            </strong>{' '}
                                            Views
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbCalendar className="text-gray-400 text-lg" />
                                        <span>
                                            Published:{' '}
                                            {/* ✅ Bound to your real TypeORM snake_case column key */}
                                            <strong className="text-gray-900 dark:text-gray-100">
                                                {dayjs(blog.created_at).format(
                                                    'DD MMM YYYY',
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <TbUser className="text-gray-400 text-lg" />
                                        <span>
                                            By{' '}
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {authorName}
                                            </span>{' '}
                                            {authorRole && (
                                                <span className="text-xs text-gray-400">
                                                    ({authorRole})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    {blog.linkedDish && (
                                        <div className="flex items-center gap-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                                            <TbLink className="text-indigo-400 text-lg" />
                                            <span className="text-xs">
                                                Featured Dish:{' '}
                                                <strong className="text-indigo-600 dark:text-indigo-400 block sm:inline font-bold mt-0.5 sm:mt-0">
                                                    {blog.linkedDish.name}
                                                </strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* 🚀 4. INTEGRATED HIGH-PERFORMANCE SLIDESHOW LIGHTBOX DIALOG OVERLAY /} */}
                    <Dialog
                        isOpen={lightboxOpen}
                        width={800}
                        closable={true}
                        contentClassName="p-0 bg-black overflow-hidden border-none relative flex flex-col justify-center min-h-[60vh]"
                        onClose={() => setLightboxOpen(false)}
                    >
                        <div className="relative">
                            {/*Custom Modal Dismiss Anchor Button */}
                            <button
                                className="absolute top-4 right-4 z-20  text-white p-2 rounded-full  transition-colors" //hover:bg-black/70z bg-black/50 hover:bg-black/70
                                // className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/90 transition-colors shadow-md border border-white/10"
                                onClick={() => setLightboxOpen(false)}
                            ></button>
                            <Swiper
                                modules={[Navigation, Pagination, Keyboard]}
                                navigation={true}
                                pagination={{ clickable: true }}
                                keyboard={true}
                                initialSlide={selectedIndex}
                                spaceBetween={20}
                                slidesPerView={1}
                                style={{ height: '80vh' }}
                                // className="w-full"
                            >
                                {activeImages.map(
                                    (img: string, index: number) => (
                                        <SwiperSlide
                                            key={index}
                                            className=" overflow-hidden"
                                        >
                                            <div className="flex flex-col h-full w-full">
                                                <img
                                                    src={img}
                                                    alt={`Expanded asset preview ${index + 1}`}
                                                    className="w-full h-full object-cover" //max-w-full max-h-full w-auto h-auto object-cover select-none block mx-auto
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ),
                                )}

                                {/*                             
                            {activeImages.map((img: string, index: number) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Expanded asset preview ${index + 1}`}
                                    className=" w-full  object-contain " // h-full rounded shadow-2xl select-none max-w-full max-h-full
                                />
                            ))} */}
                            </Swiper>
                        </div>
                    </Dialog>
                </div>
            </Container>
        </AdaptiveCard>
    )
}

export default BlogDetail
