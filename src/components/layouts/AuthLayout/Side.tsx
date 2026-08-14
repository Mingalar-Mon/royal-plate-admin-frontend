import { cloneElement } from 'react'
import type { CommonProps } from '@/@types/common_type'
import emailOptLogo from '@/assets/logo/emailoptlogo.png'

type SideProps = CommonProps

const Side = ({ children, ...rest }: SideProps) => {
    return (
        <div className="flex h-full p-6 bg-[#faf7f2] dark:bg-gray-800">
            <div className="flex flex-col justify-center items-center flex-1">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
            <div className="py-10 px-12 lg:flex flex-col flex-1 justify-center hidden rounded-3xl items-center relative xl:max-w-[520px] 2xl:max-w-[720px] overflow-hidden bg-gradient-to-br from-[#2a0a10] via-primary-deep to-primary">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_28%_18%,var(--gold)_0%,transparent_45%),radial-gradient(circle_at_82%_85%,var(--gold-dark)_0%,transparent_42%)]" />
                <div className="relative flex flex-col items-center gap-6 text-center">
                    <div className="rounded-full overflow-hidden ring-2 ring-gold shadow-2xl shadow-black/40">
                        <img
                            src={emailOptLogo}
                            alt="Royal Plate"
                            className="h-24 w-24 md:h-28 md:w-28 object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="font-serif text-4xl text-gold-light tracking-wide">
                            Royal Plate
                        </h1>
                        <p className="text-gold uppercase text-xs tracking-[0.35em] mt-2">
                            Restaurant Management
                        </p>
                    </div>
                    <p className="font-serif italic text-[#fdf6e3]/80 max-w-sm leading-relaxed">
                        Elevating every meal, one order at a time.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Side
