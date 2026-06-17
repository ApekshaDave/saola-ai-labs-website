function RiskBadge({ level }) {
  const colors = {
    Low: 'bg-green-500/20 text-green-400 border-green-500',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500',
    Critical: 'bg-red-500/20 text-red-400 border-red-500'
  }

  const emojis = {
    Low: '🟢',
    Medium: '🟡',
    High: '🟠',
    Critical: '🔴'
  }

  return (
    <span className={`
      inline-flex items-center gap-2 px-4 py-2
      rounded-full border font-bold text-sm
      ${colors[level] || colors.Medium}
    `}>
      {emojis[level]} {level} Risk
    </span>
  )
}

export default RiskBadge