const RoomItem = ({ room, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(room)}
    className="w-72 rounded-3xl bg-blue-600 px-8 py-6 text-xl font-semibold text-white shadow-xl transition hover:bg-blue-700"
  >
    {room.name}
  </button>
)

export default RoomItem
