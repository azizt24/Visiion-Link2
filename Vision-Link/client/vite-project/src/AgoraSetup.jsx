import { createClient, createMicrophoneAndCameraTracks, createScreenVideoTrack } from "agora-rtc-react";

import AgoraRTM from 'agora-rtm-sdk';

const appId = "490d904cf7824b0da3ffc37dac70b557";
const token = null;
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const useScreenVideoTrack = createScreenVideoTrack();


export const rtmClient = AgoraRTM.createInstance(appId);
