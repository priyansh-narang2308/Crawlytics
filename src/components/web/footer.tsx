import { Link } from '@tanstack/react-router'
import { CrawlyticsIcon } from '../icons/logo'

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="text-white font-bold text-lg flex justify-center gap-2 tracking-tight">
          <CrawlyticsIcon className="size-7 text-orange-400" />
          Crawlytics
        </Link>

        <p className="text-zinc-500 text-sm text-center md:text-right">
          © 2026 Crawlytics. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
