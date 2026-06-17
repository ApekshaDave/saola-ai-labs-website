import { ArrowDown } from 'lucide-react'

function AttackFlow({ steps }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center w-full">

          <div className="w-full bg-slate-700 border border-slate-600
                          rounded-xl p-4 text-center">
            <span className="text-blue-400 font-bold text-sm">
              Step {index + 1}
            </span>
            <p className="text-white mt-1">{step}</p>
          </div>

          {index < steps.length - 1 && (
            <ArrowDown className="text-blue-400 my-1" size={20} />
          )}

        </div>
      ))}
    </div>
  )
}

export default AttackFlow