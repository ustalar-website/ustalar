import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import {
  MdWorkOutline,
  MdCalendarToday,
  MdOutlineLocationOn,
  MdSchool,
  MdPerson,
  MdBusinessCenter,
  MdTranslate,
  MdOutlineLocalPhone,
  MdLogout,
  MdOutlineSchool,
} from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { IoBuildOutline } from "react-icons/io5";
import { BsCake, BsGenderMale } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";

export default function ProfilePage() {
  const [profileprofileData, setProfileprofileData] = useState({
    id: 0,
    password: "",
    is_superuser: false,
    first_name: "",
    last_name: "",
    birth_date: "",
    mobile_number: "",
    gender: "",
    experience_years: 0,
    education: "0",
    education_speciality: "",
    profile_image: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    note: "",
    is_active: true,
    is_staff: false,
    created_at: "",
    updated_at: "",
    profession_area: 0,
    profession_speciality: 0,
    cities: [0, 0],
    languages: [],
    work_images: [],
  });
  const [socialLinks, setSocialLinks] = useState([]);
  useEffect(() => {
    getProfile();
  }, []);
  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    console.log("Profil məlumatları:", profileprofileData);
  }, [profileprofileData]);

  const getProfile = () => [
    axios
      .get("https://api.peshekar.online/api/v1/profile/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setProfileprofileData(response.data);
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
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      }),
  ];

  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImage = (url) => {
    setSelectedImageUrl(url);
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  };

  const handleCloseImage = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };
  const ProfileHeader = ({ profileData }) => (
    <div className="text-center w-max m-auto flex flex-col items-end box-border relative">
      <div className="relative w-[80%] flex flex-end m-auto">
        <img
          src=".././public/Confirmed.svg"
          alt=""
          className="absolute right-0 top-0"
        />
        <img
          src={
            profileData?.profile_image
              ? profileData.profile_image
              : "./src/assets/profil.png"
          }
          alt="Profile"
          onClick={() => handleImage(profileData.profile_image)}
          className="w-38 h-38 rounded-full mx-auto object-cover"
        />
      </div>
      <div className="text-center w-[100%]">
        <h2 className="text-[35px] font-semibold m-4 text-cyan-900">
          {profileData.full_name}
        </h2>
        <p className="text-sm text-center w-[100%] text-gray-600 m">
          ID: {profileData.id}
        </p>
      </div>

      <div className="flex items-center justify-center rounded-2xl hover:scale-110 p-1 transition-transform duration-300 shadow-md gap-1 mt-4 mx-auto">
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
  );

  const Gallery = ({ profileData }) => {
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = (url) => {
      setSelectedImageUrl(url);
      document.body.style.overflow = "hidden";
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    };

    const images = profileData?.work_images || [];
    const cleanedSrc = selectedImageUrl.replace(/^İş Şəkli\s*/, "");

    return (
      <div className="m-6">
        <h3 className="text-[30px] m-5 font-semibold leading-tight text-cyan-900">
          Gördüyünüz işlər
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 ml-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="w-full aspect-square overflow-hidden rounded-2xl cursor-pointer transition hover:scale-105"
              onClick={() => handleImageClick(src)}
            >
              <img
                src={src.replace("İş Şəkli ", "")}
                alt={`İş ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl p-4 shadow-lg max-w-[90%] max-h-[90%]"
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              <img
                src={cleanedSrc}
                alt="Böyük şəkil"
                className="w-full h-[80vh] rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const AboutSection = ({ profileData }) => (
    <div className="bg-gray-50 p-4 mt-[50px] rounded-xl shadow-md">
      <h3 className=" flex  text-2xl m-3 font-semibold text-cyan-900">
        <img
          src="../public/stickynote.svg"
          alt=""
          className="text-[25px] mr-2"
        />
        Haqqınızda
      </h3>
      <p className="bg-white p-3  rounded-xl text-[16px] text-cyan-900 font-sans">
        {profileprofileData.note}
      </p>
    </div>
  );
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <ProfileHeader profileData={profileprofileData} />
        <InfoCards profileData={profileprofileData} isUseFor="Profile" />
        <Gallery profileData={profileprofileData} />
        <AboutSection profileData={profileprofileData} />
      </main>
      {isModalOpen && (
        <div
          onClick={handleCloseImage}
          className="fixed inset-0  flex justify-center  z-50 bg-black/30 backdrop-blur-sm "
        >
          <div
            className={`w-[500px] h-[500px] bg-blue-100 mx-[60px] ml-[300px] my-auto relative p-2 rounded-full shadow-sm transition-colors duration-200 `}
          >
            <div className="mb-2 h-[100%] w-[100%]">
              <img
                src={selectedImageUrl}
                className="h-[100%] w-[100%] rounded-full"
                alt=""
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const InfoCards = ({ profileData, isUseFor }) => {
  const [isMoreLocation, setIsMoreLocation] = useState(false);

  return (
    <div className="grid gap-10 grid-cols-1 p-3 m-6 md:grid-cols-3">
      <div
        className={` p-6 rounded-xl space-y-5 ${
          isUseFor === "User Profile" ? "" : "bg-blue-50 shadow-md"
        }`}
      >
        {isUseFor !== "User Profile" && (
          <h3 className="flex items-center text-lg font-semibold text-cyan-900 mb-4">
            <MdPerson className="mr-2 text-4xl" /> Şəxsi Məlumatlar
          </h3>
        )}

        {isUseFor == "User Profile" && (
          <p className="flex gap-2 text-sm">
            <MdOutlineLocationOn className="text-cyan-600 text-[25px] mt-1" />
            <span className="flex flex-col">
              <span className="text-gray-500">Fəaliyyət göstərdiyi ərazi:</span>
              {profileData?.cities?.length > 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData?.cities?.slice(0, 2).join(", ")}
                  {!isMoreLocation ? (
                    <span
                      className="text-cyan-400 cursor-pointer"
                      onClick={() => setIsMoreLocation(true)}
                    >
                      {" "}
                      daha çox...
                    </span>
                  ) : (
                    <>
                      {", "}
                      {profileData?.cities?.slice(2).join(", ")}
                    </>
                  )}
                </span>
              )}

              {profileData?.cities?.length <= 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData.cities}
                </span>
              )}
            </span>
          </p>
        )}
        <p className="flex gap-2 text-sm">
          <MdOutlineLocalPhone className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Mobil nömrə:</span>
            <span className="font-semibold text-cyan-900 text-[16px] ">
              +994{profileData?.mobile_number}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <BsCake className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Doğum tarixi:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.birth_date}
            </span>
          </span>
        </p>
        {isUseFor !== "User Profile" && (
          <p className="flex gap-2 text-sm">
            <BsGenderMale className="text-cyan-600 text-[25px] mt-1" />
            <span className="flex flex-col">
              <span className="text-gray-500">Cins:</span>
              <span className="font-semibold text-cyan-900 text-[16px]">
                {profileData?.gender}
              </span>
            </span>
          </p>
        )}
      </div>

      <div
        className={` p-6 rounded-xl space-y-5 ${
          isUseFor === "User Profile" ? "" : "bg-blue-50 shadow-md"
        }`}
      >
        {isUseFor !== "User Profile" && (
          <h3 className="flex items-center text-lg font-semibold text-cyan-900 mb-4">
            <MdBusinessCenter className="mr-2 text-4xl" /> Peşə Məlumatları
          </h3>
        )}

        <p className="flex gap-2 text-sm">
          <IoBuildOutline className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Peşə sahəsi:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.profession_area}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <MdWorkOutline className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Peşə ixtisası:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.profession_speciality}
            </span>
          </span>
        </p>
        <p className="flex gap-2 text-sm">
          <MdCalendarToday className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">İş təcrübəsi:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.experience_years}
            </span>
          </span>
        </p>
        {isUseFor == "Profile" && (
          <p className="flex gap-2 text-sm">
            <MdOutlineLocationOn className="text-cyan-600 text-[25px] mt-1" />
            <span className="flex flex-col">
              <span className="text-gray-500">Fəaliyyət göstərdiyi ərazi:</span>
              {profileData?.cities?.length > 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData?.cities?.slice(0, 2).map((city, index) => (
                    <span key={index}>
                      {city}
                      {index < profileData?.cities?.slice(0, 2).length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))}
                  {!isMoreLocation ? (
                    <span
                      className="text-cyan-400 cursor-pointer"
                      onClick={() => setIsMoreLocation(true)}
                    >
                      {" "}
                      daha çox...
                    </span>
                  ) : (
                    <>
                      {", "}
                      {profileData?.cities?.slice(2).map((city, index) => (
                        <span key={index}>
                          {city}
                          {index < profileData?.cities?.slice(2).length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </>
                  )}
                </span>
              )}
              {profileData?.cities?.length <= 2 && (
                <span className="font-semibold text-cyan-900 text-[16px]">
                  {profileData?.cities?.map((city, index) => (
                    <span key={index}>
                      {city}
                      {index < profileData?.cities?.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </p>
        )}
      </div>

      <div
        className={` p-6 rounded-xl space-y-5 ${
          isUseFor === "User Profile" ? "" : "bg-blue-50 shadow-md"
        }`}
      >
        {isUseFor !== "User Profile" && (
          <h3 className="flex items-center text-lg font-semibold text-cyan-900 mb-4">
            <MdSchool className="mr-2 text-4xl" /> Təhsil və Bacarıqlar
          </h3>
        )}

        <p className="flex gap-2 text-sm">
          <FaUniversity className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500">Təhsil:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.education === "0"
                ? "Yoxdur"
                : profileData?.education}
            </span>
          </span>
        </p>

        {profileData?.education && profileData?.education !== "0" && (
          <p className="flex gap-2 text-sm">
            <MdOutlineSchool className="text-cyan-600 text-[25px] mt-1" />
            <span className="flex flex-col">
              <span className="text-gray-500">Təhsil ixtisası:</span>
              <span className="font-semibold text-cyan-900 text-[16px]">
                {profileData?.education_speciality || "Yoxdur"}
              </span>
            </span>
          </p>
        )}
        <p className="flex gap-2 text-sm">
          <MdTranslate className="text-cyan-600 text-[25px] mt-1" />
          <span className="flex flex-col">
            <span className="text-gray-500 ">Dil bilikləri:</span>
            <span className="font-semibold text-cyan-900 text-[16px]">
              {profileData?.languages?.join(", ")}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
};
