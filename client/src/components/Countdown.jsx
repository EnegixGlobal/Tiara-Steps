import { useEffect, useState } from "react";

const Countdown = () => {
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [countDownDate, setCountDownDate] = useState(getFutureDate().getTime());

  function getFutureDate() {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date().getTime();
      const diff = countDownDate - currentDate;
      if (diff < 0) {
        setCountDownDate(getFutureDate().getTime());
        return;
      }
      const daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hoursRemaining = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutesRemaining = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );
      const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);

      setDays(formatTime(daysRemaining));
      setHours(formatTime(hoursRemaining));
      setMinutes(formatTime(minutesRemaining));
      setSeconds(formatTime(secondsRemaining));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countDownDate]);

  const formatTime = (time) => {
    if (time < 0) {
      return `00`;
    }
    return time < 10 ? `0${time}` : `${time}`;
  };
  return (
    <section className="bg-[#d4b8b8] flex items-center justify-center gap-[clamp(1px,3vw,96px)] min-h-[180px] font-['League_Spartan','Poppins',sans-serif] font-black max-[600px]:gap-0.5 max-[600px]:flex-col max-[600px]:my-5">
      <div className="hidden max-[600px]:block">
        <h1 className="text-center leading-[50px] leading-none text-[clamp(19px,2.5vw,60px)] text-[#1a1a1a]">Make a purchase before </h1>
        <h1 className="text-center leading-[50px] leading-none text-[clamp(19px,2.5vw,60px)] text-[#1a1a1a]">
          and get <span className="text-[#54bab9]">free delivery </span>and{" "}
          <span className="text-[#54bab9]">upto 60% off</span>
        </h1>
      </div>
      <div className="flex justify-around items-center flex-wrap text-[#54bab9] max-[600px]:my-1 max-[600px]:mb-2">
        <div className="text-center flex items-center justify-center flex-col text-[clamp(17px,2.5vw,20px)]">
          <span className="h-[clamp(42px,5vw,70px)] w-[clamp(42px,5vw,70px)] border-2 border-[#54bab9] flex mb-1.5 items-center justify-center font-medium text-[clamp(22px,2vw,40px)] rounded-[10px] pt-1" id="days">{days}</span>
          Days
        </div>
        <h2 className="flex my-5 pb-9 items-center justify-center font-medium text-[clamp(32px,3.5vw,45px)] max-[1000px]:my-1.5 max-[1000px]:pb-7">:</h2>
        <div className="text-center flex items-center justify-center flex-col text-[clamp(17px,2.5vw,20px)]">
          <span className="h-[clamp(42px,5vw,70px)] w-[clamp(42px,5vw,70px)] border-2 border-[#54bab9] flex mb-1.5 items-center justify-center font-medium text-[clamp(22px,2vw,40px)] rounded-[10px] pt-1" id="hours">{hours}</span>
          Hours
        </div>
        <h2 className="flex my-5 pb-9 items-center justify-center font-medium text-[clamp(32px,3.5vw,45px)] max-[1000px]:my-1.5 max-[1000px]:pb-7">:</h2>
        <div className="text-center flex items-center justify-center flex-col text-[clamp(17px,2.5vw,20px)]">
          <span className="h-[clamp(42px,5vw,70px)] w-[clamp(42px,5vw,70px)] border-2 border-[#54bab9] flex mb-1.5 items-center justify-center font-medium text-[clamp(22px,2vw,40px)] rounded-[10px] pt-1" id="min">{minutes}</span>
          Minutes
        </div>
        <h2 className="flex my-5 pb-9 items-center justify-center font-medium text-[clamp(32px,3.5vw,45px)] max-[1000px]:my-1.5 max-[1000px]:pb-7">:</h2>
        <div className="text-center flex items-center justify-center flex-col text-[clamp(17px,2.5vw,20px)]">
          <span className="h-[clamp(42px,5vw,70px)] w-[clamp(42px,5vw,70px)] border-2 border-[#54bab9] flex mb-1.5 items-center justify-center font-medium text-[clamp(22px,2vw,40px)] rounded-[10px] pt-1" id="sec">{seconds}</span>
          Seconds
        </div>
      </div>
      <div className="hidden max-[600px]:block -mt-2.5">
        <h1 className="text-center leading-[50px] leading-none text-[clamp(19px,2.5vw,60px)] text-[#1a1a1a]">
          and get <span className="text-[#54bab9]">free delivery </span>and{" "}
          <span className="text-[#54bab9]">upto 60% off</span>
        </h1>
      </div>
      <div className="max-[600px]:hidden">
        <h1 className="text-center leading-[50px] leading-none text-[clamp(19px,2.5vw,60px)] text-[#1a1a1a]">Make a purchase before </h1>
        <h1 className="text-center leading-[50px] leading-none text-[clamp(19px,2.5vw,60px)] text-[#1a1a1a]">
          and get <span className="text-[#54bab9]">free delivery </span>and{" "}
          <span className="text-[#54bab9]">upto 60% off</span>
        </h1>
      </div>
    </section>
  );
};

export default Countdown;

