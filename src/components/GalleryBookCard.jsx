import { useNavigate } from 'react-router-dom'

const GalleryBookCard = ({ book }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/book/${book.id}`)
  }

  const handleTouchEnd = (e) => {
    e.stopPropagation()
    // 터치 이벤트가 즉시 반응하도록 preventDefault는 선택적으로
    if (e.cancelable) {
      e.preventDefault()
    }
    handleClick()
  }

  return (
    <div
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className="relative cursor-pointer transition-all duration-300 ease-out group z-10 hover:z-20 hover:scale-105 w-full"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto' }}
    >
      <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-white">
        <img
          src={book.thumbnail || `https://via.placeholder.com/200x300/22c55e/ffffff?text=${encodeURIComponent(book.title.charAt(0))}`}
          alt={book.title}
          className={`w-full h-full object-cover transition-all duration-300 ease-out ${book.isRead ? 'grayscale-0' : 'grayscale-[85%]'
            } group-hover:grayscale-0`}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/200x300/22c55e/ffffff?text=${encodeURIComponent(book.title.charAt(0))}`
          }}
        />
      </div>

      {/* Optional: Title overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-end justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="text-white text-xs font-medium mb-2 px-2 text-center line-clamp-2">
          {book.title}
        </div>
      </div>
    </div>
  )
}

export default GalleryBookCard


