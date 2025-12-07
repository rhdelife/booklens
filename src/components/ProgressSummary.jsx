const ProgressSummary = ({ readCount, totalCount }) => {
  const completionRate = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-600">{readCount}</div>
            <div className="text-sm text-gray-600 mt-1">읽은 책</div>
          </div>
          <div className="text-gray-300 text-2xl">/</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700">{totalCount}</div>
            <div className="text-sm text-gray-600 mt-1">전체 책</div>
          </div>
          <div className="text-gray-300 text-2xl">/</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-500">{completionRate}%</div>
            <div className="text-sm text-gray-600 mt-1">완성률</div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-brand-400 to-brand-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressSummary







