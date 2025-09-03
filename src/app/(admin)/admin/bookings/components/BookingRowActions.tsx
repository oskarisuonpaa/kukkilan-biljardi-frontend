"use client";
const BookingRowActions = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <button type="button" onClick={onDelete} className="danger">
      Poista
    </button>
  );
};

export default BookingRowActions;
