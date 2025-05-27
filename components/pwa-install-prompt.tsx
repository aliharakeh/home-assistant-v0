'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useLanguage } from '@/contexts/language-context'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function PWAInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const { t } = useLanguage()

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            const now = new Date().getTime()
            const lastPromptTime = localStorage.getItem('lastPwaInstallPromptTime')
            const oneHour = 60 * 60 * 1000

            if (!lastPromptTime || now - parseInt(lastPromptTime, 10) > oneHour) {
                setInstallPrompt(e as BeforeInstallPromptEvent)
                setShowPrompt(true)
                localStorage.setItem('lastPwaInstallPromptTime', now.toString())
            }
        }

        // Check if running in standalone mode (app installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        if (!isStandalone) {
            window.addEventListener('beforeinstallprompt', handler)
        }

        return () => {
            if (!isStandalone) {
                window.removeEventListener('beforeinstallprompt', handler)
            }
        }
    }, [])

    const onInstall = async () => {
        if (!installPrompt) return

        installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice

        if (outcome === 'accepted') {
            setInstallPrompt(null)
            setShowPrompt(false)
        }
    }

    if (!showPrompt) return null

    return (
        <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('installApp')}</DialogTitle>
                    <DialogDescription>{t('installAppDescription')}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-2">
                            <img
                                src="/icons/icon-192x192.png"
                                alt="App Icon"
                                className="w-12 h-12"
                            />
                        </div>
                        <span className="text-sm font-medium">Home Assistant</span>
                    </div>
                </div>
                <DialogFooter className="flex sm:justify-between">
                    <Button variant="outline" onClick={() => setShowPrompt(false)}>
                        {t('notNow')}
                    </Button>
                    <Button onClick={onInstall} className="gap-2">
                        <Download className="h-4 w-4" />
                        {t('install')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
