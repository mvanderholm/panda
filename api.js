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
  const cleanText = rawText.replace(/--->/g, '').replace(/F$/, '').trim();

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    throw new Error(`JSON parse error: ${cleanText.substring(0, 200)}`);
  }
}

export async function getMyCard(customerId) {
  const id = parseInt(customerId, 10);
  if (!id || isNaN(id)) throw new Error('Invalid customer ID');
  return apiFetch('PointsAccumulated', { CustomerId: id, platformtype: 2 });
}

export async function getMemberProfile(customerId) {
  const id = parseInt(customerId, 10);
  if (!id || isNaN(id)) throw new Error('Invalid customer ID');
  return apiFetch('GetMemberProfile', { CustomerID: id, platformtype: 2, returnformat: 'json' });
}

export async function enrollMember(params = {}) {
  return apiFetch('MemberEnrollment', params);
}

export async function forgotPassword(email) {
  return apiFetch('ForgotPassword', { email: email.trim(), PlatformType: 2 });
}

export async function getDivisions() {
  return apiFetch('GetDivisionList', { PlatformType: 2 });
}

export async function updateProfile(customerId, params = {}) {
  return apiFetch('MemberUpdate', { CustomerId: customerId, PlatformType: 2, ...params });
}