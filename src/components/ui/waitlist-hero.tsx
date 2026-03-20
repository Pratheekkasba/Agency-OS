"use client"

import { useState, useRef } from "react"

export const WaitlistHero = () => {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState("idle") // 'idle' | 'loading' | 'success'
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus("loading")

        // Simulate API delay
        setTimeout(() => {
            setStatus("success")
            setEmail("")
            fireConfetti()
        }, 1500)
    }

    // --- Confetti Logic ---
    const fireConfetti = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const particles: any[] = []
        const colors = ["#0079da", "#10b981", "#fbbf24", "#f472b6", "#fff"]

        // Resize canvas to cover the button area mostly
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const createParticle = () => {
            return {
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 12, // Random spread X
                vy: (Math.random() - 2) * 10, // Upward velocity
                life: 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 2,
            }
        }

        // Create batch of particles
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle())
        }

        const animate = () => {
            if (particles.length === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                return
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                p.x += p.vx
                p.y += p.vy
                p.vy += 0.5 // Gravity
                p.life -= 2

                ctx.fillStyle = p.color
                ctx.globalAlpha = Math.max(0, p.life / 100)
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()

                if (p.life <= 0) {
                    particles.splice(i, 1)
                    i--
                }
            }

            requestAnimationFrame(animate)
        }

        animate()
    }

    // Color tokens
    const colors = {
        textMain: "#ffffff",
        textSecondary: "#94a3b8",
        bluePrimary: "#5B5CF6",
        success: "#10b981", // emerald-500
        inputBg: "#27272a",
        baseBg: "#09090b",
        inputShadow: "rgba(255, 255, 255, 0.1)",
    }

    return (
        <div className="w-full flex items-center justify-center">
            {/* Animation Styles */}
            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}</style>

            {/* Main Container */}
            <div
                className="relative w-full h-screen min-h-[700px] overflow-hidden"
                style={{
                    backgroundColor: colors.baseBg,
                    fontFamily: "'Inter', 'Syne', system-ui, sans-serif",
                }}
            >
                {/* Background Decorative Layer — floating app icons */}
                <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                    <style>{`
                        @keyframes float-a {
                            0%, 100% { transform: translateY(0px) rotate(var(--r)); }
                            50% { transform: translateY(-18px) rotate(var(--r)); }
                        }
                        @keyframes float-b {
                            0%, 100% { transform: translateY(0px) rotate(var(--r)); }
                            50% { transform: translateY(12px) rotate(var(--r)); }
                        }
                        @keyframes float-c {
                            0%, 100% { transform: translateY(0px) rotate(var(--r)); }
                            50% { transform: translateY(-8px) rotate(var(--r)); }
                        }
                        .fi { position: absolute; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.6); }
                        .fi img { width: 100%; height: 100%; object-fit: cover; }
                    `}</style>

                    {/* WhatsApp — top-center-left */}
                    <div className="fi rounded-[22%]" style={{ width: 72, height: 72, top: "8%", left: "28%", "--r": "-18deg", animation: "float-a 7s ease-in-out infinite", animationDelay: "0s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2325D366'/%3E%3Cpath fill='white' d='M72 28C64 20 53 16 42 17 23 19 8 36 10 55c1 6 3 12 7 17L13 88l17-4c5 3 11 4 17 4 21 0 38-17 38-38 0-10-4-20-11-27l-2 3zm-30 58c-5 0-10-1-15-4l-1-1-11 3 3-11-1-1C13 66 11 59 11 52c0-17 14-31 31-31 8 0 16 3 22 9 6 6 9 14 9 22 0 17-14 31-31 34l-10-1z'/%3E%3C/svg%3E" alt="WhatsApp" />
                    </div>

                    {/* Instagram — top-right area */}
                    <div className="fi rounded-[22%]" style={{ width: 80, height: 80, top: "5%", left: "62%", "--r": "14deg", animation: "float-b 9s ease-in-out infinite", animationDelay: "1s", filter: "blur(1px)" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3ClinearGradient id='ig' x1='0%25' y1='100%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23FFDC80'/%3E%3Cstop offset='30%25' stop-color='%23F77737'/%3E%3Cstop offset='65%25' stop-color='%23F56040'/%3E%3Cstop offset='100%25' stop-color='%23833AB4'/%3E%3C/linearGradient%3E%3Crect width='100' height='100' rx='22' fill='url(%23ig)'/%3E%3Ccircle cx='50' cy='50' r='19' fill='none' stroke='white' stroke-width='6'/%3E%3Ccircle cx='73' cy='27' r='5' fill='white'/%3E%3C/svg%3E" alt="Instagram" />
                    </div>

                    {/* LinkedIn — far right */}
                    <div className="fi rounded-[22%]" style={{ width: 64, height: 64, top: "22%", left: "88%", "--r": "6deg", animation: "float-a 8s ease-in-out infinite", animationDelay: "2s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%230A66C2'/%3E%3Cpath fill='white' d='M26 40h12v40H26zm6-18a7 7 0 110 14 7 7 0 010-14zm18 18h11v5c2-3 5-6 10-6 11 0 13 7 13 17V80H73V58c0-5-2-9-6-9-5 0-7 4-7 7V80H47V40z'/%3E%3C/svg%3E" alt="LinkedIn" />
                    </div>

                    {/* Slack — upper-left */}
                    <div className="fi rounded-[22%]" style={{ width: 88, height: 88, top: "12%", left: "6%", "--r": "-24deg", animation: "float-c 10s ease-in-out infinite", animationDelay: "0.5s", filter: "blur(1.5px)" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='white'/%3E%3Cpath fill='%23E01E5A' d='M29 63a8 8 0 010-16h8v8a8 8 0 01-8 8zm0-32a8 8 0 010-16 8 8 0 018 8v8H29z'/%3E%3Cpath fill='%2336C5F0' d='M63 71a8 8 0 010 16 8 8 0 01-8-8v-8h8zm16-8a8 8 0 010-16H87a8 8 0 010 16H79z'/%3E%3Cpath fill='%232EB67D' d='M71 29a8 8 0 010 16h-8v-8a8 8 0 018-8zM55 21a8 8 0 010-16 8 8 0 018 8v8H55z'/%3E%3Cpath fill='%23ECB22E' d='M37 37a8 8 0 010-16h8v8a8 8 0 01-8 8zm-16 8a8 8 0 010 16H13a8 8 0 010-16h8z'/%3E%3C/svg%3E" alt="Slack" />
                    </div>

                    {/* Gmail — mid-left */}
                    <div className="fi rounded-[22%]" style={{ width: 58, height: 58, top: "42%", left: "4%", "--r": "10deg", animation: "float-b 8.5s ease-in-out infinite", animationDelay: "3s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='white'/%3E%3Cpath fill='%23EA4335' d='M16 28v44l18-14V42z'/%3E%3Cpath fill='%2334A853' d='M84 28v44L66 58V42z'/%3E%3Cpath fill='%234285F4' d='M84 28H16l34 26z'/%3E%3Cpath fill='%23FBBC04' d='M16 72h18V58L16 28z'/%3E%3Cpath fill='%23C5221F' d='M84 72H66V58L84 28z'/%3E%3C/svg%3E" alt="Gmail" />
                    </div>

                    {/* Twitter/X — top-center */}
                    <div className="fi rounded-[22%]" style={{ width: 62, height: 62, top: "3%", left: "45%", "--r": "-8deg", animation: "float-a 7.5s ease-in-out infinite", animationDelay: "1.5s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23000'/%3E%3Cpath fill='white' d='M56.5 45L76 22h-5L54 42 38 22H20l21 30L20 78h5l18-21 17 21h18zm-6 7l-2-2L25 26h7l13 19 2 3 17 25h-7z'/%3E%3C/svg%3E" alt="X" />
                    </div>

                    {/* Telegram — right edge upper */}
                    <div className="fi rounded-[22%]" style={{ width: 76, height: 76, top: "38%", left: "85%", "--r": "20deg", animation: "float-c 9.5s ease-in-out infinite", animationDelay: "2.5s", filter: "blur(1px)" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2326A5E4'/%3E%3Cpath fill='white' d='M71 28L20 49c-4 1-3 3-1 4l13 4 30-19c1-1 3 0 2 1L39 63l-1 14 3-2 8-8 17 12c3 2 5 1 6-3L74 31c1-4-2-5-3-3z'/%3E%3C/svg%3E" alt="Telegram" />
                    </div>

                    {/* Discord — lower-left */}
                    <div className="fi rounded-[22%]" style={{ width: 68, height: 68, top: "62%", left: "8%", "--r": "-14deg", animation: "float-a 11s ease-in-out infinite", animationDelay: "4s", filter: "blur(1px)" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%235865F2'/%3E%3Cpath fill='white' d='M68 28A56 56 0 0053 24c-1 2-1 3-2 4a51 51 0 00-16 0 40 40 0 00-2-4 57 57 0 00-15 4C9 44 7 60 8 76a57 57 0 0018 9 44 44 0 004-6c-2-1-4-2-6-3l1-1a41 41 0 0035 0l2 1c-2 1-4 2-6 3 1 2 2 4 4 6a57 57 0 0018-9C79 58 76 42 68 28zM40 66c-4 0-6-3-6-7s2-7 6-7 6 3 6 7-2 7-6 7zm20 0c-4 0-6-3-6-7s2-7 6-7 6 3 6 7-2 7-6 7z'/%3E%3C/svg%3E" alt="Discord" />
                    </div>

                    {/* Notion — lower-right */}
                    <div className="fi rounded-[22%]" style={{ width: 66, height: 66, top: "66%", left: "80%", "--r": "18deg", animation: "float-b 10.5s ease-in-out infinite", animationDelay: "1.2s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='white'/%3E%3Cpath d='M22 22c4 3 5 2 14 2l44-3c2 0 1-2 0-3l-7-4c-2-1-4-3-13-2L18 15c-2 0-2 2 0 3zM26 32v50c0 3 1 4 4 4l48-3c3 0 3-2 3-4V29c0-2-1-3-3-3l-48 3c-2 0-4 1-4 3zm43 4l-38 2V72l38-2V36zm-38 4l9-1 3 4 3-5 8-1v31l-7 1V42l-4 7-3-7-5 1v27l-4 1V40z' fill='black'/%3E%3C/svg%3E" alt="Notion" />
                    </div>

                    {/* Facebook — far left lower */}
                    <div className="fi rounded-[22%]" style={{ width: 54, height: 54, top: "75%", left: "22%", "--r": "22deg", animation: "float-c 8s ease-in-out infinite", animationDelay: "0.8s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%231877F2'/%3E%3Cpath fill='white' d='M64 50H54v36H40V50H32V37h8v-8c0-10 6-15 15-15 4 0 9 1 9 1v13h-5c-5 0-6 2-6 6v5h11z'/%3E%3C/svg%3E" alt="Facebook" />
                    </div>

                    {/* YouTube — right center */}
                    <div className="fi rounded-[22%]" style={{ width: 72, height: 72, top: "55%", left: "72%", "--r": "-10deg", animation: "float-a 9s ease-in-out infinite", animationDelay: "3.5s", filter: "blur(0.5px)" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23FF0000'/%3E%3Cpath fill='white' d='M80 37s-1-6-4-9c-3-4-7-4-9-4C55 23 50 23 50 23s-5 0-17 1c-2 0-6 0-9 4-3 3-4 9-4 9S19 44 19 51v7s1 7 4 10 7 3 9 4c7 1 22 1 22 1s15 0 17-1c2-1 6-1 9-4 3-3 4-10 4-10s1-6 1-13v-7s0-7-1-13zM43 61V39l22 11z'/%3E%3C/svg%3E" alt="YouTube" />
                    </div>

                    {/* Figma — upper-right near center */}
                    <div className="fi rounded-[22%]" style={{ width: 58, height: 58, top: "28%", left: "74%", "--r": "-22deg", animation: "float-b 8s ease-in-out infinite", animationDelay: "2.2s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23F24E1E'/%3E%3Ccircle cx='62' cy='50' r='12' fill='%231ABCFE'/%3E%3Ccircle cx='38' cy='62' r='12' fill='%230ACF83'/%3E%3Crect x='26' y='26' width='24' height='24' rx='12' fill='%23FF7262'/%3E%3Crect x='26' y='38' width='24' height='24' rx='0 0 12 12' fill='%23A259FF'/%3E%3C/svg%3E" alt="Figma" />
                    </div>

                    {/* Pinterest — left of center above */}
                    <div className="fi rounded-[22%]" style={{ width: 82, height: 82, top: "22%", left: "16%", "--r": "12deg", animation: "float-a 12s ease-in-out infinite", animationDelay: "1.8s", filter: "blur(2px)" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23E60023'/%3E%3Cpath fill='white' d='M50 12C29 12 12 29 12 50c0 16 10 30 24 36-1-3-1-8 0-12l6-27s-2-3-2-8c0-8 5-13 10-13 5 0 7 4 7 8 0 5-3 13-5 20-1 6 3 11 9 11 11 0 19-14 19-31 0-16-12-27-28-27-19 0-30 14-30 29 0 6 2 11 5 14 1 1 1 2 0 3L25 60c0 1-1 2-2 1C17 57 12 54 12 50'/%3E%3C/svg%3E" alt="Pinterest" />
                    </div>

                    {/* Safari — lower-far-right */}
                    <div className="fi rounded-[22%]" style={{ width: 60, height: 60, top: "72%", left: "58%", "--r": "-5deg", animation: "float-c 7s ease-in-out infinite", animationDelay: "4.5s" } as any}>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3ClinearGradient id='sb' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff'/%3E%3Cstop offset='100%25' stop-color='%23e0e0e0'/%3E%3C/linearGradient%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23sb)'/%3E%3Ccircle cx='50' cy='50' r='46' fill='none' stroke='%23ccc' stroke-width='1'/%3E%3Cpolygon points='50,20 58,50 50,80 42,50' fill='%23E53935' opacity='0.85'/%3E%3Cpolygon points='20,50 50,42 80,50 50,58' fill='%23666'/%3E%3C/svg%3E" alt="Safari" />
                    </div>
                </div>

                {/* Gradient Overlay — strong vignette so text pops */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: `
                            radial-gradient(ellipse 70% 60% at 50% 80%, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.6) 60%, transparent 100%),
                            radial-gradient(ellipse 100% 40% at 50% 100%, rgba(9,9,11,1) 0%, transparent 100%),
                            linear-gradient(to bottom, rgba(9,9,11,0.5) 0%, transparent 30%, transparent 50%, rgba(9,9,11,0.85) 85%, rgba(9,9,11,1) 100%)
                        `
                    }}
                />

                {/* Content — Vertically centered for dramatic full screen feel */}
                <div className="relative z-20 w-full h-full flex flex-col items-center justify-center pt-24 pb-32 px-6 gap-0">

                    {/* Main headline */}
                    <h1
                        className="text-center font-bold mb-6"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "clamp(3rem, 9vw, 6.5rem)",
                            lineHeight: 1.0,
                            fontWeight: 700,
                            maxWidth: "16ch",
                        }}
                    >
                        <span style={{ background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 60%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
                            Run your entire
                        </span>
                        <span style={{ background: "linear-gradient(90deg, #6C63FF 0%, #A855F7 60%, #4CC9F0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
                            agency.
                        </span>
                        <span style={{ background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
                            One system.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="text-center mb-4"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.75, color: "#A1A1AA", maxWidth: 480 }}
                    >
                        Agency OS replaces your inbox, project tracker, client portal, and analytics — with one unified platform powered by Google AI.
                    </p>

                    {/* Pill badge — trust signal (moved closer to form) */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm mb-5"
                        style={{ borderColor: "#1F1F2A", background: "rgba(108,99,255,0.08)", color: "#A1A1AA", backdropFilter: "blur(8px)" }}>
                        <svg className="w-3.5 h-3.5" style={{ color: "#22C55E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Trusted by <strong style={{ color: "#fff", fontWeight: 600 }}>&nbsp;120+ agencies&nbsp;</strong> on the waitlist
                    </div>

                    {/* Form / Success Container */}
                    <div className="w-full max-w-lg px-4 relative flex flex-col">{/* Confetti Canvas */}
                        {/* Confetti Canvas */}
                        <canvas
                            ref={canvasRef}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
                        />

                        {/* SUCCESS STATE */}
                        <div
                            className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${status === "success"
                                ? "opacity-100 scale-100 rotate-x-0 animate-success-pulse animate-success-glow"
                                : "opacity-0 scale-95 -rotate-x-90 pointer-events-none"
                                }`}
                            style={{ backgroundColor: colors.success }}
                        >
                            {/* Celebration rings */}
                            {status === "success" && (
                                <>
                                    <div
                                        className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-400 animate-ring"
                                        style={{ animationDelay: "0s" }}
                                    />
                                    <div
                                        className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-300 animate-ring"
                                        style={{ animationDelay: "0.15s" }}
                                    />
                                    <div
                                        className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-200 animate-ring"
                                        style={{ animationDelay: "0.3s" }}
                                    />
                                </>
                            )}
                            <div
                                className={`flex items-center gap-2 text-white font-semibold text-lg ${status === "success" ? "animate-bounce-in" : ""}`}
                            >
                                <div className="bg-white/20 p-1 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            className={status === "success" ? "animate-checkmark" : ""}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span>You're on the list!</span>
                            </div>
                        </div>

                        {/* FORM STATE */}
                        <form
                            onSubmit={handleSubmit}
                            className={`relative w-full h-full group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${status === "success"
                                ? "opacity-0 scale-95 rotate-x-90 pointer-events-none"
                                : "opacity-100 scale-100 rotate-x-0"
                                }`}
                        >
                            <input
                                type="email"
                                required
                                placeholder="name@email.com"
                                value={email}
                                disabled={status === "loading"}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[60px] pl-6 pr-6 sm:pr-[150px] rounded-[30px] sm:rounded-full outline-none transition-all duration-200 placeholder-zinc-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    color: colors.textMain,
                                    boxShadow: `inset 0 0 0 1px ${colors.inputShadow}`,
                                }}
                            />

                            <div className="relative sm:absolute mt-3 sm:mt-0 sm:top-[6px] sm:right-[6px] sm:bottom-[6px] w-full sm:w-auto h-[60px] sm:h-auto">
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full sm:w-auto h-full px-6 rounded-[30px] sm:rounded-xl font-medium text-white transition-all active:scale-95 hover:scale-[1.02] disabled:hover:scale-100 disabled:active:scale-100 disabled:cursor-wait flex items-center justify-center min-w-[170px]"
                                    style={{
                                        backgroundColor: colors.bluePrimary,
                                        boxShadow: "0 0 20px rgba(91,92,246,0.4)",
                                    }}
                                >
                                    {status === "loading" ? (
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            Get Early Access <span aria-hidden>→</span>
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
