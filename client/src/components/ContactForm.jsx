import { useState } from "react";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, subject, message } = formData;
      if (!name || !email || !subject || !message) {
        toast.error("Please fill all the fields");
        return;
      }
      const mailtoLink = `mailto:mustak65ee@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        `Hello Mustak,\n\nMy name is ${name} and my email address is ${email}.\n\nI wanted to talk to you about the following:\n\n${message}\n\nLooking forward to hearing from you.\n\nBest Regards,\n${name}`
      )}`;
      window.location.href = mailtoLink;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between my-8 mx-[5%] py-10 px-10 border border-[#e1e1e1] max-[1024px]:p-6">
      <form onSubmit={handleSubmit} className="w-[70%] flex flex-col items-start max-[1024px]:w-full">
        <span className="text-[17px] mb-5 max-[1024px]:text-sm">LEAVE A MESSAGE</span>
        <h2 className="text-[34px] leading-[43px] py-2 m-0 max-[1024px]:text-[25px] max-[1024px]:leading-[34px] max-[1024px]:py-0.5 max-[1024px]:pb-3.5">We love to hear from you</h2>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="font-['League_Spartan','Poppins',sans-serif] text-sm w-full py-3 px-4 mb-5 outline-none border border-[#e1e1e1]"
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="font-['League_Spartan','Poppins',sans-serif] text-sm w-full py-3 px-4 mb-5 outline-none border border-[#e1e1e1]"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="font-['League_Spartan','Poppins',sans-serif] text-sm w-full py-3 px-4 mb-5 outline-none border border-[#e1e1e1]"
        />
        <textarea
          name="message"
          cols="30"
          rows="10"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="font-['League_Spartan','Poppins',sans-serif] text-sm w-full py-3 px-4 mb-5 outline-none border border-[#e1e1e1]"
        ></textarea>
        <button type="submit" className="font-['League_Spartan','Poppins',sans-serif] text-lg font-semibold border border-red-600 text-white bg-red-600 outline-none cursor-pointer py-2.5 px-5">Submit</button>
      </form>
      <div className="font-['Poppins',sans-serif] mt-7 w-[25%] flex justify-center items-start flex-col max-[1024px]:hidden">
        <div className="py-5 flex items-start">
          <img
            src="https://secdatacom.no/wp-content/uploads/sites/3/2019/10/blank-profile-male.jpg"
            alt="profile-photo"
            className="w-[70px] h-[70px] object-cover mr-4 rounded-full"
          />
          <p className="m-0 text-sm leading-[25px]">
            <span className="block text-[17px] font-semibold">Mustak Ansary</span>Software Engineer <br />
            Mustak65ee@gmail.com
          </p>
        </div>
        <div className="py-5 flex items-start">
          <img
            src="https://secdatacom.no/wp-content/uploads/sites/3/2019/10/blank-profile-male.jpg"
            alt="profile-photo"
            className="w-[70px] h-[70px] object-cover mr-4 rounded-full"
          />
          <p className="m-0 text-sm leading-[25px]">
            <span className="block text-[17px] font-semibold">Mustak Ansary</span>Software Engineer <br />
            Mustak65ee@gmail.com
          </p>
        </div>
        <div className="py-5 flex items-start">
          <img
            src="https://secdatacom.no/wp-content/uploads/sites/3/2019/10/blank-profile-male.jpg"
            alt="profile-photo"
            className="w-[70px] h-[70px] object-cover mr-4 rounded-full"
          />
          <p className="m-0 text-sm leading-[25px]">
            <span className="block text-[17px] font-semibold">Mustak Ansary</span>Software Engineer <br />
            Mustak65ee@gmail.com
          </p>
        </div>
        <div className="py-5 flex items-start">
          <img
            src="https://secdatacom.no/wp-content/uploads/sites/3/2019/10/blank-profile-male.jpg"
            alt="profile-photo"
            className="w-[70px] h-[70px] object-cover mr-4 rounded-full"
          />
          <p className="m-0 text-sm leading-[25px]">
            <span className="block text-[17px] font-semibold">Mustak Ansary</span>Software Engineer <br />
            Mustak65ee@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
