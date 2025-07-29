import { motion } from "framer-motion";
import { MdAssignmentTurnedIn } from "react-icons/md";

interface LoaderProps {
  transparent?:boolean
}

export default function ThreeDotsLoader({transparent = true}:LoaderProps) {
  return (
    <div className={`fixed w-screen top-0 left-0 z-100 h-screen flex items-center justify-center ${transparent ? 'bg-[rgba(0,0,0,0.4)]' : 'bg-bg-light'}`}>
      <div className="flex space-x-3">
        <span className="w-4 h-4 rounded-full bg-border-focus bounce-dot" style={{ animationDelay: "0s" }}/>
        <span className="w-4 h-4 rounded-full bg-border-focus bounce-dot" style={{ animationDelay: "0.15s" }}/>
        <span className="w-4 h-4 rounded-full bg-border-focus bounce-dot" style={{ animationDelay: "0.3s" }}/>
      </div>
     
    </div>
  );
}
