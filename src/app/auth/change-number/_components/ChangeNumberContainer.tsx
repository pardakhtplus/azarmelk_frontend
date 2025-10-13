"use client";

import { useState } from "react";
import PhoneNumber from "./PhoneNumber";
import Verify from "./Verify";

export default function ChangeNumberContainer() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const onLogin = ({ phoneNumber }: { phoneNumber: string }) => {
    setPhoneNumber(phoneNumber);
  };

  return (
    <>
      {phoneNumber ? (
        <Verify phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
      ) : (
        <PhoneNumber onLogin={onLogin} />
      )}
    </>
  );
}
