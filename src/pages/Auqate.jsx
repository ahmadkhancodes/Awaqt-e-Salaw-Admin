import React, { useContext, useState } from "react";
import { Calendar } from "react-calendar";
import styled from "styled-components";
import TimingsForm from "../components/TimingsForm";
import "react-calendar/dist/Calendar.css";
// import "./auqate.css";
import { PROFILEAPPROVALCONTEXT } from "../context";
import { getDateInFormat, getPreviousDateInFormat } from "../helperfunctions";

function Auqate({ profile, setProfile }) {
  const [value, onChange] = useState(new Date());
  const [form, setForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [previousDate, setPreviousDate] = useState();
  // const [profile, setProfile] = useContext(PROFILEAPPROVALCONTEXT);

  const handleDayClick = (e) => {
    setSelectedDate(getDateInFormat(e));
    setPreviousDate(getPreviousDateInFormat(e));
    setForm(true);
  };

  const handleTileContent = ({ date, view }) => {
    let color = "tomato",
      timings;
    if (profile.timings && view === "month") {
      timings = profile.timings;
      // checking if there exsist a date in the timings JSON while
      // converting date 3/10/2022 to key 3102022
      if (timings[getDateInFormat(date).split("/").join("")]) {
        color = "teal";
      }
    }
    return view === "month" ? (
      <div style={{ padding: 2, backgroundColor: color }}></div>
    ) : null;
  };

  return (
    <Container>
      <div className="col-12 col-md-8 d-flex flex-row justify-content-center align-self-center mt-5">
        {!form ? (
          <Calendar
            onChange={onChange}
            value={value}
            style={{ height: "100%", width: "100%" }}
            onClickDay={handleDayClick}
            tileContent={handleTileContent}
          />
        ) : (
          <TimingsForm
            setForm={setForm}
            selectedDate={selectedDate}
            form={form}
            profile={profile}
            setProfile={setProfile}
            previousDate={previousDate}
          />
        )}
      </div>
    </Container>
  );
}

export default Auqate;

const Container = styled.div`
  display: flex;
  justify-content: center;
  .react-calendar__month-view__days {
    height: 100% !important;
  }
  .react-calendar {
    width: 100% !important;
    height: 35rem !important;
    font-size: 2rem;
  }
`;
