import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the shape of the task form data
// type TaskFormData = {
//   // Add your actual fields here as needed
//   title?: string;
//   description?: string;
//   price?: number;
//   location?: string;
//   skillTags?: string[];
//   isRemote?: boolean;
//   // etc.
// };

export type TaskFormData = {
  title?: string;
  description?: string;
  price?: number;
  taskDeadline?: string; 
  applicationDeadline?: string; 
  location?: string; 
  isRemote?: boolean;
  skillTags?: string[]; 
  tierRequirement?: number | null;
  isUrgent?: boolean;

  locationNote?: string; 
}


// Define the context value type
interface CreateTaskFormContextType {
  taskData: TaskFormData;
  setTaskData: Dispatch<SetStateAction<TaskFormData>>;
}

// Create the context with proper typing
const CreateTaskFormContext = createContext<CreateTaskFormContextType | undefined>(undefined);

// Create the provider
export const CreateTaskFormProvider = ({ children }: { children: ReactNode }) => {
  const [taskData, setTaskData] = useState<TaskFormData>({});

  return (
    <CreateTaskFormContext.Provider value={{ taskData, setTaskData }}>
      {children}
    </CreateTaskFormContext.Provider>
  );
};

// Custom hook to consume the context
export const useCreateTaskForm = () => {
  const context = useContext(CreateTaskFormContext);
  if (!context) {
    throw new Error("useCreateTaskForm must be used within a CreateTaskFormProvider");
  }
  return context;
};
