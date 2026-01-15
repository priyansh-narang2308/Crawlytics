import { Zap, Shield, Cpu, Database, Globe, Layers } from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: <Globe className="size-6 text-emerald-400" />,
      title: 'Global Scale Discovery',
      description:
        'Search across the entire web with location-aware agents. From local blogs to global journals, find what matters.',
    },
    {
      icon: <Cpu className="size-6 text-indigo-400" />,
      title: 'AI-Powered Extraction',
      description:
        'Automatically identify authors, publishing dates, and core semantic tags. No manual data entry required.',
    },
    {
      icon: <Zap className="size-6 text-emerald-400" />,
      title: 'Markdown-First',
      description:
        'Clean, beautiful Markdown exports ready for Notion, Obsidian, or feeding your own LLM pipelines.',
    },
    {
      icon: <Shield className="size-6 text-indigo-400" />,
      title: 'Anti-Bot Bypass',
      description:
        'Advanced proxy rotation and header spoofing ensure you never get blocked by sophisticated firewalls.',
    },
    {
      icon: <Database className="size-6 text-emerald-400" />,
      title: 'Permanent Library',
      description:
        'Save content permanently. Even if the original site goes down, your knowledge asset remains available.',
    },
    {
      icon: <Layers className="size-6 text-indigo-400" />,
      title: 'Bulk Processing',
      description:
        'Import 50+ URLs at once. Watch the live progress as our agents crawl and process your queue.',
    },
  ]

  return (
    <section className="bg-black py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">
            Powerful Capabilities
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Everything you need to build a <br />
            <span className="text-zinc-500 italic">world-class</span> knowledge
            base.
          </h3>
          <p className="text-zinc-500 text-lg">
            Crawlytics combines agentic crawling with state-of-the-art AI to
            handle the heavy lifting of research for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-emerald-500/20 hover:bg-zinc-900/60 transition-all duration-500 group"
            >
              <div className="size-12 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-emerald-500/20">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h4>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
