import React, { useRef } from "react";
import GroupCard from "./GroupCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const GroupList = ({ groups, loading, fetchMoreGroups }) => {
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
        <CarouselContent>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/5"
                >
                  <div className="p-1">
                    <GroupCard key={index} loading={true} />
                  </div>
                </CarouselItem>
              ))
            : groups.map((group, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
                  <div className="">
                    <GroupCard key={group._id} group={group} loading={false} />
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

export default GroupList;
