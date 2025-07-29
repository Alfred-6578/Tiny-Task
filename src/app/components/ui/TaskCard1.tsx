// components/TaskCard.tsx
"use client";

import { FC } from "react";
import { cn } from "@/lib/utils"; 
import { Badge } from "./Badge";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "./Button";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    skillTags: string[];
    price: number;
    location: string;
    isRemote: boolean;
    taskDeadline: string; // ISO string
    status: "open" | "in-progress" | "completed" | "cancelled";
    applications?: any[];
    postedBy: {
      displayName: string;
      profilePicUrl?: string;
      tier?: string;
    };
  };
  onClick?: () => void;
}

export const TaskCard1: FC<TaskCardProps> = ({ task, onClick }) => {
  const deadline = formatDistanceToNowStrict(new Date(task.taskDeadline), {
    addSuffix: true,
  });

  const statusColorMap = {
    open: "bg-green-100 text-green-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div
      className="w-full p-4 border border-bg-light shadow rounded-2xl  bg-white space-y-3 hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      {/* Poster info */}
      <div className="flex items-center gap-3">
        <img
          src={task.postedBy.profilePicUrl || "/default-avatar.png"}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{task.postedBy.displayName}</p>
          {task.postedBy.tier && (
            <p className="text-xs text-muted-foreground">Tier {task.postedBy.tier}</p>
          )}
        </div>
      </div>

      {/* Task title */}
      <h2 className="text-base font-bold">{task.title}</h2>

      {/* Description preview */}
      <p className="text-sm text-gray-600 line-clamp-2">
        {task.description}
      </p>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-1">
        {task.skillTags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Price and Deadline */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-sm font-semibold text-green-600">
          ₦{task.price.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">Due {deadline}</div>
      </div>

      {/* Location and Applicants */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{task.isRemote ? "Remote" : task.location}</span>
        {task?.applications && task?.applications?.length > 0 && (
          <span>{task.applications.length} applied</span>
        )}
      </div>

      {/* Status badge or Apply button */}
      <div className="pt-2">
        {task.status === "open" ? (
          <Button variant="primary" className="w-full text-sm">
            Apply
          </Button>
        ) : (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              statusColorMap[task.status]
            )}
          >
            {task.status.replace("-", " ").toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
