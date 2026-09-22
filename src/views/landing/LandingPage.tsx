import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router'
import { useAuth } from '@/auth'
import emailOptLogo from '@/assets/logo/emailoptlogo.png'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useGetAppVersions } from '@/utils/custom-hooks/useAppVersion'
import {
    TbChefHat,
    TbClipboardList,
    TbTable,
    TbCalendarEvent,
    TbReceipt2,
    TbArrowRight,
    TbCheck,
    TbClock,
    TbShieldCheck,
    TbTrendingUp,
    TbFlame,
    TbMenu2,
    TbX,
    TbChevronDown,
    TbSparkles,
    TbStar,
    TbBell,
    TbLogin,
    TbChartBar,
    TbArrowUp,
    TbAccessible,
    TbAlarm,
    TbUsers,
    TbShoppingBag,
    TbCoin,
    TbCalendarClock,
    TbCalendarCheck,
    TbCircleCheck,
    TbDownload,
    TbMapPin,
    TbPhone,
    TbClock2,
    TbSun,
    TbMoon,
} from 'react-icons/tb'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

type DemoTab = 'orders' | 'tables' | 'reservations' | 'analytics'

const DownloadAppSection = ({ isDark }: { isDark: boolean }) => {
    const { data } = useGetAppVersions()
    const appVersion = data?.data?.[0]

    return (
        <section
            className={`relative z-10 py-14 sm:py-20 transition-colors ${isDark
                ? 'bg-[#0d0307]/80 border-t border-white/[0.08]'
                : 'bg-[#f4efe8] border-t border-[#e2d9cd]'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                    {/* Left — Copy */}
                    <div className="text-center lg:text-left">
                        <span
                            className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-primary bg-primary/10 border-primary/20'
                                }`}
                        >
                            Mobile App
                        </span>
                        <h2
                            className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            Order & Reserve from Your Phone
                        </h2>
                        <p
                            className={`text-sm sm:text-base mt-4 leading-relaxed max-w-xl mx-auto lg:mx-0 ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                }`}
                        >
                            Guests download the Royal Plate app on iOS or Android, browse menus, place orders, and book reservations — all from their mobile device.
                        </p>

                        {appVersion && (
                            <div
                                className={`mt-4 flex items-center justify-center lg:justify-start gap-2 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'
                                    }`}
                            >
                                <TbDownload className={isDark ? 'text-amber-400' : 'text-primary'} />
                                <span>Latest: v{appVersion.versionName}</span>
                                <span className={isDark ? 'text-zinc-600' : 'text-gray-400'}>•</span>
                                <span className="truncate max-w-[200px] sm:max-w-none">{appVersion.title}</span>
                            </div>
                        )}

                        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3">
                            {appVersion?.iosLink && (
                                <a
                                    href={appVersion.iosLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark
                                        ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
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
                                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark
                                        ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
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
                                    href={`https://drive.google.com/file/d/1ZZMbQdiLnRQvIWZPx6Mk_SLpAE30w3Dz/view?usp=share_link`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${isDark
                                        ? 'border-white/20 bg-white/[0.04] hover:bg-white/[0.1] text-white'
                                        : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
                                        }`}
                                >
                                    <TbDownload className={`text-lg shrink-0 ${isDark ? '' : 'text-primary'}`} />
                                    <span>Direct Download (APK)</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right — Phone Mockup */}
                    <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
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
                                            <p className="text-[10px] text-zinc-500">Guest Ordering App</p>
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
                    </div>
                </div>
            </div>
        </section>
    )
}

const LandingPage = () => {
    const navigate = useNavigate()
    const { authenticated } = useAuth()
    const [isDark, setIsDark] = useState(false) // Default to light mode
    const [activeTab, setActiveTab] = useState<DemoTab>('orders')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [, setScrolled] = useState(false)
    const [showBackToTop, setShowBackToTop] = useState(false)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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

    const stats = [
        { value: '350+', label: 'Fine Dining & Eateries', sub: 'Across 14 culinary hubs' },
        { value: '$14.8M', label: 'Monthly Processed', sub: 'Zero commission leakage' },
        { value: '< 45s', label: 'Order-to-Kitchen Speed', sub: 'Real-time WebSocket & Firebase' },
        { value: '99.98%', label: 'Uptime Reliability', sub: 'Enterprise-grade cloud infra' },
    ]

    const features = [
        {
            icon: <TbClipboardList className={`text-2xl ${isDark ? 'text-amber-400' : 'text-primary'}`} />,
            title: 'Live Order Dispatch & KDS',
            description:
                'Instantly pipe customer or server tickets straight to kitchen preparation screens with sound cues, prep countdowns, and modification alerts.',
            badge: 'Sub-second Sync',
            accent: isDark ? 'from-amber-500/20 to-transparent' : 'from-primary/15 to-transparent',
        },
        {
            icon: <TbTable className="text-2xl text-emerald-500" />,
            title: 'Interactive Dining Room & Tables',
            description:
                'Visual floor layouts tailored to your restaurant layout. Color-coded dining statuses, turn-rate timing, and instant merge or split table capabilities.',
            badge: 'Live Floor Grid',
            accent: 'from-emerald-500/20 to-transparent',
        },
        {
            icon: <TbCalendarEvent className="text-2xl text-purple-500" />,
            title: 'Smart Guest Reservations',
            description:
                'Automated table assignments, special dietary tags, VIP guest history, and SMS/notification confirmations that slash no-shows to near zero.',
            badge: 'Zero No-Shows',
            accent: 'from-purple-500/20 to-transparent',
        },
        {
            icon: <TbChefHat className="text-2xl text-rose-500" />,
            title: 'Dynamic Dish & Menu Engineering',
            description:
                'Update recipes, mark items sold-out in one tap across all terminals, customize modifiers, and promote high-margin signature courses.',
            badge: 'Instant Updates',
            accent: 'from-rose-500/20 to-transparent',
        },
        {
            icon: <TbReceipt2 className="text-2xl text-sky-500" />,
            title: 'Automated Settlements & Payouts',
            description:
                'Crystal-clear revenue ledgers, commission breakdowns, staff tips management, and one-click financial payouts without accounting headaches.',
            badge: 'Audit Ready',
            accent: 'from-sky-500/20 to-transparent',
        },
        {
            icon: <TbShieldCheck className="text-2xl text-indigo-500" />,
            title: 'Role-Based Access Control',
            description:
                'Granular permissions for Admins, Restaurant Owners, Kitchen Head Chefs, and Floor Staff ensuring full data confidentiality and operational focus.',
            badge: 'Enterprise Security',
            accent: 'from-indigo-500/20 to-transparent',
        },
    ]

    const faqs = [
        {
            q: 'Can Royal Plate run on our existing iPads, Android tablets, or POS PCs?',
            a: 'Yes, 100%! Royal Plate is a modern cloud web platform engineered to work natively on any device with a modern browser — from kitchen tablets and iPads to owner smartphones and desktop workstations without proprietary hardware lock-ins.',
        },
        {
            q: 'How does real-time kitchen notification work?',
            a: 'We leverage instant cloud event pipelines (Firebase Cloud Messaging + WebSockets). When a waiter or customer places an order, the kitchen display buzzes with an audio alert and ticket updates in less than a second.',
        },
        {
            q: 'Can multiple restaurant branches be managed from one single login?',
            a: 'Yes. Restaurant owners with multi-location establishments can seamlessly switch between branch workspaces from a unified master dashboard, with separated sales, staff, and inventories.',
        },
        {
            q: 'What is the onboarding process for a new restaurant?',
            a: 'You can be up and running in under 20 minutes: create your menu categories, upload dish pictures, arrange your table floor plan, and invite your staff with their specific role permissions.',
        },
    ]

    const testimonials = [
        {
            quote:
                'Royal Plate replaced three clunky disparate software tools. Our table turnover is 30% faster during Friday dinner rushes, and kitchen communication errors have dropped to zero.',
            author: 'Chef Antoine Laurent',
            role: 'Executive Chef & Owner',
            venue: 'Le Cordon Royal • Yangon',
            rating: 5,
        },
        {
            quote:
                'The real-time table floor map and payout settlement reports give me total transparency even when I am traveling. The gold standard for restaurant operations.',
            author: 'Daw Thuzar Myint',
            role: 'Managing Director',
            venue: 'Grand Heritage Bistro Group',
            rating: 5,
        },
        {
            quote:
                'Staff onboarding took less than ten minutes. The UI is gorgeous, intuitive, and the live order notifications ensure our floor staff never misses a beat.',
            author: 'Michael Vance',
            role: 'General Manager',
            venue: 'The Amber Cellar',
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
            {/* Ambient Background Glows */}
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
                {/* Subtle Luxury Pattern Overlay */}
                <div
                    className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] transition-opacity duration-500 ${isDark
                        ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] opacity-70'
                        : 'bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] opacity-60'
                        }`}
                />
            </div>

            {/* Sticky Navigation Bar */}
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
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`text-lg sm:text-xl font-bold tracking-tight font-sans transition-colors ${isDark
                                        ? 'text-white group-hover:text-amber-300'
                                        : 'text-gray-900 group-hover:text-primary'
                                        }`}
                                >
                                    Royal Plate
                                </span>
                                <span
                                    className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border ${isDark
                                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/30'
                                        : 'bg-primary/10 text-primary border-primary/25'
                                        }`}
                                >
                                    OS
                                </span>
                            </div>
                            <span
                                className={`text-[10px] sm:text-[11px] tracking-wider font-medium hidden xs:inline-block ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                    }`}
                            >
                                Restaurant Intelligence
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
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
                            onClick={() => scrollToSection('live-demo')}
                            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Workspace
                        </button>

                        <button
                            onClick={() => scrollToSection('testimonials')}
                            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            Restaurateurs
                        </button>
                        <button
                            onClick={() => scrollToSection('faq')}
                            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            FAQ
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-300' : 'hover:text-primary'
                                }`}
                        >
                            Contact Us
                        </button>
                    </nav>

                    {/* Actions & Theme Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Light / Dark Mode Toggle Button */}
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

                        {/* Desktop Auth Buttons */}
                        <div className="hidden sm:flex items-center gap-3">
                            {authenticated ? (
                                <button
                                    onClick={() => navigate('/home')}
                                    className={`px-4 lg:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer ${isDark
                                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-zinc-950 hover:shadow-lg hover:shadow-amber-500/25'
                                        : 'bg-primary hover:bg-primary-mild text-white shadow-md shadow-primary/20'
                                        }`}
                                >
                                    <span>Go to Dashboard</span>
                                    <TbArrowRight className="text-base" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/sign-in')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${isDark
                                        ? 'text-zinc-300 hover:text-white border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04]'
                                        : 'text-gray-700 hover:text-primary border-gray-300 hover:border-primary/40 hover:bg-white shadow-sm'
                                        }`}
                                >
                                    <TbLogin className={`text-base ${isDark ? 'text-amber-400' : 'text-primary'}`} />
                                    <span>Sign In</span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Hamburger Button */}
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

                {/* Mobile Dropdown Drawer */}
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
                                onClick={() => scrollToSection('live-demo')}
                                className={`text-left py-1 text-sm font-medium flex items-center gap-2 ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live Workspace
                            </button>

                            <button
                                onClick={() => scrollToSection('testimonials')}
                                className={`text-left py-1 text-sm font-medium ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                Restaurateurs
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className={`text-left py-1 text-sm font-medium ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                FAQ
                            </button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className={`text-left py-1 text-sm font-medium ${isDark ? 'text-zinc-300 hover:text-amber-300' : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                Contact Us
                            </button>

                            {/* Theme Quick Switcher in Mobile Drawer */}
                            <div
                                className={`pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-white/10 text-zinc-400' : 'border-gray-200 text-gray-500'
                                    }`}
                            >
                                <span>Display Theme</span>
                                <button
                                    onClick={() => setIsDark(!isDark)}
                                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-semibold text-xs transition-colors ${isDark
                                        ? 'border-white/15 bg-white/5 text-amber-300'
                                        : 'border-gray-300 bg-stone-50 text-gray-800'
                                        }`}
                                >
                                    {isDark ? <TbSun /> : <TbMoon />}
                                    <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                                </button>
                            </div>

                            <div
                                className={`pt-2 border-t flex flex-col gap-2 ${isDark ? 'border-white/10' : 'border-gray-200'
                                    }`}
                            >
                                {authenticated ? (
                                    <button
                                        onClick={() => navigate('/home')}
                                        className={`w-full py-2.5 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 ${isDark
                                            ? 'bg-amber-500 text-zinc-950'
                                            : 'bg-primary text-white'
                                            }`}
                                    >
                                        <span>Go to Dashboard</span>
                                        <TbArrowRight />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/sign-in')}
                                        className={`w-full py-2.5 rounded-xl text-center text-sm font-medium border ${isDark
                                            ? 'text-zinc-300 border-white/15 hover:bg-white/5'
                                            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* HERO SECTION */}
            <section className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Pill Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border backdrop-blur-md shadow-inner mb-5 sm:mb-6 max-w-full ${isDark
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
                            className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider truncate sm:whitespace-normal ${isDark ? 'text-amber-300' : 'text-primary'
                                }`}
                        >
                            The Next-Gen Restaurant Operating System
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight font-sans leading-[1.15] sm:leading-[1.12] ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Run Your Restaurant with{' '}
                        <span
                            className={`bg-clip-text text-transparent italic ${isDark
                                ? 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500'
                                : 'bg-gradient-to-r from-primary via-[#8a2a35] to-gold'
                                }`}
                        >
                            Royal Precision.
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 ${isDark ? 'text-zinc-400' : 'text-gray-600'
                            }`}
                    >
                        Synchronize kitchen tickets in real-time, master your dining floor plan, automate table bookings, and monitor multi-branch revenue from a singular, royal command center.
                    </motion.p>

                    {/* Hero CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
                    >
                        <button
                            onClick={() => scrollToSection('live-demo')}
                            className={`w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl border font-medium text-sm sm:text-base backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer ${isDark
                                ? 'border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white'
                                : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
                                }`}
                        >
                            <TbFlame className={isDark ? 'text-amber-400 text-lg' : 'text-primary text-lg'} />
                            <span>Interactive Preview</span>
                        </button>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className={`mt-8 sm:mt-12 pt-6 sm:pt-8 border-t flex flex-wrap items-center justify-center gap-4 sm:gap-10 text-xs ${isDark
                            ? 'border-white/[0.08] text-zinc-400'
                            : 'border-gray-200 text-gray-500'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <TbStar key={i} className="fill-amber-400 text-xs" />
                                ))}
                            </div>
                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                4.9 / 5.0
                            </span>{' '}
                            Rating
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                            <span>Sub-Second Kitchen Sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbShieldCheck className={`text-base ${isDark ? 'text-amber-400' : 'text-primary'}`} />
                            <span>Zero Hardware Lock-In</span>
                        </div>
                    </motion.div>
                </div>

                {/* HERO INTERACTIVE WORKSPACE SHOWCASE */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-10 sm:mt-14 relative"
                >
                    {/* Ambient Glow behind frame */}
                    <div
                        className={`absolute -inset-1 rounded-3xl blur-2xl transition-all duration-500 ${isDark
                            ? 'bg-gradient-to-r from-amber-500/20 via-[#6e1423]/40 to-amber-600/20 opacity-60'
                            : 'bg-gradient-to-r from-primary/10 via-[#c9a227]/15 to-primary/10 opacity-70'
                            }`}
                    />

                    {/* Window Frame */}
                    <div
                        className={`relative rounded-2xl md:rounded-3xl border backdrop-blur-2xl shadow-2xl overflow-hidden transition-colors duration-300 ${isDark
                            ? 'border-white/15 bg-[#12060b]/90 shadow-2xl'
                            : 'border-gray-200 bg-white/95 shadow-2xl shadow-stone-300/40'
                            }`}
                    >
                        {/* Mockup OS Topbar */}
                        <div
                            className={`px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-b flex items-center justify-between gap-2 transition-colors ${isDark
                                ? 'border-white/10 bg-white/[0.02]'
                                : 'border-gray-100 bg-stone-50/80'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500/80" />
                                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500/80" />
                                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500/80" />
                                <span
                                    className={`ml-2 sm:ml-3 text-[11px] sm:text-xs font-mono hidden md:inline-block truncate ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                        }`}
                                >
                                    royal-plate.app/workspace/le-cordon-royal
                                </span>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="hidden sm:inline">Live Service Active</span>
                                    <span className="sm:hidden">Live</span>
                                </span>
                                <div
                                    className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border ${isDark
                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                        : 'bg-primary/10 text-primary border-primary/25'
                                        }`}
                                >
                                    RP
                                </div>
                            </div>
                        </div>

                        {/* Interactive Tabs Header inside Mockup (Horizontally scrollable on mobile!) */}
                        <div
                            className={`px-3 sm:px-6 pt-3 sm:pt-5 pb-2.5 sm:pb-3 border-b flex items-center justify-between gap-3 overflow-hidden transition-colors ${isDark
                                ? 'border-white/[0.07] bg-white/[0.01]'
                                : 'border-gray-100 bg-stone-50/50'
                                }`}
                        >
                            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'orders'
                                        ? isDark
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                            : 'bg-primary/10 text-primary border border-primary/30 shadow-sm'
                                        : isDark
                                            ? 'text-zinc-400 hover:text-zinc-200'
                                            : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    <TbClipboardList className="text-sm" />
                                    <span>Active Orders (3)</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('tables')}
                                    className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'tables'
                                        ? isDark
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                            : 'bg-emerald-600/10 text-emerald-700 border border-emerald-500/30 shadow-sm'
                                        : isDark
                                            ? 'text-zinc-400 hover:text-zinc-200'
                                            : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    <TbTable className="text-sm" />
                                    <span>Floor Grid (18/24)</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('reservations')}
                                    className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'reservations'
                                        ? isDark
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                            : 'bg-purple-600/10 text-purple-700 border border-purple-500/30 shadow-sm'
                                        : isDark
                                            ? 'text-zinc-400 hover:text-zinc-200'
                                            : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    <TbCalendarEvent className="text-sm" />
                                    <span>Today's Bookings</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'analytics'
                                        ? isDark
                                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                                            : 'bg-sky-600/10 text-sky-700 border border-sky-500/30 shadow-sm'
                                        : isDark
                                            ? 'text-zinc-400 hover:text-zinc-200'
                                            : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    <TbChartBar className="text-sm" />
                                    <span>Sales Velocity</span>
                                </button>
                            </div>

                            <div
                                className={`hidden lg:flex items-center gap-2 text-xs shrink-0 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                    }`}
                            >
                                <span
                                    className={`font-semibold font-mono ${isDark ? 'text-amber-400' : 'text-primary'
                                        }`}
                                >
                                    19:42:15
                                </span>
                                <span className={isDark ? 'text-zinc-600' : 'text-gray-300'}>•</span>
                                <span>Peak Dinner Shift</span>
                            </div>
                        </div>

                        {/* Interactive Tab Panels */}
                        <div
                            className={`p-3 sm:p-6 lg:p-8 min-h-[350px] sm:min-h-[380px] transition-colors ${isDark ? 'bg-[#0d0408]/60' : 'bg-[#fcfaf7]'
                                }`}
                        >
                            {/* TAB 1: LIVE ORDERS */}
                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
                                >
                                    {/* Order Card 1 — Preparing */}
                                    <div
                                        className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-colors ${isDark
                                            ? 'border border-purple-500/30 bg-purple-500/[0.04]'
                                            : 'border border-purple-200 bg-white shadow-sm'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p
                                                        className={`text-[10px] font-medium uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Order
                                                    </p>
                                                    <h5
                                                        className={`text-base sm:text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        #ORD-4821
                                                    </h5>
                                                </div>
                                                <span className="shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 bg-purple-100 text-purple-700">
                                                    <TbAccessible size={14} /> Preparing
                                                </span>
                                            </div>
                                            <div className="mt-3 space-y-1.5 text-xs">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Customer
                                                    </span>
                                                    <span
                                                        className={`max-w-[60%] truncate text-right font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'
                                                            }`}
                                                    >
                                                        Antoine Laurent
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Placed
                                                    </span>
                                                    <span
                                                        className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        19:34
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Table
                                                    </span>
                                                    <span
                                                        className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        Table 04 • 4 Guests
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'
                                                }`}
                                        >
                                            <p
                                                className={`mb-2 text-[10px] font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                    }`}
                                            >
                                                Items (3)
                                            </p>
                                            <div
                                                className={`space-y-1.5 text-xs ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Wagyu Ribeye M5+</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x2
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Truffle Risotto</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x1
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Chateau Margaux 2018</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x2
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-gray-100'
                                                }`}
                                        >
                                            <div>
                                                <p className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                    Total
                                                </p>
                                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    124,000 MMK
                                                </p>
                                            </div>
                                            <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                                                Est. 8 min
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Card 2 — Ready */}
                                    <div
                                        className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-colors ${isDark
                                            ? 'border border-green-500/30 bg-green-500/[0.04]'
                                            : 'border border-green-200 bg-white shadow-sm'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p
                                                        className={`text-[10px] font-medium uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Order
                                                    </p>
                                                    <h5
                                                        className={`text-base sm:text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        #ORD-4820
                                                    </h5>
                                                </div>
                                                <span className="shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 bg-green-100 text-green-700">
                                                    <TbAlarm size={14} /> Ready
                                                </span>
                                            </div>
                                            <div className="mt-3 space-y-1.5 text-xs">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Customer
                                                    </span>
                                                    <span
                                                        className={`max-w-[60%] truncate text-right font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'
                                                            }`}
                                                    >
                                                        Thuzar Myint
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Placed
                                                    </span>
                                                    <span
                                                        className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        19:26
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Table
                                                    </span>
                                                    <span
                                                        className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        Table 09 • Booth VIP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'
                                                }`}
                                        >
                                            <p
                                                className={`mb-2 text-[10px] font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                    }`}
                                            >
                                                Items (3)
                                            </p>
                                            <div
                                                className={`space-y-1.5 text-xs ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Chilean Sea Bass</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x3
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Burrata Salad</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x2
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Smoked Old Fashioned</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x3
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-gray-100'
                                                }`}
                                        >
                                            <div>
                                                <p className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                    Total
                                                </p>
                                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    157,750 MMK
                                                </p>
                                            </div>
                                            <span
                                                className={`text-[11px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${isDark
                                                    ? 'text-amber-400 bg-amber-500/10'
                                                    : 'text-amber-700 bg-amber-100'
                                                    }`}
                                            >
                                                <TbBell className="animate-bounce" size={14} /> Bell Server
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Card 3 — Pending */}
                                    <div
                                        className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-colors md:col-span-2 lg:col-span-1 ${isDark
                                            ? 'border border-yellow-500/30 bg-yellow-500/[0.04]'
                                            : 'border border-amber-200 bg-white shadow-sm'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p
                                                        className={`text-[10px] font-medium uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Order
                                                    </p>
                                                    <h5
                                                        className={`text-base sm:text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        #ORD-4824
                                                    </h5>
                                                </div>
                                                <span className="shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 bg-yellow-100 text-yellow-800">
                                                    <TbClock size={14} /> Pending
                                                </span>
                                            </div>
                                            <div className="mt-3 space-y-1.5 text-xs">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Customer
                                                    </span>
                                                    <span
                                                        className={`max-w-[60%] truncate text-right font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'
                                                            }`}
                                                    >
                                                        Clara Dupont
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Placed
                                                    </span>
                                                    <span
                                                        className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        19:42
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                        Table
                                                    </span>
                                                    <span
                                                        className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        Table 02 • Window Terrace
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'
                                                }`}
                                        >
                                            <p
                                                className={`mb-2 text-[10px] font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                    }`}
                                            >
                                                Items (3)
                                            </p>
                                            <div
                                                className={`space-y-1.5 text-xs ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Royal Seafood Platter</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x1
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Lobster Thermidor</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x1
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="truncate min-w-0">Champagne Brut</span>
                                                    <span
                                                        className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        x2
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-gray-100'
                                                }`}
                                        >
                                            <div>
                                                <p className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                    Total
                                                </p>
                                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    195,000 MMK
                                                </p>
                                            </div>
                                            <button
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${isDark
                                                    ? 'text-zinc-950 bg-amber-400 hover:bg-amber-300'
                                                    : 'text-white bg-primary hover:bg-primary-mild'
                                                    }`}
                                            >
                                                Accept to KDS
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 2: FLOOR GRID */}
                            {activeTab === 'tables' && (
                                <motion.div
                                    key="tables"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs border-b pb-3 ${isDark
                                            ? 'text-zinc-400 border-white/10'
                                            : 'text-gray-500 border-gray-200'
                                            }`}
                                    >
                                        <span className="font-medium">Floor: Main Dining Hall</span>
                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-green-500" /> Active (8)
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-red-500" /> Inactive (2)
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-orange-500" /> Maintenance (1)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
                                        {[
                                            {
                                                type: 'standard',
                                                status: 'active' as const,
                                                capacity: 4,
                                                duration: 45,
                                                gap: 15,
                                                fee: 5000,
                                                services: ['WiFi', 'Power'],
                                            },
                                            {
                                                type: 'vip',
                                                status: 'active' as const,
                                                capacity: 8,
                                                duration: 60,
                                                gap: 20,
                                                fee: 25000,
                                                services: ['Private', 'WiFi', 'Minibar'],
                                            },
                                            {
                                                type: 'family',
                                                status: 'active' as const,
                                                capacity: 6,
                                                duration: 50,
                                                gap: 15,
                                                fee: 10000,
                                                services: ['WiFi', 'Kids Menu'],
                                            },
                                        ].map((t, idx) => (
                                            <div
                                                key={idx}
                                                className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow ${isDark
                                                    ? 'border border-white/10 bg-white/[0.02]'
                                                    : 'border border-gray-200 bg-white shadow-sm'
                                                    }`}
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p
                                                                className={`text-[10px] font-medium uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                                    }`}
                                                            >
                                                                Table
                                                            </p>
                                                            <h5
                                                                className={`text-base sm:text-lg font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'
                                                                    }`}
                                                            >
                                                                {t.type}
                                                            </h5>
                                                        </div>
                                                        <span
                                                            className={`shrink-0 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold ${t.status === 'active'
                                                                ? 'bg-green-100 text-green-700'
                                                                : t.status === 'maintenance'
                                                                    ? 'bg-orange-100 text-orange-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                }`}
                                                        >
                                                            {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                                                            {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                                        <div
                                                            className={`rounded-lg p-2 sm:p-2.5 ${isDark ? 'bg-white/[0.04]' : 'bg-stone-50 border border-gray-100'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                                    }`}
                                                            >
                                                                <TbUsers /> Capacity
                                                            </div>
                                                            <p
                                                                className={`mt-1 font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'
                                                                    }`}
                                                            >
                                                                {t.capacity} persons
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`rounded-lg p-2 sm:p-2.5 ${isDark ? 'bg-white/[0.04]' : 'bg-stone-50 border border-gray-100'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                                    }`}
                                                            >
                                                                <TbClock /> Duration
                                                            </div>
                                                            <p
                                                                className={`mt-1 font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'
                                                                    }`}
                                                            >
                                                                {t.duration} min
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 space-y-1.5 text-xs">
                                                    <div className="flex justify-between gap-3">
                                                        <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                            Gap
                                                        </span>
                                                        <span
                                                            className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {t.gap} min
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-3">
                                                        <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                            Table fee
                                                        </span>
                                                        <span
                                                            className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'
                                                                }`}
                                                        >
                                                            {t.fee > 0 ? `${t.fee.toLocaleString()} MMK` : '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {t.services.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                                        {t.services.map((s) => (
                                                            <span
                                                                key={s}
                                                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${isDark
                                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                    : 'bg-primary/10 text-primary border-primary/20'
                                                                    }`}
                                                            >
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 3: RESERVATIONS */}
                            {activeTab === 'reservations' && (
                                <motion.div
                                    key="reservations"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
                                >
                                    {[
                                        {
                                            resNumber: 'RES-1024',
                                            status: 'confirmed' as const,
                                            customer: 'Ambassador H. E. Sterling',
                                            date: '14/09/2026',
                                            startTime: '20:15',
                                            endTime: '22:00',
                                            table: { type: 'vip', capacity: 6 },
                                            dishes: [
                                                { name: 'Wagyu Steak', qty: 2 },
                                                { name: 'Truffle Risotto', qty: 1 },
                                                { name: 'Chateau Margaux', qty: 2 },
                                            ],
                                            total: 320000,
                                            remark: 'Birthday Celebration',
                                        },
                                        {
                                            resNumber: 'RES-1025',
                                            status: 'pending' as const,
                                            customer: 'Dr. Kenneth Tan',
                                            date: '14/09/2026',
                                            startTime: '20:30',
                                            endTime: '22:15',
                                            table: { type: 'standard', capacity: 4 },
                                            dishes: [],
                                            total: 0,
                                            remark: null,
                                        },
                                        {
                                            resNumber: 'RES-1026',
                                            status: 'seated' as const,
                                            customer: 'Ms. Clara Dupont',
                                            date: '14/09/2026',
                                            startTime: '19:00',
                                            endTime: '21:00',
                                            table: { type: 'standard', capacity: 2 },
                                            dishes: [
                                                { name: 'Seafood Platter', qty: 1 },
                                                { name: 'Champagne Brut', qty: 2 },
                                            ],
                                            total: 185000,
                                            remark: 'Anniversary Dinner',
                                        },
                                    ].map((r, idx) => (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow ${isDark
                                                ? 'border border-white/10 bg-white/[0.02]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p
                                                            className={`text-[10px] font-medium uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                                }`}
                                                        >
                                                            Reservation
                                                        </p>
                                                        <h5
                                                            className={`text-base sm:text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'
                                                                }`}
                                                        >
                                                            #{r.resNumber}
                                                        </h5>
                                                    </div>
                                                    <span
                                                        className={`shrink-0 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold inline-flex items-center gap-1 ${r.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : r.status === 'seated'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="mt-3 space-y-1.5 text-xs">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                            Customer
                                                        </span>
                                                        <span
                                                            className={`max-w-[60%] truncate text-right font-semibold ${isDark ? 'text-zinc-200' : 'text-gray-800'
                                                                }`}
                                                        >
                                                            {r.customer}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                            Date
                                                        </span>
                                                        <span
                                                            className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {r.date}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                            Time
                                                        </span>
                                                        <span
                                                            className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {r.startTime} - {r.endTime}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                                            Table
                                                        </span>
                                                        <span
                                                            className={`font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {r.table.type.charAt(0).toUpperCase() + r.table.type.slice(1)} (cap. {r.table.capacity})
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {r.dishes.length > 0 && (
                                                <div
                                                    className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'
                                                        }`}
                                                >
                                                    <p
                                                        className={`mb-2 text-[10px] font-semibold uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Pre-ordered dishes ({r.dishes.length})
                                                    </p>
                                                    <div
                                                        className={`space-y-1.5 text-xs ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {r.dishes.map((d, di) => (
                                                            <div key={di} className="flex justify-between">
                                                                <span className="truncate min-w-0">{d.name}</span>
                                                                <span
                                                                    className={`shrink-0 font-semibold ml-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                                        }`}
                                                                >
                                                                    x{d.qty}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div
                                                className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-gray-100'
                                                    }`}
                                            >
                                                <div>
                                                    <p className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                        Total
                                                    </p>
                                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {r.total > 0 ? `${r.total.toLocaleString()} MMK` : '—'}
                                                    </p>
                                                </div>
                                                {r.remark && (
                                                    <span
                                                        className={`text-[11px] italic px-2 py-1 rounded-full ${isDark
                                                            ? 'text-zinc-400 bg-white/[0.03]'
                                                            : 'text-gray-600 bg-stone-100'
                                                            }`}
                                                    >
                                                        📌 {r.remark}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* TAB 4: ANALYTICS */}
                            {activeTab === 'analytics' && (
                                <motion.div
                                    key="analytics"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    {/* Hero banner */}
                                    <div
                                        className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-colors ${isDark
                                            ? 'bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent'
                                            : 'bg-gradient-to-br from-primary/10 via-gold/10 to-transparent border border-primary/15'
                                            }`}
                                    >
                                        <div
                                            className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${isDark ? 'bg-amber-500/10' : 'bg-primary/10'
                                                }`}
                                        />
                                        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                            <div>
                                                <div
                                                    className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${isDark
                                                        ? 'bg-white/10 text-amber-300'
                                                        : 'bg-primary/10 text-primary'
                                                        }`}
                                                >
                                                    <TbSparkles /> Today's performance
                                                </div>
                                                <h3
                                                    className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                                        }`}
                                                >
                                                    Le Cordon Royal
                                                </h3>
                                                <p
                                                    className={`mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                        }`}
                                                >
                                                    Wednesday, 14 Sep 2026 — Peak Dinner Shift
                                                </p>
                                            </div>
                                            <div className="grid w-full sm:max-w-xs grid-cols-2 gap-2.5 sm:gap-3">
                                                <div
                                                    className={`rounded-xl px-3 py-2 sm:py-2.5 border ${isDark
                                                        ? 'bg-white/[0.06] border-white/10'
                                                        : 'bg-white/80 border-gray-200 shadow-sm'
                                                        }`}
                                                >
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Total orders
                                                    </p>
                                                    <p
                                                        className={`mt-1 text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        42
                                                    </p>
                                                </div>
                                                <div
                                                    className={`rounded-xl px-3 py-2 sm:py-2.5 border ${isDark
                                                        ? 'bg-white/[0.06] border-white/10'
                                                        : 'bg-white/80 border-gray-200 shadow-sm'
                                                        }`}
                                                >
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Reservations
                                                    </p>
                                                    <p
                                                        className={`mt-1 text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        18
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 8 Stat Cards */}
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                                        {/* Pending orders */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-amber-500 ${isDark
                                                ? 'border border-white/10 bg-amber-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Pending orders
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-amber-500">6</p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2 sm:p-2.5 bg-amber-500/10 text-amber-500">
                                                    <TbClock className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Waiting for action
                                            </p>
                                        </div>

                                        {/* Confirmed orders */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-blue-500 ${isDark
                                                ? 'border border-white/10 bg-blue-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Confirmed orders
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-blue-500">14</p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2 sm:p-2.5 bg-blue-500/10 text-blue-500">
                                                    <TbShoppingBag className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Ready for fulfillment
                                            </p>
                                        </div>

                                        {/* Completed orders */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-emerald-500 ${isDark
                                                ? 'border border-white/10 bg-emerald-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Completed orders
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-emerald-500">22</p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2.5 bg-emerald-500/10 text-emerald-500">
                                                    <TbCircleCheck className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Orders completed today
                                            </p>
                                        </div>

                                        {/* Order revenue */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-emerald-500 ${isDark
                                                ? 'border border-white/10 bg-emerald-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Order revenue
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-emerald-500 truncate">
                                                        10.8M <span className="text-xs sm:text-sm font-semibold">MMK</span>
                                                    </p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2 sm:p-2.5 bg-emerald-500/10 text-emerald-500">
                                                    <TbCoin className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Completed order value
                                            </p>
                                        </div>

                                        {/* Pending reservations */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-orange-500 ${isDark
                                                ? 'border border-white/10 bg-orange-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Pending reservations
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-orange-500">3</p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2 sm:p-2.5 bg-orange-500/10 text-orange-500">
                                                    <TbCalendarClock className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Reservations to review
                                            </p>
                                        </div>

                                        {/* Confirmed reservations */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-violet-500 ${isDark
                                                ? 'border border-white/10 bg-violet-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Confirmed reservations
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-violet-500">9</p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2 sm:p-2.5 bg-violet-500/10 text-violet-500">
                                                    <TbCalendarCheck className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Confirmed for today
                                            </p>
                                        </div>

                                        {/* Completed reservations */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-emerald-500 ${isDark
                                                ? 'border border-white/10 bg-emerald-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Completed reservations
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-emerald-500">6</p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2 sm:p-2.5 bg-emerald-500/10 text-emerald-500">
                                                    <TbCircleCheck className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Reservations completed today
                                            </p>
                                        </div>

                                        {/* Reservation revenue */}
                                        <div
                                            className={`rounded-xl p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:shadow-md border-t-[3px] border-t-emerald-500 ${isDark
                                                ? 'border border-white/10 bg-emerald-500/[0.04]'
                                                : 'border border-gray-200 bg-white shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Reservation revenue
                                                    </p>
                                                    <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-emerald-500 truncate">
                                                        4.2M <span className="text-xs sm:text-sm font-semibold">MMK</span>
                                                    </p>
                                                </div>
                                                <div className="shrink-0 rounded-2xl p-2 sm:p-2.5 bg-emerald-500/10 text-emerald-500">
                                                    <TbCoin className="text-base sm:text-lg" />
                                                </div>
                                            </div>
                                            <p className={`mt-1.5 sm:mt-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Completed reservation value
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* LIVE METRICS STATS RIBBON */}
            <section
                className={`relative z-10 py-8 sm:py-12 border-y backdrop-blur-lg transition-colors duration-300 ${isDark
                    ? 'border-white/[0.08] bg-[#100408]/80'
                    : 'border-[#e2d9cd] bg-[#f4efe8]'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className={`text-center sm:text-left ${i > 0 && i % 2 === 0 ? 'border-t sm:border-t-0 pt-4 sm:pt-0' : ''
                                    } ${isDark ? 'border-white/[0.08]' : 'border-[#e2d9cd]'}`}
                            >
                                <p
                                    className={`text-2xl sm:text-4xl lg:text-5xl font-bold font-sans bg-clip-text text-transparent ${isDark
                                        ? 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500'
                                        : 'bg-gradient-to-r from-primary via-[#8a2a35] to-gold'
                                        }`}
                                >
                                    {stat.value}
                                </p>
                                <p
                                    className={`text-xs sm:text-sm font-semibold mt-1 sm:mt-2 ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {stat.label}
                                </p>
                                <p
                                    className={`text-[11px] sm:text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'
                                        }`}
                                >
                                    {stat.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CORE SUPERPOWERS / FEATURE GRID */}
            <section id="features" className="relative z-10 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <span
                        className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-primary bg-primary/10 border-primary/20'
                            }`}
                    >
                        Operational Excellence
                    </span>
                    <h2
                        className={`text-2xl sm:text-4xl lg:text-5xl font-bold font-sans mt-3 sm:mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Engineered for High-Pressure Dining Rooms
                    </h2>
                    <p
                        className={`text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 ${isDark ? 'text-zinc-400' : 'text-gray-600'
                            }`}
                    >
                        Everything needed to streamline customer flow, kitchen production, front-of-house service, and owner accountability.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {features.map((feat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl p-5 sm:p-7 backdrop-blur-xl relative overflow-hidden group transition-all shadow-xl ${isDark
                                ? 'border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-amber-400/40'
                                : 'border border-gray-200 bg-white hover:border-primary/40 hover:shadow-lg'
                                }`}
                        >
                            {/* Subtle Ambient Radial Highlight on Hover */}
                            <div
                                className={`absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gradient-to-br ${feat.accent} blur-2xl group-hover:scale-150 transition-transform duration-500`}
                            />

                            <div className="flex items-center justify-between mb-4 sm:mb-5">
                                <div
                                    className={`p-2.5 sm:p-3 rounded-xl border transition-colors ${isDark
                                        ? 'bg-white/[0.06] border-white/10 group-hover:border-amber-400/40'
                                        : 'bg-stone-50 border-gray-200 group-hover:border-primary/40'
                                        }`}
                                >
                                    {feat.icon}
                                </div>
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${isDark
                                        ? 'bg-white/[0.05] text-zinc-300 border-white/10'
                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}
                                >
                                    {feat.badge}
                                </span>
                            </div>

                            <h3
                                className={`text-lg sm:text-xl font-bold font-sans transition-colors ${isDark
                                    ? 'text-white group-hover:text-amber-300'
                                    : 'text-gray-900 group-hover:text-primary'
                                    }`}
                            >
                                {feat.title}
                            </h3>
                            <p
                                className={`mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                    }`}
                            >
                                {feat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS / STEP BY STEP VISUAL */}
            <section
                id="live-demo"
                className={`relative z-10 py-14 sm:py-20 transition-colors duration-300 ${isDark
                    ? 'bg-[#0d0307]/80 border-t border-white/[0.08]'
                    : 'bg-[#f4efe8] border-t border-[#e2d9cd]'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                        <span
                            className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-primary bg-primary/10 border-primary/20'
                                }`}
                        >
                            Smooth Frictionless Flow
                        </span>
                        <h2
                            className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-3 sm:mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            From Guest Order to Settled Bill in 3 Steps
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 relative">
                        {/* Step 1 */}
                        <div
                            className={`rounded-2xl p-5 sm:p-8 relative transition-colors ${isDark
                                ? 'border border-white/10 bg-white/[0.02]'
                                : 'border border-gray-200 bg-white shadow-sm'
                                }`}
                        >
                            <span
                                className={`font-sans text-4xl sm:text-5xl font-bold ${isDark ? 'text-amber-500/30' : 'text-primary/25'
                                    }`}
                            >
                                01
                            </span>
                            <h3
                                className={`text-lg sm:text-xl font-bold mt-3 sm:mt-4 font-sans ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                Guest Orders via Mobile App
                            </h3>
                            <p
                                className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                    }`}
                            >
                                Guests download the Royal Plate app on iOS or Android, browse the menu, and place orders or book reservations straight from their phone. Available via App Store, Google Play, and direct download link.
                            </p>
                            <div
                                className={`mt-5 sm:mt-6 p-2.5 sm:p-3 rounded-xl border text-xs flex items-center gap-2 ${isDark
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                    : 'bg-amber-50 border-amber-200 text-amber-800'
                                    }`}
                            >
                                <TbCheck className="text-sm font-bold shrink-0" />
                                <span>iOS, Android & direct download</span>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div
                            className={`rounded-2xl p-5 sm:p-8 relative shadow-xl transition-colors ${isDark
                                ? 'border border-amber-500/30 bg-amber-500/[0.04] shadow-amber-500/5'
                                : 'border border-primary/30 bg-white shadow-primary/5'
                                }`}
                        >
                            <span
                                className={`font-sans text-4xl sm:text-5xl font-bold ${isDark ? 'text-amber-400/50' : 'text-primary/40'
                                    }`}
                            >
                                02
                            </span>
                            <h3
                                className={`text-lg sm:text-xl font-bold mt-3 sm:mt-4 font-sans ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                Staff Receives & Processes Orders
                            </h3>
                            <p
                                className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                    }`}
                            >
                                Restaurant owner and staff receive instant push notifications for every new order or reservation. They update status step by step — from Pending to Confirmed, Preparing, Ready, and Completed — all in real time.
                            </p>
                            <div
                                className={`mt-5 sm:mt-6 p-2.5 sm:p-3 rounded-xl border text-xs flex items-center gap-2 ${isDark
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    }`}
                            >
                                <TbCheck className="text-sm font-bold shrink-0" />
                                <span>Instant notifications & real-time sync</span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div
                            className={`rounded-2xl p-5 sm:p-8 relative transition-colors ${isDark
                                ? 'border border-white/10 bg-white/[0.02]'
                                : 'border border-gray-200 bg-white shadow-sm'
                                }`}
                        >
                            <span
                                className={`font-sans text-4xl sm:text-5xl font-bold ${isDark ? 'text-amber-500/30' : 'text-primary/25'
                                    }`}
                            >
                                03
                            </span>
                            <h3
                                className={`text-lg sm:text-xl font-bold mt-3 sm:mt-4 font-sans ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                Admin Settlement & Revenue Payout
                            </h3>
                            <p
                                className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'
                                    }`}
                            >
                                Once orders are completed, restaurant admins reconcile commissions, process owner settlements, and manage revenue payouts — all from a single financial dashboard.
                            </p>
                            <div
                                className={`mt-5 sm:mt-6 p-2.5 sm:p-3 rounded-xl border text-xs flex items-center gap-2 ${isDark
                                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                                    : 'bg-purple-50 border-purple-200 text-purple-800'
                                    }`}
                            >
                                <TbCheck className="text-sm font-bold shrink-0" />
                                <span>Automated commission & payouts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DOWNLOAD APP SECTION */}
            <DownloadAppSection isDark={isDark} />

            {/* TESTIMONIALS SECTION */}
            <section
                id="testimonials"
                className={`relative z-10 py-14 sm:py-20 transition-colors duration-300 ${isDark
                    ? 'bg-[#0f0409]/90 border-t border-white/[0.08]'
                    : 'bg-[#faf7f2] border-t border-[#e2d9cd]'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                        <span
                            className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-primary bg-primary/10 border-primary/20'
                                }`}
                        >
                            Voices of the Trade
                        </span>
                        <h2
                            className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-3 sm:mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            Trusted by Distinguished Restaurateurs
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
                        {testimonials.map((item, idx) => (
                            <div
                                key={idx}
                                className={`rounded-2xl p-5 sm:p-7 backdrop-blur-md flex flex-col justify-between transition-colors ${isDark
                                    ? 'border border-white/10 bg-white/[0.03]'
                                    : 'border border-gray-200 bg-white shadow-sm'
                                    }`}
                            >
                                <div>
                                    <div className="flex text-amber-400 mb-3 sm:mb-4">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <TbStar key={i} className="fill-amber-400 text-sm" />
                                        ))}
                                    </div>
                                    <p
                                        className={`text-xs sm:text-sm italic leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'
                                            }`}
                                    >
                                        "{item.quote}"
                                    </p>
                                </div>
                                <div
                                    className={`mt-5 sm:mt-6 pt-4 sm:pt-5 border-t flex items-center gap-3 ${isDark ? 'border-white/10' : 'border-gray-100'
                                        }`}
                                >
                                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-amber-400 to-[#6e1423] flex items-center justify-center font-bold text-white text-sm shadow shrink-0">
                                        {item.author.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4
                                            className={`font-bold text-xs sm:text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'
                                                }`}
                                        >
                                            {item.author}
                                        </h4>
                                        <p
                                            className={`text-[11px] sm:text-xs truncate ${isDark ? 'text-amber-300' : 'text-primary font-medium'
                                                }`}
                                        >
                                            {item.role}
                                        </p>
                                        <p
                                            className={`text-[10px] sm:text-[11px] truncate ${isDark ? 'text-zinc-500' : 'text-gray-400'
                                                }`}
                                        >
                                            {item.venue}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="relative z-10 py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                    <span
                        className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-primary bg-primary/10 border-primary/20'
                            }`}
                    >
                        Got Questions?
                    </span>
                    <h2
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-3 sm:mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = expandedFaq === index
                        return (
                            <div
                                key={index}
                                className={`rounded-xl border overflow-hidden transition-colors ${isDark
                                    ? 'border-white/10 bg-white/[0.02]'
                                    : 'border-gray-200 bg-white shadow-sm'
                                    }`}
                            >
                                <button
                                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                                    className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-stone-50'
                                        }`}
                                >
                                    <span
                                        className={`font-bold text-sm sm:text-base font-sans ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}
                                    >
                                        {faq.q}
                                    </span>
                                    <TbChevronDown
                                        className={`text-base sm:text-lg transition-transform duration-300 shrink-0 ${isDark ? 'text-amber-400' : 'text-primary'
                                            } ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3 ${isDark
                                                ? 'text-zinc-400 border-white/[0.06]'
                                                : 'text-gray-600 border-gray-100'
                                                }`}
                                        >
                                            {faq.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* CONTACT US SECTION */}
            <section id="contact" className="relative z-10 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <span
                        className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-primary bg-primary/10 border-primary/20'
                            }`}
                    >
                        Get in Touch
                    </span>
                    <h2
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-sans mt-3 sm:mt-4 ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Contact Us
                    </h2>
                    <p className={`text-sm sm:text-base mt-2 sm:mt-3 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                        Have questions or ready to get started? Reach out to our team.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Address */}
                    <div
                        className={`rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center transition-colors ${isDark
                            ? 'border border-white/10 bg-white/[0.02]'
                            : 'border border-gray-200 bg-white shadow-sm'
                            }`}
                    >
                        <div
                            className={`p-3 rounded-2xl mb-3 sm:mb-4 ${isDark
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-primary/10 text-primary'
                                }`}
                        >
                            <TbMapPin className="text-2xl" />
                        </div>
                        <h4 className={`font-bold text-sm mb-1.5 sm:mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Our Office
                        </h4>
                        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Building 18, Level 5<br />
                            MICT Park, Hlaing Township<br />
                            Yangon, Myanmar
                        </p>
                    </div>

                    {/* Phone */}
                    <div
                        className={`rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center transition-colors ${isDark
                            ? 'border border-white/10 bg-white/[0.02]'
                            : 'border border-gray-200 bg-white shadow-sm'
                            }`}
                    >
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-3 sm:mb-4">
                            <TbPhone className="text-2xl" />
                        </div>
                        <h4 className={`font-bold text-sm mb-1.5 sm:mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Phone
                        </h4>
                        <a
                            href="tel:+959676767676"
                            className={`text-base sm:text-lg font-bold font-mono transition-colors ${isDark
                                ? 'text-amber-400 hover:text-amber-300'
                                : 'text-primary hover:text-primary-mild'
                                }`}
                        >
                            +95 9 676 767 676
                        </a>
                        <p className={`text-[11px] sm:text-xs mt-1.5 sm:mt-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Available Mon–Fri, 9:00 AM – 6:00 PM (MMT)
                        </p>
                    </div>

                    {/* Business Hours */}
                    <div
                        className={`rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center transition-colors sm:col-span-2 md:col-span-1 ${isDark
                            ? 'border border-white/10 bg-white/[0.02]'
                            : 'border border-gray-200 bg-white shadow-sm'
                            }`}
                    >
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 mb-3 sm:mb-4">
                            <TbClock2 className="text-2xl" />
                        </div>
                        <h4 className={`font-bold text-sm mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Business Hours
                        </h4>
                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm w-full max-w-xs sm:max-w-none">
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                    Monday – Friday
                                </span>
                                <span
                                    className={`font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}
                                >
                                    9:00 AM – 6:00 PM
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                    Saturday
                                </span>
                                <span
                                    className={`font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}
                                >
                                    10:00 AM – 4:00 PM
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-zinc-400' : 'text-gray-500'}>
                                    Sunday
                                </span>
                                <span className="text-red-500 font-medium">Closed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div
                    className={`mt-8 sm:mt-10 rounded-2xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-200 shadow-sm'
                        }`}
                >
                    <MapContainer
                        center={[16.85055, 96.1285]}
                        zoom={16}
                        minZoom={14}
                        maxZoom={18}
                        scrollWheelZoom={false}
                        zoomControl={true}
                        style={{ height: '300px', width: '100%', zIndex: 0 }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[16.85055, 96.1285]} />
                    </MapContainer>
                </div>
                <div className="mt-3 text-center">
                    <a
                        href="https://www.openstreetmap.org/?mlat=16.85055&mlon=96.1285#map=16/16.85055/96.1285"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs transition-colors ${isDark
                            ? 'text-zinc-500 hover:text-amber-400'
                            : 'text-gray-500 hover:text-primary'
                            }`}
                    >
                        Open in OpenStreetMap ↗
                    </a>
                </div>
            </section>

            {/* FOOTER — Always Dark Luxury Styling */}
            <footer className="relative z-10 border-t border-white/[0.08] bg-[#050102] py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <img
                            src={emailOptLogo}
                            alt="Royal Plate"
                            className="h-8 w-8 rounded-full ring-1 ring-amber-400/40 object-cover"
                        />
                        <div>
                            <span className="font-sans font-bold text-white tracking-wide">
                                Royal Plate
                            </span>
                            <p className="text-[11px] text-zinc-500">
                                Enterprise Restaurant Management OS
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-400">
                        <button onClick={() => scrollToSection('features')} className="hover:text-amber-300">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('live-demo')} className="hover:text-amber-300">
                            Live Workspace
                        </button>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-300">
                            Back to top
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            All Services Operational
                        </span>
                        <span>•</span>
                        <span>© {new Date().getFullYear()} Royal Plate.</span>
                    </div>
                </div>
            </footer>

            {/* BACK TO TOP BUTTON */}
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
