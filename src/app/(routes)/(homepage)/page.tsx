"use client"

import { Badge } from '@/app/components/ui/Badge';
import { TaskCard } from '@/app/components/ui/TaskCard';
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { mapAuthFirebaseError } from '@/lib/utils';
import { onAuthStateChanged } from 'firebase/auth';

// const tasks = [
//   {
//     id: "task001",
//     title: "Design a flier for school event",
//     description: "Need a simple flier for a student event. Must be delivered within 2 days.",
//     postedBy: {
//       userId: "userA123",
//       displayName: "Chinedu",
//       tier: 2,
//       profilePicUrl: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//     skillTags: ["Graphics", "Design", "Canva"],
//     isUrgent: false,
//     price: 2000,
//     status: "open",
//     taskDeadline: "2025-08-01T23:59:00.000Z",
//     applicationDeadline: "2025-07-29T23:59:00.000Z",
//     location: "Lagos, Nigeria",
//     isRemote: true,
//     likes: 10,
//     createdAt: "2025-07-27T09:00:00.000Z",
//     updatedAt: "2025-07-27T09:00:00.000Z",
//     selectedTasker: "userC789",
//     applications: [
//       {
//         userId: "userB456",
//         displayName: "Amaka",
//         tier: 1,
//         profilePicUrl: "https://randomuser.me/api/portraits/women/45.jpg",
//         coverMessage: "I'm good with Canva and can finish it today.",
//         appliedAt: "2025-07-27T10:15:00.000Z",
//         status: "rejected",
//       },
//       {
//         userId: "userC789",
//         displayName: "Tomiwa",
//         tier: 3,
//         profilePicUrl: "https://randomuser.me/api/portraits/men/76.jpg",
//         coverMessage: "Professional designer. Fast turnaround.",
//         appliedAt: "2025-07-27T10:35:00.000Z",
//         status: "accepted",
//       }
//     ],
//     taskCompletion: {
//       confirmedByPoster: true,
//       confirmedByTasker: true,
//       completedAt: "2025-07-30T15:00:00.000Z",
//     },
//     paymentAgreement: {
//       agreedAmount: 2000,
//       agreedMethod: "WhatsApp Chat / Direct Bank Transfer",
//       paid: true,
//       proofOfPaymentUrl: "https://example.com/payment1.jpg",
//     },
//     reports: [],
//     tierRequirement: null,
//   },

//   {
//     id: "task002",
//     title: "Run a market errand in Yaba",
//     description: "Buy and deliver vegetables to my aunt before 3PM.",
//     postedBy: {
//       userId: "userD111",
//       displayName: "Halima",
//       tier: 1,
//       profilePicUrl: "https://randomuser.me/api/portraits/women/22.jpg",
//     },
//     skillTags: ["Errand", "Physical"],
//     isUrgent: true,
//     price: 1500,
//     status: "open",
//     taskDeadline: "2025-07-26T15:00:00.000Z",
//     applicationDeadline: "2025-07-26T12:00:00.000Z",
//     location: "Yaba, Lagos",
//     isRemote: false,
//     likes: 13,
//     createdAt: "2025-07-25T09:00:00.000Z",
//     updatedAt: "2025-07-26T16:00:00.000Z",
//     selectedTasker: "userG888",
//     applications: [
//       {
//         userId: "userG888",
//         displayName: "Musa",
//         tier: 2,
//         profilePicUrl: "https://randomuser.me/api/portraits/men/29.jpg",
//         coverMessage: "I'm nearby and can pick it up quickly.",
//         appliedAt: "2025-07-25T10:00:00.000Z",
//         status: "accepted",
//       }
//     ],
//     taskCompletion: {
//       confirmedByPoster: true,
//       confirmedByTasker: true,
//       completedAt: "2025-07-26T15:00:00.000Z",
//     },
//     paymentAgreement: {
//       agreedAmount: 1500,
//       agreedMethod: "Cash on Delivery",
//       paid: true,
//       proofOfPaymentUrl: null,
//     },
//     reports: [],
//     tierRequirement: null,
//   },

//   {
//     id: "task003",
//     title: "Proofread my final year thesis",
//     description: "Final year project document needs a grammar check and formatting help.",
//     postedBy: {
//       userId: "userE999",
//       displayName: "Tosin",
//       tier: 3,
//       profilePicUrl: "https://randomuser.me/api/portraits/men/91.jpg",
//     },
//     skillTags: ["Writing", "Editing", "Remote"],
//     isUrgent: false,
//     price: 3000,
//     status: "open",
//     taskDeadline: "2025-07-28T20:00:00.000Z",
//     applicationDeadline: "2025-07-27T22:00:00.000Z",
//     location: "Remote",
//     isRemote: true,
//     likes: 18,
//     createdAt: "2025-07-26T14:00:00.000Z",
//     updatedAt: "2025-07-28T20:30:00.000Z",
//     selectedTasker: "userB456",
//     applications: [
//       {
//         userId: "userB456",
//         displayName: "Amaka",
//         tier: 1,
//         profilePicUrl: "https://randomuser.me/api/portraits/women/45.jpg",
//         coverMessage: "Experienced with academic writing and editing.",
//         appliedAt: "2025-07-26T15:10:00.000Z",
//         status: "accepted",
//       }
//     ],
//     taskCompletion: {
//       confirmedByPoster: true,
//       confirmedByTasker: true,
//       completedAt: "2025-07-28T20:10:00.000Z",
//     },
//     paymentAgreement: {
//       agreedAmount: 3000,
//       agreedMethod: "Transfer",
//       paid: true,
//       proofOfPaymentUrl: "https://example.com/payment3.png",
//     },
//     reports: [],
//     tierRequirement: 1,
//   },


//   {
//     id: "task004",
//     title: "Edit a short TikTok video",
//     description: "1-minute video, needs captions and transitions.",
//     postedBy: {
//       userId: "userZ321",
//       displayName: "Uche",
//       tier: 2,
//       profilePicUrl: "https://randomuser.me/api/portraits/men/15.jpg",
//     },
//     skillTags: ["Video", "Editing", "CapCut"],
//     price: 2500,
//     status: "open",
//     isUrgent: false,
//     taskDeadline: "2025-07-30T10:00:00.000Z",
//     applicationDeadline: "2025-07-29T12:00:00.000Z",
//     location: "Remote",
//     isRemote: true,
//     likes: 10,
//     createdAt: "2025-07-27T08:45:00.000Z",
//     updatedAt: "2025-07-30T10:30:00.000Z",
//     selectedTasker: "userC789",
//     applications: [
//       {
//         userId: "userC789",
//         displayName: "Tomiwa",
//         tier: 3,
//         profilePicUrl: "https://randomuser.me/api/portraits/men/76.jpg",
//         coverMessage: "Editing TikToks is my thing! Will deliver in hours.",
//         appliedAt: "2025-07-27T09:10:00.000Z",
//         status: "accepted",
//       }
//     ],
//     taskCompletion: {
//       confirmedByPoster: true,
//       confirmedByTasker: true,
//       completedAt: "2025-07-30T10:00:00.000Z",
//     },
//     paymentAgreement: {
//       agreedAmount: 2500,
//       agreedMethod: "Bank Transfer",
//       paid: true,
//       proofOfPaymentUrl: "https://example.com/payment4.jpg",
//     },
//     reports: [],
//     tierRequirement: null,
//   },

//   {
//     id: "task005",
//     title: "Translate a short document to French",
//     description: "A single-page contract, needs accurate French translation.",
//     postedBy: {
//       userId: "userL456",
//       displayName: "Ayomide",
//       tier: 3,
//       profilePicUrl: "https://randomuser.me/api/portraits/women/60.jpg",
//     },
//     skillTags: ["Translation", "French"],
//     isUrgent: false,
//     price: 3000,
//     status: "open",
//     taskDeadline: "2025-07-28T22:00:00.000Z",
//     applicationDeadline: "2025-07-27T22:00:00.000Z",
//     location: "Remote",
//     isRemote: true,
//     likes: 12,
//     createdAt: "2025-07-26T11:30:00.000Z",
//     updatedAt: "2025-07-28T22:30:00.000Z",
//     selectedTasker: "userB456",
//     applications: [
//       {
//         userId: "userB456",
//         displayName: "Amaka",
//         tier: 1,
//         profilePicUrl: "https://randomuser.me/api/portraits/women/45.jpg",
//         coverMessage: "I'm fluent in French. I’ll translate it accurately.",
//         appliedAt: "2025-07-26T12:00:00.000Z",
//         status: "accepted",
//       }
//     ],
//     taskCompletion: {
//       confirmedByPoster: true,
//       confirmedByTasker: true,
//       completedAt: "2025-07-28T21:50:00.000Z",
//     },
//     paymentAgreement: {
//       agreedAmount: 3000,
//       agreedMethod: "Transfer",
//       paid: true,
//       proofOfPaymentUrl: null,
//     },
//     reports: [],
//     tierRequirement: null,
//   },

//   {
//     id: "task006",
//     title: "Create a meme flyer for WhatsApp promotion",
//     description: "Needs to look funny, should attract attention.",
//     postedBy: {
//       userId: "userF000",
//       displayName: "Blessing",
//       tier: 2,
//       profilePicUrl: "https://randomuser.me/api/portraits/women/18.jpg",
//     },
//     skillTags: ["Design", "Funny", "Social"],
//     isUrgent: false,
//     price: 1000,
//     status: "open",
//     taskDeadline: "2025-07-25T17:00:00.000Z",
//     applicationDeadline: "2025-07-24T21:00:00.000Z",
//     location: "Abeokuta, Ogun",
//     isRemote: true,
//     likes: 14,
//     createdAt: "2025-07-23T09:30:00.000Z",
//     updatedAt: "2025-07-25T17:30:00.000Z",
//     selectedTasker: "userG888",
//     applications: [
//       {
//         userId: "userG888",
//         displayName: "Musa",
//         tier: 2,
//         profilePicUrl: "https://randomuser.me/api/portraits/men/29.jpg",
//         coverMessage: "Funny memes are my style, I’ll do it fast.",
//         appliedAt: "2025-07-23T11:00:00.000Z",
//         status: "accepted",
//       }
//     ],
//     taskCompletion: {
//       confirmedByPoster: true,
//       confirmedByTasker: true,
//       completedAt: "2025-07-25T17:00:00.000Z",
//     },
//     paymentAgreement: {
//       agreedAmount: 1000,
//       agreedMethod: "Direct Transfer",
//       paid: true,
//       proofOfPaymentUrl: "https://example.com/meme-task-proof.png",
//     },
//     reports: [],
//     tierRequirement: null,
//   },

//   {
//     id: "taskA7r4Hd8L",
//     title: "Run errands in Yaba",
//     description: "Need help picking up groceries and dropping off parcels today before 6pm.",
//     postedBy: {
//       userId: "userD321",
//       displayName: "Bola",
//       tier: 1,
//       profilePicUrl: "https://...",
//     },
//     skillTags: ["Errands", "Delivery"],
//     isUrgent: true,
//     price: 2500,
//     status: "open",
//     taskDeadline: "2025-07-28T18:00:00.000Z",
//     applicationDeadline: "2025-07-27T16:00:00.000Z",
//     location: "Yaba, Lagos",
//     isRemote: false,
//     likes: 8,
//     createdAt: "2025-07-27T11:00:00.000Z",
//     updatedAt: "2025-07-27T11:00:00.000Z",
//     selectedTasker: null,
//     applications: [],
//     taskCompletion: {
//       confirmedByPoster: false,
//       confirmedByTasker: false,
//       completedAt: null,
//     },
//     paymentAgreement: {
//       agreedAmount: 2500,
//       agreedMethod: "WhatsApp Chat / Bank Transfer",
//       paid: false,
//       proofOfPaymentUrl: null,
//     },
//     reports: [],
//     tierRequirement: 1,
//   },

//   {
//     id: "taskPq29LmDc",
//     title: "Translate a short doc to Hausa",
//     description: "Need someone fluent in Hausa to translate a 2-page document within 24 hours.",
//     postedBy: {
//       userId: "userE876",
//       displayName: "Zainab",
//       tier: 3,
//       profilePicUrl: "https://...",
//     },
//     skillTags: ["Translation", "Hausa"],
//     isUrgent: true,
//     price: 3000,
//     status: "open",
//     taskDeadline: "2025-07-28T10:00:00.000Z",
//     applicationDeadline: "2025-07-27T20:00:00.000Z",
//     location: "Remote",
//     isRemote: true,
//     likes: 10,
//     createdAt: "2025-07-27T12:45:00.000Z",
//     updatedAt: "2025-07-27T12:45:00.000Z",
//     selectedTasker: null,
//     applications: [
//       {
//         userId: "userF456",
//         displayName: "Abdul",
//         tier: 2,
//         profilePicUrl: "https://...",
//         coverMessage: "Native Hausa speaker, can deliver fast.",
//         appliedAt: "2025-07-27T13:05:00.000Z",
//         status: "pending",
//       },
//     ],
//     taskCompletion: {
//       confirmedByPoster: false,
//       confirmedByTasker: false,
//       completedAt: null,
//     },
//     paymentAgreement: {
//       agreedAmount: 3000,
//       agreedMethod: "WhatsApp Chat / Bank Transfer",
//       paid: false,
//       proofOfPaymentUrl: null,
//     },
//     reports: [],
//     tierRequirement: null,
//   },

//   {
//     id: "taskXz98EfY2",
//     title: "Fix broken zipper on jeans",
//     description: "Looking for someone who can quickly fix a zipper on a pair of jeans. Located near Lekki.",
//     postedBy: {
//       userId: "userG334",
//       displayName: "Ifeanyi",
//       tier: 2,
//       profilePicUrl: "https://...",
//     },
//     skillTags: ["Tailoring", "Repairs"],
//     isUrgent: true,
//     price: 1500,
//     status: "open",
//     taskDeadline: "2025-07-29T15:00:00.000Z",
//     applicationDeadline: "2025-07-28T12:00:00.000Z",
//     location: "Lekki, Lagos",
//     isRemote: false,
//     likes: 15,
//     createdAt: "2025-07-27T14:20:00.000Z",
//     updatedAt: "2025-07-27T14:20:00.000Z",
//     selectedTasker: null,
//     applications: [],
//     taskCompletion: {
//       confirmedByPoster: false,
//       confirmedByTasker: false,
//       completedAt: null,
//     },
//     paymentAgreement: {
//       agreedAmount: 1500,
//       agreedMethod: "WhatsApp Chat / Bank Transfer",
//       paid: false,
//       proofOfPaymentUrl: null,
//     },
//     reports: [],
//     tierRequirement: 1,
//   }
// ];



const page = () => {
    const [selected, setSelected] = useState<string[]>(['all'])
    const [tasks, setTasks] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [pageLoading, setPageLoading] = useState(false)
    

    const selectTag = (tag:string) =>{
        if (tag == 'all') {
            setSelected(['all'])
        }else{
            const filtered = selected.filter(t => t !== 'all');
                if (filtered.includes(tag)) {
                    if (selected.length > 1) {
                        setSelected(filtered.filter(t => t !== tag));
                    }else{
                        setSelected(['all'])
                    }
                } else {
                setSelected([...filtered, tag]);
                }
            
           
        }
    }

  const getAllTasks = async ()=> {
    try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(tasks);
        setTasks(tasks)
    } catch (error:any) {
        const errorCode = error.code || ""; 
        const errorMessage = mapAuthFirebaseError(errorCode);    
    }
   
    
  }

   useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            setUser(null);
            setPageLoading(false);
            return;
          }
  
            setUser(user); 
            getAllTasks()
         
      });
  
    return () => unsubscribe();
      }, []); 
  useEffect(()=>{
  },[])

  return (
    <div className='pb-20 md:pt-28'>
        <div className="md:hidden flex gap-2 items-center w-full p-2.5 rounded-full bg-gray-100 mb-4">
            <Search size={18}/>
            <input type="text" className='w-full placeholder:text-sm text-sm text-gray-500' placeholder='Search Tasks'/>
        </div>
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap mb-5 scrollbar-hide">
            {
                ['all','design','translation','tailoring','web developemnt','errands','delivery','editing','canva','errand','graphics','writing','remote','physical'].map((tag,i)=>(
                  <Badge onClick={()=> selectTag(tag)} key={i} variant={selected.includes(tag) ? 'default':'outline'} className='capitalize'>{tag}</Badge>  
                ))
            }
        </div>
        <div className="grid grid-col-1 sm:grid-cols-2 gap-6 md:gap-8 lg:grid-cols-3 lg:gap-10 justify-between">
            {
                tasks && tasks.map((task:any, i:any)=>(
                    task.status == "open" && <TaskCard key={task.id} task={task} userId={user.uid}/>

                )
                )
            }


        </div>
    </div>
  )
}

export default page
