//获取手势锁区域，宽高一致
var lock_area = document.getElementsByClassName("lock_area")[0];
lock_area.style.height = lock_area.offsetWidth+"px";

var f = document.getElementsByTagName("form")[0];


//获取画布，设置画布大小，覆盖手势锁区域
var c=document.getElementById("canv");
var ctx=c.getContext("2d");
c.width=lock_area.offsetWidth+lock_area.offsetLeft;
c.height = lock_area.offsetHeight+lock_area.offsetTop;


//获取手势锁点阵元素集合
var pos = document.getElementsByClassName("pos");

//获取手势提示区域
var tip = document.getElementById("tip");

var log=function(s){
	console.log(JSON.stringify(s));
} 

function getNowPos(e){
	var p = {}
	p.x = e.clientX;
	p.y = e.clientY;
	return p
}

function Lock(pos){
	this.pos = pos;   //	点阵元素集合  
	this.posXY = [];  //点阵单元中心坐标集合
	this.nowPos = {}	;  //当前触摸位置坐标
	this.password = "";
}
Lock.prototype={
	cell_large :this.pos[0].offsetWidth     //单元点阵大小
}

//获取点阵单元中心坐标
Lock.prototype.getPosition = function(){
	var p = [];
	var item;
	for(var i = 0;i<this.pos.length;i++){
		item = {};
		item.x = this.pos[i].offsetLeft+this.cell_large/2;
		item.y = this.pos[i].offsetTop+this.cell_large/2;
		p.push(item);
	}
	return p;
}

//获取当前触摸单元的序号,触摸点不在单元内返回"NO"
Lock.prototype.getCircle = function(){
	for(var i in this.posXY){
		if((Math.abs(this.posXY[i].x-this.nowPos.x)<this.cell_large/2)&&(Math.abs(this.posXY[i].y-this.nowPos.y)<this.cell_large/2)){
			return i;
		}
	}
	return "NO";
}

//画手势线
Lock.prototype.drawline = function(start,end){
	this.pos[end].style.backgroundColor="hotpink";
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	if(this.posXY[start]){
		ctx.moveTo(this.posXY[start].x,this.posXY[start].y);
	}
	if(this.posXY[end]){
		ctx.lineTo(this.posXY[end].x,this.posXY[end].y);
	}
	
	ctx.stroke();
}

//清除锁样式，清空密码，
Lock.prototype.restore = function(){
	for(var i = 0;i<pos.length;i++){
		this.pos[i].style.backgroundColor = "white";
	}
	this.password = "";
	ctx.clearRect(0,0,c.width,c.height);
}




var lock = new Lock(pos);

lock.posXY = lock.getPosition();

var start,end,s="";




f.onchange = function(){
	if(f.getElementsByTagName("input")[0].checked){
		tip.innerHTML = "请输入手势密码";
		lock_area.onmousedown = mousedownSet;
	}else if(f.getElementsByTagName("input")[1].checked){
		lock_area.onmousedown = mousedownVerify;
		tip.innerHTML = "";
	}else {
		lock_area.onmousedown = null;
	}
}



//设置手势
function mousedownSet (e){
	

	var e = e||event;
	lock.nowPos = getNowPos(e);
	start = lock.getCircle(); //初始触摸单元的序号
	document.onmousemove = function(e){
		var e = e||event;
		lock.nowPos = getNowPos(e);
		end = lock.getCircle();
		log(end)
		if(end!="NO"){
			//todo
			if(start!=end){
				lock.password+=start;
			}
			lock.drawline(start,end);
			start = end;
		}
		
		document.onmouseup = function(){
			document.onmousemove = null;
			lock.password+=start;
			if(lock.password.length<=4&&s==""){
				tip.innerHTML = "密码太短，至少需要5个点";
				lock.restore(pos);
				document.onmouseup = null;
				return ;	
			}
			if(s==""){
				tip.innerHTML = "请再次输入密码";
				s = lock.password;
				lock.restore(pos);
				document.onmouseup = null;
				return ;	
			}else{
				if(s!=lock.password){
					log("s:"+s+"  lock.password:"+lock.password);
					tip.innerHTML = "两次输入不一致,请重新设置";
					lock.restore(pos);
					s="";
					document.onmouseup = null;
					return ;
				}else{
					tip.innerHTML = "密码设置成功";
					localStorage.Password = lock.password;
				}	
			}
			lock.restore(pos);
			s="";
			log("localStorage.Password："+localStorage.Password);
			document.onmouseup = null;
			lock_area.onmousedown = null;
		}
		
		
	}
}





//验证手势
function mousedownVerify (e){
	var e = e||event;
	
	lock.nowPos = getNowPos(e);
	start = lock.getCircle(); //初始触摸单元的序号
	document.onmousemove = function(e){
		var e = e||event;
		lock.nowPos = getNowPos(e);
		end = lock.getCircle();
		log(end)
		if(end!="NO"){
			//todo
			if(start!=end){
				lock.password+=start;
			}
			lock.drawline(start,end);
			start = end;
		}
		
		document.onmouseup = function(){
			document.onmousemove = null;
			lock.password+=start;
			if(lock.password!=localStorage.Password){
				tip.innerHTML="密码不正确";
				lock.restore(pos);		
				document.onmouseup = null;
				return ;
			}
			tip.innerHTML="密码正确";
			lock.restore(pos);		
			document.onmouseup = null;
			lock_area.onmousedown = null;
		}	
	}
}














