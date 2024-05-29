import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

interface EventDetail {
  id          : number;
  name        : string;
  date        : string;
  time        : string;
  location    : string;
  description : string;
}

const EventMod = () => {
  const { id } = useParams(); // useParams()에서 직접 id를 추출

  const [event, setEvent] = useState<EventDetail>({
    id: 0,
    name: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/events/${id}`)
        .then((res) => {
          setEvent(res.data);
        })
        .catch(function (err) {
          console.error("이벤트를 불러오는 동안 오류가 발생했습니다.", err);
        });
    }
  }, [id]); // id가 변경될 때마다 useEffect가 다시 실행됨

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent(prevEvent => ({
      ...prevEvent,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm(id ? '이벤트를 수정하시겠습니까?' : '새로운 이벤트를 추가하시겠습니까 ?')) {
      const eventData = {
        name: event.name,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description
      };

      if (id) {
        // 기존 이벤트 수정
        axios.put(`http://localhost:3001/events/${id}`, eventData)
          .then(() => {
            window.alert("이벤트가 성공적으로 수정되었습니다:)");
            window.location.href = '/event/list';
          })
          .catch(error => {
            console.error("error", error);
            window.alert("이벤트를 수정하는 동안 오류가 발생했습니다.");
          });
      } else {
        // 새 이벤트 추가
        axios.post(`http://localhost:3001/events`, eventData)
          .then((res) => {
            const newId = res.data.id; // 새 이벤트의 ID를 가져옴
            window.alert("새 이벤트가 추가되었습니다 :)");
            window.location.href = '/event/list';
          })
          .catch(error => {
            console.error("error", error);
            window.alert("새 이벤트를 추가하는 동안 오류가 발생했습니다.");
          });
      }
    }
  };

  const { name, date, time, location, description } = event;

  return (
    <div className="container mt-5">
      <h2>{id ? 'Event 수정' : 'Event 추가'}</h2>
      <hr className="my-10" />
      &nbsp;
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">이벤트명</label>
          <input type="text" className="form-control" id="name" name="name" value={name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">날짜</label>
          <input type="date" className="form-control" id="date" name="date" value={date} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">시간</label>
          <input type="time" className="form-control" id="time" name="time" value={time} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">장소</label>
          <input type="text" className="form-control" id="location" name="location" value={location} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">설명</label>
          <textarea className="form-control" id="description" name="description" value={description} onChange={handleChange} />
        </div>
        <div className="d-flex justify-content-end">
          <Link
            to={`/event/list`}
            className="btn btn-secondary"
            style={{ marginRight: 8 }}
          >
            목록
          </Link>
          <button type="submit" className="btn btn-primary">
            {id ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventMod;
