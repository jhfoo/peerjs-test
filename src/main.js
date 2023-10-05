const APP_NAME = 'penpalz'
const AppId = Math.ceil(Math.random()*1000)
console.log(`AppId: ${AppId}`)

let peer = null

window.onload = pageLoad()

function pageLoad() {
  console.log('Page loaded')

  peer = new Peer(`${APP_NAME}-${AppId}`)
  peer.on('open', (id) => {
    console.log(`Peer Id: ${id}`)
    document.getElementById('AppId').innerHTML = id
  })

}

async function onCall() {
  console.log(`onCall: running`)
  const RemoteId = 'penpalz-' + document.getElementById('RemoteId').value

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: true
  })
  // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  // console.log(`getUserMedia: ${getUserMedia}`)
  console.log (`Calling: ${RemoteId}`)
  var call = peer.call(RemoteId, stream);

  call.on('stream', function(remoteStream) {
    // Show stream in some video/canvas element.
    console.log(`Remote stream received`)
    const elVideo = document.getElementById('RemoteVideo')
    elVideo.srcObject = remoteStream
  });
}

function onSetCaller() {
  const conn = peer.connect()
}

function onSetCallee() {
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  peer.on('call', function(call) {
    getUserMedia({
      video: true, 
      audio: true
    }, function(stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', function(remoteStream) {
        // Show stream in some video/canvas element.
        console.log(`Remote stream received`)
        document.getElementById('debug').innerHTML = 'Remote stream received'
        const elVideo = document.getElementById('RemoteVideo')
        elVideo.srcObject = remoteStream
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  })
  document.getElementById('debug').innerHTML = 'Ready to receive'
}