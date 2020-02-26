import "!style-loader!css-loader!./BaseDatePicker.css";
import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import BaseBtn from "../../common/BaseBtn/BaseBtn.jsx";
import "!style-loader!css-loader!react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import SecundaryBtn from "../BaseBtn/SecundaryBtn.jsx";
registerLocale("es", es);

export default function BaseDatePicker(props) {
  const [startDate, setStartDate] = useState(new Date());

  const DateBtn = ({ value, onClick }) => (
    <SecundaryBtn onClick={onClick}>{value}</SecundaryBtn>
  );

  useEffect(() => {
    props.onChange(startDate);
  }, [startDate]);

  const onChange = date => {
    setStartDate(date);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={date => onChange(date)}
      customInput={<DateBtn />}
      locale="es"
      dateFormat="dd/MM/yyyy"
    />
  );
}
