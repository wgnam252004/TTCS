import React from 'react';
import Calendar from './calendar/calendar';
import Showtime from './showTime/showtimes';

const ShowtimesCalendar = ({ movieId }) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  return (
    <div className="showtimes-calendar-container">
      <Calendar onDateSelect={setSelectedDate} />
      <Showtime movieId={movieId} selectedDate={selectedDate} />
    </div>
  );
};

export default ShowtimesCalendar;
