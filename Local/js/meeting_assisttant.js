import { ZoomMtg } from '@zoom/meetingsdk'


const EXTENTION_AUDIO = ".mp3"
const PATH_AUDIO_FILEL_END = "../media/audio/remind-end.mp3"
const PATH_PATTERN_AUDIO_FILEL_LAST = "../media/audio/remind-last-minutes-"
const PATH_PATTERN_AUDIO_FILEL_PASSED = "../media/audio/remind-passed-minutes-"

var isUseAssistant
var meetingStarTime
var meetingEndTime
var remindIntervalMinutes

var elapseMinute
var remainMinute



export function initAssistant(meetingConfig) {
    console.log("start use assistant", meetingConfig);
    //isUseAssistant = true
    meetingStarTime = new Date();
    let tmpDate  = new Date();
    tmpDate.setHours( String(meetingConfig.endtime).substr( 0, 2) );
    tmpDate.setMinutes( String(meetingConfig.endtime).substr( 3, 2) );
    meetingEndTime = tmpDate
    remindIntervalMinutes = meetingConfig.remindIntervalMinutes
    console.log("isUseAssistant", isUseAssistant, "meetingStarTime", meetingStarTime, "meetingEndTime", meetingEndTime, "remindIntervalMinutes", remindIntervalMinutes);
}

export function closeAssistant() {
    console.log("finish use assistant");
    isUseAssistant = false
    meetingStarTime = null
    meetingEndTime = null
    console.log("isUseAssistant", isUseAssistant, "meetingStarTime", meetingStarTime, "meetingEndTime", meetingEndTime);
}

export async function timeKeep() {
    console.log("start time keep");

    // if(isUseAssistant = true) {
    //     console.log("assisstant is still used");
    //     return;
    // }

    isUseAssistant = true
    var currentTime = new Date();
    if(meetingEndTime < currentTime) {
        console.log("meeting has been aleady finished");
        return;
    }

    //playAudioFile(PATH_AUDIO_FILEL_END);
    executeTimeKeep();
    return;

}

export async function executeTimeKeep() {

    var currentTime = new Date();
    while (meetingEndTime >= currentTime) {
        currentTime = new Date()
        elapseMinute = Math.round( (currentTime - meetingStarTime) / (1000 * 60) );
        remainMinute = Math.round( (meetingEndTime - currentTime) / (1000 * 60) );
        console.log("elapseMinute" ,elapseMinute, "remainMinute", remainMinute, "currentTime", currentTime);

        if( remainMinute == 3 ) {
            console.log("this meeting remain 3minutes");
            playAudioFile(PATH_AUDIO_FILEL_END);

        } else if ( remainMinute/remindIntervalMinutes == 1) {
            console.log("this meeting remain minutes:", remainMinute);
            playAudioFile(PATH_AUDIO_FILEL_END);
        } else if ( remainMinute/remindIntervalMinutes == 2) {
            console.log("this meeting remain minutes:", remainMinute);
        } else if ( remainMinute/remindIntervalMinutes == 3) {
            console.log("this meeting remain minutes:", remainMinute);
        
        } else if ( elapseMinute/remindIntervalMinutes == 1) {
            console.log("this meeting elaspe minutes:", elapseMinute);
        } else if ( elapseMinute/remindIntervalMinutes == 2) {
            console.log("this meeting elaspe minutes:", elapseMinute);
        } else if ( elapseMinute/remindIntervalMinutes == 3) {
            console.log("this meeting elaspe minutes:", elapseMinute);
        }

        // wait 1minutes
        //sleepSetTimeout(60000);
        console.log("wait 1minutes");
        await sleep(60000);
    };

    console.log("end time keep");
    return;
}

// function sleepSetTimeout(ms) {
//     setTimeout( console.log("wait 1minutes") , ms);
// }
  
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}  //timeはミリ秒

async function playAudioFile(audioFilepath) {
    let audio = new Audio();
    audio.muted = false;
    audio.src = audioFilepath
    console.log("audio.src", audio.src);
    audio.srcObject = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    console.log("audio.play()");
    audio.play();
    //audio.muted = true;
    return;
}

async function playAudio(audioFilepath) {
    let audio = new Audio();
    audio.src = audioFilepath
    console.log("audio.src", audio.src);
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then( stream => {
            audio.srcObject = stream
            console.log("audio.play()");
            audio.play();
        })
        .catch(err => alert(`${err.name} ${err.message}`));

    return;
}
