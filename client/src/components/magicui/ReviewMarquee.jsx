/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils"
import { Marquee } from "./marquee"

const reviews = [
  {
    name: "Aarav Patel",
    username: "@aarav_tech",
    body: "The financial advice I received was game-changing for my startup. Highly recommended!",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
  },
  {
    name: "Rohan Sharma",
    username: "@rohan_biz",
    body: "Found an expert in minutes. The 1:1 session clarified my tax situation completely.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
  },
  {
    name: "Priya Malik",
    username: "@priya_edu",
    body: "My son struggled with calculus until we found a tutor here. His grades have improved drastically.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
    {
    name: "Dev Patel",
    username: "@dev_marketing",
    body: "Incredible value. The marketing strategy session save me months of trial and error.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
  },
    {
    name: "Ananya Gupta",
    username: "@ananya_g",
    body: "I love how easy it is to book appointments. The platform is seamless and professional.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
  },
    {
    name: "Arjun Verma",
    username: "@arjun_v",
    body: "The best investment I've made for my career development this year.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)
const thirdRow = reviews.slice(0, reviews.length / 2)
const fourthRow = reviews.slice(reviews.length / 2)

import SpotlightCard from "../SpotlightCard";

const ReviewCard = ({
  img,
  name,
  username,
  body,
}) => {
  return (
    <SpotlightCard
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300", // Increased width slightly
        "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 dark:bg-gray-800 dark:border-gray-700 dark:shadow-none dark:hover:border-indigo-500",
      )}
      spotlightColor="rgba(255, 255, 255, 0.25)"
    >
      <div className="flex flex-row items-center gap-3">
        <img className="rounded-full bg-gray-100 p-0.5 dark:bg-gray-700" width="36" height="36" alt={name} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{username}</p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-gray-600 leading-relaxed dark:text-gray-300">{body}</blockquote>
    </SpotlightCard>
  )
}

export function Marquee3D() {
  return (
    <div className="relative flex h-[500px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <Marquee pauseOnHover vertical className="[--duration:30s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:30s]" vertical>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:30s]" vertical>
          {thirdRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:30s]" vertical>
          {fourthRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-gray-50 via-gray-50/20 to-transparent dark:from-gray-900 dark:via-gray-900/20"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent dark:from-gray-900 dark:via-gray-900/20"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-50 via-gray-50/20 to-transparent dark:from-gray-900 dark:via-gray-900/20"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-50 via-gray-50/20 to-transparent dark:from-gray-900 dark:via-gray-900/20"></div>
    </div>
  )
}
