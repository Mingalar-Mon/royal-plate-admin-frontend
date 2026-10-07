import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailOptLogo from '@/assets/logo/emailoptlogo.png'
import { useGetAppVersions } from '@/utils/custom-hooks/useAppVersion'
import {
    TbChefHat,
    TbCalendarEvent,
    TbArrowRight,
    TbClock,
    TbShieldCheck,
    TbMenu2,
    TbX,
    TbSparkles,
    TbStar,
    TbBell,
    TbSun,
    TbMoon,
    TbDownload,
    TbDeviceMobile,
    TbReceipt,
    TbBookmark,
    TbGift,
    TbMapPin,
    TbArrowUp,
} from 'react-icons/tb'

const LandingPage = () => {
    const { data } = useGetAppVersions()
    const appVersion = data?.data?.[0]
    const [isDark, setIsDark] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false)
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const features = [
        {
            icon: <TbChefHat className="text-3xl" />,
            title: 'Browse Menus',
            description:
                'Explore detailed menus with photos, descriptions, and prices. Filter by cuisine, dietary preferences, or chef recommendations.',
            color: 'from-amber-500 to-orange-600',
        },
        {
            icon: <TbReceipt className="text-3xl" />,
            title: 'Order Instantly',
            description:
                'Place orders directly from your table or for pickup. Real-time order tracking keeps you updated every step of the way.',
            color: 'from-emerald-500 to-teal-600',
        },
        {
            icon: <TbCalendarEvent className="text-3xl" />,
            title: 'Reserve Tables',
            description:
                'Book your perfect table in seconds. Choose date, time, party size, and special requests with instant confirmation.',
            color: 'from-purple-500 to-indigo-600',
        },
        {
            icon: <TbBell className="text-3xl" />,
            title: 'Smart Notifications',
            description:
                'Get instant updates on order status, reservation reminders, and exclusive offers from your favorite restaurants.',
            color: 'from-sky-500 to-blue-600',
        },
        {
            icon: <TbBookmark className="text-3xl" />,
            title: 'Save Favorites',
            description:
                'Bookmark your favorite dishes and restaurants. Reorder past meals with one tap and never lose track of what you love.',
            color: 'from-rose-500 to-pink-600',
        },
        {
            icon: <TbGift className="text-3xl" />,
            title: 'Exclusive Rewards',
            description:
                'Earn points with every order. Unlock special discounts, birthday treats, and VIP access to new menu launches.',
            color: 'from-violet-500 to-purple-600',
        },
    ]

    const testimonials = [
        {
            quote:
                'The app makes ordering so effortless. I love seeing the menu with photos and being able to order directly from my phone. No more waiting for the waiter!',
            author: 'Sarah Chen',
            role: 'Food Enthusiast',
            location: 'Yangon',
            rating: 5,
        },
        {
            quote:
                'Booking a table used to mean calling during busy hours. Now I just open the app, pick my time, and I am done. The confirmation notification is a nice touch.',
            author: 'Min Ko Ko',
            role: 'Regular Diner',
            location: 'Mandalay',
            rating: 5,
        },
        {
            quote:
                'I have discovered so many great restaurants through this app. The rewards program is generous, and the interface is beautiful. My go-to for dining out.',
            author: 'Emily Rodriguez',
            role: 'Travel Blogger',
            location: 'Nay Pyi Taw',
            rating: 5,
        },
    ]

    return (
        <div
            className={`min-h-screen w-full font-sans relative overflow-x-hidden transition-colors duration-300 ${isDark
                ? 'bg-[#080204] text-slate-100 selection:bg-amber-500 selection:text-black'
                : 'bg-[#faf7f2] text-gray-900 selection:bg-primary/20 selection:text-primary'
                }`}
        >
            {/* Ambient Background */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div
                    className={`absolute -top-40 left-1/2 -translate-x-1/2 h-[350px] sm:h-[550px] w-[90vw] sm:w-[850px] rounded-full blur-[100px] sm:blur-[120px] transition-all duration-500 ${isDark
                        ? 'bg-gradient-to-b from-[#6e1423]/35 via-[#4a0d16]/20 to-transparent'
                        : 'bg-gradient-to-b from-[#6e1423]/10 via-[#c9a227]/5 to-transparent'
                        }`}
                />
                <div
                    className={`absolute top-[35%] -left-32 h-[300px] sm:h-[450px] w-[300px] sm:w-[450px] rounded-full blur-[100px] sm:blur-[130px] transition-all duration-500 ${isDark ? 'bg-amber-500/10' : 'bg-primary/5'
                        }`}
                />
                <div
                    className={`absolute top-[65%] -right-32 h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full blur-[110px] sm:blur-[140px] transition-all duration-500 ${isDark ? 'bg-[#6e1423]/25' : 'bg-[#c9a227]/8'
                        }`}
                />
            </div>

            {/* Sticky Navigation */}
            <header
                className={`sticky top-0 z-50 backdrop-blur-xl border-b py-3 sm:py-3.5 shadow-2xl transition-colors duration-300 ${isDark
                    ? 'bg-[#080204]/90 border-white/[0.08] shadow-black/60'
                    : 'bg-[#faf7f2]/90 border-[#e5ded5] shadow-stone-200/50'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
                    {/* Brand */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
                    >
                        <div
                            className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-2 shadow-lg transition-all ${isDark
                                ? 'ring-amber-400/60 shadow-amber-500/20 group-hover:ring-amber-400'
                                : 'ring-primary/60 shadow-primary/20 group-hover:ring-primary'
                                }`}
                        >
                            <img
                                src={emailOptLogo}
                                alt="Royal Plate"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`text-lg sm:text-xl font-bold tracking-tight font-sans transition-colors ${isDark
                                    ? 'text-white group-hover:text-amber-300'
                                    : 'text-gray-900 group-hover:text-primary'
                                    }`}
                            >
                                Royal Plate
                            </span>
                            <span
                                className={`text-[10px] sm:text-[11px] tracking-wider font-medium hidden xs:inline-block ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                    }`}
                            >
                                Mobile App
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav
                        className={`hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-600'
                            }`}
                    >
                        <button
                            onClick={() => scrollToSection('features')}
                            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection('download')}
                            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            Download
                        </button>
                        <button
                            onClick={() => scrollToSection('testimonials')}
                            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            Reviews
                        </button>
                        <button
                            onClick={() => scrollToSection('faq')}
                            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            FAQ
                        </button>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${isDark
                                ? 'border-white/10 bg-white/5 text-amber-300 hover:bg-white/10 hover:border-amber-400/40'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-primary/40 shadow-sm'
                                }`}
                            aria-label="Toggle theme"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? (
                                <>
                                    <TbSun className="text-base text-amber-300 shrink-0" />
                                    <span className="hidden sm:inline text-xs font-semibold">Light</span>
                                </>
                            ) : (
                                <>
                                    <TbMoon className="text-base text-gray-700 shrink-0" />
                                    <span className="hidden sm:inline text-xs font-semibold">Dark</span>
                                </>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg border transition-colors ${isDark
                                ? 'text-zinc-300 hover:text-white hover:bg-white/5 border-white/10'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-black/5 border-gray-300'
                                }`}
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <TbX className="text-xl" /> : <TbMenu2 className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`md:hidden border-b px-5 sm:px-6 py-4 sm:py-5 flex flex-col gap-3.5 ${isDark
                                ? 'bg-[#0c0407] border-white/10'
                                : 'bg-white border-gray-200 shadow-xl'
                                }`}
                        >
                            <button
                                onClick={() => scrollToSection('features')}
                                className={`text-left py-1 text-sm font-medium ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('download')}
                                className={`text-left py-1 text-sm font-medium ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                Download
                            </button>
                            <button
                                onClick={() => scrollToSection('testimonials')}
                                className={`text-left py-1 text-sm font-medium ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                Reviews
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className={`text-left py-1 text-sm font-medium ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                FAQ
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* HERO SECTION */}
            <section className="relative z-10 pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                    {/* Left - Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border backdrop-blur-md shadow-inner mb-5 sm:mb-6 ${isDark
                                ? 'bg-white/[0.05] border-amber-400/30'
                                : 'bg-primary/5 border-primary/20'
                                }`}
                        >
                            <TbSparkles
                                className={`text-sm shrink-0 animate-spin ${isDark ? 'text-amber-400' : 'text-primary'
                                    }`}
                                style={{ animationDuration: '8s' }}
                            />
                            <span
                                className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-primary'
                                    }`}
                            >
                                Available on iOS & Android
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-sans leading-[1.15] sm:leading-[1.12] ${isDark ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            Your Table is{' '}
                            <span
                                className={`bg-clip-text text-transparent italic ${isDark
                                    ? 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500'
                                    : 'bg-gradient-to-r from-primary via-[#8a2a35] to-gold'
                                    }`}
                            >
                                Waiting.
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                }`}
                        >
                            Browse menus, order food, and reserve tables at the finest restaurants — all from your phone. Fast, simple, and designed for food lovers.
                        </motion.p>

                        {/* Download Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3"
                        >
                            {appVersion?.iosLink && (
                                <a
                                    href={appVersion.iosLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all transform hover:-translate-y-0.5 ${isDark
                                        ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    <span>Download on App Store</span>
                                </a>
                            )}
                            {appVersion?.playStoreLink && (
                                <a
                                    href={appVersion.playStoreLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all transform hover:-translate-y-0.5 ${isDark
                                        ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333zm2.302-3.112L5.864 3.292l10.937 6.333zM20.136 12l-3.436 1.99-2.542-2.542 2.542-2.542z" />
                                    </svg>
                                    <span>Get it on Google Play</span>
                                </a>
                            )}
                            {appVersion?.directDownloadLink && (
                                <a
                                    href="https://drive.google.com/file/d/1ivZ6VYLIjc8WR29ai4xMeP1sogiwl2hQ/view?usp=share_link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-all transform hover:-translate-y-0.5 ${isDark
                                        ? 'border-white/20 bg-white/[0.04] hover:bg-white/[0.1] text-white'
                                        : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
                                        }`}
                                >
                                    <TbDownload className={`text-lg shrink-0 ${isDark ? '' : 'text-primary'}`} />
                                    <span>Direct Download (APK)</span>
                                </a>
                            )}
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.45 }}
                            className={`mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs ${isDark
                                ? 'text-zinc-400'
                                : 'text-gray-500'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <TbStar key={i} className="fill-amber-400 text-xs" />
                                    ))}
                                </div>
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    4.9
                                </span>
                                <span>rating</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TbShieldCheck className={`text-base ${isDark ? 'text-amber-400' : 'text-primary'}`} />
                                <span>Secure & Private</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TbDownload className={`text-base ${isDark ? 'text-amber-400' : 'text-primary'}`} />
                                <span>Free Download</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right - Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="relative">
                            <div
                                className={`absolute -inset-6 sm:-inset-8 rounded-3xl blur-3xl ${isDark ? 'bg-amber-500/10' : 'bg-primary/10'
                                    }`}
                            />
                            <div className="relative w-56 sm:w-64 h-[450px] sm:h-[500px] rounded-[2.2rem] sm:rounded-[2.5rem] border-[3px] border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
                                {/* Phone notch */}
                                <div className="absolute top-0 inset-x-0 h-6 sm:h-7 bg-black rounded-b-2xl mx-12 sm:mx-16 z-10" />
                                {/* Screen content */}
                                <div className="h-full bg-gradient-to-b from-[#1a0a10] to-[#0d0408] pt-8 sm:pt-10 px-3.5 sm:px-4 flex flex-col justify-between pb-5">
                                    <div>
                                        <div className="text-center mb-3 sm:mb-4">
                                            <div className="inline-flex p-2 rounded-xl bg-amber-500/20 mb-1.5 sm:mb-2">
                                                <TbChefHat className="text-amber-400 text-lg sm:text-xl" />
                                            </div>
                                            <p className="text-xs font-bold text-white">Royal Plate</p>
                                            <p className="text-[10px] text-zinc-500">Discover & Order</p>
                                        </div>
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 shrink-0" />
                                                        <div className="flex-1 space-y-1">
                                                            <div className="h-2 bg-white/10 rounded w-3/4" />
                                                            <div className="h-1.5 bg-white/5 rounded w-1/2" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-center">
                                        <p className="text-[10px] font-bold text-amber-300">Order Now</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className={`relative z-10 py-16 sm:py-20 transition-colors ${isDark
                ? 'bg-[#0d0307]/60 border-t border-b border-white/[0.08]'
                : 'bg-white/50 border-t border-b border-[#e2d9cd]'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                        <span
                            className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-primary bg-primary/10 border-primary/20'
                                }`}
                        >
                            App Features
                        </span>
                        <h2
                            className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            Everything You Need, In Your Pocket
                        </h2>
                        <p
                            className={`text-sm sm:text-base mt-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                }`}
                        >
                            From browsing menus to making reservations, our app puts the complete dining experience at your fingertips.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`group relative rounded-2xl p-6 sm:p-7 border backdrop-blur-sm transition-all hover:-translate-y-1 ${isDark
                                    ? 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15]'
                                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:shadow-xl'
                                    }`}
                            >
                                {/* Icon */}
                                <div
                                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg`}
                                >
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3
                                    className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {feature.title}
                                </h3>
                                <p
                                    className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                        }`}
                                >
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOWNLOAD SECTION */}
            <section id="download" className="relative z-10 py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <span
                        className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-primary bg-primary/10 border-primary/20'
                            }`}
                    >
                        Get the App
                    </span>
                    <h2
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Start Your Culinary Journey Today
                    </h2>
                    <p
                        className={`text-sm sm:text-base mt-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                            }`}
                    >
                        Download Royal Plate now and discover a better way to dine. Available for free on iOS and Android.
                    </p>

                    {appVersion && (
                        <div
                            className={`mt-4 flex items-center justify-center gap-2 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'
                                }`}
                        >
                            <TbDownload className={isDark ? 'text-amber-400' : 'text-primary'} />
                            <span>Latest: v{appVersion.versionName}</span>
                            <span className={isDark ? 'text-zinc-600' : 'text-gray-400'}>•</span>
                            <span className="truncate max-w-[200px] sm:max-w-none">{appVersion.title}</span>
                        </div>
                    )}

                    {/* Download Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                        {appVersion?.iosLink && (
                            <a
                                href={appVersion.iosLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-base transition-all transform hover:-translate-y-0.5 ${isDark
                                    ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <span>Download on App Store</span>
                            </a>
                        )}
                        {appVersion?.playStoreLink && (
                            <a
                                href={appVersion.playStoreLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-base transition-all transform hover:-translate-y-0.5 ${isDark
                                    ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333zm2.302-3.112L5.864 3.292l10.937 6.333zM20.136 12l-3.436 1.99-2.542-2.542 2.542-2.542z" />
                                </svg>
                                <span>Get it on Google Play</span>
                            </a>
                        )}
                        {appVersion?.directDownloadLink && (
                            <a
                                href="https://drive.google.com/file/d/1ivZ6VYLIjc8WR29ai4xMeP1sogiwl2hQ/view?usp=share_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border text-base font-medium transition-all transform hover:-translate-y-0.5 ${isDark
                                    ? 'border-white/20 bg-white/[0.04] hover:bg-white/[0.1] text-white'
                                    : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
                                    }`}
                            >
                                <TbDownload className={`text-xl shrink-0 ${isDark ? '' : 'text-primary'}`} />
                                <span>Direct Download (APK)</span>
                            </a>
                        )}
                    </div>

                    {/* System Requirements */}
                    <div
                        className={`mt-10 pt-8 border-t flex flex-wrap items-center justify-center gap-6 text-xs ${isDark
                            ? 'border-white/[0.08] text-zinc-400'
                            : 'border-gray-200 text-gray-500'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <TbDeviceMobile className="text-base" />
                            <span>iOS 13.0 or later</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbDeviceMobile className="text-base" />
                            <span>Android 8.0 or later</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbClock className="text-base" />
                            <span>~25 MB download size</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className={`relative z-10 py-16 sm:py-20 transition-colors ${isDark
                ? 'bg-[#0d0307]/60 border-t border-b border-white/[0.08]'
                : 'bg-white/50 border-t border-b border-[#e2d9cd]'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                        <span
                            className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-primary bg-primary/10 border-primary/20'
                                }`}
                        >
                            User Reviews
                        </span>
                        <h2
                            className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            Loved by Food Enthusiasts
                        </h2>
                        <p
                            className={`text-sm sm:text-base mt-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                }`}
                        >
                            See what our users are saying about their dining experience with Royal Plate.
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`rounded-2xl p-6 sm:p-7 border backdrop-blur-sm ${isDark
                                    ? 'border-white/[0.08] bg-white/[0.02]'
                                    : 'border-gray-200 bg-white shadow-sm'
                                    }`}
                            >
                                {/* Stars */}
                                <div className="flex text-amber-400 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <TbStar key={i} className="fill-amber-400 text-lg" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p
                                    className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                        }`}
                                >
                                    "{testimonial.quote}"
                                </p>

                                {/* Author */}
                                <div>
                                    <p
                                        className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}
                                    >
                                        {testimonial.author}
                                    </p>
                                    <p
                                        className={`text-xs mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'
                                            }`}
                                    >
                                        {testimonial.role}
                                    </p>
                                    <div
                                        className={`flex items-center gap-1 mt-2 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                            }`}
                                    >
                                        <TbMapPin className="text-xs" />
                                        <span>{testimonial.location}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="relative z-10 py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                    <span
                        className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-primary bg-primary/10 border-primary/20'
                            }`}
                    >
                        FAQ
                    </span>
                    <h2
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Frequently Asked Questions
                    </h2>
                    <p
                        className={`text-sm sm:text-base mt-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                            }`}
                    >
                        Everything you need to know about the Royal Plate app.
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            q: 'Is the app free to download?',
                            a: 'Yes! Royal Plate is completely free to download and use on both iOS and Android. There are no subscription fees or hidden charges.',
                        },
                        {
                            q: 'How do I place an order?',
                            a: 'Simply browse the menu of your chosen restaurant, add items to your cart, and proceed to checkout. You can pay online or choose to pay at the restaurant.',
                        },
                        {
                            q: 'Can I make a reservation through the app?',
                            a: 'Absolutely! Select your preferred restaurant, choose your date and time, specify the number of guests, and confirm your reservation. You will receive instant confirmation.',
                        },
                        {
                            q: 'Is my payment information secure?',
                            a: 'Yes, we use industry-standard encryption and secure payment gateways to protect your financial information. Your data is always safe with us.',
                        },
                        {
                            q: 'Can I save my favorite restaurants?',
                            a: 'Yes! You can bookmark your favorite restaurants and dishes for quick access. Your saved items sync across all your devices.',
                        },
                    ].map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`rounded-2xl border backdrop-blur-sm overflow-hidden ${isDark
                                ? 'border-white/[0.08] bg-white/[0.02]'
                                : 'border-gray-200 bg-white'
                                }`}
                        >
                            <details
                                className={`group ${isDark ? '[&[open]]:bg-white/[0.04]' : '[&[open]]:bg-gray-50'}`}
                            >
                                <summary
                                    className={`flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none ${isDark
                                        ? 'text-white hover:text-amber-300'
                                        : 'text-gray-900 hover:text-primary'
                                        }`}
                                >
                                    <h3 className="font-semibold text-sm sm:text-base pr-4">{faq.q}</h3>
                                    <TbArrowRight
                                        className={`text-lg shrink-0 transition-transform group-open:rotate-90 ${isDark ? 'text-amber-400' : 'text-primary'
                                            }`}
                                    />
                                </summary>
                                <div
                                    className={`px-5 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                        }`}
                                >
                                    {faq.a}
                                </div>
                            </details>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer
                className={`relative z-10 border-t py-10 sm:py-12 transition-colors ${isDark
                    ? 'bg-[#0d0307]/80 border-white/[0.08]'
                    : 'bg-[#f4efe8] border-[#e2d9cd]'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <div
                                className={`h-10 w-10 rounded-full overflow-hidden ring-2 ${isDark
                                    ? 'ring-amber-400/60'
                                    : 'ring-primary/60'
                                    }`}
                            >
                                <img
                                    src={emailOptLogo}
                                    alt="Royal Plate"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <p
                                    className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    Royal Plate
                                </p>
                                <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                    Your Table is Waiting
                                </p>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <button
                                onClick={() => scrollToSection('features')}
                                className={`transition-colors ${isDark ? 'text-zinc-400 hover:text-amber-300' : 'text-gray-600 hover:text-primary'
                                    }`}
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('download')}
                                className={`transition-colors ${isDark ? 'text-zinc-400 hover:text-amber-300' : 'text-gray-600 hover:text-primary'
                                    }`}
                            >
                                Download
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className={`transition-colors ${isDark ? 'text-zinc-400 hover:text-amber-300' : 'text-gray-600 hover:text-primary'
                                    }`}
                            >
                                FAQ
                            </button>
                        </div>

                        {/* Contact */}
                        <div className="flex items-center gap-4">
                            <a
                                href="mailto:support@royalplate.app"
                                className={`flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-zinc-400 hover:text-amber-300' : 'text-gray-600 hover:text-primary'
                                    }`}
                            >
                                <span>support@royalplate.app</span>
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div
                        className={`mt-8 pt-6 border-t text-center text-xs ${isDark
                            ? 'border-white/[0.08] text-zinc-500'
                            : 'border-[#e2d9cd] text-gray-500'
                            }`}
                    >
                        <p>&copy; {new Date().getFullYear()} Royal Plate. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full shadow-lg transition-colors cursor-pointer ${isDark
                            ? 'bg-amber-500 text-black shadow-amber-500/30 hover:bg-amber-400'
                            : 'bg-primary text-white shadow-primary/30 hover:bg-primary-mild'
                            }`}
                        aria-label="Back to top"
                    >
                        <TbArrowUp className="text-lg sm:text-xl" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LandingPage
