import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const RESTAURANT_TIMEZONE = 'Asia/Yangon'

export const toRestaurantTime = (date: string | null | undefined) =>
    date ? dayjs.utc(date).tz(RESTAURANT_TIMEZONE) : null
