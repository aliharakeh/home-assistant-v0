'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLanguage } from '@/contexts/language-context'
import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine)

        // Add event listeners
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Clean up
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if (isOnline) return null

    return (
        <Alert variant="destructive" className="fixed bottom-0 left-0 right-0 z-50 rounded-none">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>{t('offlineMode')}</AlertDescription>
        </Alert>
    )
}
