import React, { useState } from "react";
import "./join.css";
import professionalsImage from "../assets/join.png";
import { useNavigate } from "react-router-dom";

const JoinUsCard = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("+994");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (value.startsWith("+994")) {
      const prefix = "+994";
      const numbersOnly =
        prefix + value.slice(prefix.length).replace(/\D/g, "");

      if (numbersOnly.length <= 13) {
        setPhoneNumber(numbersOnly);
        setError(null);
      }
    }
  };

  const formatPhoneForApi = (phone) => {
    return phone.replace(/\D/g, "").substring(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 13) {
      setError("Zəhmət olmasa düzgün nömrə daxil edin (+994501234567)");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formattedNumber = formatPhoneForApi(phoneNumber);

      const allowedPrefixes = ["50", "51", "55", "70", "77", "99", "10", "60"];
      const prefixRegex = new RegExp(`^(${allowedPrefixes.join("|")})`);

      if (formattedNumber.length !== 9 || !prefixRegex.test(formattedNumber)) {
        throw new Error(
          "Mobil nömrə düzgün daxil edilməyib. Məsələn: 501234567"
        );
      }

      const response = await fetch(
        "https://api.peshekar.online/api/v1/check-phone/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile_number: formattedNumber }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mobile_number?.[0] || "Xəta baş verdi");
      }

      setIsSent(true);
      navigate(`/register?phone=${formattedNumber}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-us-container">
      <div className="join-us-card">
        <div className="join-us-content">
          <h2 className="join-us-title">
            Aramıza qoşulmağa <br /> nə deyirsən?
          </h2>
          <p className="join-us-description">
            Yüzlərlə peşəkar sırasına sən də qoşul!
          </p>
          <form className="join-us-form" onSubmit={handleSubmit}>
            <input
              placeholder="+994501234567"
              maxLength={13}
              value={phoneNumber}
              onChange={handlePhoneChange}
              type="tel"
              className="phone-input"
              inputMode="numeric"
            />
            {error && <p className="error-message">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || isSent}
              className={`submit-button ${isLoading ? "loading" : ""} ${
                isSent ? "success" : ""
              }`}
            >
              {isLoading ? (
                <span className="button-loader"></span>
              ) : isSent ? (
                "✓ Göndərildi!"
              ) : (
                "Qeydiyyatdan keç"
              )}
            </button>
          </form>
        </div>
        <div className="join-us-image-container">
          <img
            src={professionalsImage}
            alt="Peşəkarlar"
            className="professionals-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default JoinUsCard;
