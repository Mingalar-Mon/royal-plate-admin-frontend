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
    TbScan,
    TbCreditCard,
    TbUsers,
    TbThumbUp,
    TbCrown,
    TbHome,
    TbHeart,
    TbBook,
    TbChevronDown,
    TbMinus,
    TbPlus,
    TbCheck,
    TbSearch,
    TbApps,
} from 'react-icons/tb'

const PhoneFrame = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative rounded-[2.5rem] border-[3px] border-zinc-700 shadow-2xl overflow-hidden bg-zinc-900 ${className}`}>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-12 sm:w-16 h-3.5 sm:h-4 bg-black rounded-full" />
        <div className="w-full h-full overflow-hidden">
            {children}
        </div>
    </div>
)

const StatusBar = ({ dark = false }: { dark?: boolean }) => (
    <div className={`relative flex items-center justify-between px-4 pt-3 pb-1.5 text-[9px] font-semibold ${dark ? 'text-white/70' : 'text-black/50'}`}>
        <span className="z-10">9:41</span>
        <div className="flex items-center gap-1 z-10">
            <div className="flex gap-[2px] items-end">
                <div className={`w-[3px] h-[4px] rounded-[0.5px] ${dark ? 'bg-white/50' : 'bg-black/30'}`} />
                <div className={`w-[3px] h-[6px] rounded-[0.5px] ${dark ? 'bg-white/60' : 'bg-black/40'}`} />
                <div className={`w-[3px] h-[8px] rounded-[0.5px] ${dark ? 'bg-white/70' : 'bg-black/50'}`} />
                <div className={`w-[3px] h-[10px] rounded-[0.5px] ${dark ? 'bg-white/90' : 'bg-black/70'}`} />
            </div>
            <svg className={`w-3 h-3 ${dark ? 'text-white/70' : 'text-black/50'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21l-1.5-1.5C5.4 14.4 2 11 2 7.5 2 4.4 4.4 2 7.5 2c1.7 0 3.4.8 4.5 2.1C13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.4 22 7.5c0 3.5-3.4 6.9-8.5 12L12 21z" />
            </svg>
            <div className={`w-5 h-2.5 rounded-[3px] border ${dark ? 'border-white/50' : 'border-black/40'} relative`}>
                <div className={`absolute inset-[1px] right-[2px] rounded-[1.5px] ${dark ? 'bg-white/70' : 'bg-black/50'}`} />
            </div>
        </div>
    </div>
)

const BottomNav = ({ active = 0, dark = false }: { active?: number; dark?: boolean }) => {
    const tabs = [
        { icon: <TbHome className="text-sm" />, label: 'Home' },
        { icon: <TbSearch className="text-sm" />, label: 'Search' },
        { icon: <TbBook className="text-sm" />, label: 'Bookings' },
        { icon: <TbHeart className="text-sm" />, label: 'Saved' },
        { icon: <TbApps className="text-sm" />, label: 'More' },
    ]
    return (
        <div className={`flex items-center justify-around py-2 px-2 border-t ${dark ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5'}`}>
            {tabs.map((tab, i) => (
                <div key={i} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${i === active ? (dark ? 'text-amber-400' : 'text-[#6e1423]') : (dark ? 'text-zinc-500' : 'text-gray-400')}`}>
                    {tab.icon}
                    <span className="text-[7px] font-medium">{tab.label}</span>
                </div>
            ))}
        </div>
    )
}

const SplashScreen = () => (
    <div className="w-full h-full bg-gradient-to-b from-[#4a0d16] via-[#6e1423] to-[#4a0d16] flex flex-col relative">
        <StatusBar dark />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="relative">
                <div className="absolute -inset-4 bg-gold/10 rounded-full blur-xl" />
                <TbCrown className="text-5xl text-gold relative z-10" />
            </div>
            <div className="text-center mt-2">
                <h2 className="text-white text-xl font-bold tracking-wider">ROYAL PLATE</h2>
                <p className="text-gold-light text-[10px] tracking-[0.2em] mt-1 font-medium">REGAL DINING</p>
            </div>
            <div className="mt-8 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
        </div>
        <p className="text-white/30 text-[8px] pb-6 tracking-wide">Fine Dining, Redefined</p>
    </div>
)

const HomeScreen = () => (
    <div className="w-full h-full bg-[#f8f7f5] flex flex-col">
        <StatusBar />
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-4 pt-2 pb-3 flex items-center justify-between">
                <div>
                    <p className="text-[8px] text-gray-400">Good evening,</p>
                    <p className="text-[11px] font-bold text-gray-900">Aung Ko</p>
                </div>
                <div className="relative">
                    <TbBell className="text-sm text-gray-600" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </div>
            </div>

            <div className="px-4 mb-3">
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
                    <TbSearch className="text-xs text-gray-400" />
                    <span className="text-[9px] text-gray-300">Search restaurants...</span>
                </div>
            </div>

            <div className="px-4 mb-3">
                <div className="bg-gradient-to-r from-[#6e1423] to-[#8a2a35] rounded-xl p-3 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-white/5 rounded-full -translate-y-4 translate-x-4" />
                    <p className="text-[8px] text-white/70 font-medium">WEEKEND SPECIAL</p>
                    <p className="text-white text-[11px] font-bold mt-0.5">20% Off Your First Reservation</p>
                    <p className="text-white/60 text-[7px] mt-1">Valid until Dec 31</p>
                    <div className="mt-2 bg-white/20 rounded-md px-2 py-0.5 inline-block">
                        <span className="text-white text-[7px] font-semibold">Claim Now</span>
                    </div>
                </div>
            </div>

            <div className="px-4 mb-3">
                <p className="text-[9px] font-bold text-gray-900 mb-2">Cuisine Categories</p>
                <div className="flex gap-2">
                    {['Myanmar', 'Chinese', 'Japanese', 'Thai'].map((c, i) => (
                        <div key={i} className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl ${i === 0 ? 'bg-[#6e1423] text-white' : 'bg-white border border-gray-100 text-gray-600'} shadow-sm`}>
                            <span className="text-[10px]">{['🍛', '🥢', '🍣', '🍜'][i]}</span>
                            <span className="text-[7px] font-medium">{c}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 flex-1">
                <p className="text-[9px] font-bold text-gray-900 mb-2">Nearby Restaurants</p>
                <div className="space-y-2">
                    {[
                        { name: 'The Golden Leaf', cuisine: 'Myanmar Fusion', rating: '4.8', dist: '0.8 km', img: '🏯' },
                        { name: 'Sakura Garden', cuisine: 'Japanese', rating: '4.9', dist: '1.2 km', img: '🌸' },
                    ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl p-2 shadow-sm border border-gray-50">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6e1423]/10 to-gold/10 flex items-center justify-center text-lg shrink-0">
                                {r.img}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-gray-900 truncate">{r.name}</p>
                                <p className="text-[7px] text-gray-400">{r.cuisine}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[7px] text-amber-500 font-semibold flex items-center gap-0.5">
                                        <TbStar className="fill-amber-400 text-[7px]" /> {r.rating}
                                    </span>
                                    <span className="text-[7px] text-gray-300">{r.dist}</span>
                                </div>
                            </div>
                            <div className="bg-[#6e1423] rounded-md px-1.5 py-0.5">
                                <span className="text-white text-[7px] font-medium">Reserve</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    </div>
)

const ReservationScreen = () => (
    <div className="w-full h-full bg-[#f8f7f5] flex flex-col">
        <StatusBar />
        <div className="flex-1 overflow-hidden flex flex-col px-4 pt-2">
            <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-bold text-gray-900">Reserve a Table</p>
                <div className="bg-white rounded-lg px-2 py-1 border border-gray-100 flex items-center gap-1">
                    <span className="text-[8px] text-gray-600">The Golden Leaf</span>
                    <TbChevronDown className="text-[8px] text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3">
                <p className="text-[8px] text-gray-400 font-medium mb-2">Number of Guests</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TbUsers className="text-sm text-[#6e1423]" />
                        <span className="text-[11px] font-bold text-gray-900">4 People</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <TbMinus className="text-[8px] text-gray-500" />
                        </button>
                        <button className="w-5 h-5 rounded-full bg-[#6e1423] flex items-center justify-center">
                            <TbPlus className="text-[8px] text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3">
                <p className="text-[8px] text-gray-400 font-medium mb-2">Select Date</p>
                <div className="flex gap-1.5">
                    {['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12'].map((d, i) => (
                        <div key={i} className={`flex-1 text-center py-1.5 rounded-lg text-[7px] font-medium ${i === 2 ? 'bg-[#6e1423] text-white' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                            {d}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3 flex-1">
                <p className="text-[8px] text-gray-400 font-medium mb-2">Select Table</p>
                <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 12 }).map((_, i) => {
                        const isTaken = [2, 5, 8].includes(i)
                        const isSelected = i === 6
                        return (
                            <div
                                key={i}
                                className={`h-6 rounded-md flex items-center justify-center text-[6px] font-medium ${isTaken
                                    ? 'bg-gray-100 text-gray-300'
                                    : isSelected
                                        ? 'bg-[#6e1423] text-white'
                                        : 'bg-gray-50 text-gray-500 border border-gray-100'
                                    }`}
                            >
                                T{i + 1}
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-gray-100" />
                        <span className="text-[6px] text-gray-400">Taken</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-gray-50 border border-gray-100" />
                        <span className="text-[6px] text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-[#6e1423]" />
                        <span className="text-[6px] text-gray-400">Selected</span>
                    </div>
                </div>

                <p className="text-[8px] text-gray-400 font-medium mt-3 mb-2">Available Time Slots</p>
                <div className="grid grid-cols-3 gap-1.5">
                    {['1:00-2:00 PM', '2:00-3:00 PM', '3:00-4:00 PM', '5:00-6:00 PM', '6:00-7:00 PM', '7:00-8:00 PM'].map((t, i) => (
                        <div key={i} className={`text-center py-1.5 rounded-lg text-[7px] font-medium ${i === 4 ? 'bg-[#6e1423]/10 text-[#6e1423] border border-[#6e1423]/20' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                            {t}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pb-3">
                <div className="bg-[#6e1423] rounded-xl py-2.5 flex items-center justify-center gap-1.5">
                    <TbCheck className="text-white text-xs" />
                    <span className="text-white text-[10px] font-bold">Confirm Reservation</span>
                </div>
            </div>

            <BottomNav active={2} />
        </div>
    </div>
)

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

    const navLinks = [
        { label: 'Features', id: 'features' },
        { label: 'How It Works', id: 'how-it-works' },
        { label: 'Reviews', id: 'testimonials' },
        { label: 'FAQ', id: 'faq' },
    ]

    const steps = [
        {
            step: '01',
            icon: <TbMapPin className="text-2xl" />,
            title: 'Discover Restaurants',
            description:
                'Browse curated restaurants near you. Explore menus with photos, ratings, and real-time availability.',
        },
        {
            step: '02',
            icon: <TbCalendarEvent className="text-2xl" />,
            title: 'Reserve Your Table',
            description:
                'Pick your restaurant, choose date & time, select guests, and confirm your booking instantly.',
        },
        {
            step: '03',
            icon: <TbThumbUp className="text-2xl" />,
            title: 'Enjoy Your Meal',
            description:
                'Arrive to your reserved table, order via QR code, earn rewards, and save favorites for next time.',
        },
    ]

    const features = [
        {
            icon: <TbCalendarEvent className="text-2xl" />,
            title: 'Instant Reservations',
            description:
                'Book your perfect table in seconds. Choose date, time, party size, and get instant confirmation.',
            color: 'from-purple-500 to-indigo-600',
        },
        {
            icon: <TbChefHat className="text-2xl" />,
            title: 'Browse Menus',
            description:
                'Explore detailed menus with photos, descriptions, and prices. Filter by cuisine or dietary preferences.',
            color: 'from-amber-500 to-orange-600',
        },
        {
            icon: <TbScan className="text-2xl" />,
            title: 'QR Table Ordering',
            description:
                'Scan the QR code at your table and order directly from your phone. No need to wait for a waiter.',
            color: 'from-emerald-500 to-teal-600',
        },
        {
            icon: <TbCreditCard className="text-2xl" />,
            title: 'Secure Payments',
            description:
                'Pay with confidence using encrypted payment gateways. Support for cards, wallets, and cash on delivery.',
            color: 'from-sky-500 to-blue-600',
        },
        {
            icon: <TbGift className="text-2xl" />,
            title: 'Rewards & Offers',
            description:
                'Earn points with every order. Unlock discounts, birthday treats, and VIP access to new launches.',
            color: 'from-rose-500 to-pink-600',
        },
        {
            icon: <TbBell className="text-2xl" />,
            title: 'Smart Alerts',
            description:
                'Get reservation reminders, order status updates, and exclusive offers from your favorite spots.',
            color: 'from-violet-500 to-purple-600',
        },
    ]

    const whyChooseFeatures = [
        {
            icon: <TbCalendarEvent className="text-xl" />,
            title: 'Instant Booking',
            description: 'Reserve tables in seconds with real-time availability',
        },
        {
            icon: <TbMapPin className="text-xl" />,
            title: '500+ Restaurants',
            description: 'Discover the finest dining spots across the city',
        },
        {
            icon: <TbShieldCheck className="text-xl" />,
            title: 'Secure & Private',
            description: 'Bank-level encryption protects all your data',
        },
        {
            icon: <TbGift className="text-xl" />,
            title: 'Earn Rewards',
            description: 'Get points and discounts on every reservation',
        },
    ]

    const testimonials = [
        {
            quote:
                'Booking a table used to mean calling during busy hours. Now I just open the app, pick my time, and done. The confirmation notification is a nice touch.',
            author: 'Min Ko Ko',
            role: 'Regular Diner',
            location: 'Mandalay',
            rating: 5,
        },
        {
            quote:
                'The reservation feature is a game changer. I love being able to see available tables and pick the perfect spot before I even leave home.',
            author: 'Sarah Chen',
            role: 'Food Enthusiast',
            location: 'Yangon',
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

    const stats = [
        { value: '10K+', label: 'Downloads', icon: <TbDownload className="text-xl" /> },
        { value: '4.9', label: 'App Rating', icon: <TbStar className="text-xl fill-current" /> },
        { value: '500+', label: 'Restaurants', icon: <TbMapPin className="text-xl" /> },
        { value: '24/7', label: 'Support', icon: <TbUsers className="text-xl" /> },
    ]

    const faqs = [
        {
            q: 'Is the app free to download?',
            a: 'Yes! Royal Plate is completely free to download and use on both iOS and Android. There are no subscription fees or hidden charges.',
        },
        {
            q: 'How do I make a reservation?',
            a: 'Simply select your preferred restaurant, choose your date and time, specify the number of guests, pick your table, and confirm. You will receive instant confirmation via notification.',
        },
        {
            q: 'Can I order food through the app?',
            a: 'Yes! Once seated, scan the QR code on your table to access the menu and order directly from your phone. You can also browse menus before visiting.',
        },
        {
            q: 'Is my payment information secure?',
            a: 'Yes, we use industry-standard encryption and secure payment gateways to protect your financial information. Your data is always safe with us.',
        },
        {
            q: 'Can I save my favorite restaurants?',
            a: 'Yes! You can bookmark your favorite restaurants and dishes for quick access. Your saved items sync across all your devices.',
        },
    ]

    const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafaf8]'
    const textPrimary = isDark ? 'text-white' : 'text-gray-900'
    const textSecondary = isDark ? 'text-zinc-400' : 'text-gray-500'
    const textMuted = isDark ? 'text-zinc-500' : 'text-gray-400'
    const cardBg = isDark
        ? 'bg-white/[0.04] border-white/[0.08]'
        : 'bg-white border-gray-100'
    const cardHoverBg = isDark
        ? 'hover:bg-white/[0.07] hover:border-white/[0.14]'
        : 'hover:bg-white hover:border-gray-200 hover:shadow-lg'
    const sectionAltBg = isDark
        ? 'bg-white/[0.02]'
        : 'bg-white'
    const borderColor = isDark ? 'border-white/[0.08]' : 'border-gray-100'

    return (
        <div className={`min-h-screen w-full font-sans relative overflow-x-hidden transition-colors duration-300 ${bg} ${isDark ? 'text-slate-100 selection:bg-amber-500/30 selection:text-amber-200' : 'text-gray-900 selection:bg-primary/20 selection:text-primary'}`}>
            {/* Sticky Navigation */}
            <header className={`sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a]/90' : 'bg-[#fafaf8]/90'} backdrop-blur-xl border-b ${borderColor}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-[72px]">
                        <div
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
                        >
                            <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden ring-2 transition-all ${isDark ? 'ring-amber-400/40 group-hover:ring-amber-400/70' : 'ring-primary/30 group-hover:ring-primary/60'}`}>
                                <img src={emailOptLogo} alt="Royal Plate" className="h-full w-full object-cover" />
                            </div>
                            <span className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${isDark ? 'text-white group-hover:text-amber-300' : 'text-gray-900 group-hover:text-primary'}`}>
                                Royal Plate
                            </span>
                        </div>

                        <nav className={`hidden md:flex items-center gap-1`}>
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/[0.06]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'}`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDark ? 'text-amber-300 hover:bg-white/[0.06]' : 'text-gray-600 hover:bg-gray-100'}`}
                                aria-label="Toggle theme"
                            >
                                {isDark ? <TbSun className="text-lg" /> : <TbMoon className="text-lg" />}
                            </button>

                            <a
                                href={appVersion?.iosLink || appVersion?.playStoreLink || '#download'}
                                target={appVersion?.iosLink || appVersion?.playStoreLink ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-primary text-white hover:bg-primary-mild'}`}
                            >
                                <TbDownload className="text-base" />
                                <span>Get App</span>
                            </a>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`md:hidden p-2.5 rounded-xl transition-colors cursor-pointer ${isDark ? 'text-zinc-300 hover:bg-white/[0.06]' : 'text-gray-700 hover:bg-gray-100'}`}
                                aria-label="Toggle Menu"
                            >
                                {mobileMenuOpen ? <TbX className="text-xl" /> : <TbMenu2 className="text-xl" />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`md:hidden border-t ${borderColor} ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}
                        >
                            <div className="px-4 py-4 flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => scrollToSection(link.id)}
                                        className={`text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-zinc-300 hover:text-white hover:bg-white/[0.06]' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                                    >
                                        {link.label}
                                    </button>
                                ))}
                                <a
                                    href={appVersion?.iosLink || appVersion?.playStoreLink || '#download'}
                                    target={appVersion?.iosLink || appVersion?.playStoreLink ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    className={`mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-amber-400 text-black' : 'bg-primary text-white'}`}
                                >
                                    <TbDownload className="text-base" />
                                    <span>Download App</span>
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* HERO SECTION */}
            <section className="relative z-10 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 ${isDark ? 'bg-amber-400/10 border-amber-400/20 text-amber-300' : 'bg-primary/5 border-primary/15 text-primary'}`}
                            >
                                <TbSparkles className="text-sm" />
                                <span className="text-xs font-semibold tracking-wide">Reserve Tables & Discover Restaurants</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className={`text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight leading-[1.1] ${textPrimary}`}
                            >
                                Your Table{' '}
                                <span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400' : 'bg-gradient-to-r from-primary via-[#8a2a35] to-gold'}`}>
                                    Awaits
                                </span>
                                <br />
                                Book It in Seconds
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`mt-5 sm:mt-6 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed ${textSecondary}`}
                            >
                                Reserve tables at top restaurants, browse menus, and order via QR code. The complete dining experience starts here.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3"
                            >
                                {appVersion?.iosLink && (
                                    <a
                                        href={appVersion.iosLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}
                                    >
                                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                        <span>App Store</span>
                                    </a>
                                )}
                                {appVersion?.playStoreLink && (
                                    <a
                                        href={appVersion.playStoreLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}
                                    >
                                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333zm2.302-3.112L5.864 3.292l10.937 6.333zM20.136 12l-3.436 1.99-2.542-2.542 2.542-2.542z" />
                                        </svg>
                                        <span>Google Play</span>
                                    </a>
                                )}
                                {appVersion?.directDownloadLink && (
                                    <a
                                        href="https://drive.google.com/file/d/1ivZ6VYLIjc8WR29ai4xMeP1sogiwl2hQ/view?usp=share_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5 ${isDark ? 'border-white/15 text-white hover:bg-white/[0.06]' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-sm'}`}
                                    >
                                        <TbDownload className={`text-lg shrink-0 ${isDark ? '' : 'text-primary'}`} />
                                        <span>Download APK</span>
                                    </a>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.45 }}
                                className={`mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs ${textMuted}`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <TbStar key={i} className="fill-amber-400 text-xs" />
                                        ))}
                                    </div>
                                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>4.9</span>
                                    <span>rating</span>
                                </div>
                                <div className={`w-px h-4 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                                <div className="flex items-center gap-1.5">
                                    <TbShieldCheck className={`text-base ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                    <span>Secure & Private</span>
                                </div>
                                <div className={`w-px h-4 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                                <div className="flex items-center gap-1.5">
                                    <TbDownload className={`text-base ${isDark ? 'text-amber-400' : 'text-primary'}`} />
                                    <span>Free Download</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - Code-based Phone Mockups */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex justify-center lg:justify-end"
                        >
                            <div className="relative px-4 sm:px-12 lg:px-16">
                                <div className={`absolute -inset-8 rounded-full blur-3xl ${isDark ? 'bg-amber-500/8' : 'bg-primary/8'}`} />

                                {/* Splash Screen - Behind Left */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30, rotate: -8 }}
                                    animate={{ opacity: 1, x: 0, rotate: -8 }}
                                    transition={{ duration: 0.7, delay: 0.4 }}
                                    className="absolute -left-8 sm:-left-14 top-8 z-10"
                                >
                                    <PhoneFrame className="w-52 sm:w-60 h-[440px] sm:h-[500px] opacity-90">
                                        <SplashScreen />
                                    </PhoneFrame>
                                </motion.div>

                                {/* Home Screen - Center */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.3 }}
                                    className="relative z-20"
                                >
                                    <PhoneFrame className="w-52 sm:w-60 h-[440px] sm:h-[500px]">
                                        <HomeScreen />
                                    </PhoneFrame>
                                </motion.div>

                                {/* Floating Card - Reservation */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className={`hidden sm:block absolute -right-4 sm:-right-12 lg:-right-16 bottom-1/4 z-30 p-3 sm:p-3.5 rounded-xl border shadow-lg backdrop-blur-sm ${isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white/95 border-gray-100'}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/15' : 'bg-purple-50'}`}>
                                            <TbCalendarEvent className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                                        </div>
                                        <div>
                                            <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Table Reserved</p>
                                            <p className={`text-[10px] ${textMuted}`}>Instant confirmation</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Card - Rating */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className={`hidden sm:block absolute -left-4 sm:-left-12 lg:-left-16 bottom-16 z-30 p-3 sm:p-3.5 rounded-xl border shadow-lg backdrop-blur-sm ${isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white/95 border-gray-100'}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/15' : 'bg-amber-50'}`}>
                                            <TbStar className={`text-lg fill-amber-400 text-amber-400`} />
                                        </div>
                                        <div>
                                            <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>4.9 Rating</p>
                                            <p className={`text-[10px] ${textMuted}`}>10K+ reviews</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <section className={`relative z-10 border-y ${borderColor} ${sectionAltBg}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="flex items-center gap-3 justify-center md:justify-start"
                            >
                                <div className={`p-2.5 rounded-xl ${isDark ? 'bg-white/[0.05]' : 'bg-primary/5'}`}>
                                    <span className={isDark ? 'text-amber-400' : 'text-primary'}>{stat.icon}</span>
                                </div>
                                <div>
                                    <p className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>{stat.value}</p>
                                    <p className={`text-xs sm:text-sm ${textSecondary}`}>{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section id="features" className="relative z-10 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                        <span className={`text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-primary bg-primary/5 border-primary/15'}`}>
                            Why Choose Us
                        </span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 ${textPrimary}`}>
                            The Smarter Way to{' '}
                            <span className={isDark ? 'text-amber-400' : 'text-primary'}>Dine Out</span>
                        </h2>
                        <p className={`text-sm sm:text-base mt-3 leading-relaxed ${textSecondary}`}>
                            From reservation to checkout, Royal Plate makes every step seamless.
                        </p>
                    </div>

                    {/* Phone with surrounding cards */}
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
                            {/* Left Cards */}
                            <div className="space-y-4 order-2 lg:order-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className={`p-5 rounded-2xl border transition-all ${cardBg} ${cardHoverBg}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                                            <span className={isDark ? 'text-purple-400' : 'text-purple-600'}>{whyChooseFeatures[0].icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold ${textPrimary}`}>{whyChooseFeatures[0].title}</h3>
                                            <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>{whyChooseFeatures[0].description}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className={`p-5 rounded-2xl border transition-all ${cardBg} ${cardHoverBg}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                            <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>{whyChooseFeatures[2].icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold ${textPrimary}`}>{whyChooseFeatures[2].title}</h3>
                                            <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>{whyChooseFeatures[2].description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Center Phone - Reservation Screen */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="flex justify-center order-1 lg:order-2"
                            >
                                <div className="relative">
                                    <div className={`absolute -inset-6 rounded-full blur-2xl ${isDark ? 'bg-purple-500/10' : 'bg-primary/6'}`} />
                                    <PhoneFrame className="w-52 sm:w-60 h-[440px] sm:h-[500px] relative z-10">
                                        <ReservationScreen />
                                    </PhoneFrame>
                                </div>
                            </motion.div>

                            {/* Right Cards */}
                            <div className="space-y-4 order-3">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className={`p-5 rounded-2xl border transition-all ${cardBg} ${cardHoverBg}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                            <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>{whyChooseFeatures[1].icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold ${textPrimary}`}>{whyChooseFeatures[1].title}</h3>
                                            <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>{whyChooseFeatures[1].description}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className={`p-5 rounded-2xl border transition-all ${cardBg} ${cardHoverBg}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                            <span className={isDark ? 'text-rose-400' : 'text-rose-600'}>{whyChooseFeatures[3].icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold ${textPrimary}`}>{whyChooseFeatures[3].title}</h3>
                                            <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>{whyChooseFeatures[3].description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className={`relative z-10 py-16 sm:py-24 ${sectionAltBg} border-y ${borderColor}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                        <span className={`text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-primary bg-primary/5 border-primary/15'}`}>
                            How It Works
                        </span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 ${textPrimary}`}>
                            Three Simple Steps
                        </h2>
                        <p className={`text-sm sm:text-base mt-3 leading-relaxed ${textSecondary}`}>
                            From discovery to dining, the app makes every step effortless.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.12 }}
                                className={`relative rounded-2xl p-6 sm:p-8 border transition-all ${cardBg} ${cardHoverBg}`}
                            >
                                <span className={`text-5xl sm:text-6xl font-black ${isDark ? 'text-white/[0.04]' : 'text-gray-100'} absolute top-4 right-5 select-none`}>
                                    {step.step}
                                </span>
                                <div className={`inline-flex p-3 rounded-xl mb-5 ${isDark ? 'bg-primary/15' : 'bg-primary/8'}`}>
                                    <span className={isDark ? 'text-amber-400' : 'text-primary'}>{step.icon}</span>
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${textPrimary}`}>{step.title}</h3>
                                <p className={`text-sm leading-relaxed ${textSecondary}`}>{step.description}</p>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                        <TbArrowRight className={`text-xl ${isDark ? 'text-zinc-700' : 'text-gray-300'}`} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* APP PREVIEW */}
            <section className="relative z-10 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                        <span className={`text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-primary bg-primary/5 border-primary/15'}`}>
                            App Preview
                        </span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 ${textPrimary}`}>
                            See It in Action
                        </h2>
                        <p className={`text-sm sm:text-base mt-3 leading-relaxed ${textSecondary}`}>
                            A beautiful, intuitive experience designed for food lovers.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
                        {[
                            { screen: <SplashScreen />, label: 'Welcome Screen' },
                            { screen: <HomeScreen />, label: 'Discover Restaurants' },
                            { screen: <ReservationScreen />, label: 'Book a Table' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <PhoneFrame className="w-48 sm:w-56 lg:w-60 h-[400px] sm:h-[470px] lg:h-[500px]">
                                    {item.screen}
                                </PhoneFrame>
                                <p className={`text-sm font-semibold ${textPrimary}`}>{item.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className={`relative z-10 py-16 sm:py-24 ${sectionAltBg} border-y ${borderColor}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                        <span className={`text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-primary bg-primary/5 border-primary/15'}`}>
                            Features
                        </span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 ${textPrimary}`}>
                            Everything You Need
                        </h2>
                        <p className={`text-sm sm:text-base mt-3 leading-relaxed ${textSecondary}`}>
                            Complete dining experience at your fingertips.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className={`group rounded-2xl p-6 border transition-all hover:-translate-y-0.5 ${cardBg} ${cardHoverBg}`}
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${textPrimary}`}>{feature.title}</h3>
                                <p className={`text-sm leading-relaxed ${textSecondary}`}>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="testimonials" className={`relative z-10 py-16 sm:py-24 border-b ${borderColor}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                        <span className={`text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-primary bg-primary/5 border-primary/15'}`}>
                            Reviews
                        </span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 ${textPrimary}`}>
                            Loved by Food Lovers
                        </h2>
                        <p className={`text-sm sm:text-base mt-3 leading-relaxed ${textSecondary}`}>
                            See what our users say about their experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                        {testimonials.map((t, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`rounded-2xl p-6 border ${cardBg}`}
                            >
                                <div className="flex text-amber-400 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <TbStar key={i} className="fill-amber-400 text-base" />
                                    ))}
                                </div>
                                <p className={`text-sm leading-relaxed mb-6 ${textSecondary}`}>
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-white/[0.06] text-white' : 'bg-primary/8 text-primary'}`}>
                                        {t.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold ${textPrimary}`}>{t.author}</p>
                                        <p className={`text-xs ${textMuted}`}>{t.role} &middot; {t.location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="relative z-10 py-16 sm:py-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <span className={`text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-primary bg-primary/5 border-primary/15'}`}>
                            FAQ
                        </span>
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 ${textPrimary}`}>
                            Common Questions
                        </h2>
                        <p className={`text-sm sm:text-base mt-3 leading-relaxed ${textSecondary}`}>
                            Everything you need to know about Royal Plate.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`rounded-xl border overflow-hidden ${cardBg}`}
                            >
                                <details className={`group ${isDark ? '[&[open]]:bg-white/[0.03]' : '[&[open]]:bg-gray-50/80'}`}>
                                    <summary className={`flex items-center justify-between gap-4 p-5 cursor-pointer list-none ${textPrimary}`}>
                                        <h3 className="font-semibold text-sm sm:text-base pr-4">{faq.q}</h3>
                                        <TbArrowRight className={`text-lg shrink-0 transition-transform group-open:rotate-90 ${isDark ? 'text-amber-400' : 'text-primary'}`} />
                                    </summary>
                                    <div className={`px-5 pb-5 text-sm leading-relaxed ${textSecondary}`}>
                                        {faq.a}
                                    </div>
                                </details>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOWNLOAD CTA */}
            <section id="download" className={`relative z-10 py-16 sm:py-24 ${sectionAltBg} border-t ${borderColor}`}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={`inline-flex p-3 rounded-2xl mb-6 ${isDark ? 'bg-amber-500/10' : 'bg-primary/8'}`}>
                            <TbDeviceMobile className={`text-2xl ${isDark ? 'text-amber-400' : 'text-primary'}`} />
                        </div>

                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textPrimary}`}>
                            Ready to Get Started?
                        </h2>
                        <p className={`text-sm sm:text-base mt-3 leading-relaxed max-w-lg mx-auto ${textSecondary}`}>
                            Download Royal Plate now and discover a better way to dine. Free on iOS and Android.
                        </p>

                        {appVersion && (
                            <div className={`mt-3 flex items-center justify-center gap-2 text-xs ${textMuted}`}>
                                <TbDownload className={isDark ? 'text-amber-400' : 'text-primary'} />
                                <span>v{appVersion.versionName}</span>
                                <span className={isDark ? 'text-zinc-700' : 'text-gray-300'}>&middot;</span>
                                <span className="truncate max-w-[200px] sm:max-w-none">{appVersion.title}</span>
                            </div>
                        )}

                        <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                            {appVersion?.iosLink && (
                                <a
                                    href={appVersion.iosLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}
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
                                    className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}
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
                                    className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5 ${isDark ? 'border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-sm'}`}
                                >
                                    <TbDownload className={`text-lg shrink-0 ${isDark ? '' : 'text-primary'}`} />
                                    <span>Direct Download (APK)</span>
                                </a>
                            )}
                        </div>

                        <div className={`mt-8 flex flex-wrap items-center justify-center gap-5 text-xs ${textMuted}`}>
                            <div className="flex items-center gap-1.5">
                                <TbDeviceMobile className="text-base" />
                                <span>iOS 13.0+</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TbDeviceMobile className="text-base" />
                                <span>Android 8.0+</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TbClock className="text-base" />
                                <span>~25 MB</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className={`relative z-10 border-t ${borderColor} ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f5f3ef]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl overflow-hidden ring-2 ${isDark ? 'ring-amber-400/40' : 'ring-primary/30'}`}>
                                <img src={emailOptLogo} alt="Royal Plate" className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <p className={`font-bold text-lg ${textPrimary}`}>Royal Plate</p>
                                <p className={`text-xs ${textMuted}`}>Your Table Awaits</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`transition-colors ${isDark ? 'text-zinc-400 hover:text-amber-300' : 'text-gray-600 hover:text-primary'}`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        <a
                            href="mailto:support@royalplate.app"
                            className={`text-sm transition-colors ${isDark ? 'text-zinc-400 hover:text-amber-300' : 'text-gray-600 hover:text-primary'}`}
                        >
                            support@royalplate.app
                        </a>
                    </div>

                    <div className={`mt-8 pt-6 border-t text-center text-xs ${borderColor} ${textMuted}`}>
                        <p>&copy; {new Date().getFullYear()} Royal Plate. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Back to Top */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={`fixed bottom-5 right-5 z-50 p-3 rounded-full shadow-lg transition-colors cursor-pointer ${isDark ? 'bg-amber-400 text-black shadow-amber-500/20 hover:bg-amber-300' : 'bg-primary text-white shadow-primary/20 hover:bg-primary-mild'}`}
                        aria-label="Back to top"
                    >
                        <TbArrowUp className="text-lg" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LandingPage
