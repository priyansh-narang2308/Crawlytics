export const CrawlyticsIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />

      <circle cx="24" cy="24" r="4" fill="currentColor" />

      <path
        d="M24 8V16M24 32V40M8 24H16M32 24H40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M13 13L18 18M30 30L35 35M13 35L18 30M30 18L35 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}
