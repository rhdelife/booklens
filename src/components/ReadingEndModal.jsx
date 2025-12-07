import React, { useState } from 'react'

const ReadingEndModal = ({ isOpen, onClose, onConfirm, totalPages, currentPage }) => {
  const [pagesRead, setPagesRead] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    const pages = parseInt(pagesRead, 10)
    if (isNaN(pages) || pages < 0) {
      alert('유효한 페이지 숫자를 입력해주세요.')
      return
    }
    if (pages > totalPages) {
      alert(`입력한 페이지 수가 총 페이지 수(${totalPages}페이지)를 초과합니다.`)
      return
    }
    onConfirm(pages)
    setPagesRead('')
  }

  const handleClose = () => {
    setPagesRead('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            읽은 페이지를 입력하세요
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              읽은 페이지 수
            </label>
            <input
              type="number"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder={`총 ${totalPages} 페이지 중...`}
              min="0"
              max={totalPages}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-center text-lg"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              현재까지 읽은 페이지: {currentPage || 0} / {totalPages}
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
            >
              확인
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadingEndModal




