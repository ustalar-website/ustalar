import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import Sidebar from "../sidebar";
import ReviewDisplay from "../components/review-display";
import ReviewForm from "../components/review-form";

export default function ReviewPage() {
  const { masterId } = useParams();

  useEffect(() => {
    console.log("Master ID:", masterId);
    if (!masterId) {
      console.error("Master ID is undefined!");
    }
  }, [masterId]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <ReviewDisplay masterId={masterId} />
        <ReviewForm masterId={masterId} />
      </div>
    </div>
  );
}
