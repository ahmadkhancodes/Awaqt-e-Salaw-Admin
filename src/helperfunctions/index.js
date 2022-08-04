const formatAMPM = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const nth = (d) => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const getDateInFormat = (e) => {
  const d = new Date(e);
  const mnth = ("" + (d.getMonth() + 1)).slice(-2);
  const day = ("" + d.getDate()).slice(-2);
  return [mnth, day, d.getFullYear()].join("/");
};
const getPreviousDateInFormat = (e) => {
  const d = new Date(e);
  const mnth = ("" + (d.getMonth() + 1)).slice(-2);
  const day = ("" + (d.getDate() - 1)).slice(-2);
  return [mnth, day, d.getFullYear()].join("/");
};
export {
  formatAMPM,
  nth,
  monthNames,
  getDateInFormat,
  getPreviousDateInFormat,
};
