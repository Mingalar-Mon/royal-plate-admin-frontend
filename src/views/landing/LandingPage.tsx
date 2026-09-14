import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router'
import { useAuth } from '@/auth'
import emailOptLogo from '@/assets/logo/emailoptlogo.png'
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
} from 'react-icons/tb'

type DemoTab = 'orders' | 'tables' | 'reservations' | 'analytics'

const LandingPage = () => {
    const navigate = useNavigate()
    const { authenticated } = useAuth()
    const [activeTab, setActiveTab] = useState<DemoTab>('orders')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [, setScrolled] = useState(false)
    const [showBackToTop, setShowBackToTop] = useState(false)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    // Keep navbar sticky; no scroll-driven style switch needed

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
            icon: <TbClipboardList className="text-2xl text-amber-400" />,
            title: 'Live Order Dispatch & KDS',
            description:
                'Instantly pipe customer or server tickets straight to kitchen preparation screens with sound cues, prep countdowns, and modification alerts.',
            badge: 'Sub-second Sync',
            accent: 'from-amber-500/20 to-transparent',
        },
        {
            icon: <TbTable className="text-2xl text-emerald-400" />,
            title: 'Interactive Dining Room & Tables',
            description:
                'Visual floor layouts tailored to your restaurant layout. Color-coded dining statuses, turn-rate timing, and instant merge or split table capabilities.',
            badge: 'Live Floor Grid',
            accent: 'from-emerald-500/20 to-transparent',
        },
        {
            icon: <TbCalendarEvent className="text-2xl text-purple-400" />,
            title: 'Smart Guest Reservations',
            description:
                'Automated table assignments, special dietary tags, VIP guest history, and SMS/notification confirmations that slash no-shows to near zero.',
            badge: 'Zero No-Shows',
            accent: 'from-purple-500/20 to-transparent',
        },
        {
            icon: <TbChefHat className="text-2xl text-rose-400" />,
            title: 'Dynamic Dish & Menu Engineering',
            description:
                'Update recipes, mark items sold-out in one tap across all terminals, customize modifiers, and promote high-margin signature courses.',
            badge: 'Instant Updates',
            accent: 'from-rose-500/20 to-transparent',
        },
        {
            icon: <TbReceipt2 className="text-2xl text-sky-400" />,
            title: 'Automated Settlements & Payouts',
            description:
                'Crystal-clear revenue ledgers, commission breakdowns, staff tips management, and one-click financial payouts without accounting headaches.',
            badge: 'Audit Ready',
            accent: 'from-sky-500/20 to-transparent',
        },
        {
            icon: <TbShieldCheck className="text-2xl text-indigo-400" />,
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
            venue: "Le Cordon Royal • Yangon",
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
        <div className="min-h-screen w-full bg-[#080204] text-slate-100 selection:bg-amber-500 selection:text-black font-sans relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[850px] rounded-full bg-gradient-to-b from-[#6e1423]/35 via-[#4a0d16]/20 to-transparent blur-[120px]" />
                <div className="absolute top-[35%] -left-32 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[130px]" />
                <div className="absolute top-[65%] -right-32 h-[500px] w-[500px] rounded-full bg-[#6e1423]/25 blur-[140px]" />
                {/* Subtle Luxury Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
            </div>

            {/* Sticky Navigation Bar */}
            <header
                className="sticky top-0 z-50 bg-[#080204]/90 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/60"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Brand */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-amber-400/60 shadow-lg shadow-amber-500/20 group-hover:ring-amber-400 transition-all">
                            <img
                                src={emailOptLogo}
                                alt="Royal Plate"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-bold tracking-tight text-white font-serif group-hover:text-amber-300 transition-colors">
                                    Royal Plate
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30">
                                    OS
                                </span>
                            </div>
                            <span className="text-[11px] text-zinc-400 tracking-wider font-medium">
                                Restaurant Intelligence
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
                        <button
                            onClick={() => scrollToSection('features')}
                            className="hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection('live-demo')}
                            className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Workspace
                        </button>
                        <button
                            onClick={() => scrollToSection('comparison')}
                            className="hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            Why Us
                        </button>
                        <button
                            onClick={() => scrollToSection('testimonials')}
                            className="hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            Restaurateurs
                        </button>
                        <button
                            onClick={() => scrollToSection('faq')}
                            className="hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            FAQ
                        </button>
                    </nav>

                    {/* Actions */}
                    <div className="hidden sm:flex items-center gap-3">
                        {authenticated ? (
                            <button
                                onClick={() => navigate('/home')}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-zinc-950 font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                            >
                                <span>Go to Dashboard</span>
                                <TbArrowRight className="text-base" />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/landing')}
                                className="px-4 py-2 rounded-xl text-zinc-300 hover:text-white text-sm font-medium border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <TbArrowRight className="text-base text-amber-400" />
                                <span>Back to top</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <TbX className="text-xl" /> : <TbMenu2 className="text-xl" />}
                    </button>
                </div>

                {/* Mobile Dropdown Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-[#0c0407] border-b border-white/10 px-6 py-5 flex flex-col gap-4"
                        >
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-left text-zinc-300 hover:text-amber-300 py-1"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('live-demo')}
                                className="text-left text-zinc-300 hover:text-amber-300 py-1 flex items-center gap-2"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live Workspace
                            </button>
                            <button
                                onClick={() => scrollToSection('comparison')}
                                className="text-left text-zinc-300 hover:text-amber-300 py-1"
                            >
                                Why Us
                            </button>
                            <button
                                onClick={() => scrollToSection('testimonials')}
                                className="text-left text-zinc-300 hover:text-amber-300 py-1"
                            >
                                Restaurateurs
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="text-left text-zinc-300 hover:text-amber-300 py-1"
                            >
                                FAQ
                            </button>

                            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                                <button
                                    onClick={() => navigate('/landing')}
                                    className="w-full py-2.5 rounded-xl text-center text-zinc-300 text-sm font-medium border border-white/15"
                                >
                                    Back to top
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* HERO SECTION */}
            <section className="relative z-10 pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Pill Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-amber-400/30 backdrop-blur-md shadow-inner mb-6"
                    >
                        <TbSparkles className="text-amber-400 text-sm animate-spin" style={{ animationDuration: '8s' }} />
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                            The Next-Gen Restaurant Operating System
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight font-serif text-white leading-[1.12]"
                    >
                        Run Your Restaurant with{' '}
                        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent italic">
                            Royal Precision.
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Synchronize kitchen tickets in real-time, master your dining floor plan, automate table bookings, and monitor multi-branch revenue from a singular, royal command center.
                    </motion.p>

                    {/* Hero CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={() => scrollToSection('live-demo')}
                            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white font-medium text-base backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <TbFlame className="text-amber-400 text-lg" />
                            <span>Interactive Preview</span>
                        </button>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <TbStar key={i} className="fill-amber-400 text-xs" />
                                ))}
                            </div>
                            <span className="font-semibold text-white">4.9 / 5.0</span> Rating
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                            <span>Sub-Second Kitchen Sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbShieldCheck className="text-base text-amber-400" />
                            <span>Zero Hardware Lock-In</span>
                        </div>
                    </motion.div>
                </div>

                {/* HERO INTERACTIVE WORKSPACE SHOWCASE */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-14 relative"
                >
                    {/* Ambient Glow behind frame */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#6e1423]/40 to-amber-600/20 blur-2xl opacity-60" />

                    {/* Window Frame */}
                    <div className="relative rounded-2xl md:rounded-3xl border border-white/15 bg-[#12060b]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
                        {/* Mockup OS Topbar */}
                        <div className="px-5 py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                <span className="ml-3 text-xs text-zinc-400 font-mono hidden sm:inline-block">
                                    royal-plate.app/workspace/le-cordon-royal
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Live Service Active
                                </span>
                                <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                                    RP
                                </div>
                            </div>
                        </div>

                        {/* Interactive Tabs Header inside Mockup */}
                        <div className="px-6 pt-5 pb-3 border-b border-white/[0.07] bg-white/[0.01] flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                        activeTab === 'orders'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                            : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                >
                                    <TbClipboardList className="text-sm" />
                                    <span>Active Orders (6)</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('tables')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                        activeTab === 'tables'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                            : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                >
                                    <TbTable className="text-sm" />
                                    <span>Floor Grid (18/24)</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('reservations')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                        activeTab === 'reservations'
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                            : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                >
                                    <TbCalendarEvent className="text-sm" />
                                    <span>Today's Bookings</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('analytics')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                        activeTab === 'analytics'
                                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                                            : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                >
                                    <TbChartBar className="text-sm" />
                                    <span>Sales Velocity</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <span className="text-amber-400 font-semibold font-mono">19:42:15</span>
                                <span className="text-zinc-600">•</span>
                                <span>Peak Dinner Shift</span>
                            </div>
                        </div>

                        {/* Interactive Tab Panels */}
                        <div className="p-4 sm:p-6 lg:p-8 min-h-[380px] bg-[#0d0408]/60">
                            {/* TAB 1: LIVE ORDERS */}
                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    {/* Order Card 1 */}
                                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-4 flex flex-col justify-between shadow-lg">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white font-mono text-base">#ORD-4821</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                        COOKING
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                                                    <TbClock className="text-amber-400" /> 8m ago
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-amber-300 mb-2">Table 04 • 4 Guests</p>
                                            <ul className="space-y-1.5 text-xs text-zinc-300 border-t border-white/10 pt-2.5">
                                                <li className="flex justify-between">
                                                    <span>2x Wagyu Ribeye M5+</span>
                                                    <span className="font-mono text-zinc-400">Med-Rare</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>1x Truffle Infused Risotto</span>
                                                    <span className="font-mono text-zinc-400">Extra Parm</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>2x Chateau Margaux 2018</span>
                                                    <span className="font-mono text-zinc-400">Bottle</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                            <span className="font-mono font-bold text-sm text-white">$248.00</span>
                                            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                                Ready in ~4 mins
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Card 2 */}
                                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 flex flex-col justify-between shadow-lg">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white font-mono text-base">#ORD-4820</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                        READY
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                                                    <TbClock className="text-emerald-400" /> 16m ago
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-emerald-300 mb-2">Table 09 • Booth VIP</p>
                                            <ul className="space-y-1.5 text-xs text-zinc-300 border-t border-white/10 pt-2.5">
                                                <li className="flex justify-between">
                                                    <span>3x Chilean Sea Bass</span>
                                                    <span className="font-mono text-zinc-400">Glazed</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>2x Burrata & Heirloom Salad</span>
                                                    <span className="font-mono text-zinc-400">Standard</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>3x Smoked Old Fashioned</span>
                                                    <span className="font-mono text-zinc-400">Bar</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                            <span className="font-mono font-bold text-sm text-white">$315.50</span>
                                            <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded flex items-center gap-1">
                                                <TbBell className="animate-bounce" /> Bell Server
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Card 3 */}
                                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-4 flex flex-col justify-between shadow-lg">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white font-mono text-base">#ORD-4824</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                                        NEW TICKET
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-rose-400 flex items-center gap-1 font-bold">
                                                    JUST NOW
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-rose-300 mb-2">Table 02 • Window Terrace</p>
                                            <ul className="space-y-1.5 text-xs text-zinc-300 border-t border-white/10 pt-2.5">
                                                <li className="flex justify-between">
                                                    <span>1x Royal Seafood Platter</span>
                                                    <span className="font-mono text-zinc-400">Chef Special</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>1x Lobster Thermidor</span>
                                                    <span className="font-mono text-zinc-400">Split</span>
                                                </li>
                                                <li className="flex justify-between">
                                                    <span>2x Champagne Brut</span>
                                                    <span className="font-mono text-zinc-400">Chilled</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                            <span className="font-mono font-bold text-sm text-white">$390.00</span>
                                            <button className="text-[11px] font-bold text-zinc-950 bg-amber-400 px-3 py-1 rounded hover:bg-amber-300 transition-colors">
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
                                    <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/10 pb-3">
                                        <span>Floor: Main Dining Hall & Patio</span>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available (6)
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Dining (14)
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Reserved (4)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                                        {[
                                            { id: 'T-01', cap: '4p', status: 'dining', bill: '$184', time: '38m' },
                                            { id: 'T-02', cap: '2p', status: 'dining', bill: '$390', time: '12m' },
                                            { id: 'T-03', cap: '6p', status: 'available', bill: '$0', time: 'Ready' },
                                            { id: 'T-04', cap: '4p', status: 'dining', bill: '$248', time: '52m' },
                                            { id: 'VIP-1', cap: '8p', status: 'reserved', bill: 'Deposit', time: '20:15' },
                                            { id: 'VIP-2', cap: '6p', status: 'dining', bill: '$610', time: '1h 10m' },
                                            { id: 'T-07', cap: '2p', status: 'available', bill: '$0', time: 'Ready' },
                                            { id: 'T-08', cap: '4p', status: 'dining', bill: '$140', time: '24m' },
                                            { id: 'T-09', cap: '4p', status: 'dining', bill: '$315', time: '40m' },
                                            { id: 'T-10', cap: '2p', status: 'available', bill: '$0', time: 'Ready' },
                                            { id: 'PAT-1', cap: '4p', status: 'reserved', bill: '7:45 PM', time: 'Booked' },
                                            { id: 'PAT-2', cap: '4p', status: 'dining', bill: '$210', time: '18m' },
                                        ].map((t) => (
                                            <div
                                                key={t.id}
                                                className={`rounded-xl p-3 border transition-all ${
                                                    t.status === 'dining'
                                                        ? 'border-amber-500/40 bg-amber-500/[0.07]'
                                                        : t.status === 'reserved'
                                                        ? 'border-purple-500/40 bg-purple-500/[0.07]'
                                                        : 'border-emerald-500/30 bg-emerald-500/[0.05]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="font-bold text-white text-sm">{t.id}</span>
                                                    <span className="text-[10px] text-zinc-400">{t.cap}</span>
                                                </div>
                                                <p className="text-xs font-mono font-semibold text-zinc-200">{t.bill}</p>
                                                <p className="text-[10px] text-zinc-400 mt-1">{t.time}</p>
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
                                    className="space-y-3"
                                >
                                    {[
                                        {
                                            name: 'Ambassador H. E. Sterling',
                                            party: '6 Guests',
                                            table: 'VIP Salon #1',
                                            time: '20:15 Tonight',
                                            notes: 'Birthday Celebration • Champagne on arrival • Seafood allergy',
                                            status: 'CONFIRMED',
                                        },
                                        {
                                            name: 'Dr. Kenneth Tan & Family',
                                            party: '4 Guests',
                                            table: 'Patio #1 (Garden View)',
                                            time: '20:30 Tonight',
                                            notes: 'Prefers quiet corner • Wine pairing requested',
                                            status: 'CONFIRMED',
                                        },
                                        {
                                            name: 'Ms. Clara Dupont',
                                            party: '2 Guests',
                                            table: 'Window Terrace T-02',
                                            time: '21:00 Tonight',
                                            notes: 'Anniversary Dinner • Pre-selected Tasting Menu',
                                            status: 'SEATED EARLY',
                                        },
                                    ].map((r, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center border border-purple-500/30 shrink-0">
                                                    {r.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-white text-sm">{r.name}</h4>
                                                        <span className="text-xs text-amber-300 font-medium">
                                                            ({r.party})
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-400 mt-0.5">
                                                        Assigned: <span className="text-zinc-200">{r.table}</span> • Time:{' '}
                                                        <span className="text-amber-400 font-mono font-medium">{r.time}</span>
                                                    </p>
                                                    <p className="text-[11px] text-zinc-400 italic mt-1 bg-white/[0.03] px-2 py-0.5 rounded inline-block">
                                                        📌 {r.notes}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="self-start sm:self-center px-2.5 py-1 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                {r.status}
                                            </span>
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
                                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                                >
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                                            Today's Gross Sales
                                        </p>
                                        <p className="text-2xl font-bold font-mono text-white mt-1.5">$8,640.50</p>
                                        <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                                            <TbTrendingUp /> +24% vs last Tuesday
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                                            Avg Table Ticket
                                        </p>
                                        <p className="text-2xl font-bold font-mono text-white mt-1.5">$182.20</p>
                                        <p className="text-xs text-amber-400 mt-2 flex items-center gap-1 font-medium">
                                            <span>⭐ Top Wine Pairing</span>
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                                            Tables Turned
                                        </p>
                                        <p className="text-2xl font-bold font-mono text-white mt-1.5">54 Parties</p>
                                        <p className="text-xs text-sky-400 mt-2 flex items-center gap-1 font-medium">
                                            <span>⚡ 42m Avg Duration</span>
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                                            Kitchen Latency
                                        </p>
                                        <p className="text-2xl font-bold font-mono text-emerald-400 mt-1.5">14m 20s</p>
                                        <p className="text-xs text-zinc-400 mt-2">
                                            Target: &lt; 18 mins
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* LIVE METRICS STATS RIBBON */}
            <section className="relative z-10 py-12 border-y border-white/[0.08] bg-[#100408]/80 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
                        {stats.map((stat, i) => (
                            <div key={i} className={`pt-4 md:pt-0 ${i !== 0 ? 'md:pl-8' : ''} text-center md:text-left`}>
                                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                    {stat.value}
                                </p>
                                <p className="text-sm font-semibold text-white mt-2">{stat.label}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CORE SUPERPOWERS / FEATURE GRID */}
            <section id="features" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        Operational Excellence
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white mt-4">
                        Engineered for High-Pressure Dining Rooms
                    </h2>
                    <p className="text-zinc-400 text-base sm:text-lg mt-4">
                        Everything needed to streamline customer flow, kitchen production, front-of-house service, and owner accountability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-7 backdrop-blur-xl relative overflow-hidden group hover:border-amber-400/40 transition-all shadow-xl"
                        >
                            {/* Subtle Ambient Radial Highlight on Hover */}
                            <div
                                className={`absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gradient-to-br ${feat.accent} blur-2xl group-hover:scale-150 transition-transform duration-500`}
                            />

                            <div className="flex items-center justify-between mb-5">
                                <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 group-hover:border-amber-400/40 transition-colors">
                                    {feat.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10">
                                    {feat.badge}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white font-serif group-hover:text-amber-300 transition-colors">
                                {feat.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                                {feat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS / STEP BY STEP VISUAL */}
            <section id="live-demo" className="relative z-10 py-20 bg-[#0d0307]/80 border-t border-white/[0.08]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                            Smooth Frictionless Flow
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-4">
                            From Guest Order to Settled Bill in 3 Steps
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 relative">
                            <span className="font-serif text-5xl font-bold text-amber-500/30">01</span>
                            <h3 className="text-xl font-bold text-white mt-4 font-serif">
                                Table QR or Server Tablet
                            </h3>
                            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                                Guests scan the elegant table QR or staff punch dishes into mobile handhelds. Modifiers and seat assignments are locked in seconds.
                            </p>
                            <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                                <TbCheck className="text-sm font-bold" /> Instant dish validation & allergens
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-8 relative shadow-xl shadow-amber-500/5">
                            <span className="font-serif text-5xl font-bold text-amber-400/50">02</span>
                            <h3 className="text-xl font-bold text-white mt-4 font-serif">
                                Instant Kitchen KDS Dispatch
                            </h3>
                            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                                Orders appear instantaneously on kitchen line displays with audio bells, cooking order priority, and synchronized timer tracking.
                            </p>
                            <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                                <TbCheck className="text-sm font-bold" /> Sub-second Firebase cloud audio alert
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 relative">
                            <span className="font-serif text-5xl font-bold text-amber-500/30">03</span>
                            <h3 className="text-xl font-bold text-white mt-4 font-serif">
                                One-Click Bill & Revenue Payout
                            </h3>
                            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                                Settle receipts via digital payment or cash, free the table on the live grid, and audit automatic daily commissions and owner settlements.
                            </p>
                            <div className="mt-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
                                <TbCheck className="text-sm font-bold" /> Automated ledgers & tax compliance
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARISON TABLE: ROYAL PLATE VS LEGACY POS */}
            <section id="comparison" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        The Decisive Difference
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white mt-4">
                        Why Premier Restaurateurs Switch to Royal Plate
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.04]">
                                <th className="p-4 sm:p-6 text-sm font-semibold text-zinc-300">Feature Capabilities</th>
                                <th className="p-4 sm:p-6 text-sm font-bold text-amber-300 bg-amber-500/10 border-x border-amber-500/20">
                                    👑 Royal Plate OS
                                </th>
                                <th className="p-4 sm:p-6 text-sm font-medium text-zinc-400">Legacy Hardwired POS</th>
                                <th className="p-4 sm:p-6 text-sm font-medium text-zinc-400">Third-Party Aggregators</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.07] text-sm">
                            <tr>
                                <td className="p-4 sm:p-6 font-medium text-white">Hardware Lock-In</td>
                                <td className="p-4 sm:p-6 font-bold text-emerald-400 bg-amber-500/[0.04] border-x border-amber-500/20">
                                    Zero (Any browser/tablet)
                                </td>
                                <td className="p-4 sm:p-6 text-zinc-400">$3,000+ proprietary terminals</td>
                                <td className="p-4 sm:p-6 text-zinc-400">Clunky rented tablets</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-6 font-medium text-white">Order Commission Squeeze</td>
                                <td className="p-4 sm:p-6 font-bold text-emerald-400 bg-amber-500/[0.04] border-x border-amber-500/20">
                                    0% per-order extortion
                                </td>
                                <td className="p-4 sm:p-6 text-zinc-400">High monthly subscription</td>
                                <td className="p-4 sm:p-6 text-rose-400">20% - 35% cut per order</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-6 font-medium text-white">Real-Time Kitchen KDS Sync</td>
                                <td className="p-4 sm:p-6 font-bold text-emerald-400 bg-amber-500/[0.04] border-x border-amber-500/20">
                                    Sub-second audio alerts
                                </td>
                                <td className="p-4 sm:p-6 text-zinc-400">Paper thermal roll jams</td>
                                <td className="p-4 sm:p-6 text-zinc-400">Separate tablet chimes</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-6 font-medium text-white">Interactive Table Floor Grid</td>
                                <td className="p-4 sm:p-6 font-bold text-emerald-400 bg-amber-500/[0.04] border-x border-amber-500/20">
                                    Integrated visual designer
                                </td>
                                <td className="p-4 sm:p-6 text-zinc-400">Static table numbers only</td>
                                <td className="p-4 sm:p-6 text-zinc-400">Not supported (takeout only)</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-6 font-medium text-white">Multi-Role Security (RBAC)</td>
                                <td className="p-4 sm:p-6 font-bold text-emerald-400 bg-amber-500/[0.04] border-x border-amber-500/20">
                                    Admin / Owner / Chef / Staff
                                </td>
                                <td className="p-4 sm:p-6 text-zinc-400">Shared manager 4-digit PIN</td>
                                <td className="p-4 sm:p-6 text-zinc-400">Single shared password</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className="relative z-10 py-20 bg-[#0f0409]/90 border-t border-white/[0.08]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                            Voices of the Trade
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-4">
                            Trusted by Distinguished Restaurateurs
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((item, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex text-amber-400 mb-4">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <TbStar key={i} className="fill-amber-400 text-sm" />
                                        ))}
                                    </div>
                                    <p className="text-zinc-300 text-sm italic leading-relaxed">
                                        "{item.quote}"
                                    </p>
                                </div>
                                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-[#6e1423] flex items-center justify-center font-bold text-white text-sm">
                                        {item.author.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.author}</h4>
                                        <p className="text-xs text-amber-300">{item.role}</p>
                                        <p className="text-[11px] text-zinc-500">{item.venue}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="relative z-10 py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        Got Questions?
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-4">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = expandedFaq === index
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                                >
                                    <span className="font-bold text-white text-base font-serif">{faq.q}</span>
                                    <TbChevronDown
                                        className={`text-amber-400 text-lg transition-transform duration-300 shrink-0 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/[0.06] pt-3"
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

            {/* GRAND CALL TO ACTION BANNER */}
            <section className="relative z-10 py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#2b0811] via-[#4a0d16] to-[#120509] p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#e9c66a15,transparent_60%)]" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 mb-6">
                            <TbChefHat className="text-3xl" />
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
                            Ready to Elevate Your Dining Service to Royal Standards?
                        </h2>
                        <p className="mt-5 text-base sm:text-lg text-zinc-300">
                            Join elite restaurants streamlining operations with Royal Plate today. Sign in to your workspace or onboard a new establishment.
                        </p>

                        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/sign-in')}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-zinc-950 font-bold text-base hover:shadow-2xl hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                            >
                                Sign In to Restaurant Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/admin/sign-in')}
                                className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/20 bg-white/[0.04] hover:bg-white/[0.1] text-white font-medium text-base backdrop-blur-md transition-all cursor-pointer"
                            >
                                Platform Admin Portal
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 border-t border-white/[0.08] bg-[#050102] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src={emailOptLogo}
                            alt="Royal Plate"
                            className="h-8 w-8 rounded-full ring-1 ring-amber-400/40 object-cover"
                        />
                        <div>
                            <span className="font-serif font-bold text-white tracking-wide">
                                Royal Plate
                            </span>
                            <p className="text-[11px] text-zinc-500">
                                Enterprise Restaurant Management OS
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
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

                    <div className="flex items-center gap-3 text-xs text-zinc-500">
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
                        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-colors cursor-pointer"
                        aria-label="Back to top"
                    >
                        <TbArrowUp className="text-xl" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LandingPage
