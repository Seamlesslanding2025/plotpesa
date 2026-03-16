'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, MapPin, ExternalLink, Trash2, CheckSquare, Loader2, Inbox } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PortalNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const { user } = useAuth()
    const supabase = createClient()
    const [notifications, setNotifications] = useState<PortalNotification[]>([])
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {
        if (!user) return
        setLoading(true)
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) setNotifications(data as PortalNotification[])
        setLoading(false)
    }

    useEffect(() => {
        fetchNotifications()
    }, [user])

    const markAllRead = async () => {
        if (!user) return
        await (supabase.from('notifications') as any)
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false)

        setNotifications((prev): PortalNotification[] => prev.map(n => ({ ...n, is_read: true })))
    }

    const deleteNotification = async (id: string) => {
        await supabase
            .from('notifications')
            .delete()
            .eq('id', id)

        setNotifications((prev): PortalNotification[] => prev.filter(n => n.id !== id))
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-pesa-green opacity-20" />
                <p className="font-black text-pesa-green uppercase tracking-[0.2em] text-xs opacity-50">Opening Secure Inbox...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tighter italic">Portal Alerts</h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Your personalized property matching history</p>
                </div>
                {notifications.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={markAllRead}
                        className="h-12 border-2 border-pesa-green text-pesa-green font-black rounded-xl hover:bg-pesa-green hover:text-white transition-all text-xs uppercase tracking-widest"
                    >
                        <CheckSquare className="mr-2 h-4 w-4" /> Mark All as Read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-[4rem] border-2 border-dashed border-pesa-border p-32 text-center shadow-pesa relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pesa-green/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="w-24 h-24 bg-pesa-subtle rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-pesa-subtle">
                        <Inbox className="h-12 w-12 text-pesa-green opacity-30" />
                    </div>
                    <h3 className="text-2xl font-black text-pesa-green mb-2">Clear Skies</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto">No notifications currently. We'll update you as matched assets are verified.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {notifications.map((n) => (
                        <Card
                            key={n.id}
                            className={`bg-white rounded-3xl border border-pesa-border shadow-pesa overflow-hidden group hover:shadow-xl transition-all ${!n.is_read ? 'border-l-8 border-l-pesa-gold bg-pesa-gold/[0.02]' : 'border-l-8 border-l-gray-100'
                                }`}
                        >
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-start gap-6">
                                        <div className={`p-4 rounded-2xl shrink-0 ${!n.is_read ? 'bg-pesa-gold text-pesa-green' : 'bg-gray-50 text-gray-400'}`}>
                                            <Bell className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-black text-pesa-green tracking-tight">{n.title}</h3>
                                                {!n.is_read && <span className="bg-pesa-gold text-pesa-green text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">New</span>}
                                            </div>
                                            <p className="text-gray-600 font-medium leading-relaxed max-w-2xl">{n.message}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                                                {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {n.link && (
                                            <Link href={n.link} className="no-underline">
                                                <Button className="h-12 px-6 bg-pesa-green text-white font-black rounded-xl border-b-4 border-pesa-gold hover:opacity-90">
                                                    View Asset <ExternalLink className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            variant="ghost"
                                            onClick={() => deleteNotification(n.id)}
                                            className="h-12 w-12 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
