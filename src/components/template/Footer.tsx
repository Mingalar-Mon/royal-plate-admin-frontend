import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full sm:flex-row sm:justify-between">
            <span className="text-xs sm:text-sm text-center">
                Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                <span className="font-semibold">{`${APP_NAME}`}</span> All
                rights reserved.
            </span>
            <div className="text-xs sm:text-sm">
                <a
                    className="text-gray"
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                >
                    Term & Conditions
                </a>
                <span className="mx-1.5 text-muted hidden sm:inline"> | </span>
                <a
                    className="text-gray"
                    href="https://royal-plate-admin-frontend-e2w1.vercel.app/privacy-policy"
                    onClick={(e) => e.preventDefault()}
                >
                    Privacy & Policy
                </a>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-12 sm:h-16 ${PAGE_CONTAINER_GUTTER_X}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
