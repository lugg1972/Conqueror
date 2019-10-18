let c = View.get("#bow canvas");
let ctx = c.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(0, 0, 100, 100);
ctx.clearRect(25, 25, 50, 50);
ctx.lineWidth = "1px";
ctx.beginPath();
ctx.arc(50, 25, 10, 0, 2 * Math.PI);
ctx.stroke();