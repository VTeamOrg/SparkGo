import { API_URL } from '../../../config';

/* Create a checkout session */
export const createCheckoutSession = async (requestData) => {
  const fullEndpoint = `${API_URL}/subscription/createCheckoutSession`;

  console.log("session support: ", fullEndpoint);
  console.log("requestData: ", requestData);

  try {
    const response = await fetch(fullEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Error creating checkout session');
    }

    const session = await response.json();

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
