import React, { useRef, useEffect } from "react";
import GroupCard from "./GroupCard";

const GroupList = ({ groups, loading, fetchMoreGroups }) => {
  const scrollRef = useRef(null);

  // Check if the user has scrolled near the end
  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // Trigger fetch if scrolled near the end
      if (scrollWidth - scrollLeft - clientWidth < 100) {
        fetchMoreGroups();
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => <GroupCard key={idx} loading={true} />)
        : groups.map((group) => <GroupCard key={group.id} group={group} loading={false} />)}
    </div>
  );
};

export default GroupList;
