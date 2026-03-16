'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "./ui/slider"
import { Button } from "@/components/ui/button"
import { Calculator, Landmark, Calendar, Percent, Coins } from "lucide-react"

export default function MortgageCalculator() {
    const [loanAmount, setLoanAmount] = useState(5000000)
    const [interestRate, setInterestRate] = useState(13.5)
    const [years, setYears] = useState(15)
    const [monthlyPayment, setMonthlyPayment] = useState(0)

    useEffect(() => {
        const rate = interestRate / 100 / 12
        const n = years * 12
        const payment = (loanAmount * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
        setMonthlyPayment(isNaN(payment) ? 0 : payment)
    }, [loanAmount, interestRate, years])

    const formatKES = (val: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0
        }).format(val)
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
            <div className="grid md:grid-cols-2">
                {/* Inputs */}
                <div className="p-8 md:p-12 space-y-8 bg-gray-50/50">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-pesa-green uppercase tracking-tight flex items-center gap-2">
                            <Calculator className="h-6 w-6 text-pesa-gold" />
                            Loan Estimator
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">Estimate your monthly repayments in KES.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Coins className="h-4 w-4" /> Total Loan
                                </Label>
                                <span className="font-black text-pesa-green">{formatKES(loanAmount)}</span>
                            </div>
                            <Input
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="h-12 rounded-xl border-gray-200 focus:border-pesa-green bg-white shadow-inner font-bold"
                            />
                            <Slider
                                value={[loanAmount]}
                                min={500000}
                                max={50000000}
                                step={100000}
                                onValueChange={(val: number[]) => setLoanAmount(val[0])}
                                className="py-4"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Percent className="h-4 w-4" /> Rate (%)
                                </Label>
                                <Input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="h-12 rounded-xl border-gray-200 font-bold"
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Years
                                </Label>
                                <Input
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="h-12 rounded-xl border-gray-200 font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="p-8 md:p-12 bg-pesa-green text-white flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="space-y-2 relative z-10">
                        <p className="text-pesa-gold font-black uppercase tracking-[0.3em] text-[10px]">Monthly Payment</p>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                            {formatKES(monthlyPayment)}
                        </h2>
                        <p className="text-white/60 text-sm font-medium">Estimated monthly installment</p>
                    </div>

                    <div className="w-full h-px bg-white/10 relative z-10"></div>

                    <div className="grid grid-cols-2 w-full gap-4 relative z-10">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase text-white/40 mb-1">Total Paid</p>
                            <p className="font-bold text-sm">{formatKES(monthlyPayment * years * 12)}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black uppercase text-white/40 mb-1">Interest</p>
                            <p className="font-bold text-sm text-pesa-gold">{formatKES((monthlyPayment * years * 12) - loanAmount)}</p>
                        </div>
                    </div>

                    <Button className="w-full h-14 bg-pesa-gold hover:bg-white text-pesa-green font-black rounded-2xl transition-all shadow-2xl relative z-10">
                        Apply for Financing
                    </Button>
                </div>
            </div>
        </Card>
    )
}
