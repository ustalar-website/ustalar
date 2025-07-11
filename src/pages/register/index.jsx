
import { useNavigate, Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { az } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitySelectionPopup from "../../components/CitySelectionPopup";
import ImageEditor from "../../components/ImageEditor";
import axios from "axios";
import { format, subYears, isValid, parseISO } from "date-fns";
import Swal from "sweetalert2";
import backgroundPng from "../../assets/background.png";
import Footer from "../../components/Footer";

const cities = [
  "Ağcabədi",
  "Ağdam",
  "Ağdaş",
  "Ağdərə",
  "Ağstafa",
  "Ağsu",
  "Astara",
  "Babək",
  "Balakən",
  "Bakı",
  "Gədəbəy",
  "Gəncə",
  "Goranboy",
  "Göygöl",
  "Göyçay",
  "Hacıqabul",
  "Xaçmaz",
  "Xankəndi",
  "Xocalı",
  "Xocavənd",
  "Qobustan",
  "Quba",
  "Qubadlı",
  "Qusar",
  "Saatlı",
  "Sabirabad",
  "Salyan",
  "Samux",
  "Sədərək",
  "Siyəzən",
  "Şabran",
  "Şamaxı",
  "Şəki",
  "Şəmkir",
  "Şərur",
  "Şuşa",
  "Tərtər",
  "Tovuz",
  "Ucar",
  "Yevlax",
  "Zaqatala",
  "Zəngilan",
  "Zərdab",
];

function Register() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formDataErrors, setFormDataErrors] = useState({});
  const [catagories, setCatagories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [otherServiceId, setOtherServiceId] = useState(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);

  const getCatagories = useCallback(() => {
    axios
      .get("https://api.peshekar.online/api/v1/categories/")
      .then((response) => {
        setCatagories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const getServices = useCallback(() => {
    if (!selectedCategory) return;
    axios
      .get(
        `https://api.peshekar.online/api/v1/category/${selectedCategory.id}/services/`
      )
      .then((response) => {
        const fetchedServices = response.data;
        const otherService = fetchedServices.find(
          (item) =>
            item.display_name.toLowerCase().includes("digər") ||
            item.display_name.toLowerCase() === "Digər"
        );
        if (otherService) {
          setOtherServiceId(otherService.id);
          setServices(
            fetchedServices.filter((item) => item.id !== otherService.id)
          );
        } else {
          setOtherServiceId(null);
          setServices(fetchedServices);
        }
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, [selectedCategory]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: null,
    mobile_number: "",
    password: "",
    password2: "",
    gender: "",
    profession_area: "",
    profession_speciality: "",
    experience_years: "",
    cities: [],
    education: "",
    educationField: "",
    languages: [],
    profile_image: null,
    socialLinks: {
      facebook: "",
      instagram: "",
      tiktok: "",
      linkedin: "",
    },
    work_images: [],
    about: "",
    custom_profession: "",
  });

  const educationOptions = [
    { id: 1, label: "Tam ali" },
    { id: 2, label: "Natamam ali" },
    { id: 3, label: "Orta" },
    { id: 4, label: "Peşə təhsili" },
    { id: 5, label: "Orta ixtisas təhsili" },
    { id: 0, label: "Yoxdur" },
  ];

  const [socialMediaLinks, setSocialMediaLinks] = useState({
    Facebook: "",
    Instagram: "",
    TikTok: "",
    LinkedIn: "",
  });

  const handleSocialMediaLinksValue = (e) => {
    const { name, value } = e.target;
    setSocialMediaLinks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageChange = (e) => {
    const value = Number.parseInt(e.target.value);
    const isChecked = e.target.checked;
    setFormData((prevData) => {
      let updatedLanguages = [...prevData.languages];
      if (isChecked) {
        if (!updatedLanguages.includes(value)) {
          updatedLanguages.push(value);
        }
      } else {
        updatedLanguages = updatedLanguages.filter((id) => id !== value);
      }
      return { ...prevData, languages: updatedLanguages };
    });
  };

  const [showPopup, setShowPopup] = useState(false);
  const openPopup = () => {
    setShowPopup(true);
    document.body.style.overflow = "hidden";
  };
  const closePopup = () => {
    setShowPopup(false);
    document.body.style.overflowY = "auto";
  };

  const languageOptions = [
    { id: 1, label: "Azərbaycan" },
    { id: 2, label: "İngilis" },
    { id: 3, label: "Rus" },
    { id: 4, label: "Türk" },
  ];

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageToEdit(file);
      setShowEditor(true);
    }
  };

  const handleImageEditorDelete = () => {
    setFormData((prev) => ({ ...prev, profile_image: null }));
    setImageToEdit(null);
    setShowEditor(false);
  };

  const handleImageEditorSave = (editedFile) => {
    setFormData((prev) => ({ ...prev, profile_image: editedFile }));
    setImageToEdit(null);
    setShowEditor(false);
  };

  const handleImageEditorCancel = () => {
    setImageToEdit(null);
    setShowEditor(false);
  };

  const handlePortfolioChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      work_images: [...prev.work_images, ...files].slice(0, 10),
    }));
  };

  const handleRemoveWorkImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      work_images: prev.work_images.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleDragStart = (e, index) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = draggedImageIndex;
    if (dragIndex === null || dragIndex === dropIndex) {
      setDraggedImageIndex(null);
      return;
    }
    const newWorkImages = [...formData.work_images];
    const [draggedItem] = newWorkImages.splice(dragIndex, 1);
    newWorkImages.splice(dropIndex, 0, draggedItem);
    setFormData((prev) => ({
      ...prev,
      work_images: newWorkImages,
    }));
    setDraggedImageIndex(null);
  };

  const isEmpty = (v) => {
    if (v === null || v === undefined) return true;
    if (typeof v === "string") return v.trim() === "";
    if (Array.isArray(v)) return v.length === 0;
    return false;
  };

  const regexps = (name) => {
    if (name === "first_name" || name === "last_name") {
      return /^[AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkQqLlMmNnOoÖöPpRrSsŞşTtUuÜüVvYyZz]{2,20}$/;
    } else if (name === "mobile_number") {
      return /^(50|51|55|70|77|99|10|60)\d{7}$/;
    } else if (name === "password") {
      return /^(?=.*[A-ZÇĞİÖŞÜƏ])(?=.*\d)(?=.*[!@#\-_+])[A-Za-zÇçĞğİıÖöŞşÜüƏə\d!@#\-_+]{8,15}$/;
    } else if (name === "custom_profession") {
      return /^[A-Za-zÇçƏəĞğİiÖöŞşÜü ]{2,40}$/;
    }
    return null;
  };

  const getErrorMessage = (name, value, extraData = {}) => {
    switch (name) {
      case "first_name":
      case "last_name":
        if (isEmpty(value)) return "Zəhmət olmasa, məlumatları daxil edin.";
        if (!regexps(name).test(value) || /[А-Яа-яЁё]/.test(value))
          return "Yalnız Azərbaycan hərfləri ilə yazılmalıdır.";
        return "";
      case "birth_date":
        if (isEmpty(value)) return "Zəhmət olmasa, doğum tarixini daxil edin.";
        const birthDate = value instanceof Date ? value : parseISO(value);
        if (!isValid(birthDate)) return "Doğum tarixini düzgün daxil edin.";
        if (birthDate > subYears(new Date(), 15))
          return "Qeydiyyatdan keçmək üçün minimum yaş 15 olmalıdır.";
        return "";
      case "mobile_number":
        if (isEmpty(value)) return "Zəhmət olmasa, məlumatları daxil edin.";
        if (!regexps(name).test(value))
          return "Mobil nömrə düzgün daxil edilməyib. 50 123 45 67 formatında daxil edin.";
        return "";
      case "password":
        if (isEmpty(value)) return "Zəhmət olmasa, məlumatları daxil edin.";
        if (!regexps(name).test(value))
          return "Şifrəniz ən azı 8 simvoldan ibarət olmalı, özündə minimum bir böyük hərf, rəqəm və xüsusi simvol (məsələn: !, @, #, -, _, +) ehtiva etməlidir.";
        return "";
      case "password2":
        if (isEmpty(value)) return "Zəhmət olmasa, məlumatları daxil edin.";
        if (formData.password !== value) return "Şifrələr uyğun deyil.";
        return "";
      case "gender":
        if (isEmpty(value)) return "Zəhmət olmasa, seçim edin.";
        return "";
      case "profession_area":
        if (isEmpty(value)) return "Zəhmət olmasa, peşə sahəsi seçin.";
        return "";
      case "profession_speciality":
        if (Number(value) === Number(otherServiceId)) return "";
        if (isEmpty(value)) return "Zəhmət olmasa, peşə ixtisası seçin.";
        return "";
      case "custom_profession":
        if (isEmpty(value)) return "Zəhmət olmasa, ixtisası daxil edin.";
        if (!regexps(name).test(value))
          return "Yalnız Azərbaycan hərfləri ilə qeyd edilməlidir";
        return "";
      case "experience_years":
        if (isEmpty(value)) return "Zəhmət olmasa, iş təcrübəsini daxil edin.";
        return "";
      case "cities":
        if (isEmpty(value)) return "Fəaliyyət ərazisi seçilməlidir.";
        return "";
      case "education":
        if (isEmpty(value)) return "Zəhmət olmasa, təhsil səviyyəsini seçin.";
        return "";
      case "educationField":
        if (isEmpty(value))
          return "Zəhmət olmasa, təhsil ixtisasını daxil edin.";
        return "";
      case "about":
        if (isEmpty(value)) return "Haqqınızda məlumat daxil edin";
        return "";
      case "profile_image":
        if (isEmpty(value)) return "Profil şəkli əlavə olunmalıdır";
        return "";
      case "languages":
        if (isEmpty(value)) return "Zəhmət olmasa, dil biliklərinizi seçin.";
        return "";
      default:
        return "";
    }
  };

  const validateCurrentStep = () => {
    const errors = {};
    if (step === 1) {
      errors.first_name = getErrorMessage("first_name", formData.first_name);
      errors.last_name = getErrorMessage("last_name", formData.last_name);
      errors.birth_date = getErrorMessage("birth_date", formData.birth_date);
      errors.mobile_number = getErrorMessage(
        "mobile_number",
        formData.mobile_number
      );
      errors.password = getErrorMessage("password", formData.password);
      errors.password2 = getErrorMessage("password2", formData.password2);
      errors.gender = getErrorMessage("gender", formData.gender);
    } else if (step === 2) {
      errors.profession_area = getErrorMessage(
        "profession_area",
        formData.profession_area
      );
      if (formData.profession_speciality !== otherServiceId) {
        errors.profession_speciality = getErrorMessage(
          "profession_speciality",
          formData.profession_speciality,
          {
            otherServiceId,
          }
        );
      }
      if (formData.profession_speciality === otherServiceId) {
        errors.custom_profession = getErrorMessage(
          "custom_profession",
          formData.custom_profession
        );
      } else if (!formData.profession_speciality) {
        errors.profession_speciality = "Zəhmət olmasa, peşə ixtisası seçin.";
      }
      errors.experience_years = getErrorMessage(
        "experience_years",
        formData.experience_years
      );
      errors.cities = getErrorMessage("cities", formData.cities);
    } else if (step === 3) {
      errors.education = getErrorMessage("education", formData.education);
      if (formData.education !== "" && formData.education !== 0) {
        errors.educationField = getErrorMessage(
          "educationField",
          formData.educationField
        );
      }
      errors.about = getErrorMessage("about", formData.about);
      errors.profile_image = getErrorMessage(
        "profile_image",
        formData.profile_image
      );
      errors.languages = getErrorMessage("languages", formData.languages);
    }
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([, value]) => value !== "")
    );
    setFormDataErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, multiple, options } = e.target;
    if (type === "password") {
      check_password_strength(value);
    }
    if (name === "profession_speciality") {
      const numericValue = value === "other" ? otherServiceId : Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
        custom_profession: value === "other" ? prev.custom_profession : "",
      }));
      if (value === "other") {
        setFormDataErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.profession_speciality;
          return newErrors;
        });
      }
    } else if (multiple) {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => Number.parseInt(opt.value));
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number.parseInt(value) : value,
      }));
    }
    if (formDataErrors[name]) {
      const errorMessage = getErrorMessage(name, value);
      if (!errorMessage) {
        setFormDataErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
    if (name === "profession_area") {
      const selected = catagories.find((item) => item.id == value);
      setSelectedCategory(selected || null);
      setFormData((prev) => ({
        ...prev,
        profession_speciality: "",
        custom_profession: "",
      }));
    }
  };

  const handleBlurValidation = (e) => {
    const { name, value } = e.target;
    setFormDataErrors((prev) => ({
      ...prev,
      [name]: getErrorMessage(name, value, { otherServiceId }),
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      return;
    }
    if (step === 1) {
      if (!formData.mobile_number || formData.mobile_number.length !== 9) {
        Swal.fire({
          icon: "warning",
          title: "Mobil nömrə düzgün deyil",
          text: "Zəhmət olmasa, 9 rəqəmdən ibarət mobil nömrə daxil edin.",
          confirmButtonText: "Başa düşdüm",
          confirmButtonColor: "#1A4862",
        });
        return;
      }
      const fullNumber = `${formData.mobile_number}`;
      try {
        const res = await fetch(
          "https://api.peshekar.online/api/v1/check-phone/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile_number: fullNumber }),
          }
        );
        const data = await res.json();
        if (res.status === 200 && data?.is_mobile_number) {
          setStep((prev) => prev + 1);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Bu nömrə istifadə olunur.",
            text: data.mobile_number
              ? data.mobile_number[0]
              : "Zəhmət olmasa, başqa nömrə daxil edin.",
            confirmButtonText: "Başa düşdüm",
            confirmButtonColor: "#1A4862",
          });
        }
      } catch (error) {
        console.error("Xəta:", error);
        Swal.fire({
          icon: "error",
          title: "Serverə qoşulmaq mümkün olmadı",
          text: "İnternet bağlantınızı yoxlayın və yenidən cəhd edin.",
          confirmButtonText: "Başa düşdüm",
          confirmButtonColor: "#d33",
        });
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append(
      "birth_date",
      format(formData.birth_date, "yyyy/MM/dd")
    );
    formDataToSend.append("mobile_number", formData.mobile_number);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("password2", formData.password2);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("profession_area", formData.profession_area);
    if (formData.profession_speciality === otherServiceId) {
      formDataToSend.append(
        "profession_speciality",
        formData.profession_speciality
      );
      formDataToSend.append("custom_profession", formData.custom_profession);
    } else {
      formDataToSend.append(
        "profession_speciality",
        formData.profession_speciality
      );
      formDataToSend.append("custom_profession", "");
    }
    formDataToSend.append("experience_years", formData.experience_years);
    formData.cities.forEach((cityId) =>
      formDataToSend.append("cities", cityId)
    );
    formData.languages.forEach((langId) =>
      formDataToSend.append("languages", langId)
    );
    formDataToSend.append("education", formData.education);
    if (formData.education !== 6) {
      formDataToSend.append("education_speciality", formData.educationField);
    } else {
      formDataToSend.append("education_speciality", "");
    }
    formDataToSend.append("note", formData.about);
    formDataToSend.append("facebook", socialMediaLinks.Facebook);
    formDataToSend.append("instagram", socialMediaLinks.Instagram);
    formDataToSend.append("tiktok", socialMediaLinks.TikTok);
    formDataToSend.append("linkedin", socialMediaLinks.LinkedIn);
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }
    formData.work_images.forEach((file) =>
      formDataToSend.append("work_images", file)
    );

    try {
      await axios.post(
        "https://api.peshekar.online/api/v1/register/",
        formDataToSend
      );
      Swal.fire({
        title: "Qeydiyyat uğurludur!",
        text: "Davam etmək üçün 'Login' düyməsinə klikləyin.",
        icon: "success",
        confirmButtonText: "Login",
        allowOutsideClick: false,
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-cyan-600 px-6 py-2 rounded text-white",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response) {
        console.error(
          "Error response data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      Swal.fire({
        title: "Xəta baş verdi!",
        text:
          error?.response?.data?.detail || "Zəhmət olmasa, yenidən cəhd edin.",
        icon: "error",
        confirmButtonText: "Bağla",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-red-600 px-6 py-2 rounded text-white",
        },
      });
    }
  };

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const handleUploadClick = () => fileInputRef.current.click();
  const handleUploadClick2 = () => fileInputRef2.current.click();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    isUpperCase: false,
    isLowerCase: false,
    isSymbol: false,
    isNumber: false,
    isLengthEight: false,
  });

  const parentRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth);
    }
    getCatagories();
  }, [getCatagories]);

  useEffect(() => {
    if (selectedCategory) {
      getServices();
    }
  }, [selectedCategory, getServices]);

  const color = [
    "",
    "bg-red-500",
    "bg-yellow-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  const check_password_strength = (value) => {
    const uppercaseRegexp = /[A-ZÇĞİÖŞÜƏ]/;
    const lowercaseRegexp = /[a-zçğıöşüə]/;
    const symbolRegexp = /[!@#$%^&*)(+=._\-{}[\]:;"'<>,?/\\|~`]/;
    const numberRegexp = /\d/;
    setPasswordStrength({
      isUpperCase: uppercaseRegexp.test(value),
      isLowerCase: lowercaseRegexp.test(value),
      isSymbol: symbolRegexp.test(value),
      isNumber: numberRegexp.test(value),
      isLengthEight: value.length >= 8,
    });
  };

  const [citiesForShow, setCitiesForShow] = useState({
    cities: [],
    districts: [],
  });

  const handleChildData = (dataFromChild) => {
    const selectedAreas = [
      ...(dataFromChild.selectedCitiesForShow || []),
      ...(dataFromChild.selectedDistrictsForShow || []),
    ].map((item) => item.display_name || item.name);
    setFormData((prev) => ({
      ...prev,
      cities: [
        ...(dataFromChild.selectedCitiesForShow || []).map((city) => city.id),
        ...(dataFromChild.selectedDistrictsForShow || []).map(
          (district) => district.id
        ),
      ],
    }));
    setCitiesForShow({
      cities: [...(dataFromChild.selectedCitiesForShow || [])],
      districts: [...(dataFromChild.selectedDistrictsForShow || [])],
      displayText: selectedAreas.join(", "),
    });
    closePopup();
  };

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-[rgba(26,72,98,1)] h-[100px] sticky top-0 left-0 z-50 flex justify-between px-[20px] py-[20px] items-center">
        <Link to="/" className="text-white text-lg font-bold">
          <img src="./ag-logo.png" alt="logo" className="h-15 w-auto ml-10"/>
        </Link>
        <p className="text-white cursor-pointer" onClick={handleClick}>
          Hesabınız var? Daxil olun
        </p>
      </div>
      <div className="gradient-register text-center py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A4852] mb-2 p-4 text-center">
          Peşə Sahibləri Platformasına <br /> Xoş Gəlmisiniz!
        </h1>
        <p className="text-[#6C757D]">
          Peşəkar xidmətlərinizi paylaşmaq üçün qeydiyyatdan keçin.
        </p>
      </div>
      <main
        className="flex-grow relative flex justify-center items-start py-[40px] bg-cover bg-center bg-fixed bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundPng})` }}
      >
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.25)]"></div>
        {step === 1 && (
          <form className="relative z-10 bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="flex justify-evenly ">
              <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(26,72,98,1)] text-white ">
                1
              </div>
              <div className="w-[40px] h-[2px] bg-[rgba(195,200,209,1)] flex mt-3" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(195,200,209,1)] ">
                2
              </div>
              <div className="w-[40px] h-[2px] bg-[rgba(195,200,209,1)] flex mt-3" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(195,200,209,1)] ">
                3
              </div>
            </div>
            <p className="text-center text-cyan-900 font-semibold pt-4">
              Addım 1/3{" "}
            </p>
            <h2 className="text-cyan-900 font-semibold leading-[1.5] text-[25px] mt-5">
              Şəxsi məlumatlar
            </h2>
            <div className="py-[15px]">
              <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                Ad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={20}
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={handleBlurValidation}
                onKeyDown={(e) => {
                  const isControlKey = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(e.key);
                  const isLetter = /^[a-zA-ZəöüçğışƏÖÜÇĞŞİI ]$/.test(e.key);
                  if (!isLetter && !isControlKey) e.preventDefault();
                }}
                placeholder="Adınızı daxil edin"
                className={`${
                  formDataErrors.first_name
                    ? "border-red-600"
                    : "border-gray-300"
                } outline-gray-200 w-full mt-1 p-2 text-[16px] border bg-white rounded-md`}
              />
              {formDataErrors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.first_name}
                </p>
              )}
            </div>
            <div className="py-[10px]">
              <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                Soyad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={20}
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={handleBlurValidation}
                onKeyDown={(e) => {
                  const isControlKey = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(e.key);
                  const isLetter = /^[a-zA-ZəöüçğışƏÖÜÇĞŞİIА-Яа-яЁё]$/.test(
                    e.key
                  );
                  if (!isLetter && !isControlKey) e.preventDefault();
                }}
                placeholder="Soyadınızı daxil edin"
                className={`w-full mt-1 p-2 text-[16px] bg-white rounded-md outline-gray-200 ${
                  formDataErrors.last_name
                    ? "border-red-600"
                    : "border-gray-300"
                } border`}
              />
              {formDataErrors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.last_name}
                </p>
              )}
            </div>
            <div className="py-[10px]">
              <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                Doğum tarixi <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.birth_date}
                onChange={(date) => {
                  setFormData((prev) => ({ ...prev, birth_date: date }));
                  setFormDataErrors((prev) => ({
                    ...prev,
                    birth_date: getErrorMessage("birth_date", date),
                  }));
                }}
                onBlur={handleBlurValidation}
                dateFormat="yyyy/MM/dd"
                placeholderText="İl / ay / gün"
                locale={az}
                maxDate={subYears(new Date(), 15)}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                calendarStartDay={1}
                className={`${
                  formDataErrors.birth_date
                    ? "border-red-600"
                    : "border-gray-300"
                } outline-gray-200 w-full mt-1 p-2 text-[16px] border bg-white rounded-md text-gray-700`}
              />
              {formDataErrors.birth_date && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.birth_date}
                </p>
              )}
            </div>
            <div className="py-[10px]">
              <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                Mobil nömrə <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <div className="flex">
                  <span className="bg-white px-4 py-2 border border-gray-300 border-r-0 rounded-l-md">
                    +994
                  </span>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 9);
                      setFormData((prev) => ({
                        ...prev,
                        mobile_number: onlyNumbers,
                      }));
                    }}
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ];
                      if (
                        !/[0-9]/.test(e.key) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onBlur={handleBlurValidation}
                    placeholder="501234567"
                    className={`${
                      formDataErrors.mobile_number
                        ? "border-red-600"
                        : "border-gray-300"
                    } outline-gray-200 w-full p-2 text-[16px] border bg-white rounded-r-md`}
                  />
                </div>
                {formDataErrors.mobile_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.mobile_number}
                  </p>
                )}
              </div>
            </div>
            <div className="py-[10px]">
              <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                Şifrə <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  maxLength={15}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlurValidation}
                  placeholder="Şifrənizi daxil edin"
                  className={`${
                    formDataErrors.password
                      ? "border-red-600"
                      : "border-gray-300"
                  } outline-gray-200 w-full mt-1 p-2 text-[16px] border bg-white rounded-md pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="w-full">
                <div
                  ref={parentRef}
                  className={`block mt-[5px] h-[6px] rounded-2xl ${
                    color[
                      Object.values(passwordStrength).filter((x) => x === true)
                        .length
                    ]
                  }`}
                ></div>
              </div>
              <p
                className={`mt-1 text-sm ${
                  formDataErrors.password ? "text-red-500" : "text-gray-500"
                }`}
              >
                Şifrəniz ən azı 8 simvoldan ibarət olmalı, özündə minimum bir
                böyük hərf, rəqəm və xüsusi simvol (məsələn: !, @, #, -, _, +)
                ehtiva etməlidir.
              </p>
            </div>
            <div className="py-[10px]">
              <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                Şifrəni təkrar yazın <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="password2"
                  maxLength={15}
                  value={formData.password2}
                  onChange={handleChange}
                  onBlur={handleBlurValidation}
                  placeholder="Şifrənizi təkrar daxil edin"
                  className={`${
                    formDataErrors.password2
                      ? "border-red-600"
                      : "border-gray-300"
                  } outline-gray-200 w-full mt-1 p-2 text-[16px] border bg-white rounded-md pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600"
                >
                  {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formDataErrors.password2 && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.password2}
                </p>
              )}
            </div>
            <div className="py-[10px]">
              <label className="text-cyan-900 leading-[1.5] text-sm font-semibold">
                Cins <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6 mt-1">
                <label className="text-cyan-900 leading-[1.5] flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={formData.gender === "MALE"}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Kişi
                </label>
                <label className="text-cyan-900 leading-[1.5] flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={formData.gender === "FEMALE"}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Qadın
                </label>
              </div>
              {formDataErrors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.gender}
                </p>
              )}
            </div>
            <button
              type="submit"
              className=" flex justify-center items-center text-sm bg-cyan-900 text-white py-2 rounded-md mt-4 w-full"
              onClick={handleNext}
            >
              Növbəti{" "}
              <IoIosArrowForward className="w-[20px] h-[20px] pt-[2px]" />
            </button>
            <p className="text-sm mt-6 text-gray-600 flex items-center justify-center gap-[3px]">
              Hesabınız var?{" "}
              <a
                href="/login"
                className="text-[rgba(49,135,184,1)] hover:underline"
              >
                Daxil olun
              </a>
            </p>
          </form>
        )}
        {step === 2 && (
          <div className="relative z-10 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg w-[90%] max-w-md ">
            <div className="flex justify-evenly ">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(195,200,209,1)]">
                1
              </div>
              <div className="w-[40px] h-[2px] bg-[rgba(26,72,98,1)] flex justify-between items-center mt-3" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(26,72,98,1)]  text-white ">
                2
              </div>
              <div className="w-[40px] h-[2px] bg-[rgba(195,200,209,1)] flex mt-3" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(195,200,209,1)] ">
                3
              </div>
            </div>
            <p className="text-center text-cyan-900 pt-4 pb-5">Addım 2/3 </p>
            <h3 className="text-xl font-bold text-[#1A4852] mb-4 ">
              Peşə məlumatları
            </h3>
            <div className="mb-4">
              <label className="block text-sm text-cyan-900 font-medium mb-1">
                Peşə sahəsi <span className="text-red-500">*</span>
              </label>
              <select
                name="profession_area"
                onChange={handleChange}
                onBlur={handleBlurValidation}
                className={`${
                  formDataErrors.profession_area
                    ? "border-red-600"
                    : "border-gray-300"
                } outline-gray-200 w-full mt-1 p-2 text-[16px] text-cyan-900 border bg-[rgba(195,200,209,1)] rounded-md`}
                value={formData.profession_area}
              >
                <option value="">Peşə sahəsini seçin</option>
                {catagories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.display_name}
                  </option>
                ))}
              </select>
              {formDataErrors.profession_area && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.profession_area}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm text-cyan-900  font-medium mb-1">
                Peşə ixtisası <span className="text-red-500">*</span>
              </label>
              <select
                name="profession_speciality"
                value={formData.profession_speciality}
                onChange={handleChange}
                onBlur={handleBlurValidation}
                className={`${
                  formDataErrors.profession_speciality
                    ? "border-red-600"
                    : "border-gray-300"
                } outline-gray-200 w-full mt-1 p-2 text-[16px] text-cyan-900 border bg-[rgba(195,200,209,1)] rounded-md`}
              >
                <option value="">Peşə ixtisasını seçin</option>
                {services.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.display_name}
                  </option>
                ))}
                {otherServiceId && (
                  <option value={otherServiceId}>Digər</option>
                )}
              </select>
              {formDataErrors.profession_speciality && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.profession_speciality}
                </p>
              )}
            </div>
            {formData.profession_speciality === otherServiceId && (
              <div className="mt-3 mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1">
                  İxtisası daxil edin: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  name="custom_profession"
                  value={formData.custom_profession || ""}
                  onChange={handleChange}
                  onBlur={handleBlurValidation}
                  onKeyDown={(e) => {
                    const isControlKey = [
                      "Backspace",
                      "Tab",
                      "ArrowLeft",
                      "ArrowRight",
                      "Delete",
                    ].includes(e.key);
                    const isLetter = /^[a-zA-ZəöüçğışƏÖÜÇĞŞİI ]$/.test(e.key);
                    if (!isLetter && !isControlKey) e.preventDefault();
                  }}
                  placeholder="Daxil edin..."
                  className={`w-full border p-2 rounded-md text-cyan-900 cursor-text ${
                    formDataErrors.custom_profession
                      ? "border-red-600"
                      : "border-gray-200"
                  } bg-[rgba(195,200,209,1)] px-4 py-2 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300`}
                />
                {formDataErrors.custom_profession && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.custom_profession}
                  </p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm text-cyan-900 font-medium mb-1">
                İş təcrübəsi(il) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onBlur={handleBlurValidation}
                placeholder="Məsələn: 4"
                onChange={handleChange}
                onInput={(e) => {
                  if (e.target.value > 90) {
                    e.target.value = 90;
                  }
                }}
                max={90}
                className={`${
                  formDataErrors.experience_years
                    ? "border-red-600"
                    : "border-gray-300"
                } no-spinner outline-gray-200 w-full text-cyan-900 mt-1 p-2 text-[16px] border bg-gray-200 rounded-md`}
              />
              {formDataErrors.experience_years && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.experience_years}
                </p>
              )}
            </div>
            <div className="mt-3 mb-4">
              <label className="block text-sm text-cyan-900 font-medium mb-1">
                Fəaliyyət göstərdiyi ərazi :{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                onClick={openPopup}
                value={citiesForShow.displayText || ""}
                placeholder="Ərazi seç"
                className={`w-full border p-2 rounded-md ${
                  citiesForShow.displayText
                    ? "text-cyan-900 font-semibold bg-white"
                    : "text-gray-500 bg-[rgba(195,200,209,1)]"
                } border-gray-300 px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-600`}
              />
              {formDataErrors.cities && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.cities}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="border border-cyan-900 text-cyan-900 py-2 px-4 rounded-md hover:bg-gray-100 w-[48%] flex justify-center items-center"
              >
                <IoIosArrowBack className="pt-[2px]" /> Geri
              </button>
              <button
                type="submit"
                className=" flex justify-center items-center bg-cyan-900 border-cyan-900 text-white py-2 px-6 rounded-md w-[48%] "
                onClick={handleNext}
              >
                Növbəti <IoIosArrowForward className="pt-[2px]" />
              </button>
            </div>
            <p className="text-sm mt-4 text-gray-600 flex items-center justify-center gap-[3px]">
              Hesabınız var?
              <a
                href="/login"
                className="text-[rgba(49,135,184,1)] hover:underline"
              >
                Daxil olun
              </a>
            </p>
          </div>
        )}
        {step === 3 && (
          <div className="relative z-10 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="flex justify-evenly pb-[10px]">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(195,200,209,1)]">
                1
              </div>
              <div className="w-[40px] h-[2px] bg-[rgba(26,72,98,1)]  flex mt-3" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(195,200,209,1)]  ">
                2
              </div>
              <div className="w-[40px] h-[2px] bg-[rgba(26,72,98,1)]    flex mt-3" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full  bg-[rgba(26,72,98,1)]  text-white ">
                3
              </div>
            </div>
            <p className="text-center  text-cyan-900 pb-3 pt-4">Addım 3/3 </p>
            <h2 className="text-xl font-bold text-[#1A4852] mb-1 py-2">
              Əlavə məlumatlar
            </h2>
            <div className="mb-4">
              <label className="block text-sm text-cyan-900 font-medium mb-1 py-2">
                Təhsil <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {educationOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-start gap-2 text-sm text-cyan-900 break-words"
                  >
                    <input
                      type="radio"
                      name="education"
                      value={option.id}
                      className={`accent-cyan-700 mt-1`}
                      checked={formData.education === option.id}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          education: Number.parseInt(e.target.value),
                        }));
                        setFormDataErrors((prev) => ({
                          ...prev,
                          education: getErrorMessage(
                            "education",
                            Number.parseInt(e.target.value)
                          ),
                        }));
                      }}
                      onBlur={handleBlurValidation}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              {formDataErrors.education && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.education}
                </p>
              )}
            </div>
            {formData.education !== "" && formData.education !== 0 && (
              <div className="mb-4">
                <label className="block text-sm text-cyan-900 font-medium mb-1">
                  Təhsil ixtisası <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Təhsil ixtisasını daxil edin"
                  name="educationField"
                  className="w-full border border-gray-300 bg-white p-2 rounded-md text-sm text-gray-600 outline-gray-400 cursor-default"
                  value={formData.educationField}
                  onChange={handleChange}
                  onBlur={handleBlurValidation}
                />
                {formDataErrors.educationField && (
                  <p className="text-red-500 text-sm mt-1">
                    {formDataErrors.educationField}
                  </p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm text-cyan-900 font-medium mb-1 py-2">
                Dil bilikləri <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
                {languageOptions.map((lang) => (
                  <label
                    key={lang.id}
                    className="flex items-center gap-1 text-sm text-cyan-900"
                  >
                    <input
                      type="checkbox"
                      name="languages"
                      value={lang.id}
                      checked={formData.languages.includes(lang.id)}
                      onChange={handleLanguageChange}
                      onBlur={handleBlurValidation}
                      className={`accent-cyan-700 w-4 h-4 border-gray-300 ${
                        lang.label === "İngilis" ? "ml-5" : ""
                      }`}
                    />
                    {lang.label}
                  </label>
                ))}
              </div>
              {formDataErrors.languages && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.languages}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm text-cyan-900 font-medium mb-1">
                Profil şəkli
              </label>
              <div
                className="border-2 border-dashed  bg-white border-gray-300 rounded-md py-6 text-center text-gray-500 hover:bg-gray-50 cursor-pointer transition"
                onClick={handleUploadClick}
              >
                <span className="text-sm  flex flex-col items-center justify-center pt-2">
                  <img src="/gallery.svg" alt="Gallery icon" /> Şəkil yükləmək
                  üçün klikləyin.
                </span>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                />
              </div>
              {formDataErrors.profile_image && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.profile_image}
                </p>
              )}
            </div>
            {formData.profile_image && (
              <div className="flex flex-col items-start mt-2">
                <img
                  src={
                    URL.createObjectURL(formData.profile_image) ||
                    "/placeholder.svg"
                  }
                  alt="Profil şəkli"
                  className="w-32 h-32 object-cover border border-gray-300 rounded-md"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImageToEdit(formData.profile_image);
                      setShowEditor(true);
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Şəkli dəyiş
                  </button>
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block  text-cyan-900 text-sm font-semibold mb-1">
                Sosial şəbəkə linkləri
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Peşənizlə əlaqədar sosial şəbəkə səhifəsinin (olduqda) linkini
                əlavə edə bilərsiniz.
              </p>
              {[
                {
                  icon: "fa-brands fa-facebook",
                  name: "Facebook",
                  placeholder: "Facebook profil linki",
                  color: "#1877F2",
                },
                {
                  icon: "fa-brands fa-instagram",
                  name: "Instagram",
                  placeholder: "Instagram profil linki",
                  color: "#C13584",
                },
                {
                  icon: "fa-brands fa-tiktok",
                  name: "TikTok",
                  placeholder: "TikTok profil linki",
                  color: "#000000",
                },
                {
                  icon: "fa-brands fa-linkedin",
                  name: "LinkedIn",
                  placeholder: "Linkedin profil linki",
                  color: "#0A66C2",
                },
              ].map((network) => (
                <div
                  key={network.name}
                  className="flex items-center border border-gray-300 rounded-md mb-2 overflow-hidden bg-white"
                >
                  <div
                    className="flex items-center justify-center w-12 h-12"
                    style={{ backgroundColor: `${network.color}20` }}
                  >
                    <i
                      className={`${network.icon} text-xl`}
                      style={{ color: network.color }}
                    ></i>
                  </div>
                  <input
                    type="text"
                    placeholder={network.placeholder}
                    name={network.name}
                    className="w-full p-3 outline-none cursor-pointer text-cyan-700"
                    onChange={handleSocialMediaLinksValue}
                    value={socialMediaLinks[network.name]}
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block  text-cyan-900 text-sm font-medium mb-2">
                  Gördüyünüz işlər (Nümunə işlərinizin şəkilləri)
                </label>
                <div
                  className="border-2 border-dashed bg-white border-gray-300 rounded-md py-6 px-4 text-center text-gray-500 cursor-pointer "
                  onClick={handleUploadClick2}
                >
                  <span className="text-sm  mb-1 text-gray-400 text-center flex flex-col items-center justify-center">
                    <img
                      src="/cloud-upload.png"
                      className="flex justify-center w-[30px] align-center"
                      alt="Cloud upload icon"
                    />{" "}
                    JPG/PNG faylları yükləyin (maksimum 10 fayl)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    className="hidden"
                    ref={fileInputRef2}
                    onChange={handlePortfolioChange}
                  />
                </div>
                {formData.work_images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {formData.work_images.map((file, index) => (
                      <div
                        key={index}
                        className="relative"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`İş şəkli ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveWorkImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-cyan-900 text-sm font-medium mb-1">
                Haqqınızda
              </label>
              <div className="relative">
                <textarea
                  name="about"
                  onChange={handleChange}
                  value={formData.about}
                  placeholder="Əlavə qeydlərinizi daxil edin"
                  maxLength={1500}
                  className="w-full border border-gray-300 outline-gray-400 rounded-md p-2 min-h-[100px] resize-none pr-16 text-sm"
                  onBlur={handleBlurValidation}
                />
                <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {formData.about.length}/1500
                </span>
              </div>
              {formDataErrors.about && (
                <p className="text-red-500 text-sm mt-1">
                  {formDataErrors.about}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="border border-[#1A4852] text-[#1A4852] py-2 px-4 rounded-md hover:bg-gray-100 w-[38%] flex justify-center items-center text-sm"
              >
                <IoIosArrowBack />
                Geri
              </button>
              <button
                type="submit"
                className="flex items-center justify-center bg-[rgba(26,72,98,1)] text-white text-sm px-4 py-2 rounded-md hover:bg-[#153b45] w-[58%]"
                onClick={handleFinalSubmit}
              >
                Qeydiyyatı tamamla
                <IoIosArrowForward />
              </button>
            </div>
            <p className="text-sm mt-4 text-gray-600 flex items-center justify-center gap-[3px]">
              Hesabınız var?{" "}
              <a
                href="/login"
                className="text-[rgba(49,135,184,1)] hover:underline"
              >
                Daxil olun
              </a>
            </p>
          </div>
        )}
      </main>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="w-[65%] h-[90%] rounded-2xl bg-image overflow-hidden shadow-lg">
            <CitySelectionPopup
              onSendData={handleChildData}
              cities={citiesForShow}
            />
          </div>
        </div>
      )}
      {showEditor && (
        <ImageEditor
          image={imageToEdit}
          onSave={handleImageEditorSave}
          onCancel={handleImageEditorCancel}
          onDelete={handleImageEditorDelete}
        />
      )}
      <Footer />
    </div>
  );
}

export default Register;
