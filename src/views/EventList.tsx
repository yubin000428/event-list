import React, { useState, useEffect, ChangeEvent, KeyboardEvent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import DeleteModal from '../modals/DeleteModal'

interface Event {
  id          : number;
  name        : string;
  date        : string;
  time        : string;
  location    : string;
  description : string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [eventNameFilter, setEventNameFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    // console.log(event);
    if (window.confirm("수정 하시겠습니까 ?")){
      window.location.href = `/event/mod/${event.id}`;
    }
  }

  function del(id: number) {
    // console.log(id)
    fetch(`http://localhost:3001/events/${id}`, {
      method: "DELETE",
    }).then(res => {
      if(res.ok) {
        setEvents(events.filter(event => event.id !== id));
        setShowDeleteModal(false); // 모달 닫기
      }
    })
  }

  const handleDateFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDateFilter(value);
    setCurrentPage(1);
  }

  const handleEventNameFilter = () => {
    if (eventNameInput) {
      const { value } = eventNameInput;

      // 검색어가 두글자 미만이면 alert창
      if (value.length >= 2) {
        setEventNameFilter(value.toLowerCase());
        setCurrentPage(1);
      } else {
        window.alert('검색어는 두글자 이상이어야합니다.')
      }
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
    <div className="container mt-5">
      <div className="row mb-2 align-items-center">
        <div className="col-md-3 mb-3">
          <label htmlFor="dateFilter" className="form-label">날짜</label>
          <input type="date" id="dateFilter" value={dateFilter} onChange={handleDateFilter} className="form-control" />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="eventNameInput" className="form-label mr-2">이벤트명 검색</label>
          <input type="text" id="eventNameInput" ref={input => eventNameInput = input} className="form-control" onKeyPress={handleEnterPress} />
        </div>
        <div className="col-md-2 mb-3">
          <button 
          className="btn btn-primary mt-4" 
          onClick={handleEventNameFilter}
          >검색</button>
        </div>
        <div className="col-md-3 mb-3 d-flex justify-content-end">
          <Link to={`/event/add`} className="btn btn-primary mt-4">이벤트 추가</Link>
        </div>
      </div>
      <div className="table-responsive">
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
                <td className="align-middle">{indexOfFirstEvent + index + 1}</td>
                <td className="align-middle">{event.name}</td>
                <td className="align-middle">{event.date}</td>
                <td className="align-middle">{event.time}</td>
                <td className="align-middle">{event.location}</td>
                <td className="align-middle">{event.description}</td>
                <td className="align-middle">
                  <DeleteModal onDelete={() => del(event.id)} />
                  <button 
                    onClick={() => modEvent(event)}
                    className="btn btn-primary ms-2"
                    style={{ marginTop: 4 }}
                  >
                    수정
                  </button>
                  {/* <DeleteModal 
                    onHide={() => setShowDeleteModal(true)} 
                  /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  );
}

export default EventList;
