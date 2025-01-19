import React, { useRef } from "react";
import BuddyCard from "./BuddyCard";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const BuddyList = ({ buddies, loading, fetchMoreBuddies }) => {
  const scrollRef = useRef(null);

  // Handle scrolling to trigger loading more buddies
  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // Trigger fetchMoreBuddies if near the end
      if (scrollWidth - scrollLeft - clientWidth < 100) {
        fetchMoreBuddies();
      }
    }
  };

  return (
    <div className="w-[100%] h-[450px] overflow-hidden flex items-center justify-center">
      {/* <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-[100%] overflow-x-auto space-x-6 p-4 h-full scrollbar-hide flex items-center justify-center"
        style={{
          scrollBehavior: "smooth",

          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
          WebkitOverflowScrolling: "touch", // Enables smooth scrolling
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <BuddyCard key={idx} loading={true} />
            ))
          : buddies.map((buddy) => (
              <BuddyCard key={buddy._id} buddy={buddy} loading={false} />
            
            ))}
      </div> */}
      <Carousel
      opts={{
        align: "start",
      }}
      className="w-[92%]"
    >
      <CarouselContent >
        {loading? Array.from({ length: 6 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
            <BuddyCard key={index} loading={true} />
            </div>
          </CarouselItem>
        )) : buddies.map((buddy,index)=>(
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
            <div className="">
            <BuddyCard key={buddy._id} buddy={buddy} loading={false} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
  );
};

export default BuddyList;



