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

export default function CustomQuickActions() {

	// const editor = useEditor();
	// const { data: session } = useSession();


  // const saveSnapshot = async () => {
  //   console.log("trying to save");
  //   if (!session) {
  //     if (window.confirm("You need to be signed in to save your IKIGAI. Sign up now?")) {
  //       window.location.href = '/signup';
  //     }
  //     return;
  //   }
  //   if (editor && editor.store) {
  //     console.log("gonna do some magics");
  //     const snapshot = editor.store.getSnapshot();
  //     // await saveImageAssetsAsBlobsAndUpdateMetadata(snapshot.store, editor);
  //     const updatedSnapshot = editor.store.getSnapshot();
            
  //     try {
  //       const uploadResult = await uploadSnapshotToDatabase(updatedSnapshot);
  //       // console.log("Saved Ikigai snapshot with updated asset URLs.");
  //       console.log(uploadResult);

  //     } catch (error) {
  //       alert("Failed to save the snapshot to the database. Please try again.");
  //     }
  //   }
  // };

  return (
		// TODO: remlove the menu form the screen when breakpoint is broken. check tldraw code to see where the breakpoint is
    <DefaultQuickActions>
      <DefaultQuickActionsContent />
			<SaveButton/>
    </DefaultQuickActions>
  );
}




const SaveButton: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const editor = useEditor();
  const { data: session } = useSession();

  const save = async () => {
    setIsSaving(true);
    const saveStatus = await saveBoardToDatabase(editor);
    if (!saveStatus) {
      alert("Failed to save the snapshot to the database. Please try again.");
    }
    setIsSaving(false);
  };

  useEffect(() => {
    if (!session) {
      // alert("You need to be signed in to save your IKIGAI.");
    }
  }, [session]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
			className='w-24 flex items-center justify-start pointer-events-auto rounded-lg hover:bg-tldraw-menu-hover-gray '

    >
			<img 
				src="/icons/save.svg"  
				alt="Save Icon" 
				className='w-[15px] mx-2 '
			/>
      <button onClick={save} className='text-black'>
        {isSaving ? 'Unsaved Changes' : 'Saved'}
      </button>
    </motion.div>
  );
};

