import { useState, useEffect } from 'react'
import { TbArrowUp, TbShieldCheck } from 'react-icons/tb'

const sections = [
    { id: 'infocollect', title: '1. What Information Do We Collect?' },
    { id: 'infouse', title: '2. How Do We Process Your Information?' },
    {
        id: 'whoshare',
        title: '3. When and With Whom Do We Share Your Personal Information?',
    },
    {
        id: 'cookies',
        title: '4. Do We Use Cookies and Other Tracking Technologies?',
    },
    { id: 'inforetain', title: '5. How Long Do We Keep Your Information?' },
    {
        id: 'infominors',
        title: '6. Do We Collect Information from Minors?',
    },
    { id: 'privacyrights', title: '7. What Are Your Privacy Rights?' },
    { id: 'DNT', title: '8. Controls for Do-Not-Track Features' },
    { id: 'policyupdates', title: '9. Do We Make Updates to This Notice?' },
    {
        id: 'contact',
        title: '10. How Can You Contact Us About This Notice?',
    },
    {
        id: 'request',
        title: '11. How Can You Review, Update, or Delete the Data We Collect?',
    },
]

const Section = ({
    id,
    title,
    children,
}: {
    id: string
    title: string
    children: React.ReactNode
}) => (
    <section id={id} className="scroll-mt-24">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            {title}
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
        </div>
    </section>
)

const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-6 mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
        {children}
    </h3>
)

const InShort = ({ children }: { children: React.ReactNode }) => (
    <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm italic text-gray-700 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
        <strong>In Short:</strong> {children}
    </p>
)

const PrivacyPolicy = () => {
    const [showBackToTop, setShowBackToTop] = useState(false)
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400)

            const offsets = sections.map((s) => {
                const el = document.getElementById(s.id)
                return { id: s.id, top: el ? el.getBoundingClientRect().top : Infinity }
            })
            const current = offsets.reduce((closest, s) => {
                if (s.top <= 120 && s.top > closest.top) return s
                return closest
            }, { id: '', top: -Infinity })
            if (current.id) setActiveSection(current.id)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
                    <TbShieldCheck className="text-2xl text-[#6e1423]" />
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Privacy Policy
                    </h1>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex gap-10">
                    {/* Table of Contents - Sidebar */}
                    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 overflow-y-auto lg:block">
                        <nav>
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Contents
                            </h4>
                            <ul className="space-y-1">
                                {sections.map((s) => (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            className={`block rounded-md px-3 py-1.5 text-xs leading-snug transition-colors ${activeSection === s.id
                                                ? 'bg-[#6e1423]/10 font-semibold text-[#6e1423] dark:text-[#e9c66a]'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="min-w-0 flex-1">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 sm:p-10">
                            {/* Title */}
                            <div className="mb-8 border-b border-gray-100 pb-8 dark:border-gray-700">
                                <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                                    PRIVACY POLICY
                                </h1>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Last updated October 09, 2026
                                </p>
                            </div>

                            {/* Intro */}
                            <div className="mb-10 space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                <p>
                                    This Privacy Notice for Royal Plate (&apos;we&apos;, &apos;us&apos;, or &apos;our&apos;), describes how and why we might access, collect, store, use, and/or share (&apos;process&apos;) your personal information when you use our services (&apos;Services&apos;), including when you:
                                </p>
                                <ul className="list-inside list-disc space-y-1 pl-2">
                                    <li>
                                        Download and use our mobile application (Royal Plate), or any other application of ours that links to this Privacy Notice
                                    </li>
                                    <li>
                                        Engage with us in other related ways, including any marketing or events
                                    </li>
                                </ul>
                                <p>
                                    <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services.
                                </p>
                            </div>

                            {/* Summary of Key Points */}
                            <div className="mb-10">
                                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                                    SUMMARY OF KEY POINTS
                                </h2>
                                <div className="space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    <p>
                                        This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our{' '}
                                        <a href="#toc" className="font-medium text-[#6e1423] underline dark:text-[#e9c66a]">
                                            table of contents
                                        </a>{' '}
                                        below to find the section you are looking for.
                                    </p>

                                    <div>
                                        <strong>What personal information do we process?</strong>{' '}
                                        When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
                                    </div>

                                    <div>
                                        <strong>Do we process any sensitive personal information?</strong>{' '}
                                        We do not process sensitive personal information.
                                    </div>

                                    <div>
                                        <strong>Do we collect any information from third parties?</strong>{' '}
                                        We do not collect any information from third parties.
                                    </div>

                                    <div>
                                        <strong>How do we process your information?</strong>{' '}
                                        We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.
                                    </div>

                                    <div>
                                        <strong>In what situations and with which parties do we share personal information?</strong>{' '}
                                        We may share information in specific situations and with specific third parties.
                                    </div>

                                    <div>
                                        <strong>What are your rights?</strong>{' '}
                                        Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
                                    </div>

                                </div>
                            </div>

                            {/* Table of Contents */}
                            <div id="toc" className="mb-10 scroll-mt-24">
                                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                                    TABLE OF CONTENTS
                                </h2>
                                <ol className="space-y-2">
                                    {sections.map((s) => (
                                        <li key={s.id}>
                                            <a
                                                href={`#${s.id}`}
                                                className="text-sm font-medium text-[#6e1423] hover:underline dark:text-[#e9c66a]"
                                            >
                                                {s.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Sections */}
                            <div className="space-y-12">
                                {/* Section 1 */}
                                <Section id="infocollect" title="1. WHAT INFORMATION DO WE COLLECT?">
                                    <SubHeading>Personal information you disclose to us</SubHeading>
                                    <InShort>
                                        We collect personal information that you provide to us.
                                    </InShort>
                                    <p>
                                        We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                                    </p>
                                    <p>
                                        <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 pl-2">
                                        <li>Names</li>
                                        <li>Phone numbers</li>
                                        <li>Email addresses</li>
                                        <li>Usernames</li>
                                        <li>Passwords</li>
                                    </ul>

                                    <p>
                                        <strong>Sensitive Information.</strong> We do not process sensitive information.
                                    </p>

                                    <p>
                                        <strong>Application Data.</strong> If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:
                                    </p>
                                    <ul className="list-inside list-disc space-y-2 pl-2">
                                        <li>
                                            <em>Geolocation Information.</em> We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device&apos;s settings.
                                        </li>
                                        <li>
                                            <em>Mobile Device Access.</em> We may request access or permission to certain features from your mobile device, including your mobile device&apos;s sms messages, camera, and other features. If you wish to change our access or permissions, you may do so in your device&apos;s settings.
                                        </li>
                                        <li>
                                            <em>Push Notifications.</em> We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device&apos;s settings.
                                        </li>
                                    </ul>
                                    <p>
                                        This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.
                                    </p>
                                    <p>
                                        All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
                                    </p>

                                    <SubHeading>Google API</SubHeading>
                                    <p>
                                        Our use of information received from Google APIs will adhere to{' '}
                                        <a
                                            href="https://developers.google.com/terms/api-services-user-data-policy"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            className="text-[#6e1423] underline dark:text-[#e9c66a]"
                                        >
                                            Google API Services User Data Policy
                                        </a>
                                        , including the{' '}
                                        <a
                                            href="https://developers.google.com/terms/api-services-user-data-policy#limited-use"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            className="text-[#6e1423] underline dark:text-[#e9c66a]"
                                        >
                                            Limited Use requirements
                                        </a>
                                        .
                                    </p>
                                </Section>

                                {/* Section 2 */}
                                <Section id="infouse" title="2. HOW DO WE PROCESS YOUR INFORMATION?">
                                    <InShort>
                                        We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
                                    </InShort>
                                    <p>
                                        <strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong>
                                    </p>
                                    <ul className="list-inside list-disc space-y-2 pl-2">
                                        <li>
                                            <strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.
                                        </li>
                                        <li>
                                            <strong>To respond to user inquiries/offer support to users.</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.
                                        </li>
                                        <li>
                                            <strong>To send you marketing and promotional communications.</strong> We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see the &apos;WHAT ARE YOUR PRIVACY RIGHTS?&apos; section below.
                                        </li>
                                        <li>
                                            <strong>To deliver targeted advertising to you.</strong> We may process your information to develop and display personalised content and advertising tailored to your interests, location, and more.
                                        </li>
                                        <li>
                                            <strong>To protect our Services.</strong> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.
                                        </li>
                                    </ul>
                                </Section>

                                {/* Section 3 */}
                                <Section id="whoshare" title="3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?">
                                    <InShort>
                                        We may share information in specific situations described in this section and/or with the following third parties.
                                    </InShort>
                                    <p>
                                        We may need to share your personal information in the following situations:
                                    </p>
                                    <ul className="list-inside list-disc space-y-2 pl-2">
                                        <li>
                                            <strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                                        </li>
                                        <li>
                                            <strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g. Google Maps API, Places API). Google Maps uses GPS, Wi-Fi, and cell towers to estimate your location. GPS is accurate to about 20 meters, while Wi-Fi and cell towers help improve accuracy when GPS signals are weak, like indoors. This data helps Google Maps provide directions, but it is not always perfectly precise. We obtain and store on your device (&apos;cache&apos;) your location. You may revoke your consent anytime by contacting us at the contact details provided at the end of this document.
                                        </li>
                                    </ul>
                                </Section>

                                {/* Section 4 */}
                                <Section id="cookies" title="4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?">
                                    <InShort>
                                        We may use cookies and other tracking technologies to collect and store your information.
                                    </InShort>
                                    <p>
                                        We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
                                    </p>
                                    <p>
                                        We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements or to tailor advertisements to your interests. The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.
                                    </p>
                                    <p>
                                        Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
                                    </p>
                                </Section>

                                {/* Section 5 */}
                                <Section id="inforetain" title="5. HOW LONG DO WE KEEP YOUR INFORMATION?">
                                    <InShort>
                                        We keep your information for as long as necessary to fulfil the purposes outlined in this Privacy Notice unless otherwise required by law.
                                    </InShort>
                                    <p>
                                        We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
                                    </p>
                                    <p>
                                        When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                                    </p>
                                </Section>

                                {/* Section 6 */}
                                <Section id="infominors" title="6. DO WE COLLECT INFORMATION FROM MINORS?">
                                    <InShort>
                                        We do not knowingly collect data from or market to children under 18 years of age.
                                    </InShort>
                                    <p>
                                        We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at the contact details provided at the end of this document.
                                    </p>
                                </Section>

                                {/* Section 7 */}
                                <Section id="privacyrights" title="7. WHAT ARE YOUR PRIVACY RIGHTS?">
                                    <InShort>
                                        You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.
                                    </InShort>

                                    <p>
                                        <strong>
                                            <u>Withdrawing your consent:</u>
                                        </strong>{' '}
                                        If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section &apos;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&apos; below.
                                    </p>
                                    <p>
                                        However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
                                    </p>

                                    <SubHeading>Account Information</SubHeading>
                                    <p>
                                        If you would at any time like to review or change the information in your account or terminate your account, you can:
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 pl-2">
                                        <li>Log in to your account settings and update your user account.</li>
                                    </ul>
                                    <p>
                                        Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
                                    </p>
                                </Section>

                                {/* Section 8 */}
                                <Section id="DNT" title="8. CONTROLS FOR DO-NOT-TRACK FEATURES">
                                    <p>
                                        Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&apos;DNT&apos;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
                                    </p>
                                </Section>

                                {/* Section 9 */}
                                <Section id="policyupdates" title="9. DO WE MAKE UPDATES TO THIS NOTICE?">
                                    <InShort>
                                        Yes, we will update this notice as necessary to stay compliant with relevant laws.
                                    </InShort>
                                    <p>
                                        We may update this Privacy Notice from time to time. The updated version will be indicated by an updated &apos;Revised&apos; date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
                                    </p>
                                </Section>

                                {/* Section 10 */}
                                <Section id="contact" title="10. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?">
                                    <p>
                                        If you have questions or comments about this notice, you may contact us by post at:
                                    </p>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/50">
                                        <p>Royal Plate</p>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Contact details to be provided
                                        </p>
                                    </div>
                                </Section>


                            </div>

                            {/* Footer */}

                        </div>
                    </main>
                </div>
            </div>

            {/* Back to Top */}
            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#6e1423] text-white shadow-lg transition-all hover:bg-[#4a0d16]"
                    aria-label="Back to top"
                >
                    <TbArrowUp className="text-lg" />
                </button>
            )}
        </div>
    )
}

export default PrivacyPolicy
