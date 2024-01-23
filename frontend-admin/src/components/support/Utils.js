export const validateEmail = (email) => {
    // Regular expression pattern for a valid email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

export function formatDateTime(dateTimeString) {
const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};
return new Date(dateTimeString).toLocaleString(undefined, options);
}

export const translateUnlimited = (value) => {
  return value === -1 ? 'Unlimited' : value;
};