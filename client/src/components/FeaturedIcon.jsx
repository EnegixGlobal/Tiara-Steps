import React from "react";
const features = [
  {
    imgSrc:
      "https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/70/null/external-quality-logistic-delivery-kiranshastry-lineal-kiranshastry.png",
    text: "100% ORIGINAL GUARANTEE",
  },
  {
    imgSrc: "https://img.icons8.com/ios/64/null/security-checked--v1.png",
    text: "100% SECURE PAYMENT",
  },
  {
    imgSrc:
      "https://img.icons8.com/external-konkapp-detailed-outline-konkapp/74/null/external-fast-delivery-logistic-and-delivery-konkapp-detailed-outline-konkapp.png",
    text: "DELIVERY WITHIN 48 HOURS",
  },
  {
    imgSrc:
      "https://img.icons8.com/external-victoruler-outline-victoruler/64/null/external-return-box-logistics-victoruler-outline-victoruler.png",
    text: "RETURN WITHIN 30 DAYS",
  },
];

const FeaturedIcon = () => {
  return (
    <section className="flex flex-wrap justify-around items-center text-center bg-[#d4b8b8] min-h-[170px] py-5 px-[60px] max-[700px]:gap-3 max-[700px]:py-2.5 max-[700px]:px-1 max-[415px]:justify-evenly max-[415px]:gap-0">
      {features.map((feature, index) => (
        <div key={index} className="flex justify-center items-center flex-col py-2.5">
          <div className="w-[clamp(38px,10vw,70px)] aspect-square mx-auto">
            <img src={feature.imgSrc} className="w-full aspect-square object-cover mx-auto" alt={feature.text} />
          </div>
          <div className="w-full mx-auto mt-2.5 leading-none">
            <h5 className="font-['League_Spartan','Poppins',sans-serif] text-[clamp(12px,2.2vw,16px)] font-semibold">{feature.text}</h5>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturedIcon;
