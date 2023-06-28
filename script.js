// // const video = document.getElementById("video");

// // function startVideo() {
// //   navigator.mediaDevices.getUserMedia(
// //     { video: {} },
// //     (stream) => (video.srcObject = stream),
// //     (err) => console.log(err)
// //   );
// // }

// // startVideo();
// // Select the video element
// const videoElement = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

//   .then(startVideo)
//   .catch((err) => {
//     console.log(err);
//   });

// function startVideo() {
//   // Check if getUserMedia is supported
//   if (navigator.mediaDevices.getUserMedia) {
//     // Request access to the webcam
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then(function (stream) {
//         // Attach the stream to the video element
//         videoElement.srcObject = stream;
//       })
//       .catch(function (error) {
//         console.error("Error accessing the webcam:", error);
//       });
//   } else {
//     console.error("getUserMedia is not supported in this browser.");
//   }
// }
const video = document.getElementById("video");

// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//   faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//   faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//   faceapi.nets.faceExpressionNet.loadFromUri("/models"),
// ]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {
    width: video.width,
    height: video.height,
  };

  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    console.log(detections);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    const resizeDetection = faceapi.resizeResults(detections, displaySize);
    // canvas.getContex('2d').clearRect
    faceapi.draw.drawDetections(canvas, resizeDetection);
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetection);
    faceapi.draw.drawFaceExpressions(canvas, resizeDetection);
  }, 100);
});
