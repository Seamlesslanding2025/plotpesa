'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    if (!isVisible) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] bg-pesa-green text-white p-4 rounded-2xl shadow-2xl hover:bg-pesa-gold hover:text-pesa-green transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-black/20"
            aria-label="Back to top"
        >
            <ArrowUp className="h-6 w-6 font-black" />
        </button>
    )
}
