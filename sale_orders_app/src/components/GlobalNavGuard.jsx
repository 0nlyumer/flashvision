import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';

export default function GlobalNavGuard() {
    const { isDirty, setDirty } = useApp();
    const { appConfirm } = useDialog();

    let blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        if (blocker.state === 'blocked') {
            const handleBlock = async () => {
                const proceed = await appConfirm(
                    "Unsaved Changes Detected\n\nYou have unsaved progress in the current module. If you proceed, all unsaved entries will be discarded.\n\nAre you sure you wish to leave this screen without saving?",
                    "Unsaved Progress",
                    "Leave Without Saving",
                    "Cancel & Stay"
                );
                
                if (proceed) {
                    setDirty(false); // Clear the dirty state
                    blocker.proceed(); // Proceed with navigation
                } else {
                    blocker.reset(); // Cancel navigation
                }
            };
            handleBlock();
        }
    }, [blocker, appConfirm, setDirty]);

    return null;
}
