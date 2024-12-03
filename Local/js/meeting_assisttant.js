import { ZoomMtg } from '@zoom/meetingsdk'


const EXTENTION_AUDIO = ".mp3"
const PATH_AUDIO_FILEL_END = "../media/audio/remind-end.mp3"
const PATH_PATTERN_AUDIO_FILEL_LAST = "../media/audio/remind-last-minutes-"
const PATH_PATTERN_AUDIO_FILEL_PASSED = "../media/audio/remind-passed-minutes-"

var audioContext = new AudioContext();
var dstNodeForZoom = audioContext.createMediaStreamDestination();

var isUseAssistant = false
var meetingStarTime
var meetingEndTime
var remindIntervalMinutes

var elapseMinute
var remainMinute

let isPlaying = false

export function getIsUseAssistant() {
    console.log("isUseAssistant", isUseAssistant)
    return isUseAssistant
}


export function initAssistant(meetingConfig) {
    console.log("start use assistant", meetingConfig);
    isUseAssistant = true
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

    console.log("start getUserMedia");
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    playAudioFile(PATH_AUDIO_FILEL_END);
    //executeTimeKeep();
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
    console.log("sleep minutes", time/1000)
    return new Promise((resolve) => setTimeout(resolve, time))
}  //timeはミリ秒

async function playAudioFile(audioFilepath) {

    // let audio = new Audio();
    // audio.muted = false;
    // audio.src = audioFilepath
    // console.log("audio.src", audio.src);
    // audio.srcObject = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    // console.log("audio.play()");
    // audio.play();

    // const audioContext = new AudioContext();
    // //createMediaStreamSource
    // //createMediaElementSource
    // const track = audioContext.createMediaElementSource(audio);
    // track.connect(audioContext.destination);
    // audioContext.start()
    await sleep(3000);

    // 音声ファイルを取得
    console.log("playAudioFile", audioFilepath);
    const audioRes = await fetch(audioFilepath);
    const audioData = await audioRes.arrayBuffer();
    console.log("audioRes", audioRes);
    console.log("audioData", audioData);
    

    //const audioContext = new AudioContext();
    //audioContext = new AudioContext();
    //const dstNodeForZoom = audioContext.createMediaStreamDestination();

    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const srcBufferNode = audioContext.createBufferSource();
    srcBufferNode.buffer = audioBuffer;

    //srcBufferNode.connect(analyzerNode);
    //srcBufferNode.connect(audioContext.destination);
    srcBufferNode.connect(dstNodeForZoom);
    console.log("srcBufferNode", srcBufferNode);
    srcBufferNode.start();

    // const msForZoom = new MediaStream();

    // const response = await fetch(audioFilepath);
    // const arrayBuffer = await response.arrayBuffer();

    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // const ctx = new AudioContext();
    // // Web Audio APIで使える形式に変換
    // //const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    // //const bufferSrc = ctx.createBufferSource();
    // //bufferSrc.buffer = audioBuffer;

    // //const dstNodeForZoom = ctx.createMediaStreamDestination();
    // bufferSrc.connect(dstNodeForZoom);
    // const {stream} = dstNodeForZoom;

    // var PC =
    //     window.RTCPeerConnection ||
    //     window.webkitRTCPeerConnection ||
    //     window.mozRTCPeerConnection;
    // var peer = new PC({ iceServers: [ { 'urls': 'stun:stun.l.google.com:19302' } ] });
    // //peer.onicecandidate = function(ice) { ... };

    // // ミキシングの出力ノードのストリームをRTCPeerConnectionに追加
    // peer.addStream(stream.stream);


    // // dstNodeForZoom.stream.getAudioTracks().forEach((x) => {
    // //     console.log("AudioTRACK", x);
    // //     msForZoom.addTrack(x);
    // // });

    // //bufferSrc.connect(ctx.destination);
    // bufferSrc.start();

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


const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
);

// getUserMedia()の上書き
navigator.mediaDevices.getUserMedia = async function (params) {
    const srcNodeRef = MediaStreamAudioSourceNode;
    const msForZoom = new MediaStream();
    console.log("getUserMedia", params)

    const ms = await _getUserMedia(params);

    srcNodeRef.current = audioContext.createMediaStreamSource(ms);
    
    //// Connect src to dest
    //srcNodeRef.current.connect(dstNodeForInternal);
    //srcNodeRef.current.disconnect(dstNodeForZoom);

    srcNodeRef.current.connect(dstNodeForZoom);

    //// Zoom用のノードのストリームをZoomのストリームに。
    dstNodeForZoom.stream.getAudioTracks().forEach((x) => {
        console.log("AudioTRACK", x);
        msForZoom.addTrack(x);
    });


    console.log(params, msForZoom.getTracks());
    return msForZoom;
}


// getUserMedia()の上書き
// navigator.mediaDevices.getUserMedia = async function (constraints) {

//     console.log("getUserMedia", constraints)
//     var msForZoom = new MediaStream();

//     const ms = await _getUserMedia(constraints);
//     // const ms = await new Promise<MediaStream>((resolve) => {
//     //     setTimeout(() => {
//     //         console.warn("Failed to get MediaStream!?")
//     //         resolve(new MediaStream())
//     //     }, 1000 * 10)
//     //     _getUserMedia(constraints).then(ms => {
//     //         resolve(ms)
//     //     });
//     // })

//     // Audio
//     const ctx = new AudioContext();
//     const dstNodeForZoom = ctx.createMediaStreamDestination();

//     if (ms.getAudioTracks().length > 0) {
//         //// New Source
//         //srcNodeRef.current = ctx.createMediaStreamSource(ms);
//         msSrc = ctx.createMediaStreamSource(ms);
//         //// Connect src to dest
//         msSrc.connect(dstNodeForZoom)
//         //srcNodeRef.current.connect(dstNodeForZoom);

//         //// Zoom用のノードのストリームをZoomのストリームに。
//         dstNodeForZoom.stream.getAudioTracks().forEach((x) => {
//             console.log("AudioTRACK", x);
//             msForZoom.addTrack(x);
//         });
//     }

//     console.log("constraints/Tracks", constraints, msForZoom.getTracks())
//     msForZoom = ms;
//     return msForZoom;
// };