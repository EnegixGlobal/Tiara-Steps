import PropTypes from "prop-types";
import backgroundImage from "../Images/1.jpg";

const Header = (props) => {
  const { text1, text2 } = props.combinedText;
  return (
    <div
      className="text-center flex justify-center items-center flex-col py-[4%] px-[5%] text-white font-['League_Spartan',sans-serif,'Poppins'] max-[771px]:py-[7%] max-[771px]:px-[5%] max-[580px]:py-[7%] max-[580px]:px-[5%] max-[580px]:pb-[9%]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <h1 className="font-black text-[clamp(23px,3.5vw,80px)] font-normal">{text1}</h1>
      <h2 className="text-[22px] font-normal -mt-[17px] max-[771px]:text-xl max-[580px]:text-base max-[580px]:-mt-1.5">{text2}</h2>
    </div>
  );
};

Header.propTypes = {
  combinedText: PropTypes.shape({
    text1: PropTypes.string.isRequired,
    text2: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Header;
