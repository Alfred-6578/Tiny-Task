import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { MoreVertical, Heart, Users, Calendar, MapPin, Tag } from 'lucide-react';
import {BsHeart, BsHeartFill } from 'react-icons/bs';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { doc, setDoc, increment, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';


export type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string;
    postedBy: {
      userId: string;
      displayName: string;
      tier: number;
      profilePicUrl: string;
    };
    skillTags: string[];
    isUrgent: boolean;
    price: number;
    status: "open" | "in_progress" | "completed" | "cancelled" | string;
    taskDeadline: string;
    applicationDeadline: string;
    location: string;
    city: string;
    state: string;
    isRemote: boolean;
    createdAt: string;
    updatedAt: string;
    likesCount: number,
    selectedTasker: string | null;
    applicationCount: number;
    taskCompletion: {
      confirmedByPoster: boolean;
      confirmedByTasker: boolean;
      completedAt: string | null;
    };
    paymentAgreement: {
      agreedAmount: number;
      agreedMethod: string;
      paid: boolean;
      proofOfPaymentUrl: string | null;
    };
    reports: any[];
    tierRequirement: number | null;
  };
  onClick?: () => void;
  userId : string;
};


export const TaskCard: FC<TaskCardProps> = ({ task, userId }) => {
  const {
    id,
    title,
    description,
    price,
    postedBy,
    skillTags,
    location,
    city,
    state,
    tierRequirement,
    applicationCount,
    likesCount,
    isUrgent,
    isRemote

  } = task;
  
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likesCount?? 0)

  
  const toggleLike = async ()=>{
    if (liked) {
      setLiked(false)
      setLikeCount((prev)=> prev - 1 )
    }else{
      setLiked(true)
      setLikeCount((prev)=> prev + 1 )
    }


    try {
      const likeRef = doc(db, "tasks", task.id, "likes", userId);
      const taskRef = doc(db, "tasks", task.id);

      if (!liked) {
        await setDoc(likeRef, {
          createdAt: new Date()
        });

        await updateDoc(taskRef, {
          likesCount: increment(1)
        });
      }else{
        await deleteDoc(likeRef);
        await updateDoc(taskRef, {
          likesCount: increment(-1)
        });
      }
      
    } catch (error) {
      console.error("Failed to like task")

      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  }



  const deadline = formatDistanceToNowStrict(new Date(task?.taskDeadline), {
      addSuffix: true,
  });
  const postedAgo = formatDistanceToNowStrict(new Date(task?.createdAt), { addSuffix: true });


  useEffect(() => {
    if (!userId || !task?.id) return;
   
    const likeRef = doc(db, "tasks", task.id, "likes", userId);
      
    getDoc(likeRef).then((snap) => {
      setLiked(snap.exists());
    });
  }, [task?.id, userId]);

 
  return (
    <div className="bg-white border flex flex-col justify-between border-gray-200 shadow-sm rounded-2xl p-4 w-full max-w-[calc(100vw-48px)] mx-auto transition-transform duration-300">
      <div className="">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Link href={`/users/${postedBy.userId}`} className="font-semibold text-black hover:underline capitalize">@{postedBy.displayName}</Link >
            {/* <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">Tier {tierRequirement}</span> */}
            <span className="mx-1">•</span>
            <span>{postedAgo}</span>
          </div>
          <MoreVertical className="w-4 h-4 cursor-pointer" />
        </div>

        <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          {
            isRemote? "Remote"
            :<span>{city},{state}</span>

          }
        </div>

        <h2 className="mt-3 text-base font-semibold text-gray-900 truncate-1-line">
          {title}
        </h2>

        <p className="text-sm text-gray-600 mt-1 truncate-2-lines">
          {description}
        </p>
      </div>

      <div className="">
        <div className="flex items-center justify-between mt-4 text-sm font-medium">
          <span className="text-green-600 font-semibold">₦{price}</span>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Due {deadline}</span>
          </div>
        </div>

        
        <div className="flex flex-wrap gap-2 mt-2">
          {
            skillTags.map((tag, i)=>(
              <span key={i} className={`flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full`}>
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))
          }
        { isUrgent &&
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
            <Tag className="w-3 h-3" /> Urgent
          </span>
          }
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span onClick={toggleLike} className='cursor-pointer'>
              {
                !liked ?
                <Heart className="w-4 h-4 text-red-500" />
                :
                <BsHeartFill className="w-4 h-4 text-red-500"/>
              }
            </span>
            <span>{likeCount} Likes</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{applicationCount } { applicationCount !== 1 ? 'Applicants' : 'Applicant' }</span>
          </div>
        </div>

        <div className="mt-4 flex w-full">
          <Link href={`/tasks/${id}`} className='w-full'>
            <button className="w-full bg-primary cursor-pointer text-white text-sm py-2 rounded-full hover:bg-gray-800 transition">
              Apply For Task
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
