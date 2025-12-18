import React from 'react'

const PostingConfirmModal = ({ isOpen, onClose, onConfirm, book }) => {
  if (!isOpen || !book) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center tracking-tight">
            포스팅을 작성하시겠습니까?
          </h2>
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-500 mb-2">선택한 책:</div>
            <div className="font-semibold text-gray-900 text-lg">{book.title}</div>
            <div className="text-sm text-gray-500 mt-1">{book.author}</div>
            {book.completedDate && (
              <div className="text-xs text-gray-400 mt-2">완독일: {book.completedDate}</div>
            )}
          </div>
          <p className="text-gray-500 text-center mb-6 text-sm">
            이 책에 대한 독후감이나 리뷰를 작성하시겠습니까?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-all duration-200 text-sm"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 text-sm"
            >
              포스팅 작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostingConfirmModal

