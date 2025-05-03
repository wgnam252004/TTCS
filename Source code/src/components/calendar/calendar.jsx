import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subMonths, addMonths } from 'date-fns';

import './calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>{'<'}</button>
        <h3>{format(currentDate, "MMMM yyyy")}</h3>
        <button onClick={handleNextMonth}>{'>'}</button>
      </div>

      <div className="calendar-days">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-body">
        {rows.map((week, i) => (
          <div key={i} className="week-row">
            {week.map((date, j) => (
              <div
                key={j}
                className={`date-cell ${
                  format(date, "MM") !== format(currentDate, "MM") ? 'dim' : ""
                } ${
                  format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? 'current' : ""
                } ${
                  format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ? 'selected' : ""
                }`}
                onClick={() => setSelectedDate(date)}
              >
                {format(date, "d")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;




