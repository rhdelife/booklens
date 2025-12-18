const ReadingStats = ({ totalBooks = 0, reading = 0, completed = 0 }) => {
  const stats = [
    {
      label: '전체 책 수',
      value: totalBooks,
      color: 'from-brand-400 to-brand-500',
      icon: '📚',
    },
    {
      label: '진행 중',
      value: reading,
      color: 'from-blue-400 to-blue-500',
      icon: '📖',
    },
    {
      label: '완독',
      value: completed,
      color: 'from-green-400 to-green-500',
      icon: '✅',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">{stat.icon}</div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} opacity-20`}></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default ReadingStats




















