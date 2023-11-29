import { IoIosClose } from "react-icons/io";
import { msgBoxData } from "../../GStore";
import { useSignal, useSignalEffect } from "@preact/signals-react";

/**
 * A component displaying a message box.
 * @returns {JSX.Element} - Returns the JSX for the MsgBox component.
 */
const MsgBox = () => {
    const boxRef = useSignal(null);

    /**
     * Handles the closing action of the message box.
     * @returns {void}
     */
    const handleBoxClose = () => {
        boxRef.value?.classList.add("slide-top");
        const timer = setTimeout(() => {
            msgBoxData.value.onClose && msgBoxData.value.onClose();
            msgBoxData.value = { content: null, timeout: null, onClose: null };
        }, 500);

        return () => clearTimeout(timer);

    };

    /**
     * Checks if there is a timer to close the msg box
     */
    useSignalEffect(() => {
        if (msgBoxData.value.timeout === null) return;
        const timer = setTimeout(() => {
            handleBoxClose();
        }, msgBoxData.value.timeout);
        return () => clearTimeout(timer);
    })

    return (
        <section
            ref={ref => boxRef.value = ref}
            className={`${msgBoxData.peek().content ? "slide-bottom" : "hidden"} bg-bg_color fixed top-4 left-2/4 py-4 pr-8 pl-4 w-[calc(100%-2rem)] -translate-x-1/2 z-[10000] rounded-lg shadow-lg`}
        >
            <IoIosClose
                className="fixed top-2 right-2 text-2xl text-gray-600"
                onClick={() => handleBoxClose()}
            />
            {msgBoxData.value.content}
        </section>
    );
};

export default MsgBox;
