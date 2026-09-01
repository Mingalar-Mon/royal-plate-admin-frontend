import { TbChefHat } from 'react-icons/tb'

interface PageLoadingProps {
    label?: string
}

const PageLoading = ({ label = 'Loading' }: PageLoadingProps) => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
        {/* Animated restaurant icon */}
        <div className="relative mb-6">
            <div className="absolute -inset-3 animate-spin rounded-full border-2 border-dashed border-primary/40" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <TbChefHat className="text-4xl text-primary" />
            </div>
        </div>
        {/* Text with animated dots */}
        <div className="flex items-center gap-2">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                {label}
            </p>
            <span className="flex items-end gap-1">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-2 w-2 animate-wave rounded-full bg-primary"
                        style={{ animationDelay: `${i * 150}ms` }}
                    />
                ))}
            </span>
        </div>
    </div>
)

export default PageLoading