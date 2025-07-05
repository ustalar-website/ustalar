import React from "react";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";  
export default function EcomCard({
  professional,
  categoryName,
  specialityName,
  cityNames,
}) {
  
  const displayRating = professional.rating?.toFixed(1) || "N/A";
  const displayReviewCount = professional.reviewCount || 0;
  const navigate = useNavigate();
  const masterId= professional.id;  
  const displayTags = professional.tags || [];
    const handleClick = () => {
    navigate(`/master/${professional.id}`);
  };

  const locationText =
    cityNames && cityNames.length > 0 ? cityNames.join(", ") : "Yer yoxdur";

  return (
    <div className="w-full max-w-[300px] mx-auto h-[400px] rounded-lg shadow-md overflow-hidden bg-white flex flex-col">
      <div className="relative w-full h-48">
        <img
          src={
            professional.profile_image ||
            "/placeholder.svg?height=192&width=256"
          }
          alt={professional.full_name}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-xl">
            {professional.profession_speciality || categoryName}
          </h3>
          {professional.rating > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-semibold">{displayRating}</span>
              <span className="text-sm text-gray-500 ml-1">
                ({displayReviewCount})
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-2">
          {professional.full_name}
          {specialityName && ` - ${specialityName}`}
        </p>

        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{locationText}</span>
        </div>
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {displayTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#cde4f2] text-[#1a4862]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto">
          <button  onClick={handleClick} className="w-full bg-[#1A4862] text-white py-2 rounded-lg font-medium cursor-pointer border border-[#1A4862] hover:bg-white hover:text-[#1A4862] transition hover: motion-reduce:transition-none motion-reduce:hover:transform-none">
            Ətraflı
          </button>
        </div>
      </div>
    </div>
  );
}