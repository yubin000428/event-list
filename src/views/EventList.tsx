import React, { useState, useEffect, ChangeEvent, KeyboardEvent, Fragment } from 'react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [eventNameFilter, setEventNameFilter] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  // 페이지가 로드될 때 한번만 데이터를 가져오도록 useEffect 사용
  useEffect(() => {
    fetch("http://localhost:3001/events")
      .then(res => {
        return res.json();
      })
      .then(data => {
        setEvents(data);
      })
  }, []);

  // 초기화
  function reload() {
    window.location.reload();
  }

  // 수정
  function modEvent(event: Event) {
    console.log(event);
    if (window.confirm("수정 하시겠습니까 ?")){
      window.location.href = `/event/mod/${event.id}`;
    }
  }



  function del(id: number) {
    console.log(id)
    if (window.confirm("삭제 하시겠습니까 ?")){
      fetch(`http://localhost:3001/events/${id}`, {
        method: "DELETE",
      }).then(res => {
        if(res.ok) {
          setEvents(events.filter(event => event.id !== id));
          window.alert("삭제되었습니다 :)");
          window.location.reload();
        }
      })
    }
  }
  
  const handleDateFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDateFilter(value);
    setCurrentPage(1);
  }

  const handleEventNameFilter = () => {
    if (eventNameInput) {
      const { value } = eventNameInput;
      setEventNameFilter(value.toLowerCase());
      setCurrentPage(1);
    }
  }

  // 엔터 눌렀을 때
  const handleEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEventNameFilter();
    }
  }
  
  let filteredEvents = events;
  if (dateFilter) {
    filteredEvents = filteredEvents.filter(event => event.date === dateFilter);
  }
  if (eventNameFilter) {
    filteredEvents = filteredEvents.filter(event => event.name.toLowerCase().includes(eventNameFilter));
  }

  // 데이터를 날짜와 시간 순으로 보이게 하기
  filteredEvents.sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time).getTime();
    const dateB = new Date(b.date + 'T' + b.time).getTime();
    return dateA - dateB;
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  let eventNameInput: HTMLInputElement | null = null;

  

  return (
    <Fragment>
      <div className="container mt-5">
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="dateFilter" className="mr-1">날짜:</label>
            <input type="date" id="dateFilter" value={dateFilter} onChange={handleDateFilter} className="form-control" />
          </div>
          <div className="col-md-3">
            <label htmlFor="eventNameFilter" className="mr-2">이벤트명 검색:</label>
            <input type="text" ref={input => eventNameInput = input} className="form-control" onKeyPress={handleEnterPress} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={handleEventNameFilter}>검색</button>
          </div>
          <div className="col-md-2 justify-content-end">
            <Link to={`/event/add`} className="btn btn-primary">추가</Link>
          </div>
        </div>
        <table className="table table-striped table-bordered mt-3">
        <thead className="thead-dark">
          <tr>
            <th className="text-center" style={{ width: "5%" }}>NO</th>
            <th className="text-center" style={{ width: "15%" }}>이벤트명</th>
            <th className="text-center" style={{ width: "15%" }}>날짜</th>
            <th className="text-center" style={{ width: "10%" }}>시간</th>
            <th className="text-center" style={{ width: "20%" }}>장소</th>
            <th className="text-center" style={{ width: "25%" }}>설명</th>
            <th className="text-center" style={{ width: "10%" }}>삭제/수정</th>
          </tr>
          </thead>
          <tbody>
            {currentEvents.map((event, index) => (
              <tr key={event.id} className="text-center">
                <td className="text-center">{indexOfFirstEvent + index + 1}</td>
                <td className="text-center">{event.name}</td>
                <td className="text-center">{event.date}</td>
                <td className="text-center">{event.time}</td>
                <td className="text-center">{event.location}</td>
                <td className="text-center">{event.description}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => del(event.id)}>삭제</button>
                  <button 
                    onClick={() => modEvent(event)}
                    className="btn btn-primary ml-2"
                    style={{ marginRight: 8 }}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }, (_, i) => (
              <li key={i + 1} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                <span className="page-link">{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default EventList;
