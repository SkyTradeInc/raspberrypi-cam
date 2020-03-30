import React, { useEffect } from 'react';
import './App.css';

function App() {


const [image,setImage] = React.useState({})
const imageRef=React.useRef()



const date = 1585568958147 

useEffect(()=>{
  getImage()
 })

const getImage=async()=>{
var newDate = new Date().getTime();
console.log(newDate-date,"time")
  fetch("http://93e852d9.ngrok.io/img")
  .then(res=>res.json())
  .then(res=>{
    setImage(res.image)
    renderPredictions(res.prediction)
  })

  
}

const renderPredictions = predictions => {
  const ctx = imageRef.current.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Font options.
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";
  predictions.forEach(prediction => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const width = prediction.bbox[2];
    const height = prediction.bbox[3];
    // Draw the bounding box.
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);
    // Draw the label background.
    ctx.fillStyle = "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
  });

  predictions.forEach(prediction => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    // Draw the text last to ensure it's on top.
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
  });

}

  return (
    <div className="App">
      <header className="App-header">
        <img className="size" width={1000} height={667} src={image} />
        <canvas className="size" width={1000} height={667} ref={imageRef}/>
      </header>
    </div>
  );
}

export default App;
