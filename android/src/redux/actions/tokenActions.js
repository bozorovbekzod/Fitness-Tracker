export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';

export const setAccessToken = (accessToken) => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken,
});