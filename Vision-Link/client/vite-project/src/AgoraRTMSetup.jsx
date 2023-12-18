import { createClient } from 'agora-rtm-react';

const appId = "490d904cf7824b0da3ffc37dac70b557";
const token = null;
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useRTMClient = createClient(appId);