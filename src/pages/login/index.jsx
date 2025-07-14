import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../home/Components/Footer";
import SuccessModal from "../../components/SuccessModal";
import { Eye, EyeOff } from "lucide-react";
import backgroundpng from "../../assets/background.png";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile_number: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    buttonText: "Tamam",
    redirectPath: null,
  });

  const showModal = (
    type,
    title,
    message,
    buttonText = "Tamam",
    redirectPath = null
  ) => {
    setModalConfig({ title, message, buttonText, redirectPath });

    if (type === "success") {
      setShowSuccessModal(true);
    } else if (type === "error") {
      setShowErrorModal(true);
    } else if (type === "info") {
      setShowInfoModal(true);
    }
  };

  const closeAllModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setShowInfoModal(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile_number") {
      const cleanValue = value.replace(/\s/g, "").replace(/\D/g, "");
      if (cleanValue.length <= 9) {
        setFormData((prev) => ({
          ...prev,
          [name]: cleanValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mobile_number) {
      newErrors.mobile_number = "Mobil nömrə daxil edin";
    } else if (formData.mobile_number.length !== 9) {
      newErrors.mobile_number = "Mobil nömrə 9 rəqəmdən ibarət olmalıdır";
    }

    if (!formData.password) {
      newErrors.password = "Şifrə daxil edin";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifrə ən azı 6 simvoldan ibarət olmalıdır";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("Login attempt with data:", formData);

      const response = await fetch(
        "https://api.peshekar.online/api/v1/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile_number: formData.mobile_number,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();
      console.log("Login response:", result);

      if (response.ok) {
        if (result.access_token || result.token || result.access) {
          const token = result.access_token || result.token || result.access;
          localStorage.setItem("authToken", token);

          if (result.refresh_token || result.refresh) {
            const refreshToken = result.refresh_token || result.refresh;
            localStorage.setItem("refreshToken", refreshToken);
          }

          if (result.user) {
            localStorage.setItem("userData", JSON.stringify(result.user));
          }
        }

        showModal(
          "success",
          "Giriş Uğurlu!",
          "Hesabınıza uğurla daxil oldunuz. Profil səhifəsinə yönləndirilirsiniz.",
          "Davam et",
          "/profil"
        );
      } else {
        let errorMessage = "Giriş zamanı xəta baş verdi";

        if (response.status === 401) {
          errorMessage = "Mobil nömrə və ya şifrə yanlışdır";
        } else if (response.status === 400) {
          if (result.mobile_number) {
            setErrors({
              mobile_number: Array.isArray(result.mobile_number)
                ? result.mobile_number[0]
                : result.mobile_number,
            });
            return;
          }
          if (result.password) {
            setErrors({
              password: Array.isArray(result.password)
                ? result.password[0]
                : result.password,
            });
            return;
          }
          if (result.non_field_errors) {
            errorMessage = Array.isArray(result.non_field_errors)
              ? result.non_field_errors[0]
              : result.non_field_errors;
          } else if (result.detail) {
            errorMessage = result.detail;
          } else if (result.message) {
            errorMessage = result.message;
          }
        } else if (response.status === 429) {
          errorMessage = "Çox sayda cəhd. Zəhmət olmasa bir az gözləyin.";
        } else if (response.status >= 500) {
          errorMessage =
            "Server xətası. Zəhmət olmasa daha sonra yenidən cəhd edin.";
        }

        showModal("error", "Giriş Xətası", errorMessage, "Yenidən cəhd et");
      }
    } catch (error) {
      console.error("Network error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        showModal(
          "error",
          "Bağlantı Xətası",
          "İnternet bağlantınızı yoxlayın və yenidən cəhd edin.",
          "Yenidən cəhd et"
        );
      } else {
        showModal(
          "error",
          "Şəbəkə Xətası",
          "Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən cəhd edin.",
          "Yenidən cəhd et"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/reset");
  };

  const formatMobileNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 9);

    let formatted = "";

    if (cleaned.length > 0) {
      formatted += cleaned.slice(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += " " + cleaned.slice(2, 5);
    }
    if (cleaned.length > 5) {
      formatted += " " + cleaned.slice(5, 7);
    }
    if (cleaned.length > 7) {
      formatted += " " + cleaned.slice(7, 9);
    }

    return formatted;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#1A4862] px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-lg font-bold">
            <img src="./ag-logo.png" alt="logo" className="h-15 w-auto" />
          </Link>
          <button
            onClick={handleRegisterClick}
            className="text-white text-sm hover:underline"
          >
            Hesabınız yoxdur? Qeydiyyatdan keçin
          </button>
        </div>
      </div>

      <div className="bg-[#E8F4F8] py-12 flex-shrink-0">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4862] mb-4">
            Peşə Sahibləri Platformasına
            <br />
            Xoş Gəlmisiniz!
          </h1>
          <p className="text-gray-600 text-lg">
            Hesabınıza daxil olaraq xidmətlərinizi idarə edin.
          </p>
        </div>
      </div>

      <div
        className="flex-1 py-12 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${backgroundpng}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#1A4862] mb-6 text-center">
              Daxil ol
            </h2>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobil nömrə <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span
                    className={`px-3 py-2 border border-r-0 rounded-l-lg text-sm text-gray-700 
        ${
          errors.mobile_number ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
                  >
                    +994
                  </span>
                  <input
                    type="text"
                    name="mobile_number"
                    value={formatMobileNumber(formData.mobile_number)}
                    onChange={handleChange}
                    placeholder="50 123 45 67"
                    maxLength="12"
                    className={`w-full px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862]
        ${
          errors.mobile_number ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
                  />
                </div>

                {errors.mobile_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobile_number}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifrə <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifrənizi daxil edin"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4862] ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#3B82F6] hover:underline"
                >
                  Şifrəni unutmusuz?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A4862] text-white py-3 rounded-lg font-medium hover:bg-[#1A4862]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Gözləyin...
                  </>
                ) : (
                  "Daxil ol"
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Hesabınız yoxdur?{" "}
                <button
                  onClick={handleRegisterClick}
                  className="text-[#3B82F6] hover:underline font-medium"
                >
                  Qeydiyyatdan keçin
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeAllModals}
        type="success"
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        redirectPath={modalConfig.redirectPath}
      />

      <SuccessModal
        isOpen={showErrorModal}
        onClose={closeAllModals}
        type="error"
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        redirectPath={modalConfig.redirectPath}
      />

      <SuccessModal
        isOpen={showInfoModal}
        onClose={closeAllModals}
        type="info"
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        redirectPath={modalConfig.redirectPath}
      />

      <Footer />
    </div>
  );
}

export default Login;
