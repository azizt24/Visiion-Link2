import { createClient } from 'agora-rtm-react';

const appId = "ad8de8aa1f124b068d3477ed9591ed19";
const token = null;
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useRTMClient = createClient(appId);