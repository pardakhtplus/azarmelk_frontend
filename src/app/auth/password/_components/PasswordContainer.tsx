"use client";

import { useState } from "react";
import Verify from "./Verify";
import ChangePassword from "./ChangePassword";
import PhoneNumber from "./PhoneNumber";

export default function PasswordContainer() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState("");

  const onLogin = ({ phoneNumber }: { phoneNumber: string }) => {
    setPhoneNumber(phoneNumber);
  };

  return (
    <>
      {isVerified ? (
        <ChangePassword
          phoneNumber={phoneNumber}
          setIsVerified={setIsVerified}
          token={token}
        />
      ) : phoneNumber ? (
        <Verify
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setIsVerified={setIsVerified}
          setToken={setToken}
        />
      ) : (
        <PhoneNumber onLogin={onLogin} />
      )}
    </>
  );
}
