import React from "react"
import './ticketInfo.css'
import { useNavigate } from "react-router-dom"

const TicketInfo = () => {
    const navigate = useNavigate();
    
    return (
        <div className="ticketBooking__infoContainer">
            <div className="ticketBooking__infoHeader">
                <h2 className="ticketBooking__theaterName">Filmora Tây Hồ</h2>
                <p className="ticketBooking__screenInfo">Screen 2 - 11/4/2025 - Suất chiếu: 12:00</p>
            </div>

            <div className="ticketBooking__movieInfo">
                <h3 className="ticketBooking__movieTitle">PORORO: THÁM HIỂM ĐẠI DƯƠNG XANH</h3>
            </div>

            <div className="ticketBooking__ticketDetails">
                <div className="ticketBooking__ticketRow">
                    <span className="ticketBooking__ticketLabel">2 x Adult-Stand</span>
                    <span className="ticketBooking__ticketValue">200,000 VND</span>
                </div>
                <div className="ticketBooking__ticketRow">
                    <span className="ticketBooking__seatInfo">C7, C8</span>
                    <span></span>
                </div>
            </div>

            <div className="ticketBooking__totalRow">
                <span className="ticketBooking__totalLabel">Tổng tiền</span>
                <span className="ticketBooking__totalValue">200,000 VND</span>
            </div>

            <div className="ticketBooking__actionButtons">
                <button className="ticketBooking__payButton" onClick={() => navigate('/payTicket')}>Thanh Toán</button>
                <button className="ticketBooking__backButton" onClick={() => navigate('/bookingChair')}>← Trở lại</button>
            </div>
        </div>
    )
}

export default TicketInfo