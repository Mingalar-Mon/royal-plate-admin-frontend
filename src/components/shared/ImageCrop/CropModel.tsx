import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
// import { Controller } from 'react-hook-form'
import { getCroppedImg } from './cropImage'

interface Props {
    isOpen: boolean
    imageSrc: string
    aspect: number
    originalFile?: File | null
    onCropComplete: (croppedFile: File) => void
    onClose: () => void
}

const CropModal = ({
    isOpen,
    imageSrc,
    aspect,
    originalFile,
    onCropComplete,
    onClose,
}: Props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
        width: number
        height: number
        x: number
        y: number
    } | null>(null)

    const onCropChange = useCallback(
        (
            idx: { height: number; width: number; x: number; y: number },
            pixels: { width: number; height: number; x: number; y: number },
        ) => {
            setCroppedAreaPixels(pixels)
        },
        [],
    )

    const handleSave = async () => {
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (croppedFile) onCropComplete(croppedFile)
            onClose()
        } catch (e) {
            console.error('Error cropping image', e)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4">Edit Photo</h3>

                {/* Cropper Container Layer */}
                <div className="relative w-full h-64 bg-gray-900 rounded">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect} // Controls Facebook aspect ratio behavior
                        onCropChange={setCrop}
                        onCropComplete={onCropChange}
                        onZoomChange={setZoom}
                    />
                </div>

                {/* Zoom Engine Control */}
                <div className="my-4">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Zoom
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        className="w-full accent-blue-600"
                        onChange={(e) => setZoom(Number(e.target.value))}
                    />
                </div>

                {/* Action Button Layout */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    {originalFile && (
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            onClick={() => {
                                onCropComplete(originalFile)
                                onClose()
                            }}
                        >
                            Use Full Image
                        </button>
                    )}
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleSave}
                    >
                        Save Crop
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CropModal
