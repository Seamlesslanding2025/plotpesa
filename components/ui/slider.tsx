'use client'

import * as React from 'react'

interface SliderProps {
    value: number[]
    min: number
    max: number
    step: number
    onValueChange: (value: number[]) => void
    className?: string
}

export function Slider({ value, min, max, step, onValueChange, className }: SliderProps) {
    return (
        <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={(e) => onValueChange([Number(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pesa-green"
            />
        </div>
    )
}
