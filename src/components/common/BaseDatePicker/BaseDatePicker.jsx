import "!style-loader!css-loader!./BaseDatePicker.css";
import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import BaseBtn from "../../common/BaseBtn/BaseBtn.jsx";
import "!style-loader!css-loader!react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es"; // the locale you want
registerLocale("es", es);

export default function BaseDatePicker(props) {
  const [startDate, setStartDate] = useState(new Date());

  const ExampleCustomInput = ({ value, onClick }) => (
    <BaseBtn className={"datePicker-input"} onClick={onClick}>
      {value}
    </BaseBtn>
  );

  return (
    <DatePicker
      selected={startDate}
      onChange={date => setStartDate(date)}
      customInput={<ExampleCustomInput />}
      locale="es"
    />
  );
}
