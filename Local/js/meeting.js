import { ZoomMtg } from "@zoom/meetingsdk";
import  * as  MeetingAssist  from './meeting_assisttant.js';

const testTool = window.testTool;
//const meeting_end_time = document.getElementById("meeting_end_time").value

// get meeting args from url
const tmpArgs = testTool.parseQuery();
const meetingConfig = {
  sdkKey: tmpArgs.sdkKey,
  meetingNumber: tmpArgs.mn,
  userName: (function () {
    if (tmpArgs.name) {
      try {
        return testTool.b64DecodeUnicode(tmpArgs.name);
      } catch (e) {
        return tmpArgs.name;
      }
    }
    return (
      "CDN#" +
      tmpArgs.version +
      "#" +
      testTool.detectOS() +
      "#" +
      testTool.getBrowserInfo()
    );
  })(),
  passWord: tmpArgs.pwd,
  endtime: tmpArgs.endtime,
  remindIntervalMinutes: tmpArgs.remindIntervalMinutes,
  leaveUrl: "/index.html",
  role: parseInt(tmpArgs.role, 10),
  userEmail: (function () {
    try {
      return testTool.b64DecodeUnicode(tmpArgs.email);
    } catch (e) {
      return tmpArgs.email;
    }
  })(),
  lang: tmpArgs.lang,
  signature: tmpArgs.signature || "",
  china: tmpArgs.china === "1",
};

console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

// it's option if you want to change the MeetingSDK-Web dependency link resources. setZoomJSLib must be run at first
// ZoomMtg.setZoomJSLib("https://source.zoom.us/{VERSION}/lib", "/av"); // default, don't need call it
if (meetingConfig.china)
  ZoomMtg.setZoomJSLib("https://jssdk.zoomus.cn/3.9.2/lib", "/av"); // china cdn option

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function beginJoin(signature) {
  ZoomMtg.i18n.load(meetingConfig.lang);
  ZoomMtg.init({
    leaveUrl: meetingConfig.leaveUrl,
    disableCORP: !window.crossOriginIsolated, // default true
    // disablePreview: false, // default false
    externalLinkPage: "./externalLinkPage.html",
    success: function () {
      console.log(meetingConfig);
      console.log("signature", signature);
      ZoomMtg.join({
        meetingNumber: meetingConfig.meetingNumber,
        userName: meetingConfig.userName,
        signature: signature,
        sdkKey: meetingConfig.sdkKey,
        userEmail: meetingConfig.userEmail,
        passWord: meetingConfig.passWord,
        success: function (res) {
          ZoomMtg.getCurrentUser({
            success: function (res) {
              console.log("success getCurrentUser", res.result.currentUser);
            },
          });
        },
        error: function (res) {
          console.log(res);
        },
      });
    },
    error: function (res) {
      console.log(res);
    },
  });

  ZoomMtg.inMeetingServiceListener("onUserJoin", function (data) {
    console.log("inMeetingServiceListener onUserJoin", data);
  });

  ZoomMtg.inMeetingServiceListener("onUserLeave", function (data) {
    console.log("inMeetingServiceListener onUserLeave", data);
  });

  ZoomMtg.inMeetingServiceListener("onUserIsInWaitingRoom", function (data) {
    console.log("inMeetingServiceListener onUserIsInWaitingRoom", data);
  });

  ZoomMtg.inMeetingServiceListener("onMeetingStatus", function (data) {
    console.log("inMeetingServiceListener onMeetingStatus", data);
    if( data["meetingStatus"]==2 ) {
        console.log("meeting join");
        ZoomMtg.getAttendeeslist({
            success: function (res) {
                console.log(res, "get getAttendeeslist");
            }
        }); 
        ZoomMtg.getCurrentMeetingInfo({
          success: function (res) {
              console.log(res, "get getAttendeeslist");
          }
        });
        
        if( !(MeetingAssist.getIsUseAssistant()) ) {
          MeetingAssist.initAssistant(meetingConfig);
          MeetingAssist.timeKeep();
        }
    } else if ( data["meetingStatus"]==3 ) {
      MeetingAssist.closeAssistant();
    }
  });
}

beginJoin(meetingConfig.signature);
