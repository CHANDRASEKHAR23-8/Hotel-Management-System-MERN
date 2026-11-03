
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  // Database data
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  // Loading and error states
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [roomError, setRoomError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Room form
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [savingRoom, setSavingRoom] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // Guest form
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestAddress, setGuestAddress] = useState("");
  const [savingGuest, setSavingGuest] = useState(false);
  const [guestMessage, setGuestMessage] = useState("");

  // Booking form
  const [selectedGuest, setSelectedGuest] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [savingBooking, setSavingBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // Payment form
  const [paymentBooking, setPaymentBooking] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  // Load rooms
  async function fetchRooms() {
    setLoadingRooms(true);
    setRoomError("");

    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load rooms.");
      }

      setRooms(data);
    } catch (error) {
      setRoomError(error.message);
    } finally {
      setLoadingRooms(false);
    }
  }

  // Load guests
  async function fetchGuests() {
    try {
      const response = await fetch(`${API_URL}/guests`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load guests.");
      }

      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  }

  // Load bookings
  async function fetchBookings() {
    setLoadingBookings(true);
    setBookingError("");

    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Could not load bookings."
        );
      }

      setBookings(data);
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setLoadingBookings(false);
    }
  }

  // Load payments
  async function fetchPayments() {
    setLoadingPayments(true);
    setPaymentError("");

    try {
      const response = await fetch(`${API_URL}/payments`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Could not load payments."
        );
      }

      setPayments(data);
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setLoadingPayments(false);
    }
  }

  // Load initial data
  useEffect(() => {
    fetchRooms();
    fetchGuests();
    fetchBookings();
    fetchPayments();
  }, []);

  // Add room
  async function handleAddRoom(event) {
    event.preventDefault();
    setSavingRoom(true);
    setFormMessage("");

    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: roomNumber.trim(),
          roomType,
          price: Number(price),
          capacity: Number(capacity),
          status: "Available",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Could not add room."
        );
      }

      setFormMessage("Room added successfully!");
      setRoomNumber("");
      setRoomType("Single");
      setPrice("");
      setCapacity("1");

      await fetchRooms();
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      setSavingRoom(false);
    }
  }

  // Add guest
  async function handleAddGuest(event) {
    event.preventDefault();
    setSavingGuest(true);
    setGuestMessage("");

    try {
      const response = await fetch(`${API_URL}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName.trim(),
          phone: guestPhone.trim(),
          email: guestEmail.trim(),
          address: guestAddress.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Could not add guest."
        );
      }

      setGuestMessage("Guest added successfully!");
      setGuestName("");
      setGuestPhone("");
      setGuestEmail("");
      setGuestAddress("");

      await fetchGuests();
    } catch (error) {
      setGuestMessage(error.message);
    } finally {
      setSavingGuest(false);
    }
  }

  // Create booking
  async function handleAddBooking(event) {
    event.preventDefault();
    setSavingBooking(true);
    setBookingMessage("");

    try {
      if (!selectedGuest || !selectedRoom || !checkIn || !checkOut) {
        throw new Error("Please complete all booking fields.");
      }

      if (new Date(checkOut) <= new Date(checkIn)) {
        throw new Error("Check-out must be after check-in.");
      }

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest: selectedGuest,
          room: selectedRoom,
          checkIn,
          checkOut,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Could not create booking."
        );
      }

      setBookingMessage("Booking created successfully!");
      setSelectedGuest("");
      setSelectedRoom("");
      setCheckIn("");
      setCheckOut("");

      await fetchBookings();
      await fetchRooms();
    } catch (error) {
      setBookingMessage(error.message);
    } finally {
      setSavingBooking(false);
    }
  }

  // Create payment
  async function handleAddPayment(event) {
    event.preventDefault();
    setSavingPayment(true);
    setPaymentMessage("");

    try {
      if (!paymentBooking) {
        throw new Error("Please select a booking.");
      }

      const amount = Number(paymentAmount);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Enter a payment amount greater than zero.");
      }

      const response = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking: paymentBooking,
          amount,
          paymentMethod,
          status: paymentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Could not record payment."
        );
      }

      setPaymentMessage("Payment recorded successfully!");
      setPaymentBooking("");
      setPaymentAmount("");
      setPaymentMethod("UPI");
      setPaymentStatus("Pending");

      await fetchPayments();
    } catch (error) {
      setPaymentMessage(error.message);
    } finally {
      setSavingPayment(false);
    }
  }

  // Navigation
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Rooms", icon: "🛏" },
    { name: "Guests", icon: "♙" },
    { name: "Bookings", icon: "▣" },
    { name: "Payments", icon: "₹" },
  ];

  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const selectedRoomDetails = rooms.find(
    (room) => room._id === selectedRoom
  );

  const bookingNights =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const estimatedTotal =
    bookingNights * Number(selectedRoomDetails?.price || 0);

  const today = new Date().toLocaleDateString("en-CA");

  const paidTotal = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const pendingTotal = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">H</span>
          <div>
            <h2>Haven Hotel</h2>
            <p>MANAGEMENT SYSTEM</p>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.name);

                if (item.name === "Rooms") fetchRooms();
                if (item.name === "Guests") fetchGuests();

                if (item.name === "Bookings") {
                  fetchBookings();
                  fetchGuests();
                  fetchRooms();
                }

                if (item.name === "Payments") {
                  fetchPayments();
                  fetchBookings();
                }

                if (item.name === "Dashboard") {
                  fetchRooms();
                  fetchGuests();
                  fetchBookings();
                  fetchPayments();
                }
              }}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <p>Hotel Manager</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Pages / {activePage}</p>
            <h1>{activePage}</h1>
          </div>

          <div className="topbar-right">
            <span className="status-dot"></span>
            System Online
            <div className="top-avatar">A</div>
          </div>
        </header>

        {/* DASHBOARD */}
        {activePage === "Dashboard" ? (
          <>
            <section className="welcome">
              <div>
                <p className="eyebrow">HOTEL OVERVIEW</p>
                <h2>Welcome back, Administrator!</h2>
                <p>Here is what's happening at your hotel today.</p>
              </div>
              <div className="welcome-icon">🏨</div>
            </section>

            <section className="stats-grid">
              <StatCard
                title="Total Rooms"
                value={rooms.length}
                icon="🛏"
                note="Rooms saved in database"
              />
              <StatCard
                title="Available Rooms"
                value={availableRooms}
                icon="🔑"
                note="Ready to book"
              />
              <StatCard
                title="Total Guests"
                value={guests.length}
                icon="♙"
                note="Registered guests"
              />
              <StatCard
                title="Total Bookings"
                value={bookings.length}
                icon="▣"
                note="Bookings saved in database"
              />
              <StatCard
                title="Payments Received"
                value={formatMoney(paidTotal)}
                icon="₹"
                note="Payments marked Paid"
              />
              <StatCard
                title="Pending Payments"
                value={formatMoney(pendingTotal)}
                icon="◷"
                note="Awaiting payment"
              />
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Rooms in Your Hotel</h3>
                    <p>Live data from MongoDB</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => {
                      setActivePage("Rooms");
                      fetchRooms();
                    }}
                  >
                    View rooms →
                  </button>
                </div>

                {loadingRooms ? (
                  <p>Loading rooms...</p>
                ) : roomError ? (
                  <p>{roomError}</p>
                ) : rooms.length === 0 ? (
                  <p>No rooms have been added yet.</p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>ROOM</th>
                          <th>TYPE</th>
                          <th>PRICE / NIGHT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.slice(0, 5).map((room) => (
                          <tr key={room._id}>
                            <td>{room.roomNumber}</td>
                            <td>{room.roomType}</td>
                            <td>{formatMoney(room.price)}</td>
                            <td>
                              <span
                                className={`pill ${
                                  room.status === "Available"
                                    ? "confirmed"
                                    : "pending"
                                }`}
                              >
                                {room.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="panel quick-panel">
                <h3>Quick Actions</h3>
                <p>Common hotel operations</p>

                {["Rooms", "Guests", "Bookings", "Payments"].map(
                  (page) => (
                    <button
                      key={page}
                      className="quick-action"
                      onClick={() => {
                        setActivePage(page);

                        if (page === "Rooms") fetchRooms();
                        if (page === "Guests") fetchGuests();

                        if (page === "Bookings") {
                          fetchBookings();
                          fetchGuests();
                          fetchRooms();
                        }

                        if (page === "Payments") {
                          fetchPayments();
                          fetchBookings();
                        }
                      }}
                    >
                      <span className="quick-icon">＋</span>
                      <span>
                        <strong>
                          {page === "Rooms" ? "Manage Rooms" : page}
                        </strong>
                        <small>Open {page.toLowerCase()} section</small>
                      </span>
                      <span className="arrow">→</span>
                    </button>
                  )
                )}
              </div>
            </section>
          </>
        ) : activePage === "Rooms" ? (
          /* ROOMS */
          <>
            <section className="panel add-room-form">
              <h2>Add New Room</h2>
              <p>Enter the details below to add a room to your hotel.</p>

              <form onSubmit={handleAddRoom}>
                <label htmlFor="roomNumber">Room Number</label>
                <input
                  id="roomNumber"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 104"
                  required
                />

                <label htmlFor="roomType">Room Type</label>
                <select
                  id="roomType"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>

                <label htmlFor="price">Price per Night (₹)</label>
                <input
                  id="price"
                  type="number"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <label htmlFor="capacity">Capacity (guests)</label>
                <input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />

                <button type="submit" disabled={savingRoom}>
                  {savingRoom ? "Saving Room..." : "Add Room"}
                </button>

                {formMessage && <p role="status">{formMessage}</p>}
              </form>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Room Management</h3>
                  <p>Room details loaded from your database</p>
                </div>
                <button className="text-button" onClick={fetchRooms}>
                  ↻ Refresh
                </button>
              </div>

              {loadingRooms ? (
                <p>Loading rooms...</p>
              ) : roomError ? (
                <p role="alert">{roomError}</p>
              ) : rooms.length === 0 ? (
                <p>No rooms found in MongoDB.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ROOM NUMBER</th>
                        <th>ROOM TYPE</th>
                        <th>CAPACITY</th>
                        <th>PRICE / NIGHT</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room) => (
                        <tr key={room._id}>
                          <td>{room.roomNumber}</td>
                          <td>{room.roomType}</td>
                          <td>{room.capacity}</td>
                          <td>{formatMoney(room.price)}</td>
                          <td>
                            <span
                              className={`pill ${
                                room.status === "Available"
                                  ? "confirmed"
                                  : "pending"
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : activePage === "Guests" ? (
          /* GUESTS */
          <>
            <section className="panel add-room-form">
              <h2>Register New Guest</h2>
              <p>Enter the guest details below.</p>

              <form onSubmit={handleAddGuest}>
                <label htmlFor="guestName">Full Name</label>
                <input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />

                <label htmlFor="guestPhone">Phone Number</label>
                <input
                  id="guestPhone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                />

                <label htmlFor="guestEmail">Email</label>
                <input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Enter email address"
                />

                <label htmlFor="guestAddress">Address</label>
                <input
                  id="guestAddress"
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  placeholder="Enter address"
                />

                <button type="submit" disabled={savingGuest}>
                  {savingGuest ? "Saving Guest..." : "Add Guest"}
                </button>

                {guestMessage && <p role="status">{guestMessage}</p>}
              </form>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Guest Management</h3>
                  <p>Guest records from MongoDB</p>
                </div>
                <button className="text-button" onClick={fetchGuests}>
                  ↻ Refresh
                </button>
              </div>

              {guests.length === 0 ? (
                <p>No guests found.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>PHONE</th>
                        <th>EMAIL</th>
                        <th>ADDRESS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr key={guest._id}>
                          <td>{guest.name}</td>
                          <td>{guest.phone}</td>
                          <td>{guest.email || "—"}</td>
                          <td>{guest.address || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : activePage === "Bookings" ? (
          /* BOOKINGS */
          <>
            <section className="panel add-room-form">
              <h2>Create New Booking</h2>
              <p>Select a guest, room, and stay dates.</p>

              <form onSubmit={handleAddBooking}>
                <label htmlFor="bookingGuest">Select Guest</label>
                <select
                  id="bookingGuest"
                  value={selectedGuest}
                  onChange={(e) => setSelectedGuest(e.target.value)}
                  required
                >
                  <option value="">Choose a guest</option>
                  {guests.map((guest) => (
                    <option key={guest._id} value={guest._id}>
                      {guest.name} — {guest.phone}
                    </option>
                  ))}
                </select>

                <label htmlFor="bookingRoom">Select Room</label>
                <select
                  id="bookingRoom"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  required
                >
                  <option value="">Choose an available room</option>
                  {rooms
                    .filter((room) => room.status === "Available")
                    .map((room) => (
                      <option key={room._id} value={room._id}>
                        Room {room.roomNumber} — {room.roomType} —{" "}
                        {formatMoney(room.price)}/night
                      </option>
                    ))}
                </select>

                <label htmlFor="checkIn">Check-in Date</label>
                <input
                  id="checkIn"
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);

                    if (checkOut && e.target.value >= checkOut) {
                      setCheckOut("");
                    }
                  }}
                  required
                />

                <label htmlFor="checkOut">Check-out Date</label>
                <input
                  id="checkOut"
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />

                <div className="booking-total">
                  <p>
                    Number of nights: <strong>{bookingNights}</strong>
                  </p>
                  <h3>Estimated Total: {formatMoney(estimatedTotal)}</h3>
                </div>

                <button
                  type="submit"
                  disabled={
                    savingBooking ||
                    guests.length === 0 ||
                    availableRooms === 0
                  }
                >
                  {savingBooking ? "Saving Booking..." : "Create Booking"}
                </button>

                {bookingMessage && (
                  <p role="status" aria-live="polite">
                    {bookingMessage}
                  </p>
                )}

                {bookingError && <p role="alert">{bookingError}</p>}

                {guests.length === 0 && (
                  <p>Please register a guest before creating a booking.</p>
                )}

                {availableRooms === 0 && (
                  <p>No rooms are currently marked Available.</p>
                )}
              </form>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Booking Management</h3>
                  <p>Bookings saved in MongoDB</p>
                </div>
                <button className="text-button" onClick={fetchBookings}>
                  ↻ Refresh
                </button>
              </div>

              {loadingBookings ? (
                <p>Loading bookings...</p>
              ) : bookingError ? (
                <p role="alert">{bookingError}</p>
              ) : bookings.length === 0 ? (
                <p>No bookings found. Create your first booking above.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>GUEST</th>
                        <th>ROOM</th>
                        <th>CHECK-IN</th>
                        <th>CHECK-OUT</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            {booking.guest?.name || "Guest unavailable"}
                          </td>
                          <td>
                            {booking.room?.roomNumber
                              ? `Room ${booking.room.roomNumber}`
                              : "Room unavailable"}
                          </td>
                          <td>{formatDate(booking.checkIn)}</td>
                          <td>{formatDate(booking.checkOut)}</td>
                          <td>{formatMoney(booking.totalAmount)}</td>
                          <td>
                            <span className="pill confirmed">
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : (
          /* PAYMENTS */
          <>
            <section className="stats-grid">
              <StatCard
                title="Total Payments"
                value={payments.length}
                icon="₹"
                note="Payment records"
              />
              <StatCard
                title="Amount Received"
                value={formatMoney(paidTotal)}
                icon="✓"
                note="Payments marked Paid"
              />
              <StatCard
                title="Pending Amount"
                value={formatMoney(pendingTotal)}
                icon="◷"
                note="Payments marked Pending"
              />
            </section>

            <section className="panel add-room-form">
              <h2>Record New Payment</h2>
              <p>Choose a booking and enter the payment details.</p>

              <form onSubmit={handleAddPayment}>
                <label htmlFor="paymentBooking">Select Booking</label>
                <select
                  id="paymentBooking"
                  value={paymentBooking}
                  onChange={(e) => {
                    const bookingId = e.target.value;
                    setPaymentBooking(bookingId);

                    const booking = bookings.find(
                      (item) => item._id === bookingId
                    );

                    if (booking) {
                      setPaymentAmount(String(booking.totalAmount || ""));
                    } else {
                      setPaymentAmount("");
                    }
                  }}
                  required
                >
                  <option value="">Choose a booking</option>
                  {bookings.map((booking) => (
                    <option key={booking._id} value={booking._id}>
                      {booking.guest?.name || "Guest"} — Room{" "}
                      {booking.room?.roomNumber || "N/A"} —{" "}
                      {formatMoney(booking.totalAmount)}
                    </option>
                  ))}
                </select>

                {bookings.length === 0 && (
                  <p>Create a booking before recording a payment.</p>
                )}

                <label htmlFor="paymentAmount">Payment Amount (₹)</label>
                <input
                  id="paymentAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                  required
                />

                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>

                <label htmlFor="paymentStatus">Payment Status</label>
                <select
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>

                <button
                  type="submit"
                  disabled={savingPayment || bookings.length === 0}
                >
                  {savingPayment ? "Saving Payment..." : "Record Payment"}
                </button>

                {paymentMessage && (
                  <p role="status" aria-live="polite">
                    {paymentMessage}
                  </p>
                )}
              </form>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Payment Records</h3>
                  <p>Payments saved in MongoDB</p>
                </div>
                <button className="text-button" onClick={fetchPayments}>
                  ↻ Refresh
                </button>
              </div>

              {loadingPayments ? (
                <p>Loading payments...</p>
              ) : paymentError ? (
                <p role="alert">{paymentError}</p>
              ) : payments.length === 0 ? (
                <p>No payments recorded yet.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>GUEST</th>
                        <th>ROOM</th>
                        <th>AMOUNT</th>
                        <th>METHOD</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id}>
                          <td>
                            {payment.booking?.guest?.name || "N/A"}
                          </td>
                          <td>
                            {payment.booking?.room?.roomNumber || "N/A"}
                          </td>
                          <td>{formatMoney(payment.amount)}</td>
                          <td>{payment.paymentMethod}</td>
                          <td>{formatDate(payment.paymentDate)}</td>
                          <td>
                            <span
                              className={`pill ${
                                payment.status === "Paid"
                                  ? "confirmed"
                                  : "pending"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN");
}

function StatCard({ title, value, icon, note }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
}

export default App;
