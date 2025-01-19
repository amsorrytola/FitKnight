import React, { useState } from "react";
import { Card, CardHeader, CardContent} from "../../../components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "../../../components/ui/dialog";
import { Skeleton } from "../../../components/ui/skeleton"

const GroupCard = ({ group, loading }) => {
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card
        className="w-full max-w-sm shadow-lg cursor-pointer hover:shadow-xl transition-all"
        onClick={() => setOpen(true)}
      >
        <CardHeader>
          <img
            src={group.image || "/placeholder-group.png"}
            alt={group.name}
            className="h-32 w-full rounded-lg object-cover"
          />
        </CardHeader>
        <CardContent>
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="text-sm text-gray-600">{group.shortDescription}</p>
          <p className="text-xs text-gray-500 mt-1">{`Admin: ${group.adminName}`}</p>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <h3 className="text-xl font-bold">{group.name}</h3>
          </DialogHeader>
          <div>
            {/* Group details go here */}
            <p className="text-gray-600">{group.shortDescription}</p>
            <p className="text-sm text-gray-500">{`Admin: ${group.adminName}`}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupCard;
