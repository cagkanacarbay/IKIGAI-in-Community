import {
  DefaultQuickActions,
  DefaultQuickActionsContent,
  TLComponents,
  Tldraw,
  TldrawUiMenuItem,
	useEditor
} from 'tldraw';
import 'tldraw/tldraw.css';
import { saveBoardToDatabase } from '@/lib/boardStorage';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBoardContext } from '@/app/tldraw/boardContext';
import "@/styles/loader.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import CloseButton from '@/components/ui/closeButton';

export default function CustomQuickActions() {
  return (
		// TODO: remlove the menu form the screen when breakpoint is broken. check tldraw code to see where the breakpoint is
    <DefaultQuickActions>
      <DefaultQuickActionsContent />
			<SaveButton/>
    </DefaultQuickActions>
  );
}


const SaveButton: React.FC = () => {
  const editor = useEditor();
  const { data: session } = useSession();
  const { hasUnsavedChanges, setHasUnsavedChanges, ikigaiId, setIkigaiId } = useBoardContext();
  const [isSaving, setIsSaving] = useState(false); 
  const [showNotLoggedInAlert, setShowNotLoggedInAlert] = useState(false);


  const save = async () => {
    if (!session) {
      // Show alert if the user is not logged in
      setShowNotLoggedInAlert(true);
      return;
    }
    
    if (!hasUnsavedChanges) {
      return;
    }
    
    setIsSaving(true);
    const start = Date.now();
    const saveResult = await saveBoardToDatabase(editor, ikigaiId);
    // console.log("Save Status: ", saveResult	)
    const end = Date.now();
  
    if (saveResult.status === "error") {
      alert("Failed to save the snapshot to the database. Please try again.");
    } else {
      setIkigaiId(saveResult.result.ikigai_id)
      setHasUnsavedChanges(false);
    }
  
    const delay = Math.max(0, 3000 - (end - start));
    setTimeout(() => setIsSaving(false), delay);

  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`
            w-24 flex items-center justify-start pointer-events-auto rounded-lg 
            transition-colors duration-1000
            ${hasUnsavedChanges ? 'bg-purple-100' : isSaving ? 'bg-purple-100' : 'hover:bg-tldraw-menu-hover-gray'}
          `}
          onClick={save}
        >
          <img 
            src="/icons/save.svg"  
            alt="Save Icon" 
            className='w-[15px] mx-2'
          />
          {isSaving ? (
            <span className="loader"></span>
          ) : (
            <span className="ml-2">
              {hasUnsavedChanges ? 'Unsaved Changes' : 'Saved'}
            </span>
          )}
        </motion.div>
      </AlertDialogTrigger>
      {showNotLoggedInAlert && <NotLoggedInAlertContent />}
    </AlertDialog>
  );
};


const NotLoggedInAlertContent: React.FC = () => {

  return (
    <AlertDialogContent>
      <AlertDialogCancel  className="absolute top-0 right-0 bg-red-200 hover:bg-red-700 p-2">
        <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </AlertDialogCancel>
      <AlertDialogHeader>
        <AlertDialogTitle>Not Logged In</AlertDialogTitle>
        <AlertDialogDescription>
          To save your board, please sign up and log in to your account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex justify-center gap-2 mb-1">
        <Link href="/signup" passHref className="px-4 py-2 text-white bg-blue-300 hover:bg-blue-500 rounded transition duration-150 ease-in-out">
          Sign Up
        </Link>
        <Link href="/signin" passHref className="px-4 py-2 text-white bg-purple-300 hover:bg-purple-500 rounded transition duration-150 ease-in-out">
          Sign In
        </Link>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};