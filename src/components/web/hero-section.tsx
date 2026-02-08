import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, Wand2 } from 'lucide-react'
import Plasma from '../Plasma'

const HeroSection = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#6f6f6f"
          speed={0.9}
          direction="forward"
          scale={1.1}
          opacity={1}
          mouseInteractive={true}
        />
      </div>

      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,rgba(0,0,0,0.8)_80%,#000_100%)]" />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl pt-20">
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white  leading-[0.9] mb-8 ">
          Turn the Web into Your <br />
          <span className="bg-linear-to-r from-emerald-400 via-emerald-200 to-indigo-400 bg-clip-text text-transparent">
            Knowledge Engine.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Crawlytics discovers, scrapes, and prioritizes web content using AI.
          Build a permanent library of insights in seconds, not hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
          <Button
            size="lg"
            asChild
            className="h-14 px-8 text-base font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Link to="/login">
              Get Started for Free
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>

        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          {[
            {
              icon: <Wand2 className="size-5 text-emerald-400" />,
              title: 'AI Scrying',
              desc: 'Understand intent, not just keywords.',
            },
            {
              icon: <Sparkles className="size-5 text-indigo-400" />,
              title: 'Auto-Tagging',
              desc: 'Intelligent categorization on the fly.',
            },
            {
              icon: <ArrowRight className="size-5 text-zinc-400" />,
              title: 'Markdown Native',
              desc: 'Perfect for your favorite tools.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all duration-500 will-change-transform"
            >
              <div className="p-2 bg-white/5 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold mb-1">{feature.title}</h3>
              <p className="text-[13px] text-zinc-500 leading-snug">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent z-2" />
    </div>
  )
}

export default HeroSection
