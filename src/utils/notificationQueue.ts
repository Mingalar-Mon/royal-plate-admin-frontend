import type { NotificationTier } from '@/@types/notification'

const notificationAudioUrl = '/notification.wav'

interface QueuedNotification {
    id: string
    tier: NotificationTier
    timestamp: number
}

class NotificationQueue {
    private queue: QueuedNotification[] = []
    private isPlaying = false
    private audio: HTMLAudioElement | null = null

    getTierConfig(tier: NotificationTier) {
        const configs = {
            critical: {
                duration: 0,
                soundInterval: 3000,
                maxConcurrent: 3,
                escalationDelay: 30000,
            },
            important: {
                duration: 15000,
                soundInterval: 0,
                maxConcurrent: 5,
                escalationDelay: 60000,
            },
            info: {
                duration: 5000,
                soundInterval: 0,
                maxConcurrent: 5,
                escalationDelay: 0,
            },
        }
        return configs[tier]
    }

    async playSound(tier: NotificationTier): Promise<void> {
        if (this.isPlaying) {
            this.queue.push({
                id: Math.random().toString(36).substr(2, 9),
                tier,
                timestamp: Date.now(),
            })
            return
        }

        this.isPlaying = true

        try {
            this.audio = new Audio(notificationAudioUrl)
            this.audio.volume = tier === 'critical' ? 0.8 : 0.6
            await this.audio.play()

            if (tier === 'critical') {
                const config = this.getTierConfig('critical')
                let repeatCount = 0
                const maxRepeats = 3

                const repeatSound = async () => {
                    if (repeatCount >= maxRepeats) {
                        this.isPlaying = false
                        this.processQueue()
                        return
                    }
                    repeatCount++
                    try {
                        const audio = new Audio(notificationAudioUrl)
                        audio.volume = 0.8
                        await audio.play()
                        setTimeout(repeatSound, config.soundInterval)
                    } catch {
                        this.isPlaying = false
                        this.processQueue()
                    }
                }

                setTimeout(repeatSound, config.soundInterval)
            } else {
                this.audio.onended = () => {
                    this.isPlaying = false
                    this.processQueue()
                }
            }
        } catch {
            this.isPlaying = false
            this.processQueue()
        }
    }

    private processQueue() {
        if (this.queue.length > 0) {
            const next = this.queue.shift()!
            this.playSound(next.tier)
        }
    }

    clear() {
        this.queue = []
        if (this.audio) {
            this.audio.pause()
            this.audio = null
        }
        this.isPlaying = false
    }

    getQueueLength() {
        return this.queue.length
    }
}

export const notificationQueue = new NotificationQueue()
