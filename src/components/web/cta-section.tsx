import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

const CTASection = () => {
  return (
    <section className="bg-black py-24 px-4 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/50 border border-white/5 p-12 md:p-24 text-center group">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-indigo-500/10 opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />

          <div className="relative z-10 max-w-3xl mx-auto">
           
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-[1.1]">
              Ready to turn the entire web into your{' '}
              <span className="text-emerald-400 italic">personal library?</span>
            </h2>

            <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
              Join researchers and builders who are saving thousands of hours
              every month. No credit card required, set up in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="h-16 px-10 text-lg font-bold rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Link to="/login">
                  Get Started for Free
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
