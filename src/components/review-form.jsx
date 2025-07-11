
import React, { useRef, useState } from "react"
import { ImageIcon, Star } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import ProfilNavbar from "../profil-navbar" 
import axios from "axios"

export default function ReviewForm() {
  const { masterId } = useParams()
  const navigate = useNavigate()

  const inputref = useRef(null)
  const handleclick = () => inputref.current?.click()

  const TAG_MAPPING = {
    "#Məsuliyyət": "responsible",
    "#Səliqə": "neat",
    "#Vaxta nəzarət": "time_management",
    "#Ünsiyyətcil": "communicative",
    "#Dəqiq": "punctual",
    "#Peşəkar": "professional",
    "#Təcrübəli": "experienced",
    "#Səmərəli": "efficient",
    "#Çevik": "agile",
    "#Səbirli": "patient",
  }
  const TAGS = Object.keys(TAG_MAPPING)

  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [error, setError] = useState("")
  const [text, setText] = useState("")
  const [nameError, setNameError] = useState("")
  const [ratingError, setRatingError] = useState("")
  const [textError, setTextError] = useState("")
  const [tagError, setTagError] = useState("")
  const [imageError, setImageError] = useState("")
  const [imageUploadValidationError, setImageUploadValidationError] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    message: "",
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [images, setImages] = useState([])
  const [inputKey, setInputKey] = useState(Date.now())

  const tagselector = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
      setError("")
      setTagError("")
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
      setError("")
      setTagError("")
    } else {
      setError("5 tagdan artıq seçə bilməzsiniz")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("ReviewForm: masterId prop:", masterId)

    if (!masterId) {
      setSubmitStatus({
        loading: false,
        success: false,
        message: "Usta tapılmadı. Rəy göndərilə bilmədi.",
      })
      return
    }

    let isValid = true
    if (name.trim() === "") {
      setNameError("Zəhmət olmasa adınızı daxil edin")
      isValid = false
    } else if (name.length < 2 || name.length > 50) {
      setNameError("Ad 2-50 simvol aralığında olmalıdır")
      isValid = false
    } else {
      setNameError("")
    }

    if (rating === 0) {
      setRatingError("Lütfən bir reytinq seçin")
      isValid = false
    } else {
      setRatingError("")
    }

    if (text.trim() === "") {
      setTextError("Zəhmət olmasa rəyinizi yazın")
      isValid = false
    } else {
      setTextError("")
    }

    if (selectedTags.length === 0) {
      setTagError("Zəhmət olmasa ən azı bir etiket seçin")
      isValid = false
    } else {
      setTagError("")
    }

    setImageError("")
    setImageUploadValidationError(false)

    if (!isValid) {
      setSubmitStatus({
        loading: false,
        success: false,
        message: "Zəhmət olmasa bütün tələb olunan sahələri doldurun.",
      })
      return
    }

    setSubmitStatus({ loading: true, success: false, message: "" })

    const formData = new FormData()
    formData.append("username", name)
    formData.append("rating", rating.toString())
    formData.append("comment", text)

    selectedTags.forEach((frontendTag) => {
      const apiField = TAG_MAPPING[frontendTag]
      if (apiField) {
        formData.append(apiField, "true")
      }
    })

    images.forEach((image) => {
      formData.append("review_images", image, image.name)
    })

    const headers = {
      "Content-Type": "multipart/form-data",
    }

    try {
      const response = await axios.post(
        `https://api.peshekar.online/api/v1/professionals/${masterId}/reviews/create/`,
        formData,
        { headers },
      )
      setSubmitStatus({
        loading: false,
        success: true,
        message: "Rəyiniz uğurla göndərildi!",
      })
      navigate(`/master/${masterId}`)
      setRating(0)
      setText("")
      setSelectedTags([])
      setImages([])
      setInputKey(Date.now())
      setName("")
      setImageUploadValidationError(false)
    } catch (err) {
      console.error("Network Error:", err)
      const errorData = err.response?.data
      setSubmitStatus({
        loading: false,
        success: false,
        message: `Rəy göndərilərkən xəta baş verdi: ${errorData?.detail || err.message}`,
      })
    }
  }

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    const totalImages = [...images, ...selectedFiles]

    const isImage = (file) => file.type.startsWith("image/")
    if (!selectedFiles.every(isImage)) {
      setImageError("Yalnız şəkil faylları yükləyə bilərsiniz.")
      setInputKey(Date.now())
      setImageUploadValidationError(true)
      return
    }

    const oversized = selectedFiles.some((file) => file.size > 5 * 1024 * 1024)
    if (oversized) {
      setImageError("Şəklin ölçüsü 5MB-dan çox ola bilməz.")
      setInputKey(Date.now())
      setImageUploadValidationError(true)
      return
    }

    if (totalImages.length > 3) {
      setImageError("Ən çox 3 şəkil yükləyə bilərsiniz.")
      setInputKey(Date.now())
      setImageUploadValidationError(true)
      return
    }

    setImages(totalImages)
    setImageError("")
    setImageUploadValidationError(false)
  }

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove))
    setImageError("")
    setImageUploadValidationError(false)
  }

  return (
    <div>
      <ProfilNavbar />
      <form className="mx-auto p-6 max-w-[1400px] bg-white rounded-lg" onSubmit={handleSubmit}>
        <h2 className="font-bold text-xl mb-4">Xidmət haqqında rəy yazın</h2>
        {submitStatus.message && (
          <div
            className={`mb-4 p-3 rounded-md text-center ${
              submitStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-3">
            Adınızı və soyadınızı qeyd edin
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınızı qeyd edin"
            className={`w-full border rounded p-[5px] mb-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              nameError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {nameError && <p className="text-red-500 text-sm mb-[30px] font-semibold">{nameError}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Xidmətlə bağlı təəssüratınız necə idi?</label>
          <div className="flex gap-[3px] text-[25px] mb-[10px] cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`}
                onClick={() => setRating(star === rating ? 0 : star)}
              />
            ))}
          </div>
          {ratingError && <p className="text-red-500 text-sm mb-[30px] font-semibold">{ratingError}</p>}
          <textarea
            placeholder='"Yaşadığınız təcrübəni bizimlə bölüşün" '
            className="w-full border border-gray-300 h-[147px] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setText(e.target.value)}
            value={text}
          ></textarea>
          {textError && <p className="text-red-500 text-sm mb-[30px] font-semibold">{textError}</p>}
        </div>
        <div>
          <label className="block mb-2 font-semibold mt-[40px]">Şəkil əlavə edin (istəyə bağlıdır)</label>
          <div
            className={`w-48 h-48 border-dashed border-[3px] rounded-lg flex flex-col items-center justify-center mb-[50px] cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors${
              imageUploadValidationError ? "border-red-500 text-red-500" : "border-gray-300"
            }`}
            onClick={handleclick}
          >
            <span className="mb-1">Şəkil əlavə edin</span>
            <ImageIcon className="w-6 h-6" />
            <input
              type="file"
              ref={inputref}
              key={inputKey}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          {images.length > 0 && (
            <div className="flex gap-4 flex-wrap mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`şəkil-${index}`}
                    className="w-[100px] h-[100px] object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    aria-label="Şəkli sil"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {imageError && <p className="text-red-500 text-sm mt-2 font-semibold">{imageError}</p>}
        <div className="mb-4 max-w-[750px]">
          <p className="font-semibold mb-[20px]">Xidməti xarakterizə edən etiketləri seçin (maks. 5 ədəd)</p>
          <div className="flex flex-wrap gap-[10px]">
            {TAGS.map((tag) => (
              <button
                type="button"
                onClick={() => tagselector(tag)}
                className={`border-2 px-[10px] py-[7px] rounded text-[16px] transition-colors duration-200 ${
                  tagError ? "border-red-500" : ""
                } ${
                  selectedTags.includes(tag)
                    ? "border-[#1a4862] text-[#1a4862] bg-[#cde4f2]"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
                key={tag}
              >
                {tag}
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
        </div>
        {tagError && <p className="text-red-500 text-sm mb-[30px] font-semibold">{tagError}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#1A4862] hover:bg-[#1A4862]/90 text-white px-4 py-2 rounded-md text-lg font-semibold"
            disabled={submitStatus.loading}
          >
            {submitStatus.loading ? "Göndərilir..." : "Rəyinizi göndərin"}
          </button>
        </div>
      </form>
    </div>
  )
}
