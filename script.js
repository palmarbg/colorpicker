const can = document.getElementById('canvas-gradient-rectangle');
const ctx = can.getContext('2d');

const can2 = document.getElementById('canvas-brightness-slider');
const ctx2 = can2.getContext('2d');

const svgRect = document.getElementById('color-canvas-cursor-container');
const svgCursor = document.getElementById('color-canvas-cursor');
const svgPointer = document.getElementById('canvas-brightness-pointer');

var theta=2**1;

var WIDTH = 255;
can.width=WIDTH;
var LINE_WIDTH = theta;
var HEIGHT=128
can.height=HEIGHT;

can2.width=(WIDTH+1)/16;
can2.height=HEIGHT;

var TOTAL_WIDTH = parseInt(can2.style.left)+parseInt(can2.width)+2;

var container = document.getElementById('color-picker-data-container');

const sampleColor = container.querySelector('#show-color');

const colorInputs = container.getElementsByClassName('input');

const colorDiv = document.getElementById('color-picker-div');

//ki kell javítani!!!
const border = Math.min(window.visualViewport.width/100*0.2,window.visualViewport.height/100*0.3);

window.onresize = () => {
	const myParagraphs = container.getElementsByClassName('paragraph');
	const myDiv=container.getElementsByClassName('paragraph')[0];
	const myDiv2=container.getElementsByClassName('input')[0];
	let myWidth = Number(getComputedStyle(myDiv).width.substring(0,getComputedStyle(myDiv).width.length-2));
	let myWidth2 = Number(getComputedStyle(myDiv2).width.substring(0,getComputedStyle(myDiv2).width.length-2));
	for (let i=0;i<myParagraphs.length;i++){
		myParagraphs[i].style.fontSize=parseInt((myWidth/4.652)/window.visualViewport.width*10000*0.7)/100+'vw';
		myParagraphs[i].style.lineHeight=0;
		colorInputs[i].style.fontSize=parseInt((myWidth2/4.652)/window.visualViewport.width*10000*1.3)/100+'vw';
		colorInputs[i].style.lineHeight=0;
	}
	
}
window.onresize()

const RGB=[255,0,0];
const HSL=[0, 240, 120];

function setCanvas(){
	drawGradient();
	drawBrightness();
	drawBrightnessLevel();
	sampleColor.style.backgroundColor='rgb('+RGB[0]+','+RGB[1]+','+RGB[2]+')';
}

function drawGradient(){
	for(let x=0;x<=128/theta;x++){
		z=parseInt(theta*x);
		let grad= ctx.createLinearGradient(0, 0, WIDTH, 0);
		
		grad.addColorStop(0, 'rgb('+(255-z)+','+z+','+z+')');
		grad.addColorStop(1/6, 'rgb('+(255-z)+','+(255-z)+','+z+')');
		grad.addColorStop(2/6, 'rgb('+z+','+(255-z)+','+z+')');
		grad.addColorStop(3/6, 'rgb('+z+','+(255-z)+','+(255-z)+')');
		grad.addColorStop(4/6, 'rgb('+z+','+z+','+(255-z)+')');
		grad.addColorStop(5/6, 'rgb('+(255-z)+','+z+','+(255-z)+')');
		grad.addColorStop(1, 'rgb('+(255-z)+','+z+','+z+')');
		
		ctx.fillStyle = grad;
		ctx.fillRect(0,x*LINE_WIDTH,WIDTH,LINE_WIDTH);
	}
}

function drawBrightness(){
	let grad = ctx2.createLinearGradient(0,0,0,HEIGHT);
	let myColor = HSLtoRGB([HSL[0], HSL[1], 120]);
	grad.addColorStop(0, '#fff');
	grad.addColorStop(.5, 'rgb('+myColor[0]+','+myColor[1]+','+myColor[2]+')');
	grad.addColorStop(1, '#000');

	ctx2.fillStyle = grad;
	ctx2.fillRect(0,0,(WIDTH+1)/16, HEIGHT);
}

function setColor(e){
	let x=Math.ceil(e.x-can.getBoundingClientRect().left-border),
	    y=Math.ceil(e.y-can.getBoundingClientRect().top-border);
	let calcWidth=can.offsetWidth-border;
	let calcHeight=can.offsetHeight-border;
	y=(y<0)?0:(y>calcHeight)?calcHeight:y;

	HSL[0]=(x<0)?0:(x>=calcWidth)?239:parseInt(x/calcWidth*240);
	HSL[1]=Math.round(240-y/calcHeight*240);

	colorInputs[0].querySelector('input').value=HSL[0];
	colorInputs[1].querySelector('input').value=HSL[1];

	calcRGB();
	drawBrightness();
}

function HSLtoRGB(arr){
	let C = (240-Math.abs(2*arr[2]-240))*arr[1];
	let X = C*(40-Math.abs(arr[0]%80-40));
	let m = 480*arr[2]-C;

	let A=Math.round((m+2*C)*255/240/240/2);
	let B=Math.round((20*m+X)*255/240/240/40);
	let D=Math.round(m*255/240/240/2);

	let arr2=[0,0,0];

	if(arr[0]<=40){
		arr2[0]=A;
		arr2[1]=B;
		arr2[2]=D;
	} else if(arr[0]<=80){
		arr2[0]=B;
		arr2[1]=A;
		arr2[2]=D;
	} else if(arr[0]<=120){
		arr2[0]=D;
		arr2[1]=A;
		arr2[2]=B;
	} else if(arr[0]<=160){
		arr2[0]=D;
		arr2[1]=B;
		arr2[2]=A;
	} else if(arr[0]<=200){
		arr2[0]=B;
		arr2[1]=D;
		arr2[2]=A;
	} else if(arr[0]<=240){
		arr2[0]=A;
		arr2[1]=D;
		arr2[2]=B;
	}

	return arr2;
}

function RGBtoHSL(arr){
	let max = Math.max(arr[0], arr[1], arr[2]);
	let min = Math.min(arr[0], arr[1], arr[2]);
	let arr2=[0,0,0];

	arr2[0]=(max==min)?0:
			(max==arr[0])?Math.round(40*(arr[1]-arr[2])/(max-min)+240)%240:
			(max==arr[1])?Math.round(40*(2+(arr[2]-arr[0])/(max-min))):
							Math.round(40*(4+(arr[0]-arr[1])/(max-min)));
	arr2[2]=Math.round((max+min)/2/255*240);
	arr2[1]=(arr2[2]==0||arr2[2]==240)?0:
			Math.round((max-min)/Math.min(max+min, 2*255-max-min)*240);

	return arr2;
}

function calcRGB(){
	let temp=HSLtoRGB(HSL);
	for(let i=0;i<3;i++){
		RGB[i]=temp[i];
		colorInputs[3+i].querySelector('input').value=RGB[i];
	}
	drawBrightness();
	drawBrightnessLevel();
	svgCursor.setAttribute('x',parseInt(HSL[0]/240*510));
	svgCursor.setAttribute('y',parseInt((240-HSL[1])/240*256));
	sampleColor.style.backgroundColor='rgb('+RGB[0]+','+RGB[1]+','+RGB[2]+')';
}

function calcHSL(){
	let temp=RGBtoHSL(RGB);
	for(let i=0;i<3;i++){
		HSL[i]=temp[i];
		colorInputs[i].querySelector('input').value=HSL[i];
	}
	drawBrightness();
	drawBrightnessLevel();
	svgCursor.setAttribute('x',parseInt(HSL[0]/240*510));
	svgCursor.setAttribute('y',parseInt((240-HSL[1])/240*256));
	sampleColor.style.backgroundColor='rgb('+RGB[0]+','+RGB[1]+','+RGB[2]+')';
}

function inputHSL(){
	for(let i=0;i<3;i++)
		HSL[i]=(isNaN(colorInputs[i].querySelector('input').value))?0:parseInt(colorInputs[i].querySelector('input').value);
	calcRGB();
}

function inputRGB(){
	for(let i=0;i<3;i++)
		RGB[i]=(isNaN(colorInputs[3+i].querySelector('input').value))?0:parseInt(colorInputs[3+i].querySelector('input').value);
	calcHSL();
}

function setBrightness(e){
	let y=Math.ceil(e.y-can2.getBoundingClientRect().top-border);
	let calcHeight = parseInt(can2.offsetHeight-border);

	HSL[2]=Math.min(240, Math.max(0, Math.round(240-y/calcHeight*240)));
	colorInputs[2].querySelector('input').value = HSL[2];

	calcRGB();
	drawBrightnessLevel();
}

function drawBrightnessLevel(){
	svgPointer.setAttribute('y',240-HSL[2])
}


setCanvas();

svgRect.addEventListener('mousedown', e => {
	setColor(e);
	document.addEventListener('mousemove', setColor);
	document.addEventListener('mouseup', () => {
		document.removeEventListener('mousemove', setColor);
	})
});
can2.addEventListener('mousedown', e => {
	setBrightness(e);
	document.addEventListener('mousemove', setBrightness);
	document.addEventListener('mouseup', () => {
		document.removeEventListener('mousemove', setBrightness);
	})
});

for(let i=0;i<3;i++)
	colorInputs[i].querySelector('input').oninput = () => inputHSL();
for(let i=0;i<3;i++)
	colorInputs[3+i].querySelector('input').oninput = () => inputRGB();