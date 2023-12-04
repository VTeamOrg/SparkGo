/* support/MapUtils.js */

export function emitDisableMapEvent() {
    /* Emit an event to disable the map */
    const event = new CustomEvent('disableMap');
    window.dispatchEvent(event);
  }
  
  export function emitEnableMapEvent() {
    /* Emit an event to enable the map */
    const event = new CustomEvent('enableMap');
    window.dispatchEvent(event);
  }