const CF_BASE_URL = 'https://eport9.com/pinpoint/pinpointWSMobile/PinPointWSMobileVmcv.cfc';
const AUTH_TOKEN = 'cHB0bWJsc3ZjOmwkbW43IWpoKnE=';

export async function apiFetch(method, params = {}) {
  const queryParams = new URLSearchParams({
    method,
    AuthVerify: AUTH_TOKEN,
    ...params
  });

  const response = await fetch(`${CF_BASE_URL}?${queryParams}`);
  const rawText = await response.text();
  
  // Strip ColdFusion comment artifacts
  const cleanText = rawText.replace(/--->/g, '').trim();

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  
  try {
    return JSON.parse(cleanText);
  } catch (err) {
    throw new Error(`JSON parse error: ${cleanText.substring(0, 200)}`);
  }
}