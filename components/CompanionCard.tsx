"use client";
import { removeBookmark } from "@/lib/actions/companion.actions";
import { addBookmark } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const handleBookmark = async () => {
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(id, pathname);
        setIsBookmarked(false);
        toast.success("Bookmark removed!");
      } else {
        await addBookmark(id, pathname);
        setIsBookmarked(true);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 300);
        toast.success("Bookmarked successfully!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button 
          className={`companion-bookmark ${isLoading ? 'opacity-50' : ''} ${showSuccessAnimation ? 'bookmark-success' : ''}`} 
          onClick={handleBookmark}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="w-3 h-3" />
          ) : (
            <Image
              src={isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
              alt="bookmark"
              width={12.5}
              height={15}
            />
          )}
        </button>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image
          src="/icons/clock.svg"
          alt="duration"
          width={13.5}
          height={13.5}
        />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`/companions/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">
          Launch Lesson
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;
