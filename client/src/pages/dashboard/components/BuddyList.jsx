import React, { useRef } from "react";
import BuddyCard from "./BuddyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const BuddyList = ({ buddies, loading, fetchMoreBuddies }) => {
  const scrollRef = useRef(null);


  return (
    <div className="w-[100%] h-[450px] overflow-hidden flex items-center justify-center">
      
      <Carousel
      opts={{
        align: "start",
         // Enable looping for smooth experience
        duration: 20, // Smooth sliding
      }}
      className="w-[92%]"
    >
      <CarouselContent >
        {loading? Array.from({ length: 6 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5
          ">
            <div className="p-1">
            <BuddyCard key={index}  loading={true} />
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



