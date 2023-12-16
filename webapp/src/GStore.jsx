import { signal } from "@preact/signals-react";

/**
 * A global signal holding data for the message box, including content, timeout(timer), and onClose function.
 * This can be used to display data in the MsgBox component
 */
export const msgBoxData = signal({
    timeout: null,
    content: null,
    onClose: null
});

export const curr_theme = signal(null);

