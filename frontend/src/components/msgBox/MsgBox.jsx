import { IoIosClose } from "react-icons/io";
import { app_dark } from "../../GStore";
import { effect, signal } from "@preact/signals-react";
import { useEffect, useRef } from "react";

export const msgBoxData = signal({
    timeout: null,
    content: null,
    onClose: null
});

const MsgBox = () => {
    const boxRef = useRef(null);

    const handleBoxClose = () => {
        boxRef.current?.classList.add("slide-top");
        const timer = setTimeout(() => {
            msgBoxData.value.onClose && msgBoxData.value.onClose();
            msgBoxData.value = { content: null, timeout: null, onClose: null };
        }, 500);

        return () => clearTimeout(timer);
        
    };

    useEffect(() => {
        if (msgBoxData.value.timeout === null) return;
        const timer = setTimeout(() => {
            handleBoxClose();
        }, msgBoxData.value.timeout);
        return () => clearTimeout(timer);
    }, [msgBoxData.value]);

    return (
        <section
            ref={boxRef}
            className={`${msgBoxData.value.content ? "slide-bottom" : "hidden"} ${
                app_dark.value ? "bg-dark" : "bg-light"
            } fixed top-4 left-2/4 py-4 pr-8 pl-4 w-[calc(100%-2rem)] -translate-x-1/2 z-[10000] rounded-lg shadow-lg`}
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
