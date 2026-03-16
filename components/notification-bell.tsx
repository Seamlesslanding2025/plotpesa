'use client'

import { useState, useEffect } from 'react'
import { Bell, Loader2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './auth-provider'
import Link from 'next/link'

interface PortalNotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const { user } = useAuth()
    const supabase = createClient()
    const [notifications, setNotifications] = useState<PortalNotification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {
        if (!user) return
        setLoading(true)
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)

        if (data) {
            const typedData = data as PortalNotification[]
            setNotifications(typedData)
            setUnreadCount(typedData.filter(n => !n.is_read).length)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!user) return
        fetchNotifications()

        // Real-time subscription
        const channel = supabase
            .channel('notifications_changes')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchNotifications()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    const markAsRead = async (id: string) => {
        await (supabase.from('notifications') as any)
            .update({ is_read: true })
            .eq('id', id)

        setNotifications((prev): PortalNotification[] => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-white hover:bg-pesa-subtle rounded-2xl border border-pesa-border shadow-sm transition-all group relative"
            >
                <Bell className={`h-6 w-6 ${unreadCount > 0 ? 'text-pesa-gold animate-pulse' : 'text-pesa-green'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 shrink-0 rounded-full bg-pesa-gold text-[10px] font-black items-center justify-center text-pesa-green ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-pesa-border z-50 overflow-hidden slide-in-top">
                    <div className="p-6 border-b border-pesa-subtle bg-pesa-subtle/30 flex items-center justify-between">
                        <h3 className="text-sm font-black text-pesa-green uppercase tracking-widest">Portal Alerts</h3>
                        {unreadCount > 0 && <span className="text-[10px] font-bold text-pesa-gold uppercase">{unreadCount} New</span>}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-12 flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="h-8 w-8 animate-spin text-pesa-green opacity-20" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-xs font-bold text-gray-400">No recent alerts</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-pesa-subtle">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-6 transition-colors hover:bg-pesa-subtle/20 ${!n.is_read ? 'bg-pesa-gold/[0.03]' : ''}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.is_read ? 'bg-pesa-gold' : 'bg-gray-200'}`}></div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-black text-pesa-green leading-tight">{n.title}</p>
                                                <p className="text-xs font-medium text-gray-500 leading-relaxed">{n.message}</p>
                                                <div className="flex items-center gap-3 pt-3">
                                                    {n.link && (
                                                        <Link
                                                            href={n.link}
                                                            onClick={() => {
                                                                markAsRead(n.id)
                                                                setIsOpen(false)
                                                            }}
                                                            className="text-[10px] font-black text-pesa-gold uppercase flex items-center gap-1 hover:underline"
                                                        >
                                                            View Match <ExternalLink className="h-3 w-3" />
                                                        </Link>
                                                    )}
                                                    {!n.is_read && (
                                                        <button
                                                            onClick={() => markAsRead(n.id)}
                                                            className="text-[10px] font-bold text-gray-400 uppercase hover:text-pesa-green"
                                                        >
                                                            Dismiss
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
