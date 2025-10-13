"use client";

import Login from "./Login";
import { useState } from "react";
import Verify from "./Verify";
import CreateAccount from "./CreateAccount";
import Password from "./Password";

export default function AuthContainer() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isExisted, setIsExisted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [token, setToken] = useState("");

  const onLogin = ({ phoneNumber }: { phoneNumber: string }) => {
    setPhoneNumber(phoneNumber);
  };

  return (
    <>
      {isVerified && !isExisted ? (
        <CreateAccount
          phoneNumber={phoneNumber}
          setIsVerified={setIsVerified}
          token={token}
        />
      ) : phoneNumber && isPasswordSet ? (
        <Password
          phoneNumber={phoneNumber}
          setIsPasswordSet={setIsPasswordSet}
          setIsVerified={setIsVerified}
          isExisted={isExisted}
          setToken={setToken}
        />
      ) : phoneNumber ? (
        <Verify
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setIsVerified={setIsVerified}
          isExisted={isExisted}
          setToken={setToken}
        />
      ) : (
        <Login
          onLogin={onLogin}
          setIsExisted={setIsExisted}
          setIsPasswordSet={setIsPasswordSet}
        />
      )}
    </>
  );
}
