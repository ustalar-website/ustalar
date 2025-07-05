import React, { useState, useEffect } from "react";
import { InfoCards } from "../profil";
import axios from "axios";
import ReviewDisplay from "../components/review";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import ReviewProfession from "../components/review-profession";

const ProfileHeader = ({ data, socialLinks }) => {
    
  return (
    <>
      <div className="flex m-auto">
        <div className=" w-[40%]">
          <div className=" text-center  mt-[-75px]  flex flex-col items-start box-border relative">
            <div className="relative w-[32%] flex flex-end m-auto">
              <img  
                src="/Confirmed.svg"
                alt=""
                className="absolute right-0 top-0"
              />
              {data?.profile_image ? (
                <img
                  src={data.profile_image}
                  alt="Profile"
                  className="w-40 h-40 rounded-full p-2 bg-white mx-auto object-cover"
                />
              ) : (
                <p>Şəkil tapılmadı</p>
              )}{" "}
              {console.log("Tam response: ", data)}
            </div>
            <div className=" w-[70%] m-auto text-left">
              <h2 className="text-[35px] font-semibold  text-cyan-900">
                {data?.full_name} {"- "}
                <span className="text-gray-600">
                  {data?.education_speciality}
                </span>
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-2xl">ID:</span> {data?.id}
              </p>
              <div className="flex items-start justify-center w-[40%] rounded-2xl hover:scale-110 p-1 transition-transform duration-300 shadow-md gap-1 mt-4 ">
                {socialLinks.map((item, index) => {
                  return (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 flex items-center justify-center hover:scale-110`}
                    >
                      <i
                        className={`text-xl ${item.icon} ${
                          item.icon.includes("facebook")
                            ? "text-blue-600"
                            : item.icon.includes("instagram")
                            ? "text-fuchsia-600"
                            : item.icon.includes("tiktok")
                            ? "text-black drop-shadow-[0_1px_2px_white]"
                            : "text-blue-500"
                        }`}
                      ></i>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="   mt-6 w-[55%]">
          <h2 className="text-2xl text-cyan-900 flex  font-semibold mt-3">
            <img
              src="../public/stickynote.svg"
              alt=""
              className="text-[25px] mr-2"
            />
            Haqqında
          </h2>
          <p className="bg-blue-50 p-4 rounded-lg text-gray-700 mt-2">
            {data?.note}
          </p>
        </div>
      </div>
      <hr className="mt-8 border-cyan-900 " />
    </>
  );
};

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const { masterId } = useParams();

  const fetchProfessional = async () => {
    try {
      const response = await axios.get(
        `https://api.peshekar.online/api/v1/professionals/${masterId}/`
      );
      setData(response.data);
      setSocialLinks(
        [
          {
            icon: "fa-brands fa-facebook",
            link: response.data.facebook,
          },
          {
            icon: "fa-brands fa-instagram",
            link: response.data.instagram,
          },
          {
            icon: "fa-brands fa-tiktok",
            link: response.data.tiktok,
          },
          {
            icon: "fa-brands fa-linkedin",
            link: response.data.linkedin,
          },
        ].filter((item) => item.link)
      );
    } catch (error) {
      console.error("Xəta baş verdi:", error);
    }
  };

  useEffect(() => {
    if(masterId){
      fetchProfessional();
    }
  }, [masterId]);

  return (
    <div className=" h-full">
      <div className="relative  overflow-hidden">
        <img
          src="/profilpage.svg"
          alt="Banner"
          className="w-full object-contain"
        />
      </div>

      <ProfileHeader data={data} socialLinks={socialLinks} />
      <InfoCards profileData={data} isUseFor="User Profile" />
      <hr className="mt-8 border-cyan-900 " />
      <ReviewProfession />
      <Footer />
    </div>
  );
};

export default ProfilePage;
