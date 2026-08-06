import { useEffect, useState } from 'react'

interface ImageItem {
    url: string
    key?: string
}

interface LightboxModalProps {
    images: ImageItem[]
    currentIndex: number
    setCurrentIndex: (index: number) => void
    onClose: () => void
}

export function LightboxModal({
    images,
    currentIndex,
    setCurrentIndex,
    onClose,
}: LightboxModalProps) {
    // Tracks the sliding direction animation ('left' or 'right')
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | ''>(
        '',
    )
    // Trigger key changes to reset CSS animations smoothly
    const [animKey, setAnimKey] = useState(0)

    const handleNext = () => {
        setSlideDirection('right')
        setAnimKey((prev) => prev + 1)
        setCurrentIndex((currentIndex + 1) % images.length)
    }

    const handlePrev = () => {
        setSlideDirection('left')
        setAnimKey((prev) => prev + 1)
        setCurrentIndex((currentIndex - 1 + images.length) % images.length)
    }

    const handleThumbnailClick = (targetIndex: number) => {
        if (targetIndex === currentIndex) return
        setSlideDirection(targetIndex > currentIndex ? 'right' : 'left')
        setAnimKey((prev) => prev + 1)
        setCurrentIndex(targetIndex)
    }

    // Determine the tailwind slide class based on interaction direction
    const animationClass =
        slideDirection === 'right'
            ? 'animate-slide-in-right'
            : slideDirection === 'left'
              ? 'animate-slide-in-left'
              : 'animate-fade-in'

    // Handle keyboard shortcuts (Left, Right, Escape)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') handleNext()
            if (e.key === 'ArrowLeft') handlePrev()
        }

        window.addEventListener('keydown', handleKeyDown)
        // Lock body scrolling while open
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [currentIndex, images.length])

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 animate-fade-in">
            {/* Top Bar with counter and close button */}
            <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 text-white bg-gradient-to-b from-black/50 to-transparent z-10">
                <span className="text-sm font-medium tracking-wider">
                    {currentIndex + 1} / {images.length}
                </span>
                <button
                    type="button"
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl"
                    aria-label="Close modal"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>

            {/* Main Interactive Viewport */}
            <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center">
                {/* Previous Button */}
                <button
                    type="button"
                    className="absolute left-4 z-20 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all text-xl"
                    aria-label="Previous image"
                    onClick={handlePrev}
                >
                    ◀
                </button>

                {/* Main Selected Image */}
                <div
                    key={animKey}
                    className={`w-full h-full flex items-center justify-center transition-all duration-300 ${animationClass}`}
                >
                    <img
                        src={images[currentIndex].url}
                        alt={
                            images[currentIndex].key ||
                            `Gallery image ${currentIndex + 1}`
                        }
                        className="max-w-full max-h-[80vh] object-contain rounded-sm select-none"
                        onClick={(e) => e.stopPropagation()} // Prevents clicking image from closing modal
                    />
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    className="absolute right-4 z-20 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all text-xl"
                    aria-label="Next image"
                    onClick={handleNext}
                >
                    ▶
                </button>
            </div>
            {/* Bottom Horizontal Thumbnail Indicators */}
            <div className="w-full max-w-3xl z-10 py-4 flex flex-col items-center gap-3">
                <div className="flex gap-2 items-center overflow-x-auto max-w-full px-4 scrollbar-none py-1">
                    {images.map((img, index) => {
                        const isActive = index === currentIndex
                        return (
                            <button
                                key={img.key || index}
                                type="button"
                                onClick={() => handleThumbnailClick(index)}
                                className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden transition-all duration-200 ${
                                    isActive
                                        ? 'ring-2 ring-blue-500 scale-105 opacity-100 z-10'
                                        : 'opacity-40 hover:opacity-80 scale-95'
                                }`}
                            >
                                <img
                                    src={img.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Clickable Backdrop Dismissal Zone */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    )
}
