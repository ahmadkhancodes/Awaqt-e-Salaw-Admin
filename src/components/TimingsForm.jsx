import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { PROFILEAPPROVALCONTEXT } from "../context";

export default function TimingsForm({
  setForm,
  selectedDate,
  form,
  profile,
  setProfile,
  previousDate,
}) {
  const [timingData, setTimingData] = useState({});
  const prayerNames = [
    "Fajar",
    "Shuruq",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
    "Jumua",
  ];
  const db = getFirestore();

  useEffect(() => {
    let timings = profile.timings;
    let data = timings[selectedDate.split("/").join("")];
    let data1 = timings[previousDate.split("/").join("")];
    if (data) {
      data = data?.timings;
      data.jumua = profile?.jumua;
      setTimingData(data);
    } else if (data1) {
      data = data1?.timings;
      data.jumua = profile?.jumua;
      setTimingData(data);
    } else if (profile?.jumua) {
      setTimingData({
        jumua: profile?.jumua,
      });
    } else {
      console.warn("Data not set");
    }
  }, [form]);

  const handleChange = (e) => {
    let temp = { ...timingData };
    temp[e.currentTarget.name] = e.currentTarget.value;
    setTimingData(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uid = profile.id;
    if (Object.keys(timingData).length < 7) {
      return alert("Fill all the fields!");
    }
    let dataTemp = timingData;
    delete dataTemp["jumua"];
    delete dataTemp["date"];
    dataTemp = { timings: dataTemp };
    dataTemp["date"] = selectedDate;
    const timingsDocRef = doc(db, "timings", uid);
    const docRef = doc(db, "users", uid);
    const updateData = {};
    updateData[selectedDate.split("/").join("")] = { ...dataTemp };
    // Returning undefine for juma prayer
    // Throughing error for juma prayer
    updateDoc(timingsDocRef, updateData)
      .then(() => {
        if (timingData.jumua)
          updateDoc(docRef, { jumua: timingData.jumua }).catch((ex) =>
            console.warn("Juma Update Error:" + ex.message)
          );
        setForm(false);
      })
      .catch((ex) => console.warn("Timings Update Error:" + ex.message));
  };

  return (
    <div className="col-12 d-flex flex-column align-items-center justify-content-center">
      <div
        className="btn btn-success align-self-start p-3"
        onClick={() => setForm(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-bar-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"
          />
        </svg>
      </div>
      <h1>
        <b>Date: </b>
        {selectedDate}
      </h1>
      <form
        className="mt-4 d-flex flex-column p-5"
        style={{
          fontSize: 25,
          border: "1px solid black",
          borderRadius: 20,
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="appt">Select the timings for the prayers:</label>

        {prayerNames.map((e, index) => (
          <div key={index} className="mt-2 d-flex justify-content-between">
            <label htmlFor={e}>
              <b>{e}</b>
            </label>
            <input
              type="time"
              id={e.toLowerCase()}
              name={e.toLowerCase()}
              onChange={handleChange}
              value={timingData[e.toLowerCase()]}
            />
          </div>
        ))}

        <input
          type="submit"
          className="btn btn-success px-5 py-2 mt-5"
          style={{ fontSize: 14 }}
        />
      </form>
    </div>
  );
}
