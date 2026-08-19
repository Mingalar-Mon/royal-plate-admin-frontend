// components/RestaurantImageGallery.tsx
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
    Navigation,
    Pagination,
    Keyboard,
    Autoplay,
    EffectFade,
} from 'swiper/modules'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { TbZoom, TbX, TbChevronRight, TbChevronLeft } from 'react-icons/tb'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import classNames from '@/utils/classNames'

interface RestaurantImageGalleryProps {
    images: string[]
    title?: string
}

const RestaurantImageGallery = ({
    images = [],
    title = 'Gallery',
}: RestaurantImageGalleryProps) => {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    if (!images || images.length === 0) {
        console.log(images)
        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                    <TbZoom className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No images available</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="mb-8 w-full flex flex-col ">
                <h3 className="text-xl font-semibold mb-4 self-center w-[80%] text-primary">
                    {title}
                </h3>
                <div className="relative w-full flex justify-center group/container">
                    {/* Custom Previous Button */}
                    {/* opacity-0 */}
                    <button className="custom-prev-button absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full text-white shadow-lg transition-all duration-300 hover:bg-black hover:scale-110 active:scale-95  group-hover/container:opacity-100 disabled:opacity-0">
                        <TbChevronLeft size={28} />
                    </button>

                    {/* Custom Next Button */}
                    {/* md:opacity-0 */}
                    <button className="custom-next-button absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-full text-gray-800 dark:text-white shadow-md transition-all active:scale-95  md:group-hover/container:opacity-100">
                        <TbChevronRight size={28} />
                    </button>
                    <div className="w-[80%]">
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
                            loop={true}
                            className="rounded-xl overflow-hidden shadow-xl"
                            style={{ height: '500px' }}
                            initialSlide={selectedIndex}
                            onSlideChange={(swiper) =>
                                setSelectedIndex(swiper.activeIndex)
                            }
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <div
                                        className="relative h-full cursor-pointer group"
                                        onClick={() => {
                                            setSelectedIndex(index)
                                            setLightboxOpen(true)
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    {image.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <p className="text-lg font-semibold">
                                                {image.caption}
                                            </p>
                                        </div>
                                    )} */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <TbZoom className="text-white text-4xl" />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
                            {images.length} Photos
                        </div>
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-4 overflow-x-auto overflow-scroll justify-center  pb-2">
                    {images.slice(0, 6).map((image, index) => (
                        <div
                            key={index}
                            // hover:opacity-80 transition-opacity
                            className={classNames(
                                'relative shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer ',
                                index === selectedIndex
                                    ? 'ring-2 ring-primary'
                                    : 'opacity-90',
                            )}
                            onClick={() => {
                                setSelectedIndex(index)
                                setLightboxOpen(true)
                            }}
                        >
                            <img
                                src={image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            {index === 5 && images.length > 6 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        +{images.length - 6}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <Dialog
                isOpen={lightboxOpen}
                width={900}
                closable={true}
                contentClassName="p-0 bg-black overflow-hidden border-none relative flex flex-col justify-center min-h-[60vh] " // relative flex flex-col justify-center min-h-[60vh]
                onClose={() => setLightboxOpen(false)}
                onRequestClose={() => setLightboxOpen(false)}
            >
                <div className="relative">
                    <button
                        className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* <TbX size={24} /> */}
                    </button>

                    <Swiper
                        modules={[Navigation, Pagination, Keyboard]}
                        navigation={true}
                        pagination={{ clickable: true }}
                        keyboard={true}
                        initialSlide={selectedIndex}
                        spaceBetween={30}
                        slidesPerView={1}
                        style={{ height: '80vh' }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="flex flex-col h-full w-full">
                                    <img
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* {image.caption && (
                                        <div className="mt-4 text-center">
                                            <p className="text-lg font-semibold">
                                                {image.caption}
                                            </p>
                                        </div>
                                    )} */}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default RestaurantImageGallery
