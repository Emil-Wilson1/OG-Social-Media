export const environment = {
  apiUrl: 'http://localhost:3000/user',
  Url:'http://localhost:3000/admin',
  RTCPeerConfiguration: {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302'
      }
    ]
  }
};
