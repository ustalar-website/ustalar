import { Star } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Sidebar from "../sidebar";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `https://api.peshekar.online/api/v1/${path}`;
};

const TAG_DISPLAY_MAPPING = {
  responsible: "#Məsuliyyət",
  neat: "#Səliqə",
  time_management: "#Vaxta nəzarət",
  communicative: "#Ünsiyyətcil",
  punctual: "#Dəqiq",
  professional: "#Peşəkar",
  experienced: "#Təcrübəli",
  efficient: "#Səmərəli",
  agile: "#Çevik",
  patient: "#Səbirli",
};

export default function ReviewProfession({ masterId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("newest");

  const sortOptions = [
    { label: "Ən yenilər", value: "newest", apiParam: "-created_at" },
    { label: "Ən yüksək reytinq", value: "highest", apiParam: "-rating" },
    { label: "Ən aşağı reytinq", value: "lowest", apiParam: "rating" },
  ];

  const fetchReviews = useCallback(async () => {
    if (!masterId) {
      setError("Master ID mövcud deyil. Rəylər yüklənmədi.");
      setLoading(false);
      setReviews([]);
      return;
    }

    setLoading(true);
    setError(null);
    setReviews([]);

    try {
      const sortParam =
        sortOptions.find((option) => option.value === selectedSortOption)
          ?.apiParam || "";
      const url = `https://api.peshekar.online/api/v1/professionals/${masterId}/reviews/${
        sortParam ? `?ordering=${sortParam}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched reviews data:", data);

      const formattedReviews = (data.results || []).map((apiReview) => ({
        id: apiReview.id,
        reviewerName: apiReview.user
          ? apiReview.user.username ||
            `${apiReview.user.first_name || ""} ${
              apiReview.user.last_name || ""
            }`.trim() ||
            "Anonim hesab"
          : "Anonim hesab",
        isAnonymous:
          !apiReview.user ||
          (!apiReview.user.username &&
            !apiReview.user.first_name &&
            !apiReview.user.last_name),
        rating: apiReview.rating,
        date: new Date(apiReview.created_at).toLocaleDateString("az-AZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        text: apiReview.comment,
        tags: apiReview.tags
          ? Object.entries(apiReview.tags)
              .filter(([, value]) => value === true)
              .map(([key]) => TAG_DISPLAY_MAPPING[key])
              .filter(Boolean)
          : [],
        imageUrl: getImageUrl(
          apiReview.review_images && apiReview.review_images.length > 0
            ? apiReview.review_images[0].image
            : undefined
        ),
        profileImageUrl: getImageUrl(
          apiReview.user ? apiReview.user.profile_image : undefined
        ),
      }));
      setReviews(formattedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [masterId, selectedSortOption]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const calculateRatingDistribution = (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });

    const totalReviews = reviews.length;
    const percentages = {};
    for (let i = 1; i <= 5; i++) {
      percentages[i] =
        totalReviews > 0 ? (distribution[i] / totalReviews) * 100 : 0;
    }
    return { distribution, percentages, totalReviews };
  };

  const calculateOverallRating = (reviews) => {
    if (reviews.length === 0) return { average: 0, total: 0 };
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      average: (totalRating / reviews.length).toFixed(1),
      total: reviews.length,
    };
  };

  const { distribution, percentages, totalReviews } =
    calculateRatingDistribution(reviews);
  const { average: overallAverage, total: overallTotal } =
    calculateOverallRating(reviews);

  const [showMoreReview, setShowMoreReview] = useState(false);

  const POPULAR_TAGS = [
    "#Məsuliyyət",
    "#Səliqə",
    "#Çevik",
    "#Vaxta nəzarət",
    "#Dəqiq",
  ];

  return (
    <div>
      <div className="mx-auto p-6 max-w-[1400px] bg-white rounded-lg">
        <h2 className="font-bold text-2xl text-cyan-900 mb-6">
          Reytinq və rəylər
        </h2>

        <div className="flex flex-col md:flex-row w-full gap-4 mb-10">
          <div className="w-full md:w-[70%] flex flex-col md:flex-row rounded-xl overflow-hidden bg-gray-50">
            <div className="w-full md:w-[35%] flex flex-col items-center justify-center py-4 border-r border-gray-400">
              <div className="text-5xl font-bold text-cyan-900">
                {overallAverage}
              </div>
              <div className="flex text-yellow-400 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={
                      star <= Math.round(Number.parseFloat(overallAverage))
                        ? "fill-yellow-400"
                        : ""
                    }
                  />
                ))}
              </div>
              <p className="text-gray-600">Toplam {overallTotal} rəy</p>
            </div>

            <div className="w-full md:w-[65%] p-4">
              <h3 className="font-semibold text-[20px] mb-4">
                Reytinq bölgüsü
              </h3>
              {Object.entries(distribution)
                .sort(
                  ([a, _], [b, __]) => Number.parseInt(b) - Number.parseInt(a)
                )
                .map(([star, count]) => (
                  <div key={star} className="flex items-center mb-2">
                    <span className="w-4 text-sm font-medium">{star}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-cyan-900 rounded-full"
                        style={{
                          width: `${percentages[Number.parseInt(star)]}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full md:w-[30%] p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-[20px] mb-4">
              Haqqında etiketlər
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#CDE4F2] p-3 rounded-xl text-[#1a4862]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <h3 className="font-bold text-cyan-900 text-xl mb-2">
              Müştəri Rəyləri
            </h3>

            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="inline-flex justify-between items-center w-[200px] px-2 py-3 rounded-xl bg-cyan-900 text-white shadow hover:bg-cyan-800 transition-colors"
              >
                <span>
                  Sırala üzrə:{" "}
                  {sortOptions.find(
                    (option) => option.value === selectedSortOption
                  )?.label || "Ən yenilər"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isSelectOpen && (
                <div className="absolute left-0 mt-2 w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedSortOption(option.value);
                        setIsSelectOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-100 ${
                        selectedSortOption === option.value ? "bg-cyan-100" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <p className="text-center text-gray-600">Rəylər yüklənir...</p>
            ) : error ? (
              <p className="text-center text-red-500">
                Rəylər yüklənərkən xəta baş verdi: {error}
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-600">
                Hələ heç bir rəy yoxdur. İlk rəyi siz yazın!
              </p>
            ) : (
              reviews.map((review, index) => {
                if (index > 0 && !showMoreReview) {
                  return null;
                }
                return (
                  <div
                    key={review.id}
                    className="p-4 shadow-sm rounded-lg bg-white"
                  >
                    <div className="p-0">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          <img
                            src={
                              getImageUrl(review.profileImageUrl) ||
                              "/placeholder.svg"
                            }
                            alt={review.reviewerName}
                            className="rounded-full w-full h-full object-cover"
                          />
                          {!review.profileImageUrl && (
                            <span>{review.reviewerName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {review.reviewerName}
                          </p>
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? "fill-yellow-400" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="ml-auto text-sm text-gray-500">
                          {review.date}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.text}</p>
                      {review.imageUrl && (
                        <img
                          src={
                            getImageUrl(review.imageUrl) || "/placeholder.svg"
                          }
                          alt="Review image"
                          width={200}
                          height={150}
                          className="rounded-lg object-cover mb-3"
                        />
                      )}
                      <div className="flex flex-wrap gap-2">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#cde4f2] text-[#1a4862]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {overallTotal > 1 && (
          <div className="flex justify-center w-full mt-8">
            <button
              onClick={() => setShowMoreReview(!showMoreReview)}
              className="px-6 py-3 border border-cyan-900 text-cyan-900 hover:bg-blue-50 rounded-md w-full"
            >
              {!showMoreReview ? `Hamısına bax (${overallTotal})` : "Kiçilt"}
            </button>
          </div>
        )}
        <div className="flex justify-end mt-4 mr-10">
          <Link
            to={`/reviews/${masterId}`}
            className="px-6 py-3 bg-cyan-900 hover:bg-cyan-800 text-white rounded-md  text-center"
          >
            Rəyinizi bizimlə bölüşün
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
