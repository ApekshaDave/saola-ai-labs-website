import { Shield } from 'lucide-react'

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="animate-spin">
        <Shield size={48} className="text-blue-400" />
      </div>
      <p className="text-slate-400 text-lg">
        Analyzing and simplifying...
      </p>
      <p className="text-slate-500 text-sm">
        This takes about 5-10 seconds
      </p>
    </div>
  )
}

export default LoadingSpinner