export const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { width: number; height: number; x: number; y: number } | null,
): Promise<File | null> => {
    const image = new Image()
    image.src = imageSrc
    image.crossOrigin = 'anonymous' // Avoids CORS issues with remote URLs

    await new Promise((resolve) => (image.onload = resolve))

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx || !pixelCrop) return null

    // Set structural layout output dimensions
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the specific segment of the image onto the canvas matrix
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    )

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return resolve(null)
                // Turn the canvas blob data directly into a clean File structure
                const croppedFile = new File([blob], 'cropped_image.jpeg', {
                    type: 'image/jpeg',
                })
                resolve(croppedFile)
            },
            'image/jpeg',
            0.9,
        ) // 0.9 is the quality compression setting
    })
}
