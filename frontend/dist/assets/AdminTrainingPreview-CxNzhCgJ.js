var cu=Object.defineProperty;var uu=(s,e,t)=>e in s?cu(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var fe=(s,e,t)=>uu(s,typeof e!="symbol"?e+"":e,t);import{u as du,a as hu,r as tt,b as Ho,j as Se,E as fu,L as ko,S as pu,B as mu,s as gu,f as Au,c as br}from"./index-B25yIEoz.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ao="170",vi={ROTATE:0,DOLLY:1,PAN:2},_i={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Su=0,Vo=1,xu=2,gc=1,vu=2,Rn=3,xn=0,Gt=1,nn=2,Zn=0,$n=1,Go=2,Wo=3,Xo=4,Ac=5,ci=100,_u=101,yu=102,Mu=103,Eu=104,Cu=200,Tu=201,bu=202,wu=203,xs=204,vs=205,Ru=206,Iu=207,Du=208,Pu=209,Fu=210,Bu=211,Lu=212,Uu=213,Nu=214,pa=0,ma=1,ga=2,Qi=3,Aa=4,Sa=5,xa=6,va=7,Sc=0,Ou=1,zu=2,Jn=0,Hu=1,ku=2,Vu=3,Gu=4,Wu=5,Xu=6,qu=7,xc=300,Yi=301,Ki=302,_a=303,ya=304,vr=306,Ma=1e3,fi=1001,Ea=1002,Yt=1003,Qu=1004,Rs=1005,gn=1006,wr=1007,pi=1008,vn=1009,vc=1010,_c=1011,_s=1012,oo=1013,sn=1014,fn=1015,ts=1016,lo=1017,co=1018,ji=1020,yc=35902,Mc=1021,Ec=1022,Nt=1023,Cc=1024,Tc=1025,gi=1026,Zi=1027,bc=1028,_r=1029,wc=1030,uo=1031,Vi=1033,rr=33776,ar=33777,or=33778,lr=33779,Ca=35840,Ta=35841,ba=35842,wa=35843,Ra=36196,Ia=37492,Da=37496,Pa=37808,Fa=37809,Ba=37810,La=37811,Ua=37812,Na=37813,Oa=37814,za=37815,Ha=37816,ka=37817,Va=37818,Ga=37819,Wa=37820,Xa=37821,cr=36492,qa=36494,Qa=36495,Rc=36283,Ya=36284,Ka=36285,ja=36286,Yu=3200,Ku=3201,ju=0,Zu=1,jn="",en="srgb",ns="srgb-linear",yr="linear",ct="srgb",yi=7680,qo=519,$u=512,Ju=513,ed=514,Ic=515,td=516,nd=517,id=518,sd=519,Qo=35044,rd=35048,Yo="300 es",Bn=2e3,hr=2001;class Si{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ur=Math.PI/180,Za=180/Math.PI;function Cs(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[s&255]+Dt[s>>8&255]+Dt[s>>16&255]+Dt[s>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function Ft(s,e,t){return Math.max(e,Math.min(t,s))}function ad(s,e){return(s%e+e)%e}function Rr(s,e,t){return(1-t)*s+t*e}function os(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ht(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Dc={DEG2RAD:ur};class Fe{constructor(e=0,t=0){Fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,t,n,i,r,a,o,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],f=n[2],h=n[5],g=n[8],A=i[0],m=i[3],p=i[6],S=i[1],_=i[4],x=i[7],T=i[2],E=i[5],M=i[8];return r[0]=a*A+o*S+l*T,r[3]=a*m+o*_+l*E,r[6]=a*p+o*x+l*M,r[1]=c*A+u*S+d*T,r[4]=c*m+u*_+d*E,r[7]=c*p+u*x+d*M,r[2]=f*A+h*S+g*T,r[5]=f*m+h*_+g*E,r[8]=f*p+h*x+g*M,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,f=o*l-u*r,h=c*r-a*l,g=t*d+n*f+i*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const A=1/g;return e[0]=d*A,e[1]=(i*c-u*n)*A,e[2]=(o*n-i*a)*A,e[3]=f*A,e[4]=(u*t-i*l)*A,e[5]=(i*r-o*t)*A,e[6]=h*A,e[7]=(n*l-c*t)*A,e[8]=(a*t-n*r)*A,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ir.makeScale(e,t)),this}rotate(e){return this.premultiply(Ir.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ir.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ir=new Ve;function Pc(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function fr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function od(){const s=fr("canvas");return s.style.display="block",s}const Ko={};function hs(s){s in Ko||(Ko[s]=!0,console.warn(s))}function ld(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function cd(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function ud(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Je={enabled:!0,workingColorSpace:ns,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ct&&(s.r=Ln(s.r),s.g=Ln(s.g),s.b=Ln(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ct&&(s.r=Gi(s.r),s.g=Gi(s.g),s.b=Gi(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===jn?yr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Ln(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Gi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const jo=[.64,.33,.3,.6,.15,.06],Zo=[.2126,.7152,.0722],$o=[.3127,.329],Jo=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),el=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Je.define({[ns]:{primaries:jo,whitePoint:$o,transfer:yr,toXYZ:Jo,fromXYZ:el,luminanceCoefficients:Zo,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:jo,whitePoint:$o,transfer:ct,toXYZ:Jo,fromXYZ:el,luminanceCoefficients:Zo,outputColorSpaceConfig:{drawingBufferColorSpace:en}}});let Mi;class dd{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Mi===void 0&&(Mi=fr("canvas")),Mi.width=e.width,Mi.height=e.height;const n=Mi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Mi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Ln(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ln(t[n]/255)*255):t[n]=Ln(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let hd=0;class Fc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hd++}),this.uuid=Cs(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Dr(i[a].image)):r.push(Dr(i[a]))}else r=Dr(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Dr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?dd.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let fd=0;class Ot extends Si{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,n=fi,i=fi,r=gn,a=pi,o=Nt,l=vn,c=Ot.DEFAULT_ANISOTROPY,u=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fd++}),this.uuid=Cs(),this.name="",this.source=new Fc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ma:e.x=e.x-Math.floor(e.x);break;case fi:e.x=e.x<0?0:1;break;case Ea:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ma:e.y=e.y-Math.floor(e.y);break;case fi:e.y=e.y<0?0:1;break;case Ea:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=xc;Ot.DEFAULT_ANISOTROPY=1;class At{constructor(e=0,t=0,n=0,i=1){At.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],h=l[5],g=l[9],A=l[2],m=l[6],p=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-A)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+A)<.1&&Math.abs(g+m)<.1&&Math.abs(c+h+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,x=(h+1)/2,T=(p+1)/2,E=(u+f)/4,M=(d+A)/4,w=(g+m)/4;return _>x&&_>T?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=E/n,r=M/n):x>T?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=E/i,r=w/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=M/r,i=w/r),this.set(n,i,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(d-A)*(d-A)+(f-u)*(f-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-A)/S,this.z=(f-u)/S,this.w=Math.acos((c+h+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class pd extends Si{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ot(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Fc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ei extends pd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Bc extends Ot{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class md extends Ot{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class St{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],d=n[i+3];const f=r[a+0],h=r[a+1],g=r[a+2],A=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=h,e[t+2]=g,e[t+3]=A;return}if(d!==A||l!==f||c!==h||u!==g){let m=1-o;const p=l*f+c*h+u*g+d*A,S=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const T=Math.sqrt(_),E=Math.atan2(T,p*S);m=Math.sin(m*E)/T,o=Math.sin(o*E)/T}const x=o*S;if(l=l*m+f*x,c=c*m+h*x,u=u*m+g*x,d=d*m+A*x,m===1-o){const T=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=T,c*=T,u*=T,d*=T}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],d=r[a],f=r[a+1],h=r[a+2],g=r[a+3];return e[t]=o*g+u*d+l*h-c*f,e[t+1]=l*g+u*f+c*d-o*h,e[t+2]=c*g+u*h+o*f-l*d,e[t+3]=u*g-o*d-l*f-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),d=o(r/2),f=l(n/2),h=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=f*u*d+c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d-f*h*g;break;case"YXZ":this._x=f*u*d+c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d+f*h*g;break;case"ZXY":this._x=f*u*d-c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d-f*h*g;break;case"ZYX":this._x=f*u*d-c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d+f*h*g;break;case"YZX":this._x=f*u*d+c*h*g,this._y=c*h*d+f*u*g,this._z=c*u*g-f*h*d,this._w=c*u*d-f*h*g;break;case"XZY":this._x=f*u*d-c*h*g,this._y=c*h*d-f*u*g,this._z=c*u*g+f*h*d,this._w=c*u*d+f*h*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-l)*h,this._y=(r-c)*h,this._z=(a-i)*h}else if(n>o&&n>d){const h=2*Math.sqrt(1+n-o-d);this._w=(u-l)/h,this._x=.25*h,this._y=(i+a)/h,this._z=(r+c)/h}else if(o>d){const h=2*Math.sqrt(1+o-n-d);this._w=(r-c)/h,this._x=(i+a)/h,this._y=.25*h,this._z=(l+u)/h}else{const h=2*Math.sqrt(1+d-n-o);this._w=(a-i)/h,this._x=(r+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ft(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const h=1-t;return this._w=h*a+t*this._w,this._x=h*n+t*this._x,this._y=h*i+t*this._y,this._z=h*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),d=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=i*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-r*i),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-r*d,this.z=i+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Pr.copy(this).projectOnVector(e),this.sub(Pr)}reflect(e){return this.sub(Pr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pr=new P,tl=new St;class An{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,cn):cn.fromBufferAttribute(r,a),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Is.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Is.copy(n.boundingBox)),Is.applyMatrix4(e.matrixWorld),this.union(Is)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ls),Ds.subVectors(this.max,ls),Ei.subVectors(e.a,ls),Ci.subVectors(e.b,ls),Ti.subVectors(e.c,ls),Hn.subVectors(Ci,Ei),kn.subVectors(Ti,Ci),ni.subVectors(Ei,Ti);let t=[0,-Hn.z,Hn.y,0,-kn.z,kn.y,0,-ni.z,ni.y,Hn.z,0,-Hn.x,kn.z,0,-kn.x,ni.z,0,-ni.x,-Hn.y,Hn.x,0,-kn.y,kn.x,0,-ni.y,ni.x,0];return!Fr(t,Ei,Ci,Ti,Ds)||(t=[1,0,0,0,1,0,0,0,1],!Fr(t,Ei,Ci,Ti,Ds))?!1:(Ps.crossVectors(Hn,kn),t=[Ps.x,Ps.y,Ps.z],Fr(t,Ei,Ci,Ti,Ds))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Mn=[new P,new P,new P,new P,new P,new P,new P,new P],cn=new P,Is=new An,Ei=new P,Ci=new P,Ti=new P,Hn=new P,kn=new P,ni=new P,ls=new P,Ds=new P,Ps=new P,ii=new P;function Fr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){ii.fromArray(s,r);const o=i.x*Math.abs(ii.x)+i.y*Math.abs(ii.y)+i.z*Math.abs(ii.z),l=e.dot(ii),c=t.dot(ii),u=n.dot(ii);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const gd=new An,cs=new P,Br=new P;class ho{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):gd.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;cs.subVectors(e,this.center);const t=cs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(cs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Br.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(cs.copy(e.center).add(Br)),this.expandByPoint(cs.copy(e.center).sub(Br))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const En=new P,Lr=new P,Fs=new P,Vn=new P,Ur=new P,Bs=new P,Nr=new P;let Lc=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,En)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=En.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(En.copy(this.origin).addScaledVector(this.direction,t),En.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Lr.copy(e).add(t).multiplyScalar(.5),Fs.copy(t).sub(e).normalize(),Vn.copy(this.origin).sub(Lr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Fs),o=Vn.dot(this.direction),l=-Vn.dot(Fs),c=Vn.lengthSq(),u=Math.abs(1-a*a);let d,f,h,g;if(u>0)if(d=a*l-o,f=a*o-l,g=r*u,d>=0)if(f>=-g)if(f<=g){const A=1/u;d*=A,f*=A,h=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=r,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-l),r),h=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-r,-l),r),h=f*(f+2*l)+c):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-l),r),h=-d*d+f*(f+2*l)+c);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Lr).addScaledVector(Fs,f),h}intersectSphere(e,t){En.subVectors(e.center,this.origin);const n=En.dot(this.direction),i=En.dot(En)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,En)!==null}intersectTriangle(e,t,n,i,r){Ur.subVectors(t,e),Bs.subVectors(n,e),Nr.crossVectors(Ur,Bs);let a=this.direction.dot(Nr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Vn.subVectors(this.origin,e);const l=o*this.direction.dot(Bs.crossVectors(Vn,Bs));if(l<0)return null;const c=o*this.direction.dot(Ur.cross(Vn));if(c<0||l+c>a)return null;const u=-o*Vn.dot(Nr);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}};class Ge{constructor(e,t,n,i,r,a,o,l,c,u,d,f,h,g,A,m){Ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,u,d,f,h,g,A,m)}set(e,t,n,i,r,a,o,l,c,u,d,f,h,g,A,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=f,p[3]=h,p[7]=g,p[11]=A,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ge().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/bi.setFromMatrixColumn(e,0).length(),r=1/bi.setFromMatrixColumn(e,1).length(),a=1/bi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const f=a*u,h=a*d,g=o*u,A=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=h+g*c,t[5]=f-A*c,t[9]=-o*l,t[2]=A-f*c,t[6]=g+h*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,h=l*d,g=c*u,A=c*d;t[0]=f+A*o,t[4]=g*o-h,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=h*o-g,t[6]=A+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,h=l*d,g=c*u,A=c*d;t[0]=f-A*o,t[4]=-a*d,t[8]=g+h*o,t[1]=h+g*o,t[5]=a*u,t[9]=A-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,h=a*d,g=o*u,A=o*d;t[0]=l*u,t[4]=g*c-h,t[8]=f*c+A,t[1]=l*d,t[5]=A*c+f,t[9]=h*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,h=a*c,g=o*l,A=o*c;t[0]=l*u,t[4]=A-f*d,t[8]=g*d+h,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=h*d+g,t[10]=f-A*d}else if(e.order==="XZY"){const f=a*l,h=a*c,g=o*l,A=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+A,t[5]=a*u,t[9]=h*d-g,t[2]=g*d-h,t[6]=o*u,t[10]=A*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ad,e,Sd)}lookAt(e,t,n){const i=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),Gn.crossVectors(n,Xt),Gn.lengthSq()===0&&(Math.abs(n.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),Gn.crossVectors(n,Xt)),Gn.normalize(),Ls.crossVectors(Xt,Gn),i[0]=Gn.x,i[4]=Ls.x,i[8]=Xt.x,i[1]=Gn.y,i[5]=Ls.y,i[9]=Xt.y,i[2]=Gn.z,i[6]=Ls.z,i[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],f=n[9],h=n[13],g=n[2],A=n[6],m=n[10],p=n[14],S=n[3],_=n[7],x=n[11],T=n[15],E=i[0],M=i[4],w=i[8],y=i[12],v=i[1],I=i[5],U=i[9],F=i[13],B=i[2],z=i[6],N=i[10],q=i[14],H=i[3],X=i[7],ee=i[11],he=i[15];return r[0]=a*E+o*v+l*B+c*H,r[4]=a*M+o*I+l*z+c*X,r[8]=a*w+o*U+l*N+c*ee,r[12]=a*y+o*F+l*q+c*he,r[1]=u*E+d*v+f*B+h*H,r[5]=u*M+d*I+f*z+h*X,r[9]=u*w+d*U+f*N+h*ee,r[13]=u*y+d*F+f*q+h*he,r[2]=g*E+A*v+m*B+p*H,r[6]=g*M+A*I+m*z+p*X,r[10]=g*w+A*U+m*N+p*ee,r[14]=g*y+A*F+m*q+p*he,r[3]=S*E+_*v+x*B+T*H,r[7]=S*M+_*I+x*z+T*X,r[11]=S*w+_*U+x*N+T*ee,r[15]=S*y+_*F+x*q+T*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],h=e[14],g=e[3],A=e[7],m=e[11],p=e[15];return g*(+r*l*d-i*c*d-r*o*f+n*c*f+i*o*h-n*l*h)+A*(+t*l*h-t*c*f+r*a*f-i*a*h+i*c*u-r*l*u)+m*(+t*c*d-t*o*h-r*a*d+n*a*h+r*o*u-n*c*u)+p*(-i*o*u-t*l*d+t*o*f+i*a*d-n*a*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],h=e[11],g=e[12],A=e[13],m=e[14],p=e[15],S=d*m*c-A*f*c+A*l*h-o*m*h-d*l*p+o*f*p,_=g*f*c-u*m*c-g*l*h+a*m*h+u*l*p-a*f*p,x=u*A*c-g*d*c+g*o*h-a*A*h-u*o*p+a*d*p,T=g*d*l-u*A*l-g*o*f+a*A*f+u*o*m-a*d*m,E=t*S+n*_+i*x+r*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const M=1/E;return e[0]=S*M,e[1]=(A*f*r-d*m*r-A*i*h+n*m*h+d*i*p-n*f*p)*M,e[2]=(o*m*r-A*l*r+A*i*c-n*m*c-o*i*p+n*l*p)*M,e[3]=(d*l*r-o*f*r-d*i*c+n*f*c+o*i*h-n*l*h)*M,e[4]=_*M,e[5]=(u*m*r-g*f*r+g*i*h-t*m*h-u*i*p+t*f*p)*M,e[6]=(g*l*r-a*m*r-g*i*c+t*m*c+a*i*p-t*l*p)*M,e[7]=(a*f*r-u*l*r+u*i*c-t*f*c-a*i*h+t*l*h)*M,e[8]=x*M,e[9]=(g*d*r-u*A*r-g*n*h+t*A*h+u*n*p-t*d*p)*M,e[10]=(a*A*r-g*o*r+g*n*c-t*A*c-a*n*p+t*o*p)*M,e[11]=(u*o*r-a*d*r-u*n*c+t*d*c+a*n*h-t*o*h)*M,e[12]=T*M,e[13]=(u*A*i-g*d*i+g*n*f-t*A*f-u*n*m+t*d*m)*M,e[14]=(g*o*i-a*A*i-g*n*l+t*A*l+a*n*m-t*o*m)*M,e[15]=(a*d*i-u*o*i+u*n*l-t*d*l-a*n*f+t*o*f)*M,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,f=r*c,h=r*u,g=r*d,A=a*u,m=a*d,p=o*d,S=l*c,_=l*u,x=l*d,T=n.x,E=n.y,M=n.z;return i[0]=(1-(A+p))*T,i[1]=(h+x)*T,i[2]=(g-_)*T,i[3]=0,i[4]=(h-x)*E,i[5]=(1-(f+p))*E,i[6]=(m+S)*E,i[7]=0,i[8]=(g+_)*M,i[9]=(m-S)*M,i[10]=(1-(f+A))*M,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=bi.set(i[0],i[1],i[2]).length();const a=bi.set(i[4],i[5],i[6]).length(),o=bi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],un.copy(this);const c=1/r,u=1/a,d=1/o;return un.elements[0]*=c,un.elements[1]*=c,un.elements[2]*=c,un.elements[4]*=u,un.elements[5]*=u,un.elements[6]*=u,un.elements[8]*=d,un.elements[9]*=d,un.elements[10]*=d,t.setFromRotationMatrix(un),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=Bn){const l=this.elements,c=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let h,g;if(o===Bn)h=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===hr)h=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=h,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=Bn){const l=this.elements,c=1/(t-e),u=1/(n-i),d=1/(a-r),f=(t+e)*c,h=(n+i)*u;let g,A;if(o===Bn)g=(a+r)*d,A=-2*d;else if(o===hr)g=r*d,A=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-h,l[2]=0,l[6]=0,l[10]=A,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const bi=new P,un=new Ge,Ad=new P(0,0,0),Sd=new P(1,1,1),Gn=new P,Ls=new P,Xt=new P,nl=new Ge,il=new St;class Nn{constructor(e=0,t=0,n=0,i=Nn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],d=i[2],f=i[6],h=i[10];switch(t){case"XYZ":this._y=Math.asin(Ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ft(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ft(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-Ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,h),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return nl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return il.setFromEuler(this),this.setFromQuaternion(il,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nn.DEFAULT_ORDER="XYZ";class Uc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let xd=0;const sl=new P,wi=new St,Cn=new Ge,Us=new P,us=new P,vd=new P,_d=new St,rl=new P(1,0,0),al=new P(0,1,0),ol=new P(0,0,1),ll={type:"added"},yd={type:"removed"},Ri={type:"childadded",child:null},Or={type:"childremoved",child:null};class Ct extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=Cs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new P,t=new Nn,n=new St,i=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ge},normalMatrix:{value:new Ve}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Uc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wi.setFromAxisAngle(e,t),this.quaternion.multiply(wi),this}rotateOnWorldAxis(e,t){return wi.setFromAxisAngle(e,t),this.quaternion.premultiply(wi),this}rotateX(e){return this.rotateOnAxis(rl,e)}rotateY(e){return this.rotateOnAxis(al,e)}rotateZ(e){return this.rotateOnAxis(ol,e)}translateOnAxis(e,t){return sl.copy(e).applyQuaternion(this.quaternion),this.position.add(sl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rl,e)}translateY(e){return this.translateOnAxis(al,e)}translateZ(e){return this.translateOnAxis(ol,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Us.copy(e):Us.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(us,Us,this.up):Cn.lookAt(Us,us,this.up),this.quaternion.setFromRotationMatrix(Cn),i&&(Cn.extractRotation(i.matrixWorld),wi.setFromRotationMatrix(Cn),this.quaternion.premultiply(wi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ll),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(yd),Or.child=e,this.dispatchEvent(Or),Or.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ll),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,e,vd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,_d,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),h=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Ct.DEFAULT_UP=new P(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new P,Tn=new P,zr=new P,bn=new P,Ii=new P,Di=new P,cl=new P,Hr=new P,kr=new P,Vr=new P,Gr=new At,Wr=new At,Xr=new At;class hn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),dn.subVectors(e,t),i.cross(dn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){dn.subVectors(i,t),Tn.subVectors(n,t),zr.subVectors(e,t);const a=dn.dot(dn),o=dn.dot(Tn),l=dn.dot(zr),c=Tn.dot(Tn),u=Tn.dot(zr),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const f=1/d,h=(c*l-o*u)*f,g=(a*u-o*l)*f;return r.set(1-h-g,g,h)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,bn)===null?!1:bn.x>=0&&bn.y>=0&&bn.x+bn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,bn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,bn.x),l.addScaledVector(a,bn.y),l.addScaledVector(o,bn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return Gr.setScalar(0),Wr.setScalar(0),Xr.setScalar(0),Gr.fromBufferAttribute(e,t),Wr.fromBufferAttribute(e,n),Xr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Gr,r.x),a.addScaledVector(Wr,r.y),a.addScaledVector(Xr,r.z),a}static isFrontFacing(e,t,n,i){return dn.subVectors(n,t),Tn.subVectors(e,t),dn.cross(Tn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return dn.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),dn.cross(Tn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return hn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Ii.subVectors(i,n),Di.subVectors(r,n),Hr.subVectors(e,n);const l=Ii.dot(Hr),c=Di.dot(Hr);if(l<=0&&c<=0)return t.copy(n);kr.subVectors(e,i);const u=Ii.dot(kr),d=Di.dot(kr);if(u>=0&&d<=u)return t.copy(i);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Ii,a);Vr.subVectors(e,r);const h=Ii.dot(Vr),g=Di.dot(Vr);if(g>=0&&h<=g)return t.copy(r);const A=h*c-l*g;if(A<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Di,o);const m=u*g-h*d;if(m<=0&&d-u>=0&&h-g>=0)return cl.subVectors(r,i),o=(d-u)/(d-u+(h-g)),t.copy(i).addScaledVector(cl,o);const p=1/(m+A+f);return a=A*p,o=f*p,t.copy(n).addScaledVector(Ii,a).addScaledVector(Di,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Nc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},Ns={h:0,s:0,l:0};function qr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class nt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=en){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Je.workingColorSpace){if(e=ad(e,1),t=Ft(t,0,1),n=Ft(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=qr(a,r,e+1/3),this.g=qr(a,r,e),this.b=qr(a,r,e-1/3)}return Je.toWorkingColorSpace(this,i),this}setStyle(e,t=en){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=en){const n=Nc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ln(e.r),this.g=Ln(e.g),this.b=Ln(e.b),this}copyLinearToSRGB(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=en){return Je.fromWorkingColorSpace(Pt.copy(this),e),Math.round(Ft(Pt.r*255,0,255))*65536+Math.round(Ft(Pt.g*255,0,255))*256+Math.round(Ft(Pt.b*255,0,255))}getHexString(e=en){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Pt.copy(this),t);const n=Pt.r,i=Pt.g,r=Pt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=en){Je.fromWorkingColorSpace(Pt.copy(this),e);const t=Pt.r,n=Pt.g,i=Pt.b;return e!==en?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL(Ns);const n=Rr(Wn.h,Ns.h,t),i=Rr(Wn.s,Ns.s,t),r=Rr(Wn.l,Ns.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pt=new nt;nt.NAMES=Nc;let Md=0;class Mr extends Si{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Md++}),this.uuid=Cs(),this.name="",this.blending=$n,this.side=xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xs,this.blendDst=vs,this.blendEquation=ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new nt(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=yi,this.stencilZFail=yi,this.stencilZPass=yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==$n&&(n.blending=this.blending),this.side!==xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==xs&&(n.blendSrc=this.blendSrc),this.blendDst!==vs&&(n.blendDst=this.blendDst),this.blendEquation!==ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==yi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==yi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==yi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ai extends Mr{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=Sc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pn=Ed();function Ed(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;!(c&8388608);)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function Cd(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=Ft(s,-65504,65504),Pn.floatView[0]=s;const e=Pn.uint32View[0],t=e>>23&511;return Pn.baseTable[t]+((e&8388607)>>Pn.shiftTable[t])}function Td(s){const e=s>>10;return Pn.uint32View[0]=Pn.mantissaTable[Pn.offsetTable[e]+(s&1023)]+Pn.exponentTable[e],Pn.floatView[0]}const ys={toHalfFloat:Cd,fromHalfFloat:Td},Mt=new P,Os=new Fe;class rn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Qo,this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Os.fromBufferAttribute(this,t),Os.applyMatrix3(e),this.setXY(t,Os.x,Os.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=os(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=os(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=os(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=os(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=os(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),i=Ht(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),i=Ht(i,this.array),r=Ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qo&&(e.usage=this.usage),e}}class Oc extends rn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class zc extends rn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Kt extends rn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let bd=0;const $t=new Ge,Qr=new Ct,Pi=new P,qt=new An,ds=new An,wt=new P;class an extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bd++}),this.uuid=Cs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pc(e)?zc:Oc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return Qr.lookAt(e),Qr.updateMatrix(),this.applyMatrix4(Qr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Kt(n,3))}else{for(let n=0,i=t.count;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];qt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ho);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ds.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(qt.min,ds.min),qt.expandByPoint(wt),wt.addVectors(qt.max,ds.max),qt.expandByPoint(wt)):(qt.expandByPoint(ds.min),qt.expandByPoint(ds.max))}qt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(wt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)wt.fromBufferAttribute(o,c),l&&(Pi.fromBufferAttribute(e,c),wt.add(Pi)),i=Math.max(i,n.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let w=0;w<n.count;w++)o[w]=new P,l[w]=new P;const c=new P,u=new P,d=new P,f=new Fe,h=new Fe,g=new Fe,A=new P,m=new P;function p(w,y,v){c.fromBufferAttribute(n,w),u.fromBufferAttribute(n,y),d.fromBufferAttribute(n,v),f.fromBufferAttribute(r,w),h.fromBufferAttribute(r,y),g.fromBufferAttribute(r,v),u.sub(c),d.sub(c),h.sub(f),g.sub(f);const I=1/(h.x*g.y-g.x*h.y);isFinite(I)&&(A.copy(u).multiplyScalar(g.y).addScaledVector(d,-h.y).multiplyScalar(I),m.copy(d).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(I),o[w].add(A),o[y].add(A),o[v].add(A),l[w].add(m),l[y].add(m),l[v].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let w=0,y=S.length;w<y;++w){const v=S[w],I=v.start,U=v.count;for(let F=I,B=I+U;F<B;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const _=new P,x=new P,T=new P,E=new P;function M(w){T.fromBufferAttribute(i,w),E.copy(T);const y=o[w];_.copy(y),_.sub(T.multiplyScalar(T.dot(y))).normalize(),x.crossVectors(E,y);const I=x.dot(l[w])<0?-1:1;a.setXYZW(w,_.x,_.y,_.z,I)}for(let w=0,y=S.length;w<y;++w){const v=S[w],I=v.start,U=v.count;for(let F=I,B=I+U;F<B;F+=3)M(e.getX(F+0)),M(e.getX(F+1)),M(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new rn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,h=n.count;f<h;f++)n.setXYZ(f,0,0,0);const i=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,d=new P;if(e)for(let f=0,h=e.count;f<h;f+=3){const g=e.getX(f+0),A=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,A),a.fromBufferAttribute(t,m),u.subVectors(a,r),d.subVectors(i,r),u.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,A),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(A,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,h=t.count;f<h;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),d.subVectors(i,r),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,f=new c.constructor(l.length*u);let h=0,g=0;for(let A=0,m=l.length;A<m;A++){o.isInterleavedBufferAttribute?h=l[A]*o.data.stride+o.offset:h=l[A]*u;for(let p=0;p<u;p++)f[g++]=c[h++]}return new rn(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new an,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){const f=c[u],h=e(f,n);l.push(h)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const h=c[d];u.push(h.toJSON(e.data))}u.length>0&&(i[l]=u,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ul=new Ge,si=new Lc,zs=new ho,dl=new P,Hs=new P,ks=new P,Vs=new P,Yr=new P,Gs=new P,hl=new P,Ws=new P;class vt extends Ct{constructor(e=new an,t=new Ai){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Gs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],d=r[l];u!==0&&(Yr.fromBufferAttribute(d,e),a?Gs.addScaledVector(Yr,u):Gs.addScaledVector(Yr.sub(t),u))}t.add(Gs)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zs.copy(n.boundingSphere),zs.applyMatrix4(r),si.copy(e.ray).recast(e.near),!(zs.containsPoint(si.origin)===!1&&(si.intersectSphere(zs,dl)===null||si.origin.distanceToSquared(dl)>(e.far-e.near)**2))&&(ul.copy(r).invert(),si.copy(e.ray).applyMatrix4(ul),!(n.boundingBox!==null&&si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,si)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,f=r.groups,h=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,A=f.length;g<A;g++){const m=f[g],p=a[m.materialIndex],S=Math.max(m.start,h.start),_=Math.min(o.count,Math.min(m.start+m.count,h.start+h.count));for(let x=S,T=_;x<T;x+=3){const E=o.getX(x),M=o.getX(x+1),w=o.getX(x+2);i=Xs(this,p,e,n,c,u,d,E,M,w),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),A=Math.min(o.count,h.start+h.count);for(let m=g,p=A;m<p;m+=3){const S=o.getX(m),_=o.getX(m+1),x=o.getX(m+2);i=Xs(this,a,e,n,c,u,d,S,_,x),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,A=f.length;g<A;g++){const m=f[g],p=a[m.materialIndex],S=Math.max(m.start,h.start),_=Math.min(l.count,Math.min(m.start+m.count,h.start+h.count));for(let x=S,T=_;x<T;x+=3){const E=x,M=x+1,w=x+2;i=Xs(this,p,e,n,c,u,d,E,M,w),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),A=Math.min(l.count,h.start+h.count);for(let m=g,p=A;m<p;m+=3){const S=m,_=m+1,x=m+2;i=Xs(this,a,e,n,c,u,d,S,_,x),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function wd(s,e,t,n,i,r,a,o){let l;if(e.side===Gt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===xn,o),l===null)return null;Ws.copy(o),Ws.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Ws);return c<t.near||c>t.far?null:{distance:c,point:Ws.clone(),object:s}}function Xs(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Hs),s.getVertexPosition(l,ks),s.getVertexPosition(c,Vs);const u=wd(s,e,t,n,Hs,ks,Vs,hl);if(u){const d=new P;hn.getBarycoord(hl,Hs,ks,Vs,d),i&&(u.uv=hn.getInterpolatedAttribute(i,o,l,c,d,new Fe)),r&&(u.uv1=hn.getInterpolatedAttribute(r,o,l,c,d,new Fe)),a&&(u.normal=hn.getInterpolatedAttribute(a,o,l,c,d,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new P,materialIndex:0};hn.getNormal(Hs,ks,Vs,f.normal),u.face=f,u.barycoord=d}return u}class is extends an{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],d=[];let f=0,h=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(u,3)),this.setAttribute("uv",new Kt(d,2));function g(A,m,p,S,_,x,T,E,M,w,y){const v=x/M,I=T/w,U=x/2,F=T/2,B=E/2,z=M+1,N=w+1;let q=0,H=0;const X=new P;for(let ee=0;ee<N;ee++){const he=ee*I-F;for(let Re=0;Re<z;Re++){const ze=Re*v-U;X[A]=ze*S,X[m]=he*_,X[p]=B,c.push(X.x,X.y,X.z),X[A]=0,X[m]=0,X[p]=E>0?1:-1,u.push(X.x,X.y,X.z),d.push(Re/M),d.push(1-ee/w),q+=1}}for(let ee=0;ee<w;ee++)for(let he=0;he<M;he++){const Re=f+he+z*ee,ze=f+he+z*(ee+1),W=f+(he+1)+z*(ee+1),te=f+(he+1)+z*ee;l.push(Re,ze,te),l.push(ze,W,te),H+=6}o.addGroup(h,H,y),h+=H,f+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new is(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $i(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Bt(s){const e={};for(let t=0;t<s.length;t++){const n=$i(s[t]);for(const i in n)e[i]=n[i]}return e}function Rd(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Hc(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Id={clone:$i,merge:Bt};var Dd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jt extends Mr{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dd,this.fragmentShader=Pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$i(e.uniforms),this.uniformsGroups=Rd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class kc extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=Bn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xn=new P,fl=new Fe,pl=new Fe;class tn extends kc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Za*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ur*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Za*2*Math.atan(Math.tan(ur*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Xn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z),Xn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z)}getViewSize(e,t){return this.getViewBounds(e,fl,pl),t.subVectors(pl,fl)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ur*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Fi=-90,Bi=1;class Fd extends Ct{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new tn(Fi,Bi,e,t);i.layers=this.layers,this.add(i);const r=new tn(Fi,Bi,e,t);r.layers=this.layers,this.add(r);const a=new tn(Fi,Bi,e,t);a.layers=this.layers,this.add(a);const o=new tn(Fi,Bi,e,t);o.layers=this.layers,this.add(o);const l=new tn(Fi,Bi,e,t);l.layers=this.layers,this.add(l);const c=new tn(Fi,Bi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===hr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const A=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=A,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(d,f,h),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Vc extends Ot{constructor(e,t,n,i,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Yi,super(e,t,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Bd extends ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Vc(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:gn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new is(5,5,5),r=new jt({name:"CubemapFromEquirect",uniforms:$i(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:Zn});r.uniforms.tEquirect.value=t;const a=new vt(i,r),o=t.minFilter;return t.minFilter===pi&&(t.minFilter=gn),new Fd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}const Kr=new P,Ld=new P,Ud=new Ve;class Yn{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Kr.subVectors(n,t).cross(Ld.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Kr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Ud.getNormalMatrix(e),i=this.coplanarPoint(Kr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new ho,qs=new P;class Gc{constructor(e=new Yn,t=new Yn,n=new Yn,i=new Yn,r=new Yn,a=new Yn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bn){const n=this.planes,i=e.elements,r=i[0],a=i[1],o=i[2],l=i[3],c=i[4],u=i[5],d=i[6],f=i[7],h=i[8],g=i[9],A=i[10],m=i[11],p=i[12],S=i[13],_=i[14],x=i[15];if(n[0].setComponents(l-r,f-c,m-h,x-p).normalize(),n[1].setComponents(l+r,f+c,m+h,x+p).normalize(),n[2].setComponents(l+a,f+u,m+g,x+S).normalize(),n[3].setComponents(l-a,f-u,m-g,x-S).normalize(),n[4].setComponents(l-o,f-d,m-A,x-_).normalize(),t===Bn)n[5].setComponents(l+o,f+d,m+A,x+_).normalize();else if(t===hr)n[5].setComponents(o,d,A,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){return ri.center.set(0,0,0),ri.radius=.7071067811865476,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(qs.x=i.normal.x>0?e.max.x:e.min.x,qs.y=i.normal.y>0?e.max.y:e.min.y,qs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(qs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Wc(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Nd(s){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,d=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,u),o.onUploadCallback();let h;if(c instanceof Float32Array)h=s.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?h=s.HALF_FLOAT:h=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=s.SHORT;else if(c instanceof Uint32Array)h=s.UNSIGNED_INT;else if(c instanceof Int32Array)h=s.INT;else if(c instanceof Int8Array)h=s.BYTE;else if(c instanceof Uint8Array)h=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const u=l.array,d=l.updateRanges;if(s.bindBuffer(c,o),d.length===0)s.bufferSubData(c,0,u);else{d.sort((h,g)=>h.start-g.start);let f=0;for(let h=1;h<d.length;h++){const g=d[f],A=d[h];A.start<=g.start+g.count+1?g.count=Math.max(g.count,A.start+A.count-g.start):(++f,d[f]=A)}d.length=f+1;for(let h=0,g=d.length;h<g;h++){const A=d[h];s.bufferSubData(c,A.start*u.BYTES_PER_ELEMENT,u,A.start,A.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}class Ji extends an{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,d=e/o,f=t/l,h=[],g=[],A=[],m=[];for(let p=0;p<u;p++){const S=p*f-a;for(let _=0;_<c;_++){const x=_*d-r;g.push(x,-S,0),A.push(0,0,1),m.push(_/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){const _=S+c*p,x=S+c*(p+1),T=S+1+c*(p+1),E=S+1+c*p;h.push(_,x,E),h.push(x,T,E)}this.setIndex(h),this.setAttribute("position",new Kt(g,3)),this.setAttribute("normal",new Kt(A,3)),this.setAttribute("uv",new Kt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ji(e.width,e.height,e.widthSegments,e.heightSegments)}}var Od=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Hd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Gd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Xd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Qd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Kd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Zd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,$d=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Jd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,eh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,th=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,nh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ih=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,sh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,rh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ah=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,oh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,lh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ch=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,uh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ph="gl_FragColor = linearToOutputTexel( gl_FragColor );",mh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,gh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ah=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Sh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,xh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,_h=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Eh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ch=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Th=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Rh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ih=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Dh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ph=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bh=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lh=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Uh=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Nh=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Oh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,zh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hh=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kh=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vh=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gh=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Wh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qh=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qh=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yh=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jh=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zh=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$h=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jh=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ef=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,nf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,sf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,af=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,of=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,lf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,uf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,df=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ff=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,pf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Af=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,_f=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,yf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ef=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Tf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,wf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Rf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,If=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Df=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ff=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Bf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Lf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Uf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Nf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Of=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Xf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,qf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Qf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Yf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Kf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$f=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Jf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ep=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,np=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ip=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,rp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ap=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,op=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,cp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,up=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,fp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,gp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ap=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:Od,alphahash_pars_fragment:zd,alphamap_fragment:Hd,alphamap_pars_fragment:kd,alphatest_fragment:Vd,alphatest_pars_fragment:Gd,aomap_fragment:Wd,aomap_pars_fragment:Xd,batching_pars_vertex:qd,batching_vertex:Qd,begin_vertex:Yd,beginnormal_vertex:Kd,bsdfs:jd,iridescence_fragment:Zd,bumpmap_pars_fragment:$d,clipping_planes_fragment:Jd,clipping_planes_pars_fragment:eh,clipping_planes_pars_vertex:th,clipping_planes_vertex:nh,color_fragment:ih,color_pars_fragment:sh,color_pars_vertex:rh,color_vertex:ah,common:oh,cube_uv_reflection_fragment:lh,defaultnormal_vertex:ch,displacementmap_pars_vertex:uh,displacementmap_vertex:dh,emissivemap_fragment:hh,emissivemap_pars_fragment:fh,colorspace_fragment:ph,colorspace_pars_fragment:mh,envmap_fragment:gh,envmap_common_pars_fragment:Ah,envmap_pars_fragment:Sh,envmap_pars_vertex:xh,envmap_physical_pars_fragment:Ih,envmap_vertex:vh,fog_vertex:_h,fog_pars_vertex:yh,fog_fragment:Mh,fog_pars_fragment:Eh,gradientmap_pars_fragment:Ch,lightmap_pars_fragment:Th,lights_lambert_fragment:bh,lights_lambert_pars_fragment:wh,lights_pars_begin:Rh,lights_toon_fragment:Dh,lights_toon_pars_fragment:Ph,lights_phong_fragment:Fh,lights_phong_pars_fragment:Bh,lights_physical_fragment:Lh,lights_physical_pars_fragment:Uh,lights_fragment_begin:Nh,lights_fragment_maps:Oh,lights_fragment_end:zh,logdepthbuf_fragment:Hh,logdepthbuf_pars_fragment:kh,logdepthbuf_pars_vertex:Vh,logdepthbuf_vertex:Gh,map_fragment:Wh,map_pars_fragment:Xh,map_particle_fragment:qh,map_particle_pars_fragment:Qh,metalnessmap_fragment:Yh,metalnessmap_pars_fragment:Kh,morphinstance_vertex:jh,morphcolor_vertex:Zh,morphnormal_vertex:$h,morphtarget_pars_vertex:Jh,morphtarget_vertex:ef,normal_fragment_begin:tf,normal_fragment_maps:nf,normal_pars_fragment:sf,normal_pars_vertex:rf,normal_vertex:af,normalmap_pars_fragment:of,clearcoat_normal_fragment_begin:lf,clearcoat_normal_fragment_maps:cf,clearcoat_pars_fragment:uf,iridescence_pars_fragment:df,opaque_fragment:hf,packing:ff,premultiplied_alpha_fragment:pf,project_vertex:mf,dithering_fragment:gf,dithering_pars_fragment:Af,roughnessmap_fragment:Sf,roughnessmap_pars_fragment:xf,shadowmap_pars_fragment:vf,shadowmap_pars_vertex:_f,shadowmap_vertex:yf,shadowmask_pars_fragment:Mf,skinbase_vertex:Ef,skinning_pars_vertex:Cf,skinning_vertex:Tf,skinnormal_vertex:bf,specularmap_fragment:wf,specularmap_pars_fragment:Rf,tonemapping_fragment:If,tonemapping_pars_fragment:Df,transmission_fragment:Pf,transmission_pars_fragment:Ff,uv_pars_fragment:Bf,uv_pars_vertex:Lf,uv_vertex:Uf,worldpos_vertex:Nf,background_vert:Of,background_frag:zf,backgroundCube_vert:Hf,backgroundCube_frag:kf,cube_vert:Vf,cube_frag:Gf,depth_vert:Wf,depth_frag:Xf,distanceRGBA_vert:qf,distanceRGBA_frag:Qf,equirect_vert:Yf,equirect_frag:Kf,linedashed_vert:jf,linedashed_frag:Zf,meshbasic_vert:$f,meshbasic_frag:Jf,meshlambert_vert:ep,meshlambert_frag:tp,meshmatcap_vert:np,meshmatcap_frag:ip,meshnormal_vert:sp,meshnormal_frag:rp,meshphong_vert:ap,meshphong_frag:op,meshphysical_vert:lp,meshphysical_frag:cp,meshtoon_vert:up,meshtoon_frag:dp,points_vert:hp,points_frag:fp,shadow_vert:pp,shadow_frag:mp,sprite_vert:gp,sprite_frag:Ap},ye={common:{diffuse:{value:new nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new nt(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},mn={basic:{uniforms:Bt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Bt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new nt(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Bt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new nt(0)},specular:{value:new nt(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Bt([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Bt([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new nt(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Bt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Bt([ye.points,ye.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Bt([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Bt([ye.common,ye.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Bt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Bt([ye.sprite,ye.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:Bt([ye.common,ye.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:Bt([ye.lights,ye.fog,{color:{value:new nt(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};mn.physical={uniforms:Bt([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new nt(0)},specularColor:{value:new nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const Qs={r:0,b:0,g:0},ai=new Nn,Sp=new Ge;function xp(s,e,t,n,i,r,a){const o=new nt(0);let l=r===!0?0:1,c,u,d=null,f=0,h=null;function g(S){let _=S.isScene===!0?S.background:null;return _&&_.isTexture&&(_=(S.backgroundBlurriness>0?t:e).get(_)),_}function A(S){let _=!1;const x=g(S);x===null?p(o,l):x&&x.isColor&&(p(x,1),_=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(S,_){const x=g(_);x&&(x.isCubeTexture||x.mapping===vr)?(u===void 0&&(u=new vt(new is(1,1,1),new jt({name:"BackgroundCubeMaterial",uniforms:$i(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,E,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),ai.copy(_.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Sp.makeRotationFromEuler(ai)),u.material.toneMapped=Je.getTransfer(x.colorSpace)!==ct,(d!==x||f!==x.version||h!==s.toneMapping)&&(u.material.needsUpdate=!0,d=x,f=x.version,h=s.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new vt(new Ji(2,2),new jt({name:"BackgroundMaterial",uniforms:$i(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=Je.getTransfer(x.colorSpace)!==ct,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||f!==x.version||h!==s.toneMapping)&&(c.material.needsUpdate=!0,d=x,f=x.version,h=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,_){S.getRGB(Qs,Hc(s)),n.buffers.color.setClear(Qs.r,Qs.g,Qs.b,_,a)}return{getClearColor:function(){return o},setClearColor:function(S,_=1){o.set(S),l=_,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(o,l)},render:A,addToRenderList:m}}function vp(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,a=!1;function o(v,I,U,F,B){let z=!1;const N=d(F,U,I);r!==N&&(r=N,c(r.object)),z=h(v,F,U,B),z&&g(v,F,U,B),B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,x(v,I,U,F),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function u(v){return s.deleteVertexArray(v)}function d(v,I,U){const F=U.wireframe===!0;let B=n[v.id];B===void 0&&(B={},n[v.id]=B);let z=B[I.id];z===void 0&&(z={},B[I.id]=z);let N=z[F];return N===void 0&&(N=f(l()),z[F]=N),N}function f(v){const I=[],U=[],F=[];for(let B=0;B<t;B++)I[B]=0,U[B]=0,F[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:U,attributeDivisors:F,object:v,attributes:{},index:null}}function h(v,I,U,F){const B=r.attributes,z=I.attributes;let N=0;const q=U.getAttributes();for(const H in q)if(q[H].location>=0){const ee=B[H];let he=z[H];if(he===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(he=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(he=v.instanceColor)),ee===void 0||ee.attribute!==he||he&&ee.data!==he.data)return!0;N++}return r.attributesNum!==N||r.index!==F}function g(v,I,U,F){const B={},z=I.attributes;let N=0;const q=U.getAttributes();for(const H in q)if(q[H].location>=0){let ee=z[H];ee===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(ee=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(ee=v.instanceColor));const he={};he.attribute=ee,ee&&ee.data&&(he.data=ee.data),B[H]=he,N++}r.attributes=B,r.attributesNum=N,r.index=F}function A(){const v=r.newAttributes;for(let I=0,U=v.length;I<U;I++)v[I]=0}function m(v){p(v,0)}function p(v,I){const U=r.newAttributes,F=r.enabledAttributes,B=r.attributeDivisors;U[v]=1,F[v]===0&&(s.enableVertexAttribArray(v),F[v]=1),B[v]!==I&&(s.vertexAttribDivisor(v,I),B[v]=I)}function S(){const v=r.newAttributes,I=r.enabledAttributes;for(let U=0,F=I.length;U<F;U++)I[U]!==v[U]&&(s.disableVertexAttribArray(U),I[U]=0)}function _(v,I,U,F,B,z,N){N===!0?s.vertexAttribIPointer(v,I,U,B,z):s.vertexAttribPointer(v,I,U,F,B,z)}function x(v,I,U,F){A();const B=F.attributes,z=U.getAttributes(),N=I.defaultAttributeValues;for(const q in z){const H=z[q];if(H.location>=0){let X=B[q];if(X===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(X=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(X=v.instanceColor)),X!==void 0){const ee=X.normalized,he=X.itemSize,Re=e.get(X);if(Re===void 0)continue;const ze=Re.buffer,W=Re.type,te=Re.bytesPerElement,le=W===s.INT||W===s.UNSIGNED_INT||X.gpuType===oo;if(X.isInterleavedBufferAttribute){const se=X.data,Ae=se.stride,Ee=X.offset;if(se.isInstancedInterleavedBuffer){for(let be=0;be<H.locationSize;be++)p(H.location+be,se.meshPerAttribute);v.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let be=0;be<H.locationSize;be++)m(H.location+be);s.bindBuffer(s.ARRAY_BUFFER,ze);for(let be=0;be<H.locationSize;be++)_(H.location+be,he/H.locationSize,W,ee,Ae*te,(Ee+he/H.locationSize*be)*te,le)}else{if(X.isInstancedBufferAttribute){for(let se=0;se<H.locationSize;se++)p(H.location+se,X.meshPerAttribute);v.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let se=0;se<H.locationSize;se++)m(H.location+se);s.bindBuffer(s.ARRAY_BUFFER,ze);for(let se=0;se<H.locationSize;se++)_(H.location+se,he/H.locationSize,W,ee,he*te,he/H.locationSize*se*te,le)}}else if(N!==void 0){const ee=N[q];if(ee!==void 0)switch(ee.length){case 2:s.vertexAttrib2fv(H.location,ee);break;case 3:s.vertexAttrib3fv(H.location,ee);break;case 4:s.vertexAttrib4fv(H.location,ee);break;default:s.vertexAttrib1fv(H.location,ee)}}}}S()}function T(){w();for(const v in n){const I=n[v];for(const U in I){const F=I[U];for(const B in F)u(F[B].object),delete F[B];delete I[U]}delete n[v]}}function E(v){if(n[v.id]===void 0)return;const I=n[v.id];for(const U in I){const F=I[U];for(const B in F)u(F[B].object),delete F[B];delete I[U]}delete n[v.id]}function M(v){for(const I in n){const U=n[I];if(U[v.id]===void 0)continue;const F=U[v.id];for(const B in F)u(F[B].object),delete F[B];delete U[v.id]}}function w(){y(),a=!0,r!==i&&(r=i,c(r.object))}function y(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:y,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:M,initAttributes:A,enableAttribute:m,disableUnusedAttributes:S}}function _p(s,e,t){let n;function i(c){n=c}function r(c,u){s.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,d){d!==0&&(s.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function o(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,d);let h=0;for(let g=0;g<d;g++)h+=u[g];t.update(h,n,1)}function l(c,u,d,f){if(d===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let g=0;g<c.length;g++)a(c[g],u[g],f[g]);else{h.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,d);let g=0;for(let A=0;A<d;A++)g+=u[A]*f[A];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function yp(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const M=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(M.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(M){return!(M!==Nt&&n.convert(M)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(M){const w=M===ts&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(M!==vn&&n.convert(M)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&M!==fn&&!w)}function l(M){if(M==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";M="mediump"}return M==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),h=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),A=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),_=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,E=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:h,maxVertexTextures:g,maxTextureSize:A,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:T,maxSamples:E}}function Mp(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Yn,o=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const h=d.length!==0||f||n!==0||i;return i=f,n=d.length,h},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,h){const g=d.clippingPlanes,A=d.clipIntersection,m=d.clipShadows,p=s.get(d);if(!i||g===null||g.length===0||r&&!m)r?u(null):c();else{const S=r?0:n,_=S*4;let x=p.clippingState||null;l.value=x,x=u(g,f,_,h);for(let T=0;T!==_;++T)x[T]=t[T];p.clippingState=x,this.numIntersection=A?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,h,g){const A=d!==null?d.length:0;let m=null;if(A!==0){if(m=l.value,g!==!0||m===null){const p=h+A*4,S=f.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,x=h;_!==A;++_,x+=4)a.copy(d[_]).applyMatrix4(S,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=A,e.numIntersection=0,m}}function Ep(s){let e=new WeakMap;function t(a,o){return o===_a?a.mapping=Yi:o===ya&&(a.mapping=Ki),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===_a||o===ya)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Bd(l.height);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class fo extends kc{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Hi=4,ml=[.125,.215,.35,.446,.526,.582],ui=20,jr=new fo,gl=new nt;let Zr=null,$r=0,Jr=0,ea=!1;const li=(1+Math.sqrt(5))/2,Li=1/li,Al=[new P(-li,Li,0),new P(li,Li,0),new P(-Li,0,li),new P(Li,0,li),new P(0,li,-Li),new P(0,li,Li),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class Sl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Zr=this._renderer.getRenderTarget(),$r=this._renderer.getActiveCubeFace(),Jr=this._renderer.getActiveMipmapLevel(),ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_l(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Zr,$r,Jr),this._renderer.xr.enabled=ea,e.scissorTest=!1,Ys(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yi||e.mapping===Ki?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zr=this._renderer.getRenderTarget(),$r=this._renderer.getActiveCubeFace(),Jr=this._renderer.getActiveMipmapLevel(),ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:ts,format:Nt,colorSpace:ns,depthBuffer:!1},i=xl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cp(r)),this._blurMaterial=Tp(r,e,t)}return i}_compileMaterial(e){const t=new vt(this._lodPlanes[0],e);this._renderer.compile(t,jr)}_sceneToCubeUV(e,t,n,i){const o=new tn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(gl),u.toneMapping=Jn,u.autoClear=!1;const h=new Ai({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),g=new vt(new is,h);let A=!1;const m=e.background;m?m.isColor&&(h.color.copy(m),e.background=null,A=!0):(h.color.copy(gl),A=!0);for(let p=0;p<6;p++){const S=p%3;S===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):S===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const _=this._cubeSize;Ys(i,S*_,p>2?_:0,_,_),u.setRenderTarget(i),A&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Yi||e.mapping===Ki;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=_l()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vl());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new vt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ys(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,jr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Al[(i-r-1)%Al.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new vt(this._lodPlanes[i],c),f=c.uniforms,h=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*h):2*Math.PI/(2*ui-1),A=r/g,m=isFinite(r)?1+Math.floor(u*A):ui;m>ui&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ui}`);const p=[];let S=0;for(let M=0;M<ui;++M){const w=M/A,y=Math.exp(-w*w/2);p.push(y),M===0?S+=y:M<m&&(S+=2*y)}for(let M=0;M<p.length;M++)p[M]=p[M]/S;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:_}=this;f.dTheta.value=g,f.mipInt.value=_-n;const x=this._sizeLods[i],T=3*x*(i>_-Hi?i-_+Hi:0),E=4*(this._cubeSize-x);Ys(t,T,E,3*x,2*x),l.setRenderTarget(t),l.render(d,jr)}}function Cp(s){const e=[],t=[],n=[];let i=s;const r=s-Hi+1+ml.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-Hi?l=ml[a-s+Hi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,g=6,A=3,m=2,p=1,S=new Float32Array(A*g*h),_=new Float32Array(m*g*h),x=new Float32Array(p*g*h);for(let E=0;E<h;E++){const M=E%3*2/3-1,w=E>2?0:-1,y=[M,w,0,M+2/3,w,0,M+2/3,w+1,0,M,w,0,M+2/3,w+1,0,M,w+1,0];S.set(y,A*g*E),_.set(f,m*g*E);const v=[E,E,E,E,E,E];x.set(v,p*g*E)}const T=new an;T.setAttribute("position",new rn(S,A)),T.setAttribute("uv",new rn(_,m)),T.setAttribute("faceIndex",new rn(x,p)),e.push(T),i>Hi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function xl(s,e,t){const n=new ei(s,e,t);return n.texture.mapping=vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ys(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Tp(s,e,t){const n=new Float32Array(ui),i=new P(0,1,0);return new jt({name:"SphericalGaussianBlur",defines:{n:ui,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:po(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function vl(){return new jt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:po(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function _l(){return new jt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:po(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function po(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function bp(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===_a||l===ya,u=l===Yi||l===Ki;if(c||u){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Sl(s)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const h=o.image;return c&&h&&h.height>0||u&&h&&i(h)?(t===null&&(t=new Sl(s)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function i(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function wp(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&hs("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Rp(s,e,t,n){const i={},r=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const A=f.morphAttributes[g];for(let m=0,p=A.length;m<p;m++)e.remove(A[m])}f.removeEventListener("dispose",a),delete i[f.id];const h=r.get(f);h&&(e.remove(h),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const g in f)e.update(f[g],s.ARRAY_BUFFER);const h=d.morphAttributes;for(const g in h){const A=h[g];for(let m=0,p=A.length;m<p;m++)e.update(A[m],s.ARRAY_BUFFER)}}function c(d){const f=[],h=d.index,g=d.attributes.position;let A=0;if(h!==null){const S=h.array;A=h.version;for(let _=0,x=S.length;_<x;_+=3){const T=S[_+0],E=S[_+1],M=S[_+2];f.push(T,E,E,M,M,T)}}else if(g!==void 0){const S=g.array;A=g.version;for(let _=0,x=S.length/3-1;_<x;_+=3){const T=_+0,E=_+1,M=_+2;f.push(T,E,E,M,M,T)}}else return;const m=new(Pc(f)?zc:Oc)(f,1);m.version=A;const p=r.get(d);p&&e.remove(p),r.set(d,m)}function u(d){const f=r.get(d);if(f){const h=d.index;h!==null&&f.version<h.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function Ip(s,e,t){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,h){s.drawElements(n,h,r,f*a),t.update(h,n,1)}function c(f,h,g){g!==0&&(s.drawElementsInstanced(n,h,r,f*a,g),t.update(h,n,g))}function u(f,h,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=h[p];t.update(m,n,1)}function d(f,h,g,A){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/a,h[p],A[p]);else{m.multiDrawElementsInstancedWEBGL(n,h,0,r,f,0,A,0,g);let p=0;for(let S=0;S<g;S++)p+=h[S]*A[S];t.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Dp(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Pp(s,e,t){const n=new WeakMap,i=new At;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let y=function(){M.dispose(),n.delete(o),o.removeEventListener("dispose",y)};f!==void 0&&f.texture.dispose();const h=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,A=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let _=0;h===!0&&(_=1),g===!0&&(_=2),A===!0&&(_=3);let x=o.attributes.position.count*_,T=1;x>e.maxTextureSize&&(T=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const E=new Float32Array(x*T*4*d),M=new Bc(E,x,T,d);M.type=fn,M.needsUpdate=!0;const w=_*4;for(let v=0;v<d;v++){const I=m[v],U=p[v],F=S[v],B=x*T*4*v;for(let z=0;z<I.count;z++){const N=z*w;h===!0&&(i.fromBufferAttribute(I,z),E[B+N+0]=i.x,E[B+N+1]=i.y,E[B+N+2]=i.z,E[B+N+3]=0),g===!0&&(i.fromBufferAttribute(U,z),E[B+N+4]=i.x,E[B+N+5]=i.y,E[B+N+6]=i.z,E[B+N+7]=0),A===!0&&(i.fromBufferAttribute(F,z),E[B+N+8]=i.x,E[B+N+9]=i.y,E[B+N+10]=i.z,E[B+N+11]=F.itemSize===4?i.w:1)}}f={count:d,texture:M,size:new Fe(x,T)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let h=0;for(let A=0;A<c.length;A++)h+=c[A];const g=o.morphTargetsRelative?1:1-h;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function Fp(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,d=e.get(l,u);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return d}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class mo extends Ot{constructor(e,t,n,i,r,a,o,l,c,u=gi){if(u!==gi&&u!==Zi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===gi&&(n=sn),n===void 0&&u===Zi&&(n=ji),super(null,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Yt,this.minFilter=l!==void 0?l:Yt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Xc=new Ot,yl=new mo(1,1),qc=new Bc,Qc=new md,Yc=new Vc,Ml=[],El=[],Cl=new Float32Array(16),Tl=new Float32Array(9),bl=new Float32Array(4);function ss(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Ml[i];if(r===void 0&&(r=new Float32Array(i),Ml[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Tt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function bt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Er(s,e){let t=El[e];t===void 0&&(t=new Int32Array(e),El[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Bp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Lp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2fv(this.addr,e),bt(t,e)}}function Up(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;s.uniform3fv(this.addr,e),bt(t,e)}}function Np(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4fv(this.addr,e),bt(t,e)}}function Op(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(Tt(t,n))return;bl.set(n),s.uniformMatrix2fv(this.addr,!1,bl),bt(t,n)}}function zp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(Tt(t,n))return;Tl.set(n),s.uniformMatrix3fv(this.addr,!1,Tl),bt(t,n)}}function Hp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(Tt(t,n))return;Cl.set(n),s.uniformMatrix4fv(this.addr,!1,Cl),bt(t,n)}}function kp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Vp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2iv(this.addr,e),bt(t,e)}}function Gp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;s.uniform3iv(this.addr,e),bt(t,e)}}function Wp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4iv(this.addr,e),bt(t,e)}}function Xp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function qp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2uiv(this.addr,e),bt(t,e)}}function Qp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;s.uniform3uiv(this.addr,e),bt(t,e)}}function Yp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4uiv(this.addr,e),bt(t,e)}}function Kp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(yl.compareFunction=Ic,r=yl):r=Xc,t.setTexture2D(e||r,i)}function jp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Qc,i)}function Zp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Yc,i)}function $p(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||qc,i)}function Jp(s){switch(s){case 5126:return Bp;case 35664:return Lp;case 35665:return Up;case 35666:return Np;case 35674:return Op;case 35675:return zp;case 35676:return Hp;case 5124:case 35670:return kp;case 35667:case 35671:return Vp;case 35668:case 35672:return Gp;case 35669:case 35673:return Wp;case 5125:return Xp;case 36294:return qp;case 36295:return Qp;case 36296:return Yp;case 35678:case 36198:case 36298:case 36306:case 35682:return Kp;case 35679:case 36299:case 36307:return jp;case 35680:case 36300:case 36308:case 36293:return Zp;case 36289:case 36303:case 36311:case 36292:return $p}}function em(s,e){s.uniform1fv(this.addr,e)}function tm(s,e){const t=ss(e,this.size,2);s.uniform2fv(this.addr,t)}function nm(s,e){const t=ss(e,this.size,3);s.uniform3fv(this.addr,t)}function im(s,e){const t=ss(e,this.size,4);s.uniform4fv(this.addr,t)}function sm(s,e){const t=ss(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function rm(s,e){const t=ss(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function am(s,e){const t=ss(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function om(s,e){s.uniform1iv(this.addr,e)}function lm(s,e){s.uniform2iv(this.addr,e)}function cm(s,e){s.uniform3iv(this.addr,e)}function um(s,e){s.uniform4iv(this.addr,e)}function dm(s,e){s.uniform1uiv(this.addr,e)}function hm(s,e){s.uniform2uiv(this.addr,e)}function fm(s,e){s.uniform3uiv(this.addr,e)}function pm(s,e){s.uniform4uiv(this.addr,e)}function mm(s,e,t){const n=this.cache,i=e.length,r=Er(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),bt(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||Xc,r[a])}function gm(s,e,t){const n=this.cache,i=e.length,r=Er(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),bt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Qc,r[a])}function Am(s,e,t){const n=this.cache,i=e.length,r=Er(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),bt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Yc,r[a])}function Sm(s,e,t){const n=this.cache,i=e.length,r=Er(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),bt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||qc,r[a])}function xm(s){switch(s){case 5126:return em;case 35664:return tm;case 35665:return nm;case 35666:return im;case 35674:return sm;case 35675:return rm;case 35676:return am;case 5124:case 35670:return om;case 35667:case 35671:return lm;case 35668:case 35672:return cm;case 35669:case 35673:return um;case 5125:return dm;case 36294:return hm;case 36295:return fm;case 36296:return pm;case 35678:case 36198:case 36298:case 36306:case 35682:return mm;case 35679:case 36299:case 36307:return gm;case 35680:case 36300:case 36308:case 36293:return Am;case 36289:case 36303:case 36311:case 36292:return Sm}}class vm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Jp(t.type)}}class _m{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xm(t.type)}}class ym{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const ta=/(\w+)(\])?(\[|\.)?/g;function wl(s,e){s.seq.push(e),s.map[e.id]=e}function Mm(s,e,t){const n=s.name,i=n.length;for(ta.lastIndex=0;;){const r=ta.exec(n),a=ta.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){wl(t,c===void 0?new vm(o,s,e):new _m(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new ym(o),wl(t,d)),t=d}}}class dr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);Mm(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Rl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Em=37297;let Cm=0;function Tm(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Il=new Ve;function bm(s){Je._getMatrix(Il,Je.workingColorSpace,s);const e=`mat3( ${Il.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(s)){case yr:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Dl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Tm(s.getShaderSource(e),a)}else return i}function wm(s,e){const t=bm(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Rm(s,e){let t;switch(e){case Hu:t="Linear";break;case ku:t="Reinhard";break;case Vu:t="Cineon";break;case Gu:t="ACESFilmic";break;case Xu:t="AgX";break;case qu:t="Neutral";break;case Wu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ks=new P;function Im(){Je.getLuminanceCoefficients(Ks);const s=Ks.x.toFixed(4),e=Ks.y.toFixed(4),t=Ks.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dm(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fs).join(`
`)}function Pm(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Fm(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function fs(s){return s!==""}function Pl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Bm=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(s){return s.replace(Bm,Um)}const Lm=new Map;function Um(s,e){let t=je[e];if(t===void 0){const n=Lm.get(e);if(n!==void 0)t=je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return $a(t)}const Nm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bl(s){return s.replace(Nm,Om)}function Om(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ll(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function zm(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===gc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===vu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Rn&&(e="SHADOWMAP_TYPE_VSM"),e}function Hm(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Yi:case Ki:e="ENVMAP_TYPE_CUBE";break;case vr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function km(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ki:e="ENVMAP_MODE_REFRACTION";break}return e}function Vm(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Sc:e="ENVMAP_BLENDING_MULTIPLY";break;case Ou:e="ENVMAP_BLENDING_MIX";break;case zu:e="ENVMAP_BLENDING_ADD";break}return e}function Gm(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Wm(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=zm(t),c=Hm(t),u=km(t),d=Vm(t),f=Gm(t),h=Dm(t),g=Pm(r),A=i.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fs).join(`
`),p.length>0&&(p+=`
`)):(m=[Ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),p=[Ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Jn?"#define TONE_MAPPING":"",t.toneMapping!==Jn?je.tonemapping_pars_fragment:"",t.toneMapping!==Jn?Rm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,wm("linearToOutputTexel",t.outputColorSpace),Im(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fs).join(`
`)),a=$a(a),a=Pl(a,t),a=Fl(a,t),o=$a(o),o=Pl(o,t),o=Fl(o,t),a=Bl(a),o=Bl(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Yo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Yo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=S+m+a,x=S+p+o,T=Rl(i,i.VERTEX_SHADER,_),E=Rl(i,i.FRAGMENT_SHADER,x);i.attachShader(A,T),i.attachShader(A,E),t.index0AttributeName!==void 0?i.bindAttribLocation(A,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(A,0,"position"),i.linkProgram(A);function M(I){if(s.debug.checkShaderErrors){const U=i.getProgramInfoLog(A).trim(),F=i.getShaderInfoLog(T).trim(),B=i.getShaderInfoLog(E).trim();let z=!0,N=!0;if(i.getProgramParameter(A,i.LINK_STATUS)===!1)if(z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,A,T,E);else{const q=Dl(i,T,"vertex"),H=Dl(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(A,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+U+`
`+q+`
`+H)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(F===""||B==="")&&(N=!1);N&&(I.diagnostics={runnable:z,programLog:U,vertexShader:{log:F,prefix:m},fragmentShader:{log:B,prefix:p}})}i.deleteShader(T),i.deleteShader(E),w=new dr(i,A),y=Fm(i,A)}let w;this.getUniforms=function(){return w===void 0&&M(this),w};let y;this.getAttributes=function(){return y===void 0&&M(this),y};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(A,Em)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(A),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Cm++,this.cacheKey=e,this.usedTimes=1,this.program=A,this.vertexShader=T,this.fragmentShader=E,this}let Xm=0;class qm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Qm(e),t.set(e,n)),n}}class Qm{constructor(e){this.id=Xm++,this.code=e,this.usedTimes=0}}function Ym(s,e,t,n,i,r,a){const o=new Uc,l=new qm,c=new Set,u=[],d=i.logarithmicDepthBuffer,f=i.vertexTextures;let h=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function A(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,v,I,U,F){const B=U.fog,z=F.geometry,N=y.isMeshStandardMaterial?U.environment:null,q=(y.isMeshStandardMaterial?t:e).get(y.envMap||N),H=q&&q.mapping===vr?q.image.height:null,X=g[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));const ee=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,he=ee!==void 0?ee.length:0;let Re=0;z.morphAttributes.position!==void 0&&(Re=1),z.morphAttributes.normal!==void 0&&(Re=2),z.morphAttributes.color!==void 0&&(Re=3);let ze,W,te,le;if(X){const at=mn[X];ze=at.vertexShader,W=at.fragmentShader}else ze=y.vertexShader,W=y.fragmentShader,l.update(y),te=l.getVertexShaderID(y),le=l.getFragmentShaderID(y);const se=s.getRenderTarget(),Ae=s.state.buffers.depth.getReversed(),Ee=F.isInstancedMesh===!0,be=F.isBatchedMesh===!0,Ye=!!y.map,Ie=!!y.matcap,Be=!!q,R=!!y.aoMap,ae=!!y.lightMap,oe=!!y.bumpMap,de=!!y.normalMap,ce=!!y.displacementMap,Le=!!y.emissiveMap,re=!!y.metalnessMap,D=!!y.roughnessMap,C=y.anisotropy>0,O=y.clearcoat>0,$=y.dispersion>0,ne=y.iridescence>0,Z=y.sheen>0,Pe=y.transmission>0,ve=C&&!!y.anisotropyMap,Te=O&&!!y.clearcoatMap,qe=O&&!!y.clearcoatNormalMap,ue=O&&!!y.clearcoatRoughnessMap,L=ne&&!!y.iridescenceMap,ie=ne&&!!y.iridescenceThicknessMap,we=Z&&!!y.sheenColorMap,me=Z&&!!y.sheenRoughnessMap,ke=!!y.specularMap,We=!!y.specularColorMap,$e=!!y.specularIntensityMap,k=Pe&&!!y.transmissionMap,_e=Pe&&!!y.thicknessMap,K=!!y.gradientMap,J=!!y.alphaMap,Me=y.alphaTest>0,xe=!!y.alphaHash,Xe=!!y.extensions;let ut=Jn;y.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(ut=s.toneMapping);const It={shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:ze,fragmentShader:W,defines:y.defines,customVertexShaderID:te,customFragmentShaderID:le,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:be,batchingColor:be&&F._colorsTexture!==null,instancing:Ee,instancingColor:Ee&&F.instanceColor!==null,instancingMorph:Ee&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:se===null?s.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:ns,alphaToCoverage:!!y.alphaToCoverage,map:Ye,matcap:Ie,envMap:Be,envMapMode:Be&&q.mapping,envMapCubeUVHeight:H,aoMap:R,lightMap:ae,bumpMap:oe,normalMap:de,displacementMap:f&&ce,emissiveMap:Le,normalMapObjectSpace:de&&y.normalMapType===Zu,normalMapTangentSpace:de&&y.normalMapType===ju,metalnessMap:re,roughnessMap:D,anisotropy:C,anisotropyMap:ve,clearcoat:O,clearcoatMap:Te,clearcoatNormalMap:qe,clearcoatRoughnessMap:ue,dispersion:$,iridescence:ne,iridescenceMap:L,iridescenceThicknessMap:ie,sheen:Z,sheenColorMap:we,sheenRoughnessMap:me,specularMap:ke,specularColorMap:We,specularIntensityMap:$e,transmission:Pe,transmissionMap:k,thicknessMap:_e,gradientMap:K,opaque:y.transparent===!1&&y.blending===$n&&y.alphaToCoverage===!1,alphaMap:J,alphaTest:Me,alphaHash:xe,combine:y.combine,mapUv:Ye&&A(y.map.channel),aoMapUv:R&&A(y.aoMap.channel),lightMapUv:ae&&A(y.lightMap.channel),bumpMapUv:oe&&A(y.bumpMap.channel),normalMapUv:de&&A(y.normalMap.channel),displacementMapUv:ce&&A(y.displacementMap.channel),emissiveMapUv:Le&&A(y.emissiveMap.channel),metalnessMapUv:re&&A(y.metalnessMap.channel),roughnessMapUv:D&&A(y.roughnessMap.channel),anisotropyMapUv:ve&&A(y.anisotropyMap.channel),clearcoatMapUv:Te&&A(y.clearcoatMap.channel),clearcoatNormalMapUv:qe&&A(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&A(y.clearcoatRoughnessMap.channel),iridescenceMapUv:L&&A(y.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&A(y.iridescenceThicknessMap.channel),sheenColorMapUv:we&&A(y.sheenColorMap.channel),sheenRoughnessMapUv:me&&A(y.sheenRoughnessMap.channel),specularMapUv:ke&&A(y.specularMap.channel),specularColorMapUv:We&&A(y.specularColorMap.channel),specularIntensityMapUv:$e&&A(y.specularIntensityMap.channel),transmissionMapUv:k&&A(y.transmissionMap.channel),thicknessMapUv:_e&&A(y.thicknessMap.channel),alphaMapUv:J&&A(y.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(de||C),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!z.attributes.uv&&(Ye||J),fog:!!B,useFog:y.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Ae,skinning:F.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:Re,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:ut,decodeVideoTexture:Ye&&y.map.isVideoTexture===!0&&Je.getTransfer(y.map.colorSpace)===ct,decodeVideoTextureEmissive:Le&&y.emissiveMap.isVideoTexture===!0&&Je.getTransfer(y.emissiveMap.colorSpace)===ct,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===nn,flipSided:y.side===Gt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Xe&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&y.extensions.multiDraw===!0||be)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return It.vertexUv1s=c.has(1),It.vertexUv2s=c.has(2),It.vertexUv3s=c.has(3),c.clear(),It}function p(y){const v=[];if(y.shaderID?v.push(y.shaderID):(v.push(y.customVertexShaderID),v.push(y.customFragmentShaderID)),y.defines!==void 0)for(const I in y.defines)v.push(I),v.push(y.defines[I]);return y.isRawShaderMaterial===!1&&(S(v,y),_(v,y),v.push(s.outputColorSpace)),v.push(y.customProgramCacheKey),v.join()}function S(y,v){y.push(v.precision),y.push(v.outputColorSpace),y.push(v.envMapMode),y.push(v.envMapCubeUVHeight),y.push(v.mapUv),y.push(v.alphaMapUv),y.push(v.lightMapUv),y.push(v.aoMapUv),y.push(v.bumpMapUv),y.push(v.normalMapUv),y.push(v.displacementMapUv),y.push(v.emissiveMapUv),y.push(v.metalnessMapUv),y.push(v.roughnessMapUv),y.push(v.anisotropyMapUv),y.push(v.clearcoatMapUv),y.push(v.clearcoatNormalMapUv),y.push(v.clearcoatRoughnessMapUv),y.push(v.iridescenceMapUv),y.push(v.iridescenceThicknessMapUv),y.push(v.sheenColorMapUv),y.push(v.sheenRoughnessMapUv),y.push(v.specularMapUv),y.push(v.specularColorMapUv),y.push(v.specularIntensityMapUv),y.push(v.transmissionMapUv),y.push(v.thicknessMapUv),y.push(v.combine),y.push(v.fogExp2),y.push(v.sizeAttenuation),y.push(v.morphTargetsCount),y.push(v.morphAttributeCount),y.push(v.numDirLights),y.push(v.numPointLights),y.push(v.numSpotLights),y.push(v.numSpotLightMaps),y.push(v.numHemiLights),y.push(v.numRectAreaLights),y.push(v.numDirLightShadows),y.push(v.numPointLightShadows),y.push(v.numSpotLightShadows),y.push(v.numSpotLightShadowsWithMaps),y.push(v.numLightProbes),y.push(v.shadowMapType),y.push(v.toneMapping),y.push(v.numClippingPlanes),y.push(v.numClipIntersection),y.push(v.depthPacking)}function _(y,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),y.push(o.mask)}function x(y){const v=g[y.type];let I;if(v){const U=mn[v];I=Id.clone(U.uniforms)}else I=y.uniforms;return I}function T(y,v){let I;for(let U=0,F=u.length;U<F;U++){const B=u[U];if(B.cacheKey===v){I=B,++I.usedTimes;break}}return I===void 0&&(I=new Wm(s,v,y,r),u.push(I)),I}function E(y){if(--y.usedTimes===0){const v=u.indexOf(y);u[v]=u[u.length-1],u.pop(),y.destroy()}}function M(y){l.remove(y)}function w(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:T,releaseProgram:E,releaseShaderCache:M,programs:u,dispose:w}}function Km(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function jm(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Ul(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Nl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d,f,h,g,A,m){let p=s[e];return p===void 0?(p={id:d.id,object:d,geometry:f,material:h,groupOrder:g,renderOrder:d.renderOrder,z:A,group:m},s[e]=p):(p.id=d.id,p.object=d,p.geometry=f,p.material=h,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=A,p.group=m),e++,p}function o(d,f,h,g,A,m){const p=a(d,f,h,g,A,m);h.transmission>0?n.push(p):h.transparent===!0?i.push(p):t.push(p)}function l(d,f,h,g,A,m){const p=a(d,f,h,g,A,m);h.transmission>0?n.unshift(p):h.transparent===!0?i.unshift(p):t.unshift(p)}function c(d,f){t.length>1&&t.sort(d||jm),n.length>1&&n.sort(f||Ul),i.length>1&&i.sort(f||Ul)}function u(){for(let d=e,f=s.length;d<f;d++){const h=s[d];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:u,sort:c}}function Zm(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new Nl,s.set(n,[a])):i>=r.length?(a=new Nl,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function $m(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new nt};break;case"SpotLight":t={position:new P,direction:new P,color:new nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new nt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new nt,groundColor:new nt};break;case"RectAreaLight":t={color:new nt,position:new P,halfWidth:new P,halfHeight:new P};break}return s[e.id]=t,t}}}function Jm(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let eg=0;function tg(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function ng(s){const e=new $m,t=Jm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const i=new P,r=new Ge,a=new Ge;function o(c){let u=0,d=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let h=0,g=0,A=0,m=0,p=0,S=0,_=0,x=0,T=0,E=0,M=0;c.sort(tg);for(let y=0,v=c.length;y<v;y++){const I=c[y],U=I.color,F=I.intensity,B=I.distance,z=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=U.r*F,d+=U.g*F,f+=U.b*F;else if(I.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(I.sh.coefficients[N],F);M++}else if(I.isDirectionalLight){const N=e.get(I);if(N.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const q=I.shadow,H=t.get(I);H.shadowIntensity=q.intensity,H.shadowBias=q.bias,H.shadowNormalBias=q.normalBias,H.shadowRadius=q.radius,H.shadowMapSize=q.mapSize,n.directionalShadow[h]=H,n.directionalShadowMap[h]=z,n.directionalShadowMatrix[h]=I.shadow.matrix,S++}n.directional[h]=N,h++}else if(I.isSpotLight){const N=e.get(I);N.position.setFromMatrixPosition(I.matrixWorld),N.color.copy(U).multiplyScalar(F),N.distance=B,N.coneCos=Math.cos(I.angle),N.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),N.decay=I.decay,n.spot[A]=N;const q=I.shadow;if(I.map&&(n.spotLightMap[T]=I.map,T++,q.updateMatrices(I),I.castShadow&&E++),n.spotLightMatrix[A]=q.matrix,I.castShadow){const H=t.get(I);H.shadowIntensity=q.intensity,H.shadowBias=q.bias,H.shadowNormalBias=q.normalBias,H.shadowRadius=q.radius,H.shadowMapSize=q.mapSize,n.spotShadow[A]=H,n.spotShadowMap[A]=z,x++}A++}else if(I.isRectAreaLight){const N=e.get(I);N.color.copy(U).multiplyScalar(F),N.halfWidth.set(I.width*.5,0,0),N.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=N,m++}else if(I.isPointLight){const N=e.get(I);if(N.color.copy(I.color).multiplyScalar(I.intensity),N.distance=I.distance,N.decay=I.decay,I.castShadow){const q=I.shadow,H=t.get(I);H.shadowIntensity=q.intensity,H.shadowBias=q.bias,H.shadowNormalBias=q.normalBias,H.shadowRadius=q.radius,H.shadowMapSize=q.mapSize,H.shadowCameraNear=q.camera.near,H.shadowCameraFar=q.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=I.shadow.matrix,_++}n.point[g]=N,g++}else if(I.isHemisphereLight){const N=e.get(I);N.skyColor.copy(I.color).multiplyScalar(F),N.groundColor.copy(I.groundColor).multiplyScalar(F),n.hemi[p]=N,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ye.LTC_FLOAT_1,n.rectAreaLTC2=ye.LTC_FLOAT_2):(n.rectAreaLTC1=ye.LTC_HALF_1,n.rectAreaLTC2=ye.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;const w=n.hash;(w.directionalLength!==h||w.pointLength!==g||w.spotLength!==A||w.rectAreaLength!==m||w.hemiLength!==p||w.numDirectionalShadows!==S||w.numPointShadows!==_||w.numSpotShadows!==x||w.numSpotMaps!==T||w.numLightProbes!==M)&&(n.directional.length=h,n.spot.length=A,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=x+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=M,w.directionalLength=h,w.pointLength=g,w.spotLength=A,w.rectAreaLength=m,w.hemiLength=p,w.numDirectionalShadows=S,w.numPointShadows=_,w.numSpotShadows=x,w.numSpotMaps=T,w.numLightProbes=M,n.version=eg++)}function l(c,u){let d=0,f=0,h=0,g=0,A=0;const m=u.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const _=c[p];if(_.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),d++}else if(_.isSpotLight){const x=n.spot[h];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),h++}else if(_.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),a.identity(),r.copy(_.matrixWorld),r.premultiply(m),a.extractRotation(r),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(_.isPointLight){const x=n.point[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){const x=n.hemi[A];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(m),A++}}}return{setup:o,setupView:l,state:n}}function Ol(s){const e=new ng(s),t=[],n=[];function i(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function ig(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Ol(s),e.set(i,[o])):r>=a.length?(o=new Ol(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class sg extends Mr{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Yu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class rg extends Mr{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const ag=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,og=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function lg(s,e,t){let n=new Gc;const i=new Fe,r=new Fe,a=new At,o=new sg({depthPacking:Ku}),l=new rg,c={},u=t.maxTextureSize,d={[xn]:Gt,[Gt]:xn,[nn]:nn},f=new jt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:ag,fragmentShader:og}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const g=new an;g.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const A=new vt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gc;let p=this.type;this.render=function(E,M,w){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const y=s.getRenderTarget(),v=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Zn),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const F=p!==Rn&&this.type===Rn,B=p===Rn&&this.type!==Rn;for(let z=0,N=E.length;z<N;z++){const q=E[z],H=q.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const X=H.getFrameExtents();if(i.multiply(X),r.copy(H.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/X.x),i.x=r.x*X.x,H.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/X.y),i.y=r.y*X.y,H.mapSize.y=r.y)),H.map===null||F===!0||B===!0){const he=this.type!==Rn?{minFilter:Yt,magFilter:Yt}:{};H.map!==null&&H.map.dispose(),H.map=new ei(i.x,i.y,he),H.map.texture.name=q.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const ee=H.getViewportCount();for(let he=0;he<ee;he++){const Re=H.getViewport(he);a.set(r.x*Re.x,r.y*Re.y,r.x*Re.z,r.y*Re.w),U.viewport(a),H.updateMatrices(q,he),n=H.getFrustum(),x(M,w,H.camera,q,this.type)}H.isPointLightShadow!==!0&&this.type===Rn&&S(H,w),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(y,v,I)};function S(E,M){const w=e.update(A);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,h.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new ei(i.x,i.y)),f.uniforms.shadow_pass.value=E.map.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(M,null,w,f,A,null),h.uniforms.shadow_pass.value=E.mapPass.texture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(M,null,w,h,A,null)}function _(E,M,w,y){let v=null;const I=w.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)v=I;else if(v=w.isPointLight===!0?l:o,s.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0){const U=v.uuid,F=M.uuid;let B=c[U];B===void 0&&(B={},c[U]=B);let z=B[F];z===void 0&&(z=v.clone(),B[F]=z,M.addEventListener("dispose",T)),v=z}if(v.visible=M.visible,v.wireframe=M.wireframe,y===Rn?v.side=M.shadowSide!==null?M.shadowSide:M.side:v.side=M.shadowSide!==null?M.shadowSide:d[M.side],v.alphaMap=M.alphaMap,v.alphaTest=M.alphaTest,v.map=M.map,v.clipShadows=M.clipShadows,v.clippingPlanes=M.clippingPlanes,v.clipIntersection=M.clipIntersection,v.displacementMap=M.displacementMap,v.displacementScale=M.displacementScale,v.displacementBias=M.displacementBias,v.wireframeLinewidth=M.wireframeLinewidth,v.linewidth=M.linewidth,w.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const U=s.properties.get(v);U.light=w}return v}function x(E,M,w,y,v){if(E.visible===!1)return;if(E.layers.test(M.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&v===Rn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,E.matrixWorld);const F=e.update(E),B=E.material;if(Array.isArray(B)){const z=F.groups;for(let N=0,q=z.length;N<q;N++){const H=z[N],X=B[H.materialIndex];if(X&&X.visible){const ee=_(E,X,y,v);E.onBeforeShadow(s,E,M,w,F,ee,H),s.renderBufferDirect(w,null,F,ee,E,H),E.onAfterShadow(s,E,M,w,F,ee,H)}}}else if(B.visible){const z=_(E,B,y,v);E.onBeforeShadow(s,E,M,w,F,z,null),s.renderBufferDirect(w,null,F,z,E,null),E.onAfterShadow(s,E,M,w,F,z,null)}}const U=E.children;for(let F=0,B=U.length;F<B;F++)x(U[F],M,w,y,v)}function T(E){E.target.removeEventListener("dispose",T);for(const w in c){const y=c[w],v=E.target.uuid;v in y&&(y[v].dispose(),delete y[v])}}}const cg={[pa]:ma,[ga]:xa,[Aa]:va,[Qi]:Sa,[ma]:pa,[xa]:ga,[va]:Aa,[Sa]:Qi};function ug(s,e){function t(){let k=!1;const _e=new At;let K=null;const J=new At(0,0,0,0);return{setMask:function(Me){K!==Me&&!k&&(s.colorMask(Me,Me,Me,Me),K=Me)},setLocked:function(Me){k=Me},setClear:function(Me,xe,Xe,ut,It){It===!0&&(Me*=ut,xe*=ut,Xe*=ut),_e.set(Me,xe,Xe,ut),J.equals(_e)===!1&&(s.clearColor(Me,xe,Xe,ut),J.copy(_e))},reset:function(){k=!1,K=null,J.set(-1,0,0,0)}}}function n(){let k=!1,_e=!1,K=null,J=null,Me=null;return{setReversed:function(xe){if(_e!==xe){const Xe=e.get("EXT_clip_control");_e?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT);const ut=Me;Me=null,this.setClear(ut)}_e=xe},getReversed:function(){return _e},setTest:function(xe){xe?se(s.DEPTH_TEST):Ae(s.DEPTH_TEST)},setMask:function(xe){K!==xe&&!k&&(s.depthMask(xe),K=xe)},setFunc:function(xe){if(_e&&(xe=cg[xe]),J!==xe){switch(xe){case pa:s.depthFunc(s.NEVER);break;case ma:s.depthFunc(s.ALWAYS);break;case ga:s.depthFunc(s.LESS);break;case Qi:s.depthFunc(s.LEQUAL);break;case Aa:s.depthFunc(s.EQUAL);break;case Sa:s.depthFunc(s.GEQUAL);break;case xa:s.depthFunc(s.GREATER);break;case va:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}J=xe}},setLocked:function(xe){k=xe},setClear:function(xe){Me!==xe&&(_e&&(xe=1-xe),s.clearDepth(xe),Me=xe)},reset:function(){k=!1,K=null,J=null,Me=null,_e=!1}}}function i(){let k=!1,_e=null,K=null,J=null,Me=null,xe=null,Xe=null,ut=null,It=null;return{setTest:function(at){k||(at?se(s.STENCIL_TEST):Ae(s.STENCIL_TEST))},setMask:function(at){_e!==at&&!k&&(s.stencilMask(at),_e=at)},setFunc:function(at,on,_n){(K!==at||J!==on||Me!==_n)&&(s.stencilFunc(at,on,_n),K=at,J=on,Me=_n)},setOp:function(at,on,_n){(xe!==at||Xe!==on||ut!==_n)&&(s.stencilOp(at,on,_n),xe=at,Xe=on,ut=_n)},setLocked:function(at){k=at},setClear:function(at){It!==at&&(s.clearStencil(at),It=at)},reset:function(){k=!1,_e=null,K=null,J=null,Me=null,xe=null,Xe=null,ut=null,It=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let u={},d={},f=new WeakMap,h=[],g=null,A=!1,m=null,p=null,S=null,_=null,x=null,T=null,E=null,M=new nt(0,0,0),w=0,y=!1,v=null,I=null,U=null,F=null,B=null;const z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,q=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(H)[1]),N=q>=1):H.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),N=q>=2);let X=null,ee={};const he=s.getParameter(s.SCISSOR_BOX),Re=s.getParameter(s.VIEWPORT),ze=new At().fromArray(he),W=new At().fromArray(Re);function te(k,_e,K,J){const Me=new Uint8Array(4),xe=s.createTexture();s.bindTexture(k,xe),s.texParameteri(k,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(k,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Xe=0;Xe<K;Xe++)k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY?s.texImage3D(_e,0,s.RGBA,1,1,J,0,s.RGBA,s.UNSIGNED_BYTE,Me):s.texImage2D(_e+Xe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Me);return xe}const le={};le[s.TEXTURE_2D]=te(s.TEXTURE_2D,s.TEXTURE_2D,1),le[s.TEXTURE_CUBE_MAP]=te(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[s.TEXTURE_2D_ARRAY]=te(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),le[s.TEXTURE_3D]=te(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(s.DEPTH_TEST),a.setFunc(Qi),oe(!1),de(Vo),se(s.CULL_FACE),R(Zn);function se(k){u[k]!==!0&&(s.enable(k),u[k]=!0)}function Ae(k){u[k]!==!1&&(s.disable(k),u[k]=!1)}function Ee(k,_e){return d[k]!==_e?(s.bindFramebuffer(k,_e),d[k]=_e,k===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=_e),k===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=_e),!0):!1}function be(k,_e){let K=h,J=!1;if(k){K=f.get(_e),K===void 0&&(K=[],f.set(_e,K));const Me=k.textures;if(K.length!==Me.length||K[0]!==s.COLOR_ATTACHMENT0){for(let xe=0,Xe=Me.length;xe<Xe;xe++)K[xe]=s.COLOR_ATTACHMENT0+xe;K.length=Me.length,J=!0}}else K[0]!==s.BACK&&(K[0]=s.BACK,J=!0);J&&s.drawBuffers(K)}function Ye(k){return g!==k?(s.useProgram(k),g=k,!0):!1}const Ie={[ci]:s.FUNC_ADD,[_u]:s.FUNC_SUBTRACT,[yu]:s.FUNC_REVERSE_SUBTRACT};Ie[Mu]=s.MIN,Ie[Eu]=s.MAX;const Be={[Cu]:s.ZERO,[Tu]:s.ONE,[bu]:s.SRC_COLOR,[xs]:s.SRC_ALPHA,[Fu]:s.SRC_ALPHA_SATURATE,[Du]:s.DST_COLOR,[Ru]:s.DST_ALPHA,[wu]:s.ONE_MINUS_SRC_COLOR,[vs]:s.ONE_MINUS_SRC_ALPHA,[Pu]:s.ONE_MINUS_DST_COLOR,[Iu]:s.ONE_MINUS_DST_ALPHA,[Bu]:s.CONSTANT_COLOR,[Lu]:s.ONE_MINUS_CONSTANT_COLOR,[Uu]:s.CONSTANT_ALPHA,[Nu]:s.ONE_MINUS_CONSTANT_ALPHA};function R(k,_e,K,J,Me,xe,Xe,ut,It,at){if(k===Zn){A===!0&&(Ae(s.BLEND),A=!1);return}if(A===!1&&(se(s.BLEND),A=!0),k!==Ac){if(k!==m||at!==y){if((p!==ci||x!==ci)&&(s.blendEquation(s.FUNC_ADD),p=ci,x=ci),at)switch(k){case $n:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Go:s.blendFunc(s.ONE,s.ONE);break;case Wo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Xo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case $n:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Go:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Wo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Xo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}S=null,_=null,T=null,E=null,M.set(0,0,0),w=0,m=k,y=at}return}Me=Me||_e,xe=xe||K,Xe=Xe||J,(_e!==p||Me!==x)&&(s.blendEquationSeparate(Ie[_e],Ie[Me]),p=_e,x=Me),(K!==S||J!==_||xe!==T||Xe!==E)&&(s.blendFuncSeparate(Be[K],Be[J],Be[xe],Be[Xe]),S=K,_=J,T=xe,E=Xe),(ut.equals(M)===!1||It!==w)&&(s.blendColor(ut.r,ut.g,ut.b,It),M.copy(ut),w=It),m=k,y=!1}function ae(k,_e){k.side===nn?Ae(s.CULL_FACE):se(s.CULL_FACE);let K=k.side===Gt;_e&&(K=!K),oe(K),k.blending===$n&&k.transparent===!1?R(Zn):R(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const J=k.stencilWrite;o.setTest(J),J&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Le(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?se(s.SAMPLE_ALPHA_TO_COVERAGE):Ae(s.SAMPLE_ALPHA_TO_COVERAGE)}function oe(k){v!==k&&(k?s.frontFace(s.CW):s.frontFace(s.CCW),v=k)}function de(k){k!==Su?(se(s.CULL_FACE),k!==I&&(k===Vo?s.cullFace(s.BACK):k===xu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ae(s.CULL_FACE),I=k}function ce(k){k!==U&&(N&&s.lineWidth(k),U=k)}function Le(k,_e,K){k?(se(s.POLYGON_OFFSET_FILL),(F!==_e||B!==K)&&(s.polygonOffset(_e,K),F=_e,B=K)):Ae(s.POLYGON_OFFSET_FILL)}function re(k){k?se(s.SCISSOR_TEST):Ae(s.SCISSOR_TEST)}function D(k){k===void 0&&(k=s.TEXTURE0+z-1),X!==k&&(s.activeTexture(k),X=k)}function C(k,_e,K){K===void 0&&(X===null?K=s.TEXTURE0+z-1:K=X);let J=ee[K];J===void 0&&(J={type:void 0,texture:void 0},ee[K]=J),(J.type!==k||J.texture!==_e)&&(X!==K&&(s.activeTexture(K),X=K),s.bindTexture(k,_e||le[k]),J.type=k,J.texture=_e)}function O(){const k=ee[X];k!==void 0&&k.type!==void 0&&(s.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function $(){try{s.compressedTexImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ne(){try{s.compressedTexImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Z(){try{s.texSubImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Pe(){try{s.texSubImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ve(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Te(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function qe(){try{s.texStorage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ue(){try{s.texStorage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function L(){try{s.texImage2D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ie(){try{s.texImage3D.apply(s,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function we(k){ze.equals(k)===!1&&(s.scissor(k.x,k.y,k.z,k.w),ze.copy(k))}function me(k){W.equals(k)===!1&&(s.viewport(k.x,k.y,k.z,k.w),W.copy(k))}function ke(k,_e){let K=c.get(_e);K===void 0&&(K=new WeakMap,c.set(_e,K));let J=K.get(k);J===void 0&&(J=s.getUniformBlockIndex(_e,k.name),K.set(k,J))}function We(k,_e){const J=c.get(_e).get(k);l.get(_e)!==J&&(s.uniformBlockBinding(_e,J,k.__bindingPointIndex),l.set(_e,J))}function $e(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},X=null,ee={},d={},f=new WeakMap,h=[],g=null,A=!1,m=null,p=null,S=null,_=null,x=null,T=null,E=null,M=new nt(0,0,0),w=0,y=!1,v=null,I=null,U=null,F=null,B=null,ze.set(0,0,s.canvas.width,s.canvas.height),W.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:se,disable:Ae,bindFramebuffer:Ee,drawBuffers:be,useProgram:Ye,setBlending:R,setMaterial:ae,setFlipSided:oe,setCullFace:de,setLineWidth:ce,setPolygonOffset:Le,setScissorTest:re,activeTexture:D,bindTexture:C,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:ne,texImage2D:L,texImage3D:ie,updateUBOMapping:ke,uniformBlockBinding:We,texStorage2D:qe,texStorage3D:ue,texSubImage2D:Z,texSubImage3D:Pe,compressedTexSubImage2D:ve,compressedTexSubImage3D:Te,scissor:we,viewport:me,reset:$e}}function zl(s,e,t,n){const i=dg(n);switch(t){case Mc:return s*e;case Cc:return s*e;case Tc:return s*e*2;case bc:return s*e/i.components*i.byteLength;case _r:return s*e/i.components*i.byteLength;case wc:return s*e*2/i.components*i.byteLength;case uo:return s*e*2/i.components*i.byteLength;case Ec:return s*e*3/i.components*i.byteLength;case Nt:return s*e*4/i.components*i.byteLength;case Vi:return s*e*4/i.components*i.byteLength;case rr:case ar:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case or:case lr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ta:case wa:return Math.max(s,16)*Math.max(e,8)/4;case Ca:case ba:return Math.max(s,8)*Math.max(e,8)/2;case Ra:case Ia:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Da:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Pa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Fa:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Ba:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case La:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Ua:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Na:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Oa:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case za:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ha:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case ka:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Va:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ga:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Wa:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Xa:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case cr:case qa:case Qa:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Rc:case Ya:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Ka:case ja:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dg(s){switch(s){case vn:case vc:return{byteLength:1,components:1};case _s:case _c:case ts:return{byteLength:2,components:1};case lo:case co:return{byteLength:2,components:4};case sn:case oo:case fn:return{byteLength:4,components:1};case yc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function hg(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Fe,u=new WeakMap;let d;const f=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,C){return h?new OffscreenCanvas(D,C):fr("canvas")}function A(D,C,O){let $=1;const ne=re(D);if((ne.width>O||ne.height>O)&&($=O/Math.max(ne.width,ne.height)),$<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const Z=Math.floor($*ne.width),Pe=Math.floor($*ne.height);d===void 0&&(d=g(Z,Pe));const ve=C?g(Z,Pe):d;return ve.width=Z,ve.height=Pe,ve.getContext("2d").drawImage(D,0,0,Z,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Z+"x"+Pe+")."),ve}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),D;return D}function m(D){return D.generateMipmaps}function p(D){s.generateMipmap(D)}function S(D){return D.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?s.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function _(D,C,O,$,ne=!1){if(D!==null){if(s[D]!==void 0)return s[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let Z=C;if(C===s.RED&&(O===s.FLOAT&&(Z=s.R32F),O===s.HALF_FLOAT&&(Z=s.R16F),O===s.UNSIGNED_BYTE&&(Z=s.R8)),C===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.R8UI),O===s.UNSIGNED_SHORT&&(Z=s.R16UI),O===s.UNSIGNED_INT&&(Z=s.R32UI),O===s.BYTE&&(Z=s.R8I),O===s.SHORT&&(Z=s.R16I),O===s.INT&&(Z=s.R32I)),C===s.RG&&(O===s.FLOAT&&(Z=s.RG32F),O===s.HALF_FLOAT&&(Z=s.RG16F),O===s.UNSIGNED_BYTE&&(Z=s.RG8)),C===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RG8UI),O===s.UNSIGNED_SHORT&&(Z=s.RG16UI),O===s.UNSIGNED_INT&&(Z=s.RG32UI),O===s.BYTE&&(Z=s.RG8I),O===s.SHORT&&(Z=s.RG16I),O===s.INT&&(Z=s.RG32I)),C===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),O===s.UNSIGNED_INT&&(Z=s.RGB32UI),O===s.BYTE&&(Z=s.RGB8I),O===s.SHORT&&(Z=s.RGB16I),O===s.INT&&(Z=s.RGB32I)),C===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),O===s.UNSIGNED_INT&&(Z=s.RGBA32UI),O===s.BYTE&&(Z=s.RGBA8I),O===s.SHORT&&(Z=s.RGBA16I),O===s.INT&&(Z=s.RGBA32I)),C===s.RGB&&O===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),C===s.RGBA){const Pe=ne?yr:Je.getTransfer($);O===s.FLOAT&&(Z=s.RGBA32F),O===s.HALF_FLOAT&&(Z=s.RGBA16F),O===s.UNSIGNED_BYTE&&(Z=Pe===ct?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(D,C){let O;return D?C===null||C===sn||C===ji?O=s.DEPTH24_STENCIL8:C===fn?O=s.DEPTH32F_STENCIL8:C===_s&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===sn||C===ji?O=s.DEPTH_COMPONENT24:C===fn?O=s.DEPTH_COMPONENT32F:C===_s&&(O=s.DEPTH_COMPONENT16),O}function T(D,C){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==Yt&&D.minFilter!==gn?Math.log2(Math.max(C.width,C.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?C.mipmaps.length:1}function E(D){const C=D.target;C.removeEventListener("dispose",E),w(C),C.isVideoTexture&&u.delete(C)}function M(D){const C=D.target;C.removeEventListener("dispose",M),v(C)}function w(D){const C=n.get(D);if(C.__webglInit===void 0)return;const O=D.source,$=f.get(O);if($){const ne=$[C.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&y(D),Object.keys($).length===0&&f.delete(O)}n.remove(D)}function y(D){const C=n.get(D);s.deleteTexture(C.__webglTexture);const O=D.source,$=f.get(O);delete $[C.__cacheKey],a.memory.textures--}function v(D){const C=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(C.__webglFramebuffer[$]))for(let ne=0;ne<C.__webglFramebuffer[$].length;ne++)s.deleteFramebuffer(C.__webglFramebuffer[$][ne]);else s.deleteFramebuffer(C.__webglFramebuffer[$]);C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer[$])}else{if(Array.isArray(C.__webglFramebuffer))for(let $=0;$<C.__webglFramebuffer.length;$++)s.deleteFramebuffer(C.__webglFramebuffer[$]);else s.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&s.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let $=0;$<C.__webglColorRenderbuffer.length;$++)C.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(C.__webglColorRenderbuffer[$]);C.__webglDepthRenderbuffer&&s.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const O=D.textures;for(let $=0,ne=O.length;$<ne;$++){const Z=n.get(O[$]);Z.__webglTexture&&(s.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(O[$])}n.remove(D)}let I=0;function U(){I=0}function F(){const D=I;return D>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+i.maxTextures),I+=1,D}function B(D){const C=[];return C.push(D.wrapS),C.push(D.wrapT),C.push(D.wrapR||0),C.push(D.magFilter),C.push(D.minFilter),C.push(D.anisotropy),C.push(D.internalFormat),C.push(D.format),C.push(D.type),C.push(D.generateMipmaps),C.push(D.premultiplyAlpha),C.push(D.flipY),C.push(D.unpackAlignment),C.push(D.colorSpace),C.join()}function z(D,C){const O=n.get(D);if(D.isVideoTexture&&ce(D),D.isRenderTargetTexture===!1&&D.version>0&&O.__version!==D.version){const $=D.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(O,D,C);return}}t.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+C)}function N(D,C){const O=n.get(D);if(D.version>0&&O.__version!==D.version){W(O,D,C);return}t.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+C)}function q(D,C){const O=n.get(D);if(D.version>0&&O.__version!==D.version){W(O,D,C);return}t.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+C)}function H(D,C){const O=n.get(D);if(D.version>0&&O.__version!==D.version){te(O,D,C);return}t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+C)}const X={[Ma]:s.REPEAT,[fi]:s.CLAMP_TO_EDGE,[Ea]:s.MIRRORED_REPEAT},ee={[Yt]:s.NEAREST,[Qu]:s.NEAREST_MIPMAP_NEAREST,[Rs]:s.NEAREST_MIPMAP_LINEAR,[gn]:s.LINEAR,[wr]:s.LINEAR_MIPMAP_NEAREST,[pi]:s.LINEAR_MIPMAP_LINEAR},he={[$u]:s.NEVER,[sd]:s.ALWAYS,[Ju]:s.LESS,[Ic]:s.LEQUAL,[ed]:s.EQUAL,[id]:s.GEQUAL,[td]:s.GREATER,[nd]:s.NOTEQUAL};function Re(D,C){if(C.type===fn&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===gn||C.magFilter===wr||C.magFilter===Rs||C.magFilter===pi||C.minFilter===gn||C.minFilter===wr||C.minFilter===Rs||C.minFilter===pi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(D,s.TEXTURE_WRAP_S,X[C.wrapS]),s.texParameteri(D,s.TEXTURE_WRAP_T,X[C.wrapT]),(D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY)&&s.texParameteri(D,s.TEXTURE_WRAP_R,X[C.wrapR]),s.texParameteri(D,s.TEXTURE_MAG_FILTER,ee[C.magFilter]),s.texParameteri(D,s.TEXTURE_MIN_FILTER,ee[C.minFilter]),C.compareFunction&&(s.texParameteri(D,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(D,s.TEXTURE_COMPARE_FUNC,he[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Yt||C.minFilter!==Rs&&C.minFilter!==pi||C.type===fn&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");s.texParameterf(D,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,i.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function ze(D,C){let O=!1;D.__webglInit===void 0&&(D.__webglInit=!0,C.addEventListener("dispose",E));const $=C.source;let ne=f.get($);ne===void 0&&(ne={},f.set($,ne));const Z=B(C);if(Z!==D.__cacheKey){ne[Z]===void 0&&(ne[Z]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),ne[Z].usedTimes++;const Pe=ne[D.__cacheKey];Pe!==void 0&&(ne[D.__cacheKey].usedTimes--,Pe.usedTimes===0&&y(C)),D.__cacheKey=Z,D.__webglTexture=ne[Z].texture}return O}function W(D,C,O){let $=s.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),C.isData3DTexture&&($=s.TEXTURE_3D);const ne=ze(D,C),Z=C.source;t.bindTexture($,D.__webglTexture,s.TEXTURE0+O);const Pe=n.get(Z);if(Z.version!==Pe.__version||ne===!0){t.activeTexture(s.TEXTURE0+O);const ve=Je.getPrimaries(Je.workingColorSpace),Te=C.colorSpace===jn?null:Je.getPrimaries(C.colorSpace),qe=C.colorSpace===jn||ve===Te?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let ue=A(C.image,!1,i.maxTextureSize);ue=Le(C,ue);const L=r.convert(C.format,C.colorSpace),ie=r.convert(C.type);let we=_(C.internalFormat,L,ie,C.colorSpace,C.isVideoTexture);Re($,C);let me;const ke=C.mipmaps,We=C.isVideoTexture!==!0,$e=Pe.__version===void 0||ne===!0,k=Z.dataReady,_e=T(C,ue);if(C.isDepthTexture)we=x(C.format===Zi,C.type),$e&&(We?t.texStorage2D(s.TEXTURE_2D,1,we,ue.width,ue.height):t.texImage2D(s.TEXTURE_2D,0,we,ue.width,ue.height,0,L,ie,null));else if(C.isDataTexture)if(ke.length>0){We&&$e&&t.texStorage2D(s.TEXTURE_2D,_e,we,ke[0].width,ke[0].height);for(let K=0,J=ke.length;K<J;K++)me=ke[K],We?k&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,me.width,me.height,L,ie,me.data):t.texImage2D(s.TEXTURE_2D,K,we,me.width,me.height,0,L,ie,me.data);C.generateMipmaps=!1}else We?($e&&t.texStorage2D(s.TEXTURE_2D,_e,we,ue.width,ue.height),k&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ue.width,ue.height,L,ie,ue.data)):t.texImage2D(s.TEXTURE_2D,0,we,ue.width,ue.height,0,L,ie,ue.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){We&&$e&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,we,ke[0].width,ke[0].height,ue.depth);for(let K=0,J=ke.length;K<J;K++)if(me=ke[K],C.format!==Nt)if(L!==null)if(We){if(k)if(C.layerUpdates.size>0){const Me=zl(me.width,me.height,C.format,C.type);for(const xe of C.layerUpdates){const Xe=me.data.subarray(xe*Me/me.data.BYTES_PER_ELEMENT,(xe+1)*Me/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,xe,me.width,me.height,1,L,Xe)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,me.width,me.height,ue.depth,L,me.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,K,we,me.width,me.height,ue.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?k&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,me.width,me.height,ue.depth,L,ie,me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,K,we,me.width,me.height,ue.depth,0,L,ie,me.data)}else{We&&$e&&t.texStorage2D(s.TEXTURE_2D,_e,we,ke[0].width,ke[0].height);for(let K=0,J=ke.length;K<J;K++)me=ke[K],C.format!==Nt?L!==null?We?k&&t.compressedTexSubImage2D(s.TEXTURE_2D,K,0,0,me.width,me.height,L,me.data):t.compressedTexImage2D(s.TEXTURE_2D,K,we,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?k&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,me.width,me.height,L,ie,me.data):t.texImage2D(s.TEXTURE_2D,K,we,me.width,me.height,0,L,ie,me.data)}else if(C.isDataArrayTexture)if(We){if($e&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,we,ue.width,ue.height,ue.depth),k)if(C.layerUpdates.size>0){const K=zl(ue.width,ue.height,C.format,C.type);for(const J of C.layerUpdates){const Me=ue.data.subarray(J*K/ue.data.BYTES_PER_ELEMENT,(J+1)*K/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,J,ue.width,ue.height,1,L,ie,Me)}C.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,L,ie,ue.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,we,ue.width,ue.height,ue.depth,0,L,ie,ue.data);else if(C.isData3DTexture)We?($e&&t.texStorage3D(s.TEXTURE_3D,_e,we,ue.width,ue.height,ue.depth),k&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,L,ie,ue.data)):t.texImage3D(s.TEXTURE_3D,0,we,ue.width,ue.height,ue.depth,0,L,ie,ue.data);else if(C.isFramebufferTexture){if($e)if(We)t.texStorage2D(s.TEXTURE_2D,_e,we,ue.width,ue.height);else{let K=ue.width,J=ue.height;for(let Me=0;Me<_e;Me++)t.texImage2D(s.TEXTURE_2D,Me,we,K,J,0,L,ie,null),K>>=1,J>>=1}}else if(ke.length>0){if(We&&$e){const K=re(ke[0]);t.texStorage2D(s.TEXTURE_2D,_e,we,K.width,K.height)}for(let K=0,J=ke.length;K<J;K++)me=ke[K],We?k&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,L,ie,me):t.texImage2D(s.TEXTURE_2D,K,we,L,ie,me);C.generateMipmaps=!1}else if(We){if($e){const K=re(ue);t.texStorage2D(s.TEXTURE_2D,_e,we,K.width,K.height)}k&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,L,ie,ue)}else t.texImage2D(s.TEXTURE_2D,0,we,L,ie,ue);m(C)&&p($),Pe.__version=Z.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function te(D,C,O){if(C.image.length!==6)return;const $=ze(D,C),ne=C.source;t.bindTexture(s.TEXTURE_CUBE_MAP,D.__webglTexture,s.TEXTURE0+O);const Z=n.get(ne);if(ne.version!==Z.__version||$===!0){t.activeTexture(s.TEXTURE0+O);const Pe=Je.getPrimaries(Je.workingColorSpace),ve=C.colorSpace===jn?null:Je.getPrimaries(C.colorSpace),Te=C.colorSpace===jn||Pe===ve?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);const qe=C.isCompressedTexture||C.image[0].isCompressedTexture,ue=C.image[0]&&C.image[0].isDataTexture,L=[];for(let J=0;J<6;J++)!qe&&!ue?L[J]=A(C.image[J],!0,i.maxCubemapSize):L[J]=ue?C.image[J].image:C.image[J],L[J]=Le(C,L[J]);const ie=L[0],we=r.convert(C.format,C.colorSpace),me=r.convert(C.type),ke=_(C.internalFormat,we,me,C.colorSpace),We=C.isVideoTexture!==!0,$e=Z.__version===void 0||$===!0,k=ne.dataReady;let _e=T(C,ie);Re(s.TEXTURE_CUBE_MAP,C);let K;if(qe){We&&$e&&t.texStorage2D(s.TEXTURE_CUBE_MAP,_e,ke,ie.width,ie.height);for(let J=0;J<6;J++){K=L[J].mipmaps;for(let Me=0;Me<K.length;Me++){const xe=K[Me];C.format!==Nt?we!==null?We?k&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me,0,0,xe.width,xe.height,we,xe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me,ke,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me,0,0,xe.width,xe.height,we,me,xe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me,ke,xe.width,xe.height,0,we,me,xe.data)}}}else{if(K=C.mipmaps,We&&$e){K.length>0&&_e++;const J=re(L[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,_e,ke,J.width,J.height)}for(let J=0;J<6;J++)if(ue){We?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,L[J].width,L[J].height,we,me,L[J].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,ke,L[J].width,L[J].height,0,we,me,L[J].data);for(let Me=0;Me<K.length;Me++){const Xe=K[Me].image[J].image;We?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me+1,0,0,Xe.width,Xe.height,we,me,Xe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me+1,ke,Xe.width,Xe.height,0,we,me,Xe.data)}}else{We?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,we,me,L[J]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,ke,we,me,L[J]);for(let Me=0;Me<K.length;Me++){const xe=K[Me];We?k&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me+1,0,0,we,me,xe.image[J]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,Me+1,ke,we,me,xe.image[J])}}}m(C)&&p(s.TEXTURE_CUBE_MAP),Z.__version=ne.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function le(D,C,O,$,ne,Z){const Pe=r.convert(O.format,O.colorSpace),ve=r.convert(O.type),Te=_(O.internalFormat,Pe,ve,O.colorSpace),qe=n.get(C),ue=n.get(O);if(ue.__renderTarget=C,!qe.__hasExternalTextures){const L=Math.max(1,C.width>>Z),ie=Math.max(1,C.height>>Z);ne===s.TEXTURE_3D||ne===s.TEXTURE_2D_ARRAY?t.texImage3D(ne,Z,Te,L,ie,C.depth,0,Pe,ve,null):t.texImage2D(ne,Z,Te,L,ie,0,Pe,ve,null)}t.bindFramebuffer(s.FRAMEBUFFER,D),de(C)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,ne,ue.__webglTexture,0,oe(C)):(ne===s.TEXTURE_2D||ne>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,ne,ue.__webglTexture,Z),t.bindFramebuffer(s.FRAMEBUFFER,null)}function se(D,C,O){if(s.bindRenderbuffer(s.RENDERBUFFER,D),C.depthBuffer){const $=C.depthTexture,ne=$&&$.isDepthTexture?$.type:null,Z=x(C.stencilBuffer,ne),Pe=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=oe(C);de(C)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ve,Z,C.width,C.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ve,Z,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,Z,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Pe,s.RENDERBUFFER,D)}else{const $=C.textures;for(let ne=0;ne<$.length;ne++){const Z=$[ne],Pe=r.convert(Z.format,Z.colorSpace),ve=r.convert(Z.type),Te=_(Z.internalFormat,Pe,ve,Z.colorSpace),qe=oe(C);O&&de(C)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,qe,Te,C.width,C.height):de(C)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,qe,Te,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,Te,C.width,C.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ae(D,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,D),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(C.depthTexture);$.__renderTarget=C,(!$.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),z(C.depthTexture,0);const ne=$.__webglTexture,Z=oe(C);if(C.depthTexture.format===gi)de(C)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ne,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ne,0);else if(C.depthTexture.format===Zi)de(C)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ne,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function Ee(D){const C=n.get(D),O=D.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==D.depthTexture){const $=D.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),$){const ne=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,$.removeEventListener("dispose",ne)};$.addEventListener("dispose",ne),C.__depthDisposeCallback=ne}C.__boundDepthTexture=$}if(D.depthTexture&&!C.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Ae(C.__webglFramebuffer,D)}else if(O){C.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer[$]),C.__webglDepthbuffer[$]===void 0)C.__webglDepthbuffer[$]=s.createRenderbuffer(),se(C.__webglDepthbuffer[$],D,!1);else{const ne=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Z=C.__webglDepthbuffer[$];s.bindRenderbuffer(s.RENDERBUFFER,Z),s.framebufferRenderbuffer(s.FRAMEBUFFER,ne,s.RENDERBUFFER,Z)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=s.createRenderbuffer(),se(C.__webglDepthbuffer,D,!1);else{const $=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ne=C.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ne),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,ne)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function be(D,C,O){const $=n.get(D);C!==void 0&&le($.__webglFramebuffer,D,D.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Ee(D)}function Ye(D){const C=D.texture,O=n.get(D),$=n.get(C);D.addEventListener("dispose",M);const ne=D.textures,Z=D.isWebGLCubeRenderTarget===!0,Pe=ne.length>1;if(Pe||($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=C.version,a.memory.textures++),Z){O.__webglFramebuffer=[];for(let ve=0;ve<6;ve++)if(C.mipmaps&&C.mipmaps.length>0){O.__webglFramebuffer[ve]=[];for(let Te=0;Te<C.mipmaps.length;Te++)O.__webglFramebuffer[ve][Te]=s.createFramebuffer()}else O.__webglFramebuffer[ve]=s.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){O.__webglFramebuffer=[];for(let ve=0;ve<C.mipmaps.length;ve++)O.__webglFramebuffer[ve]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(Pe)for(let ve=0,Te=ne.length;ve<Te;ve++){const qe=n.get(ne[ve]);qe.__webglTexture===void 0&&(qe.__webglTexture=s.createTexture(),a.memory.textures++)}if(D.samples>0&&de(D)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ve=0;ve<ne.length;ve++){const Te=ne[ve];O.__webglColorRenderbuffer[ve]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[ve]);const qe=r.convert(Te.format,Te.colorSpace),ue=r.convert(Te.type),L=_(Te.internalFormat,qe,ue,Te.colorSpace,D.isXRRenderTarget===!0),ie=oe(D);s.renderbufferStorageMultisample(s.RENDERBUFFER,ie,L,D.width,D.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,O.__webglColorRenderbuffer[ve])}s.bindRenderbuffer(s.RENDERBUFFER,null),D.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),se(O.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Z){t.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),Re(s.TEXTURE_CUBE_MAP,C);for(let ve=0;ve<6;ve++)if(C.mipmaps&&C.mipmaps.length>0)for(let Te=0;Te<C.mipmaps.length;Te++)le(O.__webglFramebuffer[ve][Te],D,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Te);else le(O.__webglFramebuffer[ve],D,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0);m(C)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let ve=0,Te=ne.length;ve<Te;ve++){const qe=ne[ve],ue=n.get(qe);t.bindTexture(s.TEXTURE_2D,ue.__webglTexture),Re(s.TEXTURE_2D,qe),le(O.__webglFramebuffer,D,qe,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,0),m(qe)&&p(s.TEXTURE_2D)}t.unbindTexture()}else{let ve=s.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ve=D.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ve,$.__webglTexture),Re(ve,C),C.mipmaps&&C.mipmaps.length>0)for(let Te=0;Te<C.mipmaps.length;Te++)le(O.__webglFramebuffer[Te],D,C,s.COLOR_ATTACHMENT0,ve,Te);else le(O.__webglFramebuffer,D,C,s.COLOR_ATTACHMENT0,ve,0);m(C)&&p(ve),t.unbindTexture()}D.depthBuffer&&Ee(D)}function Ie(D){const C=D.textures;for(let O=0,$=C.length;O<$;O++){const ne=C[O];if(m(ne)){const Z=S(D),Pe=n.get(ne).__webglTexture;t.bindTexture(Z,Pe),p(Z),t.unbindTexture()}}}const Be=[],R=[];function ae(D){if(D.samples>0){if(de(D)===!1){const C=D.textures,O=D.width,$=D.height;let ne=s.COLOR_BUFFER_BIT;const Z=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Pe=n.get(D),ve=C.length>1;if(ve)for(let Te=0;Te<C.length;Te++)t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Te=0;Te<C.length;Te++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ne|=s.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ne|=s.STENCIL_BUFFER_BIT)),ve){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Pe.__webglColorRenderbuffer[Te]);const qe=n.get(C[Te]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,qe,0)}s.blitFramebuffer(0,0,O,$,0,0,O,$,ne,s.NEAREST),l===!0&&(Be.length=0,R.length=0,Be.push(s.COLOR_ATTACHMENT0+Te),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Be.push(Z),R.push(Z),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,R)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Be))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ve)for(let Te=0;Te<C.length;Te++){t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.RENDERBUFFER,Pe.__webglColorRenderbuffer[Te]);const qe=n.get(C[Te]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Pe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Te,s.TEXTURE_2D,qe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const C=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[C])}}}function oe(D){return Math.min(i.maxSamples,D.samples)}function de(D){const C=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function ce(D){const C=a.render.frame;u.get(D)!==C&&(u.set(D,C),D.update())}function Le(D,C){const O=D.colorSpace,$=D.format,ne=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||O!==ns&&O!==jn&&(Je.getTransfer(O)===ct?($!==Nt||ne!==vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),C}function re(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=U,this.setTexture2D=z,this.setTexture2DArray=N,this.setTexture3D=q,this.setTextureCube=H,this.rebindTextures=be,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=Ie,this.updateMultisampleRenderTarget=ae,this.setupDepthRenderbuffer=Ee,this.setupFrameBufferTexture=le,this.useMultisampledRTT=de}function Kc(s,e){function t(n,i=jn){let r;const a=Je.getTransfer(i);if(n===vn)return s.UNSIGNED_BYTE;if(n===lo)return s.UNSIGNED_SHORT_4_4_4_4;if(n===co)return s.UNSIGNED_SHORT_5_5_5_1;if(n===yc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===vc)return s.BYTE;if(n===_c)return s.SHORT;if(n===_s)return s.UNSIGNED_SHORT;if(n===oo)return s.INT;if(n===sn)return s.UNSIGNED_INT;if(n===fn)return s.FLOAT;if(n===ts)return s.HALF_FLOAT;if(n===Mc)return s.ALPHA;if(n===Ec)return s.RGB;if(n===Nt)return s.RGBA;if(n===Cc)return s.LUMINANCE;if(n===Tc)return s.LUMINANCE_ALPHA;if(n===gi)return s.DEPTH_COMPONENT;if(n===Zi)return s.DEPTH_STENCIL;if(n===bc)return s.RED;if(n===_r)return s.RED_INTEGER;if(n===wc)return s.RG;if(n===uo)return s.RG_INTEGER;if(n===Vi)return s.RGBA_INTEGER;if(n===rr||n===ar||n===or||n===lr)if(a===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===rr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===rr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===or)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===lr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ca||n===Ta||n===ba||n===wa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ca)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ta)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ba)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===wa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ra||n===Ia||n===Da)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ra||n===Ia)return a===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Da)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Pa||n===Fa||n===Ba||n===La||n===Ua||n===Na||n===Oa||n===za||n===Ha||n===ka||n===Va||n===Ga||n===Wa||n===Xa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Pa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ba)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===La)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ua)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Na)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===za)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ha)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ka)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Va)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ga)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cr||n===qa||n===Qa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===cr)return a===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===qa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Qa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Rc||n===Ya||n===Ka||n===ja)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===cr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ya)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ka)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ja)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ji?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class fg extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class js extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pg={type:"move"};class na{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new js,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new js,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new js,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const A of e.hand.values()){const m=t.getJointPose(A,n),p=this._getHandJoint(c,A);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,g=.005;c.inputState.pinching&&f>h+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=h-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pg)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new js;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const mg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ag{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Ot,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new jt({vertexShader:mg,fragmentShader:gg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new vt(new Ji(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Sg extends Si{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,f=null,h=null,g=null;const A=new Ag,m=t.getContextAttributes();let p=null,S=null;const _=[],x=[],T=new Fe;let E=null;const M=new tn;M.viewport=new At;const w=new tn;w.viewport=new At;const y=[M,w],v=new fg;let I=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let te=_[W];return te===void 0&&(te=new na,_[W]=te),te.getTargetRaySpace()},this.getControllerGrip=function(W){let te=_[W];return te===void 0&&(te=new na,_[W]=te),te.getGripSpace()},this.getHand=function(W){let te=_[W];return te===void 0&&(te=new na,_[W]=te),te.getHandSpace()};function F(W){const te=x.indexOf(W.inputSource);if(te===-1)return;const le=_[te];le!==void 0&&(le.update(W.inputSource,W.frame,c||a),le.dispatchEvent({type:W.type,data:W.inputSource}))}function B(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",z);for(let W=0;W<_.length;W++){const te=x[W];te!==null&&(x[W]=null,_[W].disconnect(te))}I=null,U=null,A.reset(),e.setRenderTarget(p),h=null,f=null,d=null,i=null,S=null,ze.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(W){if(i=W,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",B),i.addEventListener("inputsourceschange",z),m.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),i.renderState.layers===void 0){const te={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};h=new XRWebGLLayer(i,t,te),i.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),S=new ei(h.framebufferWidth,h.framebufferHeight,{format:Nt,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let te=null,le=null,se=null;m.depth&&(se=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=m.stencil?Zi:gi,le=m.stencil?ji:sn);const Ae={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:r};d=new XRWebGLBinding(i,t),f=d.createProjectionLayer(Ae),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new ei(f.textureWidth,f.textureHeight,{format:Nt,type:vn,depthTexture:new mo(f.textureWidth,f.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),ze.setContext(i),ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return A.getDepthTexture()};function z(W){for(let te=0;te<W.removed.length;te++){const le=W.removed[te],se=x.indexOf(le);se>=0&&(x[se]=null,_[se].disconnect(le))}for(let te=0;te<W.added.length;te++){const le=W.added[te];let se=x.indexOf(le);if(se===-1){for(let Ee=0;Ee<_.length;Ee++)if(Ee>=x.length){x.push(le),se=Ee;break}else if(x[Ee]===null){x[Ee]=le,se=Ee;break}if(se===-1)break}const Ae=_[se];Ae&&Ae.connect(le)}}const N=new P,q=new P;function H(W,te,le){N.setFromMatrixPosition(te.matrixWorld),q.setFromMatrixPosition(le.matrixWorld);const se=N.distanceTo(q),Ae=te.projectionMatrix.elements,Ee=le.projectionMatrix.elements,be=Ae[14]/(Ae[10]-1),Ye=Ae[14]/(Ae[10]+1),Ie=(Ae[9]+1)/Ae[5],Be=(Ae[9]-1)/Ae[5],R=(Ae[8]-1)/Ae[0],ae=(Ee[8]+1)/Ee[0],oe=be*R,de=be*ae,ce=se/(-R+ae),Le=ce*-R;if(te.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Le),W.translateZ(ce),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),Ae[10]===-1)W.projectionMatrix.copy(te.projectionMatrix),W.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const re=be+ce,D=Ye+ce,C=oe-Le,O=de+(se-Le),$=Ie*Ye/D*re,ne=Be*Ye/D*re;W.projectionMatrix.makePerspective(C,O,$,ne,re,D),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function X(W,te){te===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(te.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(i===null)return;let te=W.near,le=W.far;A.texture!==null&&(A.depthNear>0&&(te=A.depthNear),A.depthFar>0&&(le=A.depthFar)),v.near=w.near=M.near=te,v.far=w.far=M.far=le,(I!==v.near||U!==v.far)&&(i.updateRenderState({depthNear:v.near,depthFar:v.far}),I=v.near,U=v.far),M.layers.mask=W.layers.mask|2,w.layers.mask=W.layers.mask|4,v.layers.mask=M.layers.mask|w.layers.mask;const se=W.parent,Ae=v.cameras;X(v,se);for(let Ee=0;Ee<Ae.length;Ee++)X(Ae[Ee],se);Ae.length===2?H(v,M,w):v.projectionMatrix.copy(M.projectionMatrix),ee(W,v,se)};function ee(W,te,le){le===null?W.matrix.copy(te.matrixWorld):(W.matrix.copy(le.matrixWorld),W.matrix.invert(),W.matrix.multiply(te.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(te.projectionMatrix),W.projectionMatrixInverse.copy(te.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Za*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(f===null&&h===null))return l},this.setFoveation=function(W){l=W,f!==null&&(f.fixedFoveation=W),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=W)},this.hasDepthSensing=function(){return A.texture!==null},this.getDepthSensingMesh=function(){return A.getMesh(v)};let he=null;function Re(W,te){if(u=te.getViewerPose(c||a),g=te,u!==null){const le=u.views;h!==null&&(e.setRenderTargetFramebuffer(S,h.framebuffer),e.setRenderTarget(S));let se=!1;le.length!==v.cameras.length&&(v.cameras.length=0,se=!0);for(let Ee=0;Ee<le.length;Ee++){const be=le[Ee];let Ye=null;if(h!==null)Ye=h.getViewport(be);else{const Be=d.getViewSubImage(f,be);Ye=Be.viewport,Ee===0&&(e.setRenderTargetTextures(S,Be.colorTexture,f.ignoreDepthValues?void 0:Be.depthStencilTexture),e.setRenderTarget(S))}let Ie=y[Ee];Ie===void 0&&(Ie=new tn,Ie.layers.enable(Ee),Ie.viewport=new At,y[Ee]=Ie),Ie.matrix.fromArray(be.transform.matrix),Ie.matrix.decompose(Ie.position,Ie.quaternion,Ie.scale),Ie.projectionMatrix.fromArray(be.projectionMatrix),Ie.projectionMatrixInverse.copy(Ie.projectionMatrix).invert(),Ie.viewport.set(Ye.x,Ye.y,Ye.width,Ye.height),Ee===0&&(v.matrix.copy(Ie.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),se===!0&&v.cameras.push(Ie)}const Ae=i.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Ee=d.getDepthInformation(le[0]);Ee&&Ee.isValid&&Ee.texture&&A.init(e,Ee,i.renderState)}}for(let le=0;le<_.length;le++){const se=x[le],Ae=_[le];se!==null&&Ae!==void 0&&Ae.update(se,te,c||a)}he&&he(W,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),g=null}const ze=new Wc;ze.setAnimationLoop(Re),this.setAnimationLoop=function(W){he=W},this.dispose=function(){}}}const oi=new Nn,xg=new Ge;function vg(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Hc(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,S,_,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&h(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),A(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,S,_):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Gt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Gt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),_=S.envMap,x=S.envMapRotation;_&&(m.envMap.value=_,oi.copy(x),oi.x*=-1,oi.y*=-1,oi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),m.envMapRotation.value.setFromMatrix4(xg.makeRotationFromEuler(oi)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=_*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Gt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function A(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function _g(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,_){const x=_.program;n.uniformBlockBinding(S,x)}function c(S,_){let x=i[S.id];x===void 0&&(g(S),x=u(S),i[S.id]=x,S.addEventListener("dispose",m));const T=_.program;n.updateUBOMapping(S,T);const E=e.render.frame;r[S.id]!==E&&(f(S),r[S.id]=E)}function u(S){const _=d();S.__bindingPointIndex=_;const x=s.createBuffer(),T=S.__size,E=S.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,T,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,x),x}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const _=i[S.id],x=S.uniforms,T=S.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let E=0,M=x.length;E<M;E++){const w=Array.isArray(x[E])?x[E]:[x[E]];for(let y=0,v=w.length;y<v;y++){const I=w[y];if(h(I,E,y,T)===!0){const U=I.__offset,F=Array.isArray(I.value)?I.value:[I.value];let B=0;for(let z=0;z<F.length;z++){const N=F[z],q=A(N);typeof N=="number"||typeof N=="boolean"?(I.__data[0]=N,s.bufferSubData(s.UNIFORM_BUFFER,U+B,I.__data)):N.isMatrix3?(I.__data[0]=N.elements[0],I.__data[1]=N.elements[1],I.__data[2]=N.elements[2],I.__data[3]=0,I.__data[4]=N.elements[3],I.__data[5]=N.elements[4],I.__data[6]=N.elements[5],I.__data[7]=0,I.__data[8]=N.elements[6],I.__data[9]=N.elements[7],I.__data[10]=N.elements[8],I.__data[11]=0):(N.toArray(I.__data,B),B+=q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,U,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function h(S,_,x,T){const E=S.value,M=_+"_"+x;if(T[M]===void 0)return typeof E=="number"||typeof E=="boolean"?T[M]=E:T[M]=E.clone(),!0;{const w=T[M];if(typeof E=="number"||typeof E=="boolean"){if(w!==E)return T[M]=E,!0}else if(w.equals(E)===!1)return w.copy(E),!0}return!1}function g(S){const _=S.uniforms;let x=0;const T=16;for(let M=0,w=_.length;M<w;M++){const y=Array.isArray(_[M])?_[M]:[_[M]];for(let v=0,I=y.length;v<I;v++){const U=y[v],F=Array.isArray(U.value)?U.value:[U.value];for(let B=0,z=F.length;B<z;B++){const N=F[B],q=A(N),H=x%T,X=H%q.boundary,ee=H+X;x+=X,ee!==0&&T-ee<q.storage&&(x+=T-ee),U.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=x,x+=q.storage}}}const E=x%T;return E>0&&(x+=T-E),S.__size=x,S.__cache={},this}function A(S){const _={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(_.boundary=4,_.storage=4):S.isVector2?(_.boundary=8,_.storage=8):S.isVector3||S.isColor?(_.boundary=16,_.storage=12):S.isVector4?(_.boundary=16,_.storage=16):S.isMatrix3?(_.boundary=48,_.storage=48):S.isMatrix4?(_.boundary=64,_.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),_}function m(S){const _=S.target;_.removeEventListener("dispose",m);const x=a.indexOf(_.__bindingPointIndex);a.splice(x,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function p(){for(const S in i)s.deleteBuffer(i[S]);a=[],i={},r={}}return{bind:l,update:c,dispose:p}}class yg{constructor(e={}){const{canvas:t=od(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=a;const g=new Uint32Array(4),A=new Int32Array(4);let m=null,p=null;const S=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=en,this.toneMapping=Jn,this.toneMappingExposure=1;const x=this;let T=!1,E=0,M=0,w=null,y=-1,v=null;const I=new At,U=new At;let F=null;const B=new nt(0);let z=0,N=t.width,q=t.height,H=1,X=null,ee=null;const he=new At(0,0,N,q),Re=new At(0,0,N,q);let ze=!1;const W=new Gc;let te=!1,le=!1;const se=new Ge,Ae=new Ge,Ee=new P,be=new At,Ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ie=!1;function Be(){return w===null?H:1}let R=n;function ae(b,V){return t.getContext(b,V)}try{const b={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ao}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",Me,!1),t.addEventListener("webglcontextcreationerror",xe,!1),R===null){const V="webgl2";if(R=ae(V,b),R===null)throw ae(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let oe,de,ce,Le,re,D,C,O,$,ne,Z,Pe,ve,Te,qe,ue,L,ie,we,me,ke,We,$e,k;function _e(){oe=new wp(R),oe.init(),We=new Kc(R,oe),de=new yp(R,oe,e,We),ce=new ug(R,oe),de.reverseDepthBuffer&&f&&ce.buffers.depth.setReversed(!0),Le=new Dp(R),re=new Km,D=new hg(R,oe,ce,re,de,We,Le),C=new Ep(x),O=new bp(x),$=new Nd(R),$e=new vp(R,$),ne=new Rp(R,$,Le,$e),Z=new Fp(R,ne,$,Le),we=new Pp(R,de,D),ue=new Mp(re),Pe=new Ym(x,C,O,oe,de,$e,ue),ve=new vg(x,re),Te=new Zm,qe=new ig(oe),ie=new xp(x,C,O,ce,Z,h,l),L=new lg(x,Z,de),k=new _g(R,Le,de,ce),me=new _p(R,oe,Le),ke=new Ip(R,oe,Le),Le.programs=Pe.programs,x.capabilities=de,x.extensions=oe,x.properties=re,x.renderLists=Te,x.shadowMap=L,x.state=ce,x.info=Le}_e();const K=new Sg(x,R);this.xr=K,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const b=oe.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=oe.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(b){b!==void 0&&(H=b,this.setSize(N,q,!1))},this.getSize=function(b){return b.set(N,q)},this.setSize=function(b,V,Q=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=b,q=V,t.width=Math.floor(b*H),t.height=Math.floor(V*H),Q===!0&&(t.style.width=b+"px",t.style.height=V+"px"),this.setViewport(0,0,b,V)},this.getDrawingBufferSize=function(b){return b.set(N*H,q*H).floor()},this.setDrawingBufferSize=function(b,V,Q){N=b,q=V,H=Q,t.width=Math.floor(b*Q),t.height=Math.floor(V*Q),this.setViewport(0,0,b,V)},this.getCurrentViewport=function(b){return b.copy(I)},this.getViewport=function(b){return b.copy(he)},this.setViewport=function(b,V,Q,Y){b.isVector4?he.set(b.x,b.y,b.z,b.w):he.set(b,V,Q,Y),ce.viewport(I.copy(he).multiplyScalar(H).round())},this.getScissor=function(b){return b.copy(Re)},this.setScissor=function(b,V,Q,Y){b.isVector4?Re.set(b.x,b.y,b.z,b.w):Re.set(b,V,Q,Y),ce.scissor(U.copy(Re).multiplyScalar(H).round())},this.getScissorTest=function(){return ze},this.setScissorTest=function(b){ce.setScissorTest(ze=b)},this.setOpaqueSort=function(b){X=b},this.setTransparentSort=function(b){ee=b},this.getClearColor=function(b){return b.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor.apply(ie,arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha.apply(ie,arguments)},this.clear=function(b=!0,V=!0,Q=!0){let Y=0;if(b){let G=!1;if(w!==null){const pe=w.texture.format;G=pe===Vi||pe===uo||pe===_r}if(G){const pe=w.texture.type,Ce=pe===vn||pe===sn||pe===_s||pe===ji||pe===lo||pe===co,Ue=ie.getClearColor(),Ne=ie.getClearAlpha(),Qe=Ue.r,Ke=Ue.g,Oe=Ue.b;Ce?(g[0]=Qe,g[1]=Ke,g[2]=Oe,g[3]=Ne,R.clearBufferuiv(R.COLOR,0,g)):(A[0]=Qe,A[1]=Ke,A[2]=Oe,A[3]=Ne,R.clearBufferiv(R.COLOR,0,A))}else Y|=R.COLOR_BUFFER_BIT}V&&(Y|=R.DEPTH_BUFFER_BIT),Q&&(Y|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",Me,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),Te.dispose(),qe.dispose(),re.dispose(),C.dispose(),O.dispose(),Z.dispose(),$e.dispose(),k.dispose(),Pe.dispose(),K.dispose(),K.removeEventListener("sessionstart",Po),K.removeEventListener("sessionend",Fo),ti.stop()};function J(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Me(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const b=Le.autoReset,V=L.enabled,Q=L.autoUpdate,Y=L.needsUpdate,G=L.type;_e(),Le.autoReset=b,L.enabled=V,L.autoUpdate=Q,L.needsUpdate=Y,L.type=G}function xe(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Xe(b){const V=b.target;V.removeEventListener("dispose",Xe),ut(V)}function ut(b){It(b),re.remove(b)}function It(b){const V=re.get(b).programs;V!==void 0&&(V.forEach(function(Q){Pe.releaseProgram(Q)}),b.isShaderMaterial&&Pe.releaseShaderCache(b))}this.renderBufferDirect=function(b,V,Q,Y,G,pe){V===null&&(V=Ye);const Ce=G.isMesh&&G.matrixWorld.determinant()<0,Ue=au(b,V,Q,Y,G);ce.setMaterial(Y,Ce);let Ne=Q.index,Qe=1;if(Y.wireframe===!0){if(Ne=ne.getWireframeAttribute(Q),Ne===void 0)return;Qe=2}const Ke=Q.drawRange,Oe=Q.attributes.position;let et=Ke.start*Qe,dt=(Ke.start+Ke.count)*Qe;pe!==null&&(et=Math.max(et,pe.start*Qe),dt=Math.min(dt,(pe.start+pe.count)*Qe)),Ne!==null?(et=Math.max(et,0),dt=Math.min(dt,Ne.count)):Oe!=null&&(et=Math.max(et,0),dt=Math.min(dt,Oe.count));const ht=dt-et;if(ht<0||ht===1/0)return;$e.setup(G,Y,Ue,Q,Ne);let zt,it=me;if(Ne!==null&&(zt=$.get(Ne),it=ke,it.setIndex(zt)),G.isMesh)Y.wireframe===!0?(ce.setLineWidth(Y.wireframeLinewidth*Be()),it.setMode(R.LINES)):it.setMode(R.TRIANGLES);else if(G.isLine){let He=Y.linewidth;He===void 0&&(He=1),ce.setLineWidth(He*Be()),G.isLineSegments?it.setMode(R.LINES):G.isLineLoop?it.setMode(R.LINE_LOOP):it.setMode(R.LINE_STRIP)}else G.isPoints?it.setMode(R.POINTS):G.isSprite&&it.setMode(R.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)it.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(oe.get("WEBGL_multi_draw"))it.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const He=G._multiDrawStarts,yn=G._multiDrawCounts,st=G._multiDrawCount,ln=Ne?$.get(Ne).bytesPerElement:1,xi=re.get(Y).currentProgram.getUniforms();for(let Wt=0;Wt<st;Wt++)xi.setValue(R,"_gl_DrawID",Wt),it.render(He[Wt]/ln,yn[Wt])}else if(G.isInstancedMesh)it.renderInstances(et,ht,G.count);else if(Q.isInstancedBufferGeometry){const He=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,yn=Math.min(Q.instanceCount,He);it.renderInstances(et,ht,yn)}else it.render(et,ht)};function at(b,V,Q){b.transparent===!0&&b.side===nn&&b.forceSinglePass===!1?(b.side=Gt,b.needsUpdate=!0,ws(b,V,Q),b.side=xn,b.needsUpdate=!0,ws(b,V,Q),b.side=nn):ws(b,V,Q)}this.compile=function(b,V,Q=null){Q===null&&(Q=b),p=qe.get(Q),p.init(V),_.push(p),Q.traverseVisible(function(G){G.isLight&&G.layers.test(V.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),b!==Q&&b.traverseVisible(function(G){G.isLight&&G.layers.test(V.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights();const Y=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const pe=G.material;if(pe)if(Array.isArray(pe))for(let Ce=0;Ce<pe.length;Ce++){const Ue=pe[Ce];at(Ue,Q,G),Y.add(Ue)}else at(pe,Q,G),Y.add(pe)}),_.pop(),p=null,Y},this.compileAsync=function(b,V,Q=null){const Y=this.compile(b,V,Q);return new Promise(G=>{function pe(){if(Y.forEach(function(Ce){re.get(Ce).currentProgram.isReady()&&Y.delete(Ce)}),Y.size===0){G(b);return}setTimeout(pe,10)}oe.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let on=null;function _n(b){on&&on(b)}function Po(){ti.stop()}function Fo(){ti.start()}const ti=new Wc;ti.setAnimationLoop(_n),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(b){on=b,K.setAnimationLoop(b),b===null?ti.stop():ti.start()},K.addEventListener("sessionstart",Po),K.addEventListener("sessionend",Fo),this.render=function(b,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(V),V=K.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,V,w),p=qe.get(b,_.length),p.init(V),_.push(p),Ae.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),W.setFromProjectionMatrix(Ae),le=this.localClippingEnabled,te=ue.init(this.clippingPlanes,le),m=Te.get(b,S.length),m.init(),S.push(m),K.enabled===!0&&K.isPresenting===!0){const pe=x.xr.getDepthSensingMesh();pe!==null&&Tr(pe,V,-1/0,x.sortObjects)}Tr(b,V,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(X,ee),Ie=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,Ie&&ie.addToRenderList(m,b),this.info.render.frame++,te===!0&&ue.beginShadows();const Q=p.state.shadowsArray;L.render(Q,b,V),te===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=m.opaque,G=m.transmissive;if(p.setupLights(),V.isArrayCamera){const pe=V.cameras;if(G.length>0)for(let Ce=0,Ue=pe.length;Ce<Ue;Ce++){const Ne=pe[Ce];Lo(Y,G,b,Ne)}Ie&&ie.render(b);for(let Ce=0,Ue=pe.length;Ce<Ue;Ce++){const Ne=pe[Ce];Bo(m,b,Ne,Ne.viewport)}}else G.length>0&&Lo(Y,G,b,V),Ie&&ie.render(b),Bo(m,b,V);w!==null&&(D.updateMultisampleRenderTarget(w),D.updateRenderTargetMipmap(w)),b.isScene===!0&&b.onAfterRender(x,b,V),$e.resetDefaultState(),y=-1,v=null,_.pop(),_.length>0?(p=_[_.length-1],te===!0&&ue.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function Tr(b,V,Q,Y){if(b.visible===!1)return;if(b.layers.test(V.layers)){if(b.isGroup)Q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(V);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||W.intersectsSprite(b)){Y&&be.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Ae);const Ce=Z.update(b),Ue=b.material;Ue.visible&&m.push(b,Ce,Ue,Q,be.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||W.intersectsObject(b))){const Ce=Z.update(b),Ue=b.material;if(Y&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),be.copy(b.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),be.copy(Ce.boundingSphere.center)),be.applyMatrix4(b.matrixWorld).applyMatrix4(Ae)),Array.isArray(Ue)){const Ne=Ce.groups;for(let Qe=0,Ke=Ne.length;Qe<Ke;Qe++){const Oe=Ne[Qe],et=Ue[Oe.materialIndex];et&&et.visible&&m.push(b,Ce,et,Q,be.z,Oe)}}else Ue.visible&&m.push(b,Ce,Ue,Q,be.z,null)}}const pe=b.children;for(let Ce=0,Ue=pe.length;Ce<Ue;Ce++)Tr(pe[Ce],V,Q,Y)}function Bo(b,V,Q,Y){const G=b.opaque,pe=b.transmissive,Ce=b.transparent;p.setupLightsView(Q),te===!0&&ue.setGlobalState(x.clippingPlanes,Q),Y&&ce.viewport(I.copy(Y)),G.length>0&&bs(G,V,Q),pe.length>0&&bs(pe,V,Q),Ce.length>0&&bs(Ce,V,Q),ce.buffers.depth.setTest(!0),ce.buffers.depth.setMask(!0),ce.buffers.color.setMask(!0),ce.setPolygonOffset(!1)}function Lo(b,V,Q,Y){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new ei(1,1,{generateMipmaps:!0,type:oe.has("EXT_color_buffer_half_float")||oe.has("EXT_color_buffer_float")?ts:vn,minFilter:pi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const pe=p.state.transmissionRenderTarget[Y.id],Ce=Y.viewport||I;pe.setSize(Ce.z,Ce.w);const Ue=x.getRenderTarget();x.setRenderTarget(pe),x.getClearColor(B),z=x.getClearAlpha(),z<1&&x.setClearColor(16777215,.5),x.clear(),Ie&&ie.render(Q);const Ne=x.toneMapping;x.toneMapping=Jn;const Qe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),te===!0&&ue.setGlobalState(x.clippingPlanes,Y),bs(b,Q,Y),D.updateMultisampleRenderTarget(pe),D.updateRenderTargetMipmap(pe),oe.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let Oe=0,et=V.length;Oe<et;Oe++){const dt=V[Oe],ht=dt.object,zt=dt.geometry,it=dt.material,He=dt.group;if(it.side===nn&&ht.layers.test(Y.layers)){const yn=it.side;it.side=Gt,it.needsUpdate=!0,Uo(ht,Q,Y,zt,it,He),it.side=yn,it.needsUpdate=!0,Ke=!0}}Ke===!0&&(D.updateMultisampleRenderTarget(pe),D.updateRenderTargetMipmap(pe))}x.setRenderTarget(Ue),x.setClearColor(B,z),Qe!==void 0&&(Y.viewport=Qe),x.toneMapping=Ne}function bs(b,V,Q){const Y=V.isScene===!0?V.overrideMaterial:null;for(let G=0,pe=b.length;G<pe;G++){const Ce=b[G],Ue=Ce.object,Ne=Ce.geometry,Qe=Y===null?Ce.material:Y,Ke=Ce.group;Ue.layers.test(Q.layers)&&Uo(Ue,V,Q,Ne,Qe,Ke)}}function Uo(b,V,Q,Y,G,pe){b.onBeforeRender(x,V,Q,Y,G,pe),b.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(x,V,Q,Y,b,pe),G.transparent===!0&&G.side===nn&&G.forceSinglePass===!1?(G.side=Gt,G.needsUpdate=!0,x.renderBufferDirect(Q,V,Y,G,b,pe),G.side=xn,G.needsUpdate=!0,x.renderBufferDirect(Q,V,Y,G,b,pe),G.side=nn):x.renderBufferDirect(Q,V,Y,G,b,pe),b.onAfterRender(x,V,Q,Y,G,pe)}function ws(b,V,Q){V.isScene!==!0&&(V=Ye);const Y=re.get(b),G=p.state.lights,pe=p.state.shadowsArray,Ce=G.state.version,Ue=Pe.getParameters(b,G.state,pe,V,Q),Ne=Pe.getProgramCacheKey(Ue);let Qe=Y.programs;Y.environment=b.isMeshStandardMaterial?V.environment:null,Y.fog=V.fog,Y.envMap=(b.isMeshStandardMaterial?O:C).get(b.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&b.envMap===null?V.environmentRotation:b.envMapRotation,Qe===void 0&&(b.addEventListener("dispose",Xe),Qe=new Map,Y.programs=Qe);let Ke=Qe.get(Ne);if(Ke!==void 0){if(Y.currentProgram===Ke&&Y.lightsStateVersion===Ce)return Oo(b,Ue),Ke}else Ue.uniforms=Pe.getUniforms(b),b.onBeforeCompile(Ue,x),Ke=Pe.acquireProgram(Ue,Ne),Qe.set(Ne,Ke),Y.uniforms=Ue.uniforms;const Oe=Y.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Oe.clippingPlanes=ue.uniform),Oo(b,Ue),Y.needsLights=lu(b),Y.lightsStateVersion=Ce,Y.needsLights&&(Oe.ambientLightColor.value=G.state.ambient,Oe.lightProbe.value=G.state.probe,Oe.directionalLights.value=G.state.directional,Oe.directionalLightShadows.value=G.state.directionalShadow,Oe.spotLights.value=G.state.spot,Oe.spotLightShadows.value=G.state.spotShadow,Oe.rectAreaLights.value=G.state.rectArea,Oe.ltc_1.value=G.state.rectAreaLTC1,Oe.ltc_2.value=G.state.rectAreaLTC2,Oe.pointLights.value=G.state.point,Oe.pointLightShadows.value=G.state.pointShadow,Oe.hemisphereLights.value=G.state.hemi,Oe.directionalShadowMap.value=G.state.directionalShadowMap,Oe.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Oe.spotShadowMap.value=G.state.spotShadowMap,Oe.spotLightMatrix.value=G.state.spotLightMatrix,Oe.spotLightMap.value=G.state.spotLightMap,Oe.pointShadowMap.value=G.state.pointShadowMap,Oe.pointShadowMatrix.value=G.state.pointShadowMatrix),Y.currentProgram=Ke,Y.uniformsList=null,Ke}function No(b){if(b.uniformsList===null){const V=b.currentProgram.getUniforms();b.uniformsList=dr.seqWithValue(V.seq,b.uniforms)}return b.uniformsList}function Oo(b,V){const Q=re.get(b);Q.outputColorSpace=V.outputColorSpace,Q.batching=V.batching,Q.batchingColor=V.batchingColor,Q.instancing=V.instancing,Q.instancingColor=V.instancingColor,Q.instancingMorph=V.instancingMorph,Q.skinning=V.skinning,Q.morphTargets=V.morphTargets,Q.morphNormals=V.morphNormals,Q.morphColors=V.morphColors,Q.morphTargetsCount=V.morphTargetsCount,Q.numClippingPlanes=V.numClippingPlanes,Q.numIntersection=V.numClipIntersection,Q.vertexAlphas=V.vertexAlphas,Q.vertexTangents=V.vertexTangents,Q.toneMapping=V.toneMapping}function au(b,V,Q,Y,G){V.isScene!==!0&&(V=Ye),D.resetTextureUnits();const pe=V.fog,Ce=Y.isMeshStandardMaterial?V.environment:null,Ue=w===null?x.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:ns,Ne=(Y.isMeshStandardMaterial?O:C).get(Y.envMap||Ce),Qe=Y.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Ke=!!Q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Oe=!!Q.morphAttributes.position,et=!!Q.morphAttributes.normal,dt=!!Q.morphAttributes.color;let ht=Jn;Y.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(ht=x.toneMapping);const zt=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,it=zt!==void 0?zt.length:0,He=re.get(Y),yn=p.state.lights;if(te===!0&&(le===!0||b!==v)){const Zt=b===v&&Y.id===y;ue.setState(Y,b,Zt)}let st=!1;Y.version===He.__version?(He.needsLights&&He.lightsStateVersion!==yn.state.version||He.outputColorSpace!==Ue||G.isBatchedMesh&&He.batching===!1||!G.isBatchedMesh&&He.batching===!0||G.isBatchedMesh&&He.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&He.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&He.instancing===!1||!G.isInstancedMesh&&He.instancing===!0||G.isSkinnedMesh&&He.skinning===!1||!G.isSkinnedMesh&&He.skinning===!0||G.isInstancedMesh&&He.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&He.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&He.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&He.instancingMorph===!1&&G.morphTexture!==null||He.envMap!==Ne||Y.fog===!0&&He.fog!==pe||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==ue.numPlanes||He.numIntersection!==ue.numIntersection)||He.vertexAlphas!==Qe||He.vertexTangents!==Ke||He.morphTargets!==Oe||He.morphNormals!==et||He.morphColors!==dt||He.toneMapping!==ht||He.morphTargetsCount!==it)&&(st=!0):(st=!0,He.__version=Y.version);let ln=He.currentProgram;st===!0&&(ln=ws(Y,V,G));let xi=!1,Wt=!1,rs=!1;const ft=ln.getUniforms(),pn=He.uniforms;if(ce.useProgram(ln.program)&&(xi=!0,Wt=!0,rs=!0),Y.id!==y&&(y=Y.id,Wt=!0),xi||v!==b){ce.buffers.depth.getReversed()?(se.copy(b.projectionMatrix),cd(se),ud(se),ft.setValue(R,"projectionMatrix",se)):ft.setValue(R,"projectionMatrix",b.projectionMatrix),ft.setValue(R,"viewMatrix",b.matrixWorldInverse);const On=ft.map.cameraPosition;On!==void 0&&On.setValue(R,Ee.setFromMatrixPosition(b.matrixWorld)),de.logarithmicDepthBuffer&&ft.setValue(R,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&ft.setValue(R,"isOrthographic",b.isOrthographicCamera===!0),v!==b&&(v=b,Wt=!0,rs=!0)}if(G.isSkinnedMesh){ft.setOptional(R,G,"bindMatrix"),ft.setOptional(R,G,"bindMatrixInverse");const Zt=G.skeleton;Zt&&(Zt.boneTexture===null&&Zt.computeBoneTexture(),ft.setValue(R,"boneTexture",Zt.boneTexture,D))}G.isBatchedMesh&&(ft.setOptional(R,G,"batchingTexture"),ft.setValue(R,"batchingTexture",G._matricesTexture,D),ft.setOptional(R,G,"batchingIdTexture"),ft.setValue(R,"batchingIdTexture",G._indirectTexture,D),ft.setOptional(R,G,"batchingColorTexture"),G._colorsTexture!==null&&ft.setValue(R,"batchingColorTexture",G._colorsTexture,D));const as=Q.morphAttributes;if((as.position!==void 0||as.normal!==void 0||as.color!==void 0)&&we.update(G,Q,ln),(Wt||He.receiveShadow!==G.receiveShadow)&&(He.receiveShadow=G.receiveShadow,ft.setValue(R,"receiveShadow",G.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(pn.envMap.value=Ne,pn.flipEnvMap.value=Ne.isCubeTexture&&Ne.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&V.environment!==null&&(pn.envMapIntensity.value=V.environmentIntensity),Wt&&(ft.setValue(R,"toneMappingExposure",x.toneMappingExposure),He.needsLights&&ou(pn,rs),pe&&Y.fog===!0&&ve.refreshFogUniforms(pn,pe),ve.refreshMaterialUniforms(pn,Y,H,q,p.state.transmissionRenderTarget[b.id]),dr.upload(R,No(He),pn,D)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(dr.upload(R,No(He),pn,D),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&ft.setValue(R,"center",G.center),ft.setValue(R,"modelViewMatrix",G.modelViewMatrix),ft.setValue(R,"normalMatrix",G.normalMatrix),ft.setValue(R,"modelMatrix",G.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const Zt=Y.uniformsGroups;for(let On=0,zn=Zt.length;On<zn;On++){const zo=Zt[On];k.update(zo,ln),k.bind(zo,ln)}}return ln}function ou(b,V){b.ambientLightColor.needsUpdate=V,b.lightProbe.needsUpdate=V,b.directionalLights.needsUpdate=V,b.directionalLightShadows.needsUpdate=V,b.pointLights.needsUpdate=V,b.pointLightShadows.needsUpdate=V,b.spotLights.needsUpdate=V,b.spotLightShadows.needsUpdate=V,b.rectAreaLights.needsUpdate=V,b.hemisphereLights.needsUpdate=V}function lu(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(b,V,Q){re.get(b.texture).__webglTexture=V,re.get(b.depthTexture).__webglTexture=Q;const Y=re.get(b);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=Q===void 0,Y.__autoAllocateDepthBuffer||oe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,V){const Q=re.get(b);Q.__webglFramebuffer=V,Q.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(b,V=0,Q=0){w=b,E=V,M=Q;let Y=!0,G=null,pe=!1,Ce=!1;if(b){const Ne=re.get(b);if(Ne.__useDefaultFramebuffer!==void 0)ce.bindFramebuffer(R.FRAMEBUFFER,null),Y=!1;else if(Ne.__webglFramebuffer===void 0)D.setupRenderTarget(b);else if(Ne.__hasExternalTextures)D.rebindTextures(b,re.get(b.texture).__webglTexture,re.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Oe=b.depthTexture;if(Ne.__boundDepthTexture!==Oe){if(Oe!==null&&re.has(Oe)&&(b.width!==Oe.image.width||b.height!==Oe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(b)}}const Qe=b.texture;(Qe.isData3DTexture||Qe.isDataArrayTexture||Qe.isCompressedArrayTexture)&&(Ce=!0);const Ke=re.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ke[V])?G=Ke[V][Q]:G=Ke[V],pe=!0):b.samples>0&&D.useMultisampledRTT(b)===!1?G=re.get(b).__webglMultisampledFramebuffer:Array.isArray(Ke)?G=Ke[Q]:G=Ke,I.copy(b.viewport),U.copy(b.scissor),F=b.scissorTest}else I.copy(he).multiplyScalar(H).floor(),U.copy(Re).multiplyScalar(H).floor(),F=ze;if(ce.bindFramebuffer(R.FRAMEBUFFER,G)&&Y&&ce.drawBuffers(b,G),ce.viewport(I),ce.scissor(U),ce.setScissorTest(F),pe){const Ne=re.get(b.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+V,Ne.__webglTexture,Q)}else if(Ce){const Ne=re.get(b.texture),Qe=V||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ne.__webglTexture,Q||0,Qe)}y=-1},this.readRenderTargetPixels=function(b,V,Q,Y,G,pe,Ce){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=re.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ue=Ue[Ce]),Ue){ce.bindFramebuffer(R.FRAMEBUFFER,Ue);try{const Ne=b.texture,Qe=Ne.format,Ke=Ne.type;if(!de.textureFormatReadable(Qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!de.textureTypeReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=b.width-Y&&Q>=0&&Q<=b.height-G&&R.readPixels(V,Q,Y,G,We.convert(Qe),We.convert(Ke),pe)}finally{const Ne=w!==null?re.get(w).__webglFramebuffer:null;ce.bindFramebuffer(R.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(b,V,Q,Y,G,pe,Ce){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ue=re.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ue=Ue[Ce]),Ue){const Ne=b.texture,Qe=Ne.format,Ke=Ne.type;if(!de.textureFormatReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!de.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(V>=0&&V<=b.width-Y&&Q>=0&&Q<=b.height-G){ce.bindFramebuffer(R.FRAMEBUFFER,Ue);const Oe=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Oe),R.bufferData(R.PIXEL_PACK_BUFFER,pe.byteLength,R.STREAM_READ),R.readPixels(V,Q,Y,G,We.convert(Qe),We.convert(Ke),0);const et=w!==null?re.get(w).__webglFramebuffer:null;ce.bindFramebuffer(R.FRAMEBUFFER,et);const dt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await ld(R,dt,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Oe),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,pe),R.deleteBuffer(Oe),R.deleteSync(dt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,V=null,Q=0){b.isTexture!==!0&&(hs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),V=arguments[0]||null,b=arguments[1]);const Y=Math.pow(2,-Q),G=Math.floor(b.image.width*Y),pe=Math.floor(b.image.height*Y),Ce=V!==null?V.x:0,Ue=V!==null?V.y:0;D.setTexture2D(b,0),R.copyTexSubImage2D(R.TEXTURE_2D,Q,0,0,Ce,Ue,G,pe),ce.unbindTexture()},this.copyTextureToTexture=function(b,V,Q=null,Y=null,G=0){b.isTexture!==!0&&(hs("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,b=arguments[1],V=arguments[2],G=arguments[3]||0,Q=null);let pe,Ce,Ue,Ne,Qe,Ke,Oe,et,dt;const ht=b.isCompressedTexture?b.mipmaps[G]:b.image;Q!==null?(pe=Q.max.x-Q.min.x,Ce=Q.max.y-Q.min.y,Ue=Q.isBox3?Q.max.z-Q.min.z:1,Ne=Q.min.x,Qe=Q.min.y,Ke=Q.isBox3?Q.min.z:0):(pe=ht.width,Ce=ht.height,Ue=ht.depth||1,Ne=0,Qe=0,Ke=0),Y!==null?(Oe=Y.x,et=Y.y,dt=Y.z):(Oe=0,et=0,dt=0);const zt=We.convert(V.format),it=We.convert(V.type);let He;V.isData3DTexture?(D.setTexture3D(V,0),He=R.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(D.setTexture2DArray(V,0),He=R.TEXTURE_2D_ARRAY):(D.setTexture2D(V,0),He=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,V.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,V.unpackAlignment);const yn=R.getParameter(R.UNPACK_ROW_LENGTH),st=R.getParameter(R.UNPACK_IMAGE_HEIGHT),ln=R.getParameter(R.UNPACK_SKIP_PIXELS),xi=R.getParameter(R.UNPACK_SKIP_ROWS),Wt=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,ht.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ht.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ne),R.pixelStorei(R.UNPACK_SKIP_ROWS,Qe),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ke);const rs=b.isDataArrayTexture||b.isData3DTexture,ft=V.isDataArrayTexture||V.isData3DTexture;if(b.isRenderTargetTexture||b.isDepthTexture){const pn=re.get(b),as=re.get(V),Zt=re.get(pn.__renderTarget),On=re.get(as.__renderTarget);ce.bindFramebuffer(R.READ_FRAMEBUFFER,Zt.__webglFramebuffer),ce.bindFramebuffer(R.DRAW_FRAMEBUFFER,On.__webglFramebuffer);for(let zn=0;zn<Ue;zn++)rs&&R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,re.get(b).__webglTexture,G,Ke+zn),b.isDepthTexture?(ft&&R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,re.get(V).__webglTexture,G,dt+zn),R.blitFramebuffer(Ne,Qe,pe,Ce,Oe,et,pe,Ce,R.DEPTH_BUFFER_BIT,R.NEAREST)):ft?R.copyTexSubImage3D(He,G,Oe,et,dt+zn,Ne,Qe,pe,Ce):R.copyTexSubImage2D(He,G,Oe,et,dt+zn,Ne,Qe,pe,Ce);ce.bindFramebuffer(R.READ_FRAMEBUFFER,null),ce.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else ft?b.isDataTexture||b.isData3DTexture?R.texSubImage3D(He,G,Oe,et,dt,pe,Ce,Ue,zt,it,ht.data):V.isCompressedArrayTexture?R.compressedTexSubImage3D(He,G,Oe,et,dt,pe,Ce,Ue,zt,ht.data):R.texSubImage3D(He,G,Oe,et,dt,pe,Ce,Ue,zt,it,ht):b.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,G,Oe,et,pe,Ce,zt,it,ht.data):b.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,G,Oe,et,ht.width,ht.height,zt,ht.data):R.texSubImage2D(R.TEXTURE_2D,G,Oe,et,pe,Ce,zt,it,ht);R.pixelStorei(R.UNPACK_ROW_LENGTH,yn),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,st),R.pixelStorei(R.UNPACK_SKIP_PIXELS,ln),R.pixelStorei(R.UNPACK_SKIP_ROWS,xi),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Wt),G===0&&V.generateMipmaps&&R.generateMipmap(He),ce.unbindTexture()},this.copyTextureToTexture3D=function(b,V,Q=null,Y=null,G=0){return b.isTexture!==!0&&(hs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Q=arguments[0]||null,Y=arguments[1]||null,b=arguments[2],V=arguments[3],G=arguments[4]||0),hs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,V,Q,Y,G)},this.initRenderTarget=function(b){re.get(b).__webglFramebuffer===void 0&&D.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?D.setTextureCube(b,0):b.isData3DTexture?D.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?D.setTexture2DArray(b,0):D.setTexture2D(b,0),ce.unbindTexture()},this.resetState=function(){E=0,M=0,w=null,ce.reset(),$e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}}class Mg extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nn,this.environmentIntensity=1,this.environmentRotation=new Nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class qn extends Ot{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Yt,u=Yt,d,f){super(null,a,o,l,c,u,i,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Eg extends rn{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}class Ms extends an{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],d=[],f=[],h=[];let g=0;const A=[],m=n/2;let p=0;S(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new Kt(d,3)),this.setAttribute("normal",new Kt(f,3)),this.setAttribute("uv",new Kt(h,2));function S(){const x=new P,T=new P;let E=0;const M=(t-e)/n;for(let w=0;w<=r;w++){const y=[],v=w/r,I=v*(t-e)+e;for(let U=0;U<=i;U++){const F=U/i,B=F*l+o,z=Math.sin(B),N=Math.cos(B);T.x=I*z,T.y=-v*n+m,T.z=I*N,d.push(T.x,T.y,T.z),x.set(z,M,N).normalize(),f.push(x.x,x.y,x.z),h.push(F,1-v),y.push(g++)}A.push(y)}for(let w=0;w<i;w++)for(let y=0;y<r;y++){const v=A[y][w],I=A[y+1][w],U=A[y+1][w+1],F=A[y][w+1];(e>0||y!==0)&&(u.push(v,I,F),E+=3),(t>0||y!==r-1)&&(u.push(I,U,F),E+=3)}c.addGroup(p,E,0),p+=E}function _(x){const T=g,E=new Fe,M=new P;let w=0;const y=x===!0?e:t,v=x===!0?1:-1;for(let U=1;U<=i;U++)d.push(0,m*v,0),f.push(0,v,0),h.push(.5,.5),g++;const I=g;for(let U=0;U<=i;U++){const B=U/i*l+o,z=Math.cos(B),N=Math.sin(B);M.x=y*N,M.y=m*v,M.z=y*z,d.push(M.x,M.y,M.z),f.push(0,v,0),E.x=z*.5+.5,E.y=N*.5*v+.5,h.push(E.x,E.y),g++}for(let U=0;U<i;U++){const F=T+U,B=I+U;x===!0?u.push(B,B+1,F):u.push(B+1,B,F),w+=3}c.addGroup(p,w,x===!0?1:2),p+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ms(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class go extends Ms{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new go(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class pr extends an{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],d=new P,f=new P,h=[],g=[],A=[],m=[];for(let p=0;p<=n;p++){const S=[],_=p/n;let x=0;p===0&&a===0?x=.5/t:p===n&&l===Math.PI&&(x=-.5/t);for(let T=0;T<=t;T++){const E=T/t;d.x=-e*Math.cos(i+E*r)*Math.sin(a+_*o),d.y=e*Math.cos(a+_*o),d.z=e*Math.sin(i+E*r)*Math.sin(a+_*o),g.push(d.x,d.y,d.z),f.copy(d).normalize(),A.push(f.x,f.y,f.z),m.push(E+x,1-_),S.push(c++)}u.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){const _=u[p][S+1],x=u[p][S],T=u[p+1][S],E=u[p+1][S+1];(p!==0||a>0)&&h.push(_,x,E),(p!==n-1||l<Math.PI)&&h.push(x,T,E)}this.setIndex(h),this.setAttribute("position",new Kt(g,3)),this.setAttribute("normal",new Kt(A,3)),this.setAttribute("uv",new Kt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Cg extends an{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Hl{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ft(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ao}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ao);const hi=class hi{constructor(e,t){let n,i;this.promise=new Promise((c,u)=>{n=c,i=u});const r=n.bind(this),a=i.bind(this),o=(...c)=>{r(...c)},l=c=>{a(c)};e(o.bind(this),l.bind(this)),this.abortHandler=t,this.id=hi.idGen++}then(e){return new hi((t,n)=>{this.promise=this.promise.then((...i)=>{const r=e(...i);r instanceof Promise||r instanceof hi?r.then((...a)=>{t(...a)}):t(r)}).catch(i=>{n(i)})},this.abortHandler)}catch(e){return new hi(t=>{this.promise=this.promise.then((...n)=>{t(...n)}).catch(e)},this.abortHandler)}abort(e){this.abortHandler&&this.abortHandler(e)}};fe(hi,"idGen",0);let Es=hi;class jc extends Error{constructor(e){super(e)}}(function(){const s=new Float32Array(1),e=new Int32Array(s.buffer);return function(t){s[0]=t;const n=e[0];let i=n>>16&32768,r=n>>12&2047;const a=n>>23&255;return a<103?i:a>142?(i|=31744,i|=(a==255?0:1)&&n&8388607,i):a<113?(r|=2048,i|=(r>>114-a)+(r>>113-a&1),i):(i|=a-112<<10|r>>1,i+=r&1,i)}})();const ia=function(){const s=new Float32Array(1),e=new Int32Array(s.buffer);return function(t){return s[0]=t,e[0]}}(),Tg=function(s,e){return s[e]+(s[e+1]<<8)+(s[e+2]<<16)+(s[e+3]<<24)},Cr=function(s,e,t=!0,n){const i=new AbortController,r=i.signal;let a=!1;const o=u=>{i.abort(u),a=!0};let l=!1;const c=(u,d,f,h)=>{e&&!l&&(e(u,d,f,h),u===100&&(l=!0))};return new Es((u,d)=>{const f={signal:r};n&&(f.headers=n),fetch(s,f).then(async h=>{if(!h.ok){const _=await h.text();d(new Error(`Fetch failed: ${h.status} ${h.statusText} ${_}`));return}const g=h.body.getReader();let A=0,m=h.headers.get("Content-Length"),p=m?parseInt(m):void 0;const S=[];for(;!a;)try{const{value:_,done:x}=await g.read();if(x){if(c(100,"100%",_,p),t){const M=new Blob(S).arrayBuffer();u(M)}else u();break}A+=_.length;let T,E;p!==void 0&&(T=A/p*100,E=`${T.toFixed(2)}%`),t&&S.push(_),c(T,E,_,p)}catch(_){d(_);return}}).catch(h=>{d(new jc(h))})},o)},gt=function(s,e,t){return Math.max(Math.min(s,t),e)},Ui=function(){return performance.now()/1e3},zi=s=>{if(s.geometry&&(s.geometry.dispose(),s.geometry=null),s.material&&(s.material.dispose(),s.material=null),s.children)for(let e of s.children)zi(e)},Qt=(s,e)=>new Promise(t=>{window.setTimeout(()=>{t(s?s():void 0)},e?1:50)}),Wi=(s=0)=>{let e=0;if(s===1)e=9;else if(s===2)e=24;else if(s===3)e=45;else if(s>3)throw new Error("getSphericalHarmonicsComponentCountForDegree() -> Invalid spherical harmonics degree");return e},Ao=()=>{let s,e;return{promise:new Promise((n,i)=>{s=n,e=i}),resolve:s,reject:e}},sa=s=>{let e,t;return s||(s=()=>{}),{promise:new Es((i,r)=>{e=i,t=r},s),resolve:e,reject:t}};class bg{constructor(e,t,n){this.major=e,this.minor=t,this.patch=n}toString(){return`${this.major}_${this.minor}_${this.patch}`}}function So(){const s=navigator.userAgent;return s.indexOf("iPhone")>0||s.indexOf("iPad")>0}function Zc(){if(So()){const s=navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);return new bg(parseInt(s[1]||0,10),parseInt(s[2]||0,10),parseInt(s[3]||0,10))}else return null}const wg=14,Ss=class Ss{constructor(e=0){this.sphericalHarmonicsDegree=e,this.sphericalHarmonicsCount=Wi(this.sphericalHarmonicsDegree),this.componentCount=this.sphericalHarmonicsCount+wg,this.defaultSphericalHarmonics=new Array(this.sphericalHarmonicsCount).fill(0),this.splats=[],this.splatCount=0}static createSplat(e=0){const t=[0,0,0,1,1,1,1,0,0,0,0,0,0,0];let n=Wi(e);for(let i=0;i<n;i++)t.push(0);return t}addSplat(e){this.splats.push(e),this.splatCount++}getSplat(e){return this.splats[e]}addDefaultSplat(){const e=Ss.createSplat(this.sphericalHarmonicsDegree);return this.addSplat(e),e}addSplatFromComonents(e,t,n,i,r,a,o,l,c,u,d,f,h,g,...A){const m=[e,t,n,i,r,a,o,l,c,u,d,f,h,g,...this.defaultSphericalHarmonics];for(let p=0;p<A.length&&p<this.sphericalHarmonicsCount;p++)m[p]=A[p];return this.addSplat(m),m}addSplatFromArray(e,t){const n=e.splats[t],i=Ss.createSplat(this.sphericalHarmonicsDegree);for(let r=0;r<this.componentCount&&r<n.length;r++)i[r]=n[r];this.addSplat(i)}};fe(Ss,"OFFSET",{X:0,Y:1,Z:2,SCALE0:3,SCALE1:4,SCALE2:5,ROTATION0:6,ROTATION1:7,ROTATION2:8,ROTATION3:9,FDC0:10,FDC1:11,FDC2:12,OPACITY:13,FRC0:14,FRC1:15,FRC2:16,FRC3:17,FRC4:18,FRC5:19,FRC6:20,FRC7:21,FRC8:22,FRC9:23,FRC10:24,FRC11:25,FRC12:26,FRC13:27,FRC14:28,FRC15:29,FRC16:30,FRC17:31,FRC18:32,FRC19:33,FRC20:34,FRC21:35,FRC22:36,FRC23:37});let ge=Ss;class Ze{}fe(Ze,"DefaultSplatSortDistanceMapPrecision",16),fe(Ze,"MemoryPageSize",65536),fe(Ze,"BytesPerFloat",4),fe(Ze,"BytesPerInt",4),fe(Ze,"MaxScenes",32),fe(Ze,"ProgressiveLoadSectionSize",262144),fe(Ze,"ProgressiveLoadSectionDelayDuration",15),fe(Ze,"SphericalHarmonics8BitCompressionRange",3);const Rg=Ze.SphericalHarmonics8BitCompressionRange,Qn=Rg/2,Et=ys.toHalfFloat.bind(ys),xo=ys.fromHalfFloat.bind(ys),mt=(s,e,t=!1,n,i)=>{if(e===0)return s;if(e===1||e===2&&!t)return ys.fromHalfFloat(s);if(e===2)return vo(s,n,i)},ps=(s,e,t)=>{s=gt(s,e,t);const n=t-e;return gt(Math.floor((s-e)/n*255),0,255)},vo=(s,e,t)=>{const n=t-e;return s/255*n+e},$c=(s,e,t)=>ps(xo(s,e,t)),Ig=(s,e,t)=>Et(vo(s,e,t)),rt=(s,e,t,n=!1)=>t===0?s.getFloat32(e*4,!0):t===1||t===2&&!n?s.getUint16(e*2,!0):s.getUint8(e,!0),Dg=function(){const s=e=>e;return function(e,t,n,i=!1){if(t===n)return e;let r=s;return t===2&&i?n===1?r=Ig:n==0&&(r=vo):t===2||t===1?n===0?r=xo:n==2&&(i?r=$c:r=s):t===0&&(n===1?r=Et:n==2&&(i?r=ps:r=Et)),r(e)}}(),Ni=(s,e,t,n,i=0)=>{const r=new Uint8Array(s,e),a=new Uint8Array(t,n);for(let o=0;o<i;o++)a[o]=r[o]},j=class j{constructor(e,t=!0){fe(this,"getSplatScaleAndRotation",function(){const e=new Ge,t=new Ge,n=new Ge,i=new P,r=new P,a=new St;return function(o,l,c,u,d){const f=this.globalSplatIndexToSectionMap[o],h=this.sections[f],g=o-h.splatCountOffset,A=h.bytesPerSplat*g+j.CompressionLevels[this.compressionLevel].ScaleOffsetBytes,m=new DataView(this.bufferData,h.dataBase+A);r.set(mt(rt(m,0,this.compressionLevel),this.compressionLevel),mt(rt(m,1,this.compressionLevel),this.compressionLevel),mt(rt(m,2,this.compressionLevel),this.compressionLevel)),d&&(d.x!==void 0&&(r.x=d.x),d.y!==void 0&&(r.y=d.y),d.z!==void 0&&(r.z=d.z)),a.set(mt(rt(m,4,this.compressionLevel),this.compressionLevel),mt(rt(m,5,this.compressionLevel),this.compressionLevel),mt(rt(m,6,this.compressionLevel),this.compressionLevel),mt(rt(m,3,this.compressionLevel),this.compressionLevel)),u?(e.makeScale(r.x,r.y,r.z),t.makeRotationFromQuaternion(a),n.copy(e).multiply(t).multiply(u),n.decompose(i,c,l)):(l.copy(r),c.copy(a))}}());fe(this,"fillSplatScaleRotationArray",function(){const e=new Ge,t=new Ge,n=new Ge,i=new P,r=new St,a=new P,o=l=>{const c=l.w<0?-1:1;l.x*=c,l.y*=c,l.z*=c,l.w*=c};return function(l,c,u,d,f,h,g,A){const m=this.splatCount;d=d||0,f=f||m-1,h===void 0&&(h=d);const p=(S,_)=>Dg(S,_,g);for(let S=d;S<=f;S++){const _=this.globalSplatIndexToSectionMap[S],x=this.sections[_],T=S-x.splatCountOffset,E=x.bytesPerSplat*T+j.CompressionLevels[this.compressionLevel].ScaleOffsetBytes,M=(S-d+h)*j.ScaleComponentCount,w=(S-d+h)*j.RotationComponentCount,y=new DataView(this.bufferData,x.dataBase+E),v=A&&A.x!==void 0?A.x:rt(y,0,this.compressionLevel),I=A&&A.y!==void 0?A.y:rt(y,1,this.compressionLevel),U=A&&A.z!==void 0?A.z:rt(y,2,this.compressionLevel),F=rt(y,3,this.compressionLevel),B=rt(y,4,this.compressionLevel),z=rt(y,5,this.compressionLevel),N=rt(y,6,this.compressionLevel);i.set(mt(v,this.compressionLevel),mt(I,this.compressionLevel),mt(U,this.compressionLevel)),r.set(mt(B,this.compressionLevel),mt(z,this.compressionLevel),mt(N,this.compressionLevel),mt(F,this.compressionLevel)).normalize(),u&&(a.set(0,0,0),e.makeScale(i.x,i.y,i.z),t.makeRotationFromQuaternion(r),n.identity().premultiply(e).premultiply(t),n.premultiply(u),n.decompose(a,r,i),r.normalize()),o(r),l&&(l[M]=p(i.x,0),l[M+1]=p(i.y,0),l[M+2]=p(i.z,0)),c&&(c[w]=p(r.x,0),c[w+1]=p(r.y,0),c[w+2]=p(r.z,0),c[w+3]=p(r.w,0))}}}());fe(this,"fillSphericalHarmonicsArray",function(){for(let B=0;B<15;B++)new P;const e=new Ve,t=new Ge,n=new P,i=new P,r=new St,a=[],o=[],l=[],c=[],u=[],d=[],f=[],h=[],g=[],A=[],m=[],p=[],S=[],_=[],x=[],T=[],E=[],M=[],w=B=>B,y=(B,z,N,q)=>{B[0]=z,B[1]=N,B[2]=q},v=(B,z,N,q,H)=>{B[0]=rt(z,q,H,!0),B[1]=rt(z,q+N,H,!0),B[2]=rt(z,q+N+N,H,!0)},I=(B,z)=>{z[0]=B[0],z[1]=B[1],z[2]=B[2]},U=(B,z,N,q)=>{z[N]=q(B[0]),z[N+1]=q(B[1]),z[N+2]=q(B[2])},F=(B,z,N,q,H)=>(z[0]=mt(B[0],N,!0,q,H),z[1]=mt(B[1],N,!0,q,H),z[2]=mt(B[2],N,!0,q,H),z);return function(B,z,N,q,H,X,ee){const he=this.splatCount;q=q||0,H=H||he-1,X===void 0&&(X=q),N&&z>=1&&(t.copy(N),t.decompose(n,r,i),r.normalize(),t.makeRotationFromQuaternion(r),e.setFromMatrix4(t),y(a,e.elements[4],-e.elements[7],e.elements[1]),y(o,-e.elements[5],e.elements[8],-e.elements[2]),y(l,e.elements[3],-e.elements[6],e.elements[0]));const Re=W=>$c(W,this.minSphericalHarmonicsCoeff,this.maxSphericalHarmonicsCoeff),ze=W=>ps(W,this.minSphericalHarmonicsCoeff,this.maxSphericalHarmonicsCoeff);for(let W=q;W<=H;W++){const te=this.globalSplatIndexToSectionMap[W],le=this.sections[te];z=Math.min(z,le.sphericalHarmonicsDegree);const se=Wi(z),Ae=W-le.splatCountOffset,Ee=le.bytesPerSplat*Ae+j.CompressionLevels[this.compressionLevel].SphericalHarmonicsOffsetBytes,be=new DataView(this.bufferData,le.dataBase+Ee),Ye=(W-q+X)*se;let Ie=N?0:this.compressionLevel,Be=w;Ie!==ee&&(Ie===1?ee===0?Be=xo:ee==2&&(Be=Re):Ie===0&&(ee===1?Be=Et:ee==2&&(Be=ze)));const R=this.minSphericalHarmonicsCoeff,ae=this.maxSphericalHarmonicsCoeff;z>=1&&(v(g,be,3,0,this.compressionLevel),v(A,be,3,1,this.compressionLevel),v(m,be,3,2,this.compressionLevel),N?(F(g,g,this.compressionLevel,R,ae),F(A,A,this.compressionLevel,R,ae),F(m,m,this.compressionLevel,R,ae),j.rotateSphericalHarmonics3(g,A,m,a,o,l,_,x,T)):(I(g,_),I(A,x),I(m,T)),U(_,B,Ye,Be),U(x,B,Ye+3,Be),U(T,B,Ye+6,Be),z>=2&&(v(g,be,5,9,this.compressionLevel),v(A,be,5,10,this.compressionLevel),v(m,be,5,11,this.compressionLevel),v(p,be,5,12,this.compressionLevel),v(S,be,5,13,this.compressionLevel),N?(F(g,g,this.compressionLevel,R,ae),F(A,A,this.compressionLevel,R,ae),F(m,m,this.compressionLevel,R,ae),F(p,p,this.compressionLevel,R,ae),F(S,S,this.compressionLevel,R,ae),j.rotateSphericalHarmonics5(g,A,m,p,S,a,o,l,c,u,d,f,h,_,x,T,E,M)):(I(g,_),I(A,x),I(m,T),I(p,E),I(S,M)),U(_,B,Ye+9,Be),U(x,B,Ye+12,Be),U(T,B,Ye+15,Be),U(E,B,Ye+18,Be),U(M,B,Ye+21,Be)))}}}());this.constructFromBuffer(e,t)}getSplatCount(){return this.splatCount}getMaxSplatCount(){return this.maxSplatCount}getMinSphericalHarmonicsDegree(){let e=0;for(let t=0;t<this.sections.length;t++){const n=this.sections[t];(t===0||n.sphericalHarmonicsDegree<e)&&(e=n.sphericalHarmonicsDegree)}return e}getBucketIndex(e,t){let n;const i=e.fullBucketCount*e.bucketSize;if(t<i)n=Math.floor(t/e.bucketSize);else{let r=i;n=e.fullBucketCount;let a=0;for(;r<e.splatCount;){let o=e.partiallyFilledBucketLengths[a];if(t>=r&&t<r+o)break;r+=o,n++,a++}}return n}getSplatCenter(e,t,n){const i=this.globalSplatIndexToSectionMap[e],r=this.sections[i],a=e-r.splatCountOffset,o=r.bytesPerSplat*a,l=new DataView(this.bufferData,r.dataBase+o),c=rt(l,0,this.compressionLevel),u=rt(l,1,this.compressionLevel),d=rt(l,2,this.compressionLevel);if(this.compressionLevel>=1){const h=this.getBucketIndex(r,a)*j.BucketStorageSizeFloats,g=r.compressionScaleFactor,A=r.compressionScaleRange;t.x=(c-A)*g+r.bucketArray[h],t.y=(u-A)*g+r.bucketArray[h+1],t.z=(d-A)*g+r.bucketArray[h+2]}else t.x=c,t.y=u,t.z=d;n&&t.applyMatrix4(n)}getSplatColor(e,t){const n=this.globalSplatIndexToSectionMap[e],i=this.sections[n],r=e-i.splatCountOffset,a=i.bytesPerSplat*r+j.CompressionLevels[this.compressionLevel].ColorOffsetBytes,o=new Uint8Array(this.bufferData,i.dataBase+a,4);t.set(o[0],o[1],o[2],o[3])}fillSplatCenterArray(e,t,n,i,r){const a=this.splatCount;n=n||0,i=i||a-1,r===void 0&&(r=n);const o=new P;for(let l=n;l<=i;l++){const c=this.globalSplatIndexToSectionMap[l],u=this.sections[c],d=l-u.splatCountOffset,f=(l-n+r)*j.CenterComponentCount,h=u.bytesPerSplat*d,g=new DataView(this.bufferData,u.dataBase+h),A=rt(g,0,this.compressionLevel),m=rt(g,1,this.compressionLevel),p=rt(g,2,this.compressionLevel);if(this.compressionLevel>=1){const _=this.getBucketIndex(u,d)*j.BucketStorageSizeFloats,x=u.compressionScaleFactor,T=u.compressionScaleRange;o.x=(A-T)*x+u.bucketArray[_],o.y=(m-T)*x+u.bucketArray[_+1],o.z=(p-T)*x+u.bucketArray[_+2]}else o.x=A,o.y=m,o.z=p;t&&o.applyMatrix4(t),e[f]=o.x,e[f+1]=o.y,e[f+2]=o.z}}fillSplatCovarianceArray(e,t,n,i,r,a){const o=this.splatCount,l=new P,c=new St;n=n||0,i=i||o-1,r===void 0&&(r=n);for(let u=n;u<=i;u++){const d=this.globalSplatIndexToSectionMap[u],f=this.sections[d],h=u-f.splatCountOffset,g=(u-n+r)*j.CovarianceComponentCount,A=f.bytesPerSplat*h+j.CompressionLevels[this.compressionLevel].ScaleOffsetBytes,m=new DataView(this.bufferData,f.dataBase+A);l.set(mt(rt(m,0,this.compressionLevel),this.compressionLevel),mt(rt(m,1,this.compressionLevel),this.compressionLevel),mt(rt(m,2,this.compressionLevel),this.compressionLevel)),c.set(mt(rt(m,4,this.compressionLevel),this.compressionLevel),mt(rt(m,5,this.compressionLevel),this.compressionLevel),mt(rt(m,6,this.compressionLevel),this.compressionLevel),mt(rt(m,3,this.compressionLevel),this.compressionLevel)),j.computeCovariance(l,c,t,e,g,a)}}fillSplatColorArray(e,t,n,i,r){const a=this.splatCount;n=n||0,i=i||a-1,r===void 0&&(r=n);for(let o=n;o<=i;o++){const l=this.globalSplatIndexToSectionMap[o],c=this.sections[l],u=o-c.splatCountOffset,d=(o-n+r)*j.ColorComponentCount,f=c.bytesPerSplat*u+j.CompressionLevels[this.compressionLevel].ColorOffsetBytes,h=new Uint8Array(this.bufferData,c.dataBase+f);let g=h[3];g=g>=t?g:0,e[d]=h[0],e[d+1]=h[1],e[d+2]=h[2],e[d+3]=g}}static parseHeader(e){const t=new Uint8Array(e,0,j.HeaderSizeBytes),n=new Uint16Array(e,0,j.HeaderSizeBytes/2),i=new Uint32Array(e,0,j.HeaderSizeBytes/4),r=new Float32Array(e,0,j.HeaderSizeBytes/4),a=t[0],o=t[1],l=i[1],c=i[2],u=i[3],d=i[4],f=n[10],h=new P(r[6],r[7],r[8]),g=r[9]||-Qn,A=r[10]||Qn;return{versionMajor:a,versionMinor:o,maxSectionCount:l,sectionCount:c,maxSplatCount:u,splatCount:d,compressionLevel:f,sceneCenter:h,minSphericalHarmonicsCoeff:g,maxSphericalHarmonicsCoeff:A}}static writeHeaderCountsToBuffer(e,t,n){const i=new Uint32Array(n,0,j.HeaderSizeBytes/4);i[2]=e,i[4]=t}static writeHeaderToBuffer(e,t){const n=new Uint8Array(t,0,j.HeaderSizeBytes),i=new Uint16Array(t,0,j.HeaderSizeBytes/2),r=new Uint32Array(t,0,j.HeaderSizeBytes/4),a=new Float32Array(t,0,j.HeaderSizeBytes/4);n[0]=e.versionMajor,n[1]=e.versionMinor,n[2]=0,n[3]=0,r[1]=e.maxSectionCount,r[2]=e.sectionCount,r[3]=e.maxSplatCount,r[4]=e.splatCount,i[10]=e.compressionLevel,a[6]=e.sceneCenter.x,a[7]=e.sceneCenter.y,a[8]=e.sceneCenter.z,a[9]=e.minSphericalHarmonicsCoeff||-Qn,a[10]=e.maxSphericalHarmonicsCoeff||Qn}static parseSectionHeaders(e,t,n=0,i){const r=e.compressionLevel,a=e.maxSectionCount,o=new Uint16Array(t,n,a*j.SectionHeaderSizeBytes/2),l=new Uint32Array(t,n,a*j.SectionHeaderSizeBytes/4),c=new Float32Array(t,n,a*j.SectionHeaderSizeBytes/4),u=[];let d=0,f=d/2,h=d/4,g=j.HeaderSizeBytes+e.maxSectionCount*j.SectionHeaderSizeBytes,A=0;for(let m=0;m<a;m++){const p=l[h+1],S=l[h+2],_=l[h+3],x=c[h+4],T=x/2,E=o[f+10],M=l[h+6]||j.CompressionLevels[r].ScaleRange,w=l[h+8],y=l[h+9],v=y*4,I=E*_+v,U=o[f+20],{bytesPerSplat:F}=j.calculateComponentStorage(r,U),B=F*p,z=B+I,N={bytesPerSplat:F,splatCountOffset:A,splatCount:i?p:0,maxSplatCount:p,bucketSize:S,bucketCount:_,bucketBlockSize:x,halfBucketBlockSize:T,bucketStorageSizeBytes:E,bucketsStorageSizeBytes:I,splatDataStorageSizeBytes:B,storageSizeBytes:z,compressionScaleRange:M,compressionScaleFactor:T/M,base:g,bucketsBase:g+v,dataBase:g+I,fullBucketCount:w,partiallyFilledBucketCount:y,sphericalHarmonicsDegree:U};u[m]=N,g+=z,d+=j.SectionHeaderSizeBytes,f=d/2,h=d/4,A+=p}return u}static writeSectionHeaderToBuffer(e,t,n,i=0){const r=new Uint16Array(n,i,j.SectionHeaderSizeBytes/2),a=new Uint32Array(n,i,j.SectionHeaderSizeBytes/4),o=new Float32Array(n,i,j.SectionHeaderSizeBytes/4);a[0]=e.splatCount,a[1]=e.maxSplatCount,a[2]=t>=1?e.bucketSize:0,a[3]=t>=1?e.bucketCount:0,o[4]=t>=1?e.bucketBlockSize:0,r[10]=t>=1?j.BucketStorageSizeBytes:0,a[6]=t>=1?e.compressionScaleRange:0,a[7]=e.storageSizeBytes,a[8]=t>=1?e.fullBucketCount:0,a[9]=t>=1?e.partiallyFilledBucketCount:0,r[20]=e.sphericalHarmonicsDegree}static writeSectionHeaderSplatCountToBuffer(e,t,n=0){const i=new Uint32Array(t,n,j.SectionHeaderSizeBytes/4);i[0]=e}constructFromBuffer(e,t){this.bufferData=e,this.globalSplatIndexToLocalSplatIndexMap=[],this.globalSplatIndexToSectionMap=[];const n=j.parseHeader(this.bufferData);this.versionMajor=n.versionMajor,this.versionMinor=n.versionMinor,this.maxSectionCount=n.maxSectionCount,this.sectionCount=t?n.maxSectionCount:0,this.maxSplatCount=n.maxSplatCount,this.splatCount=t?n.maxSplatCount:0,this.compressionLevel=n.compressionLevel,this.sceneCenter=new P().copy(n.sceneCenter),this.minSphericalHarmonicsCoeff=n.minSphericalHarmonicsCoeff,this.maxSphericalHarmonicsCoeff=n.maxSphericalHarmonicsCoeff,this.sections=j.parseSectionHeaders(n,this.bufferData,j.HeaderSizeBytes,t),this.linkBufferArrays(),this.buildMaps()}static calculateComponentStorage(e,t){const n=j.CompressionLevels[e].BytesPerCenter,i=j.CompressionLevels[e].BytesPerScale,r=j.CompressionLevels[e].BytesPerRotation,a=j.CompressionLevels[e].BytesPerColor,o=Wi(t),l=j.CompressionLevels[e].BytesPerSphericalHarmonicsComponent*o,c=n+i+r+a+l;return{bytesPerCenter:n,bytesPerScale:i,bytesPerRotation:r,bytesPerColor:a,sphericalHarmonicsComponentsPerSplat:o,sphericalHarmonicsBytesPerSplat:l,bytesPerSplat:c}}linkBufferArrays(){for(let e=0;e<this.maxSectionCount;e++){const t=this.sections[e];t.bucketArray=new Float32Array(this.bufferData,t.bucketsBase,t.bucketCount*j.BucketStorageSizeFloats),t.partiallyFilledBucketCount>0&&(t.partiallyFilledBucketLengths=new Uint32Array(this.bufferData,t.base,t.partiallyFilledBucketCount))}}buildMaps(){let e=0;for(let t=0;t<this.maxSectionCount;t++){const n=this.sections[t];for(let i=0;i<n.maxSplatCount;i++){const r=e+i;this.globalSplatIndexToLocalSplatIndexMap[r]=i,this.globalSplatIndexToSectionMap[r]=t}e+=n.maxSplatCount}}updateLoadedCounts(e,t){j.writeHeaderCountsToBuffer(e,t,this.bufferData),this.sectionCount=e,this.splatCount=t}updateSectionLoadedCounts(e,t){const n=j.HeaderSizeBytes+j.SectionHeaderSizeBytes*e;j.writeSectionHeaderSplatCountToBuffer(t,this.bufferData,n),this.sections[e].splatCount=t}static generateFromUncompressedSplatArrays(e,t,n,i,r,a,o=[]){let l=0;for(let T=0;T<e.length;T++){const E=e[T];l=Math.max(E.sphericalHarmonicsDegree,l)}let c,u;for(let T=0;T<e.length;T++){const E=e[T];for(let M=0;M<E.splats.length;M++){const w=E.splats[M];for(let y=ge.OFFSET.FRC0;y<ge.OFFSET.FRC23&&y<w.length;y++)(!c||w[y]<c)&&(c=w[y]),(!u||w[y]>u)&&(u=w[y])}}c=c||-Qn,u=u||Qn;const{bytesPerSplat:d}=j.calculateComponentStorage(n,l),f=j.CompressionLevels[n].ScaleRange,h=[],g=[];let A=0;for(let T=0;T<e.length;T++){const E=e[T],M=new ge(l);for(let te=0;te<E.splatCount;te++){const le=E.splats[te];(le[ge.OFFSET.OPACITY]||0)>=t&&M.addSplat(le)}const w=o[T]||{},y=(w.blockSizeFactor||1)*(r||j.BucketBlockSize),v=Math.ceil((w.bucketSizeFactor||1)*(a||j.BucketSize)),I=j.computeBucketsForUncompressedSplatArray(M,y,v),U=I.fullBuckets.length,F=I.partiallyFullBuckets.map(te=>te.splats.length),B=F.length,z=[...I.fullBuckets,...I.partiallyFullBuckets],N=M.splats.length*d,q=B*4,H=n>=1?z.length*j.BucketStorageSizeBytes+q:0,X=N+H,ee=new ArrayBuffer(X),he=f/(y*.5),Re=new P;let ze=0;for(let te=0;te<z.length;te++){const le=z[te];Re.fromArray(le.center);for(let se=0;se<le.splats.length;se++){let Ae=le.splats[se];const Ee=M.splats[Ae],be=H+ze*d;j.writeSplatDataToSectionBuffer(Ee,ee,be,n,l,Re,he,f,c,u),ze++}}if(A+=ze,n>=1){const te=new Uint32Array(ee,0,F.length*4);for(let se=0;se<F.length;se++)te[se]=F[se];const le=new Float32Array(ee,q,z.length*j.BucketStorageSizeFloats);for(let se=0;se<z.length;se++){const Ae=z[se],Ee=se*3;le[Ee]=Ae.center[0],le[Ee+1]=Ae.center[1],le[Ee+2]=Ae.center[2]}}h.push(ee);const W=new ArrayBuffer(j.SectionHeaderSizeBytes);j.writeSectionHeaderToBuffer({maxSplatCount:ze,splatCount:ze,bucketSize:v,bucketCount:z.length,bucketBlockSize:y,compressionScaleRange:f,storageSizeBytes:X,fullBucketCount:U,partiallyFilledBucketCount:B,sphericalHarmonicsDegree:l},n,W,0),g.push(W)}let m=0;for(let T of h)m+=T.byteLength;const p=j.HeaderSizeBytes+j.SectionHeaderSizeBytes*h.length+m,S=new ArrayBuffer(p);j.writeHeaderToBuffer({versionMajor:0,versionMinor:1,maxSectionCount:h.length,sectionCount:h.length,maxSplatCount:A,splatCount:A,compressionLevel:n,sceneCenter:i,minSphericalHarmonicsCoeff:c,maxSphericalHarmonicsCoeff:u},S);let _=j.HeaderSizeBytes;for(let T of g)new Uint8Array(S,_,j.SectionHeaderSizeBytes).set(new Uint8Array(T)),_+=j.SectionHeaderSizeBytes;for(let T of h)new Uint8Array(S,_,T.byteLength).set(new Uint8Array(T)),_+=T.byteLength;return new j(S)}static computeBucketsForUncompressedSplatArray(e,t,n){let i=e.splatCount;const r=t/2,a=new P,o=new P;for(let A=0;A<i;A++){const m=e.splats[A],p=[m[ge.OFFSET.X],m[ge.OFFSET.Y],m[ge.OFFSET.Z]];(A===0||p[0]<a.x)&&(a.x=p[0]),(A===0||p[0]>o.x)&&(o.x=p[0]),(A===0||p[1]<a.y)&&(a.y=p[1]),(A===0||p[1]>o.y)&&(o.y=p[1]),(A===0||p[2]<a.z)&&(a.z=p[2]),(A===0||p[2]>o.z)&&(o.z=p[2])}const l=new P().copy(o).sub(a),c=Math.ceil(l.y/t),u=Math.ceil(l.z/t),d=new P,f=[],h={};for(let A=0;A<i;A++){const m=e.splats[A],p=[m[ge.OFFSET.X],m[ge.OFFSET.Y],m[ge.OFFSET.Z]],S=Math.floor((p[0]-a.x)/t),_=Math.floor((p[1]-a.y)/t),x=Math.floor((p[2]-a.z)/t);d.x=S*t+a.x+r,d.y=_*t+a.y+r,d.z=x*t+a.z+r;const T=S*(c*u)+_*u+x;let E=h[T];E||(h[T]=E={splats:[],center:d.toArray()}),E.splats.push(A),E.splats.length>=n&&(f.push(E),h[T]=null)}const g=[];for(let A in h)if(h.hasOwnProperty(A)){const m=h[A];m&&g.push(m)}return{fullBuckets:f,partiallyFullBuckets:g}}static preallocateUncompressed(e,t){const n=j.CompressionLevels[0].SphericalHarmonicsDegrees[t],i=j.HeaderSizeBytes+j.SectionHeaderSizeBytes,r=i+n.BytesPerSplat*e,a=new ArrayBuffer(r);return j.writeHeaderToBuffer({versionMajor:j.CurrentMajorVersion,versionMinor:j.CurrentMinorVersion,maxSectionCount:1,sectionCount:1,maxSplatCount:e,splatCount:e,compressionLevel:0,sceneCenter:new P},a),j.writeSectionHeaderToBuffer({maxSplatCount:e,splatCount:e,bucketSize:0,bucketCount:0,bucketBlockSize:0,compressionScaleRange:0,storageSizeBytes:0,fullBucketCount:0,partiallyFilledBucketCount:0,sphericalHarmonicsDegree:t},0,a,j.HeaderSizeBytes),{splatBuffer:new j(a,!0),splatBufferDataOffsetBytes:i}}};fe(j,"CurrentMajorVersion",0),fe(j,"CurrentMinorVersion",1),fe(j,"CenterComponentCount",3),fe(j,"ScaleComponentCount",3),fe(j,"RotationComponentCount",4),fe(j,"ColorComponentCount",4),fe(j,"CovarianceComponentCount",6),fe(j,"SplatScaleOffsetFloat",3),fe(j,"SplatRotationOffsetFloat",6),fe(j,"CompressionLevels",{0:{BytesPerCenter:12,BytesPerScale:12,BytesPerRotation:16,BytesPerColor:4,ScaleOffsetBytes:12,RotationffsetBytes:24,ColorOffsetBytes:40,SphericalHarmonicsOffsetBytes:44,ScaleRange:1,BytesPerSphericalHarmonicsComponent:4,SphericalHarmonicsOffsetFloat:11,SphericalHarmonicsDegrees:{0:{BytesPerSplat:44},1:{BytesPerSplat:80},2:{BytesPerSplat:140}}},1:{BytesPerCenter:6,BytesPerScale:6,BytesPerRotation:8,BytesPerColor:4,ScaleOffsetBytes:6,RotationffsetBytes:12,ColorOffsetBytes:20,SphericalHarmonicsOffsetBytes:24,ScaleRange:32767,BytesPerSphericalHarmonicsComponent:2,SphericalHarmonicsOffsetFloat:12,SphericalHarmonicsDegrees:{0:{BytesPerSplat:24},1:{BytesPerSplat:42},2:{BytesPerSplat:72}}},2:{BytesPerCenter:6,BytesPerScale:6,BytesPerRotation:8,BytesPerColor:4,ScaleOffsetBytes:6,RotationffsetBytes:12,ColorOffsetBytes:20,SphericalHarmonicsOffsetBytes:24,ScaleRange:32767,BytesPerSphericalHarmonicsComponent:1,SphericalHarmonicsOffsetFloat:12,SphericalHarmonicsDegrees:{0:{BytesPerSplat:24},1:{BytesPerSplat:33},2:{BytesPerSplat:48}}}}),fe(j,"CovarianceSizeFloats",6),fe(j,"HeaderSizeBytes",4096),fe(j,"SectionHeaderSizeBytes",1024),fe(j,"BucketStorageSizeBytes",12),fe(j,"BucketStorageSizeFloats",3),fe(j,"BucketBlockSize",5),fe(j,"BucketSize",256),fe(j,"computeCovariance",function(){const e=new Ge,t=new Ve,n=new Ve,i=new Ve,r=new Ve,a=new Ve,o=new Ve;return function(l,c,u,d,f=0,h){e.makeScale(l.x,l.y,l.z),t.setFromMatrix4(e),e.makeRotationFromQuaternion(c),n.setFromMatrix4(e),i.copy(n).multiply(t),r.copy(i).transpose().premultiply(i),u&&(a.setFromMatrix4(u),o.copy(a).transpose(),r.multiply(o),r.premultiply(a)),h>=1?(d[f]=Et(r.elements[0]),d[f+1]=Et(r.elements[3]),d[f+2]=Et(r.elements[6]),d[f+3]=Et(r.elements[4]),d[f+4]=Et(r.elements[7]),d[f+5]=Et(r.elements[8])):(d[f]=r.elements[0],d[f+1]=r.elements[3],d[f+2]=r.elements[6],d[f+3]=r.elements[4],d[f+4]=r.elements[7],d[f+5]=r.elements[8])}}()),fe(j,"dot3",(e,t,n,i,r)=>{r[0]=r[1]=r[2]=0;const a=i[0],o=i[1],l=i[2];j.addInto3(e[0]*a,e[1]*a,e[2]*a,r),j.addInto3(t[0]*o,t[1]*o,t[2]*o,r),j.addInto3(n[0]*l,n[1]*l,n[2]*l,r)}),fe(j,"addInto3",(e,t,n,i)=>{i[0]=i[0]+e,i[1]=i[1]+t,i[2]=i[2]+n}),fe(j,"dot5",(e,t,n,i,r,a,o)=>{o[0]=o[1]=o[2]=0;const l=a[0],c=a[1],u=a[2],d=a[3],f=a[4];j.addInto3(e[0]*l,e[1]*l,e[2]*l,o),j.addInto3(t[0]*c,t[1]*c,t[2]*c,o),j.addInto3(n[0]*u,n[1]*u,n[2]*u,o),j.addInto3(i[0]*d,i[1]*d,i[2]*d,o),j.addInto3(r[0]*f,r[1]*f,r[2]*f,o)}),fe(j,"rotateSphericalHarmonics3",(e,t,n,i,r,a,o,l,c)=>{j.dot3(e,t,n,i,o),j.dot3(e,t,n,r,l),j.dot3(e,t,n,a,c)}),fe(j,"rotateSphericalHarmonics5",(e,t,n,i,r,a,o,l,c,u,d,f,h,g,A,m,p,S)=>{const _=Math.sqrt(.25),x=Math.sqrt(3/4),T=Math.sqrt(1/3),E=Math.sqrt(4/3),M=Math.sqrt(1/12);c[0]=_*(l[2]*a[0]+l[0]*a[2]+(a[2]*l[0]+a[0]*l[2])),c[1]=l[1]*a[0]+a[1]*l[0],c[2]=x*(l[1]*a[1]+a[1]*l[1]),c[3]=l[1]*a[2]+a[1]*l[2],c[4]=_*(l[2]*a[2]-l[0]*a[0]+(a[2]*l[2]-a[0]*l[0])),j.dot5(e,t,n,i,r,c,g),u[0]=_*(o[2]*a[0]+o[0]*a[2]+(a[2]*o[0]+a[0]*o[2])),u[1]=o[1]*a[0]+a[1]*o[0],u[2]=x*(o[1]*a[1]+a[1]*o[1]),u[3]=o[1]*a[2]+a[1]*o[2],u[4]=_*(o[2]*a[2]-o[0]*a[0]+(a[2]*o[2]-a[0]*o[0])),j.dot5(e,t,n,i,r,u,A),d[0]=T*(o[2]*o[0]+o[0]*o[2])+-M*(l[2]*l[0]+l[0]*l[2]+(a[2]*a[0]+a[0]*a[2])),d[1]=E*o[1]*o[0]+-T*(l[1]*l[0]+a[1]*a[0]),d[2]=o[1]*o[1]+-_*(l[1]*l[1]+a[1]*a[1]),d[3]=E*o[1]*o[2]+-T*(l[1]*l[2]+a[1]*a[2]),d[4]=T*(o[2]*o[2]-o[0]*o[0])+-M*(l[2]*l[2]-l[0]*l[0]+(a[2]*a[2]-a[0]*a[0])),j.dot5(e,t,n,i,r,d,m),f[0]=_*(o[2]*l[0]+o[0]*l[2]+(l[2]*o[0]+l[0]*o[2])),f[1]=o[1]*l[0]+l[1]*o[0],f[2]=x*(o[1]*l[1]+l[1]*o[1]),f[3]=o[1]*l[2]+l[1]*o[2],f[4]=_*(o[2]*l[2]-o[0]*l[0]+(l[2]*o[2]-l[0]*o[0])),j.dot5(e,t,n,i,r,f,p),h[0]=_*(l[2]*l[0]+l[0]*l[2]-(a[2]*a[0]+a[0]*a[2])),h[1]=l[1]*l[0]-a[1]*a[0],h[2]=x*(l[1]*l[1]-a[1]*a[1]),h[3]=l[1]*l[2]-a[1]*a[2],h[4]=_*(l[2]*l[2]-l[0]*l[0]-(a[2]*a[2]-a[0]*a[0])),j.dot5(e,t,n,i,r,h,S)}),fe(j,"writeSplatDataToSectionBuffer",function(){const e=new ArrayBuffer(12),t=new ArrayBuffer(12),n=new ArrayBuffer(16),i=new ArrayBuffer(4),r=new ArrayBuffer(256),a=new St,o=new P,l=new P,{X:c,Y:u,Z:d,SCALE0:f,SCALE1:h,SCALE2:g,ROTATION0:A,ROTATION1:m,ROTATION2:p,ROTATION3:S,FDC0:_,FDC1:x,FDC2:T,OPACITY:E,FRC0:M,FRC9:w}=ge.OFFSET,y=(v,I,U)=>{const F=U*2+1;return v=Math.round(v*I)+U,gt(v,0,F)};return function(v,I,U,F,B,z,N,q,H=-Qn,X=Qn){const ee=Wi(B),he=j.CompressionLevels[F].BytesPerCenter,Re=j.CompressionLevels[F].BytesPerScale,ze=j.CompressionLevels[F].BytesPerRotation,W=j.CompressionLevels[F].BytesPerColor,te=U,le=te+he,se=le+Re,Ae=se+ze,Ee=Ae+W;if(v[A]!==void 0?(a.set(v[A],v[m],v[p],v[S]),a.normalize()):a.set(1,0,0,0),v[f]!==void 0?o.set(v[f]||0,v[h]||0,v[g]||0):o.set(0,0,0),F===0){const Ye=new Float32Array(I,te,j.CenterComponentCount),Ie=new Float32Array(I,se,j.RotationComponentCount),Be=new Float32Array(I,le,j.ScaleComponentCount);if(Ie.set([a.x,a.y,a.z,a.w]),Be.set([o.x,o.y,o.z]),Ye.set([v[c],v[u],v[d]]),B>0){const R=new Float32Array(I,Ee,ee);if(B>=1){for(let ae=0;ae<9;ae++)R[ae]=v[M+ae]||0;if(B>=2)for(let ae=0;ae<15;ae++)R[ae+9]=v[w+ae]||0}}}else{const Ye=new Uint16Array(e,0,j.CenterComponentCount),Ie=new Uint16Array(n,0,j.RotationComponentCount),Be=new Uint16Array(t,0,j.ScaleComponentCount);if(Ie.set([Et(a.x),Et(a.y),Et(a.z),Et(a.w)]),Be.set([Et(o.x),Et(o.y),Et(o.z)]),l.set(v[c],v[u],v[d]).sub(z),l.x=y(l.x,N,q),l.y=y(l.y,N,q),l.z=y(l.z,N,q),Ye.set([l.x,l.y,l.z]),B>0){const R=F===1?Uint16Array:Uint8Array,ae=F===1?2:1,oe=new R(r,0,ee);if(B>=1){for(let ce=0;ce<9;ce++){const Le=v[M+ce]||0;oe[ce]=F===1?Et(Le):ps(Le,H,X)}const de=9*ae;if(Ni(oe.buffer,0,I,Ee,de),B>=2){for(let ce=0;ce<15;ce++){const Le=v[w+ce]||0;oe[ce+9]=F===1?Et(Le):ps(Le,H,X)}Ni(oe.buffer,de,I,Ee+de,15*ae)}}}Ni(Ye.buffer,0,I,te,6),Ni(Be.buffer,0,I,le,6),Ni(Ie.buffer,0,I,se,8)}const be=new Uint8ClampedArray(i,0,4);be.set([v[_]||0,v[x]||0,v[T]||0]),be[3]=v[E]||0,Ni(be.buffer,0,I,Ae,4)}}());let De=j;const kl=new Uint8Array([112,108,121,10]),Vl=new Uint8Array([10,101,110,100,95,104,101,97,100,101,114,10]),ra="end_header",aa=new Map([["char",Int8Array],["uchar",Uint8Array],["short",Int16Array],["ushort",Uint16Array],["int",Int32Array],["uint",Uint32Array],["float",Float32Array],["double",Float64Array]]),Sn=(s,e)=>{const t=(1<<e)-1;return(s&t)/t},Gl=(s,e)=>{s.x=Sn(e>>>21,11),s.y=Sn(e>>>11,10),s.z=Sn(e,11)},Pg=(s,e)=>{s.x=Sn(e>>>24,8),s.y=Sn(e>>>16,8),s.z=Sn(e>>>8,8),s.w=Sn(e,8)},Fg=(s,e)=>{const t=1/(Math.sqrt(2)*.5),n=(Sn(e>>>20,10)-.5)*t,i=(Sn(e>>>10,10)-.5)*t,r=(Sn(e,10)-.5)*t,a=Math.sqrt(1-(n*n+i*i+r*r));switch(e>>>30){case 0:s.set(a,n,i,r);break;case 1:s.set(n,a,i,r);break;case 2:s.set(n,i,a,r);break;case 3:s.set(n,i,r,a);break}},wn=(s,e,t)=>s*(1-t)+e*t,xt=(s,e)=>{var t;return(t=s.properties.find(n=>n.name===e&&n.storage))==null?void 0:t.storage},lt=class lt{static decodeHeaderText(e){let t,n,i,r;const a=e.split(`
`).filter(d=>!d.startsWith("comment "));let o=0,l=!1;for(let d=1;d<a.length;++d){const f=a[d].split(" ");switch(f[0]){case"format":if(f[1]!=="binary_little_endian")throw new Error("Unsupported ply format");break;case"element":t={name:f[1],count:parseInt(f[2],10),properties:[],storageSizeBytes:0},t.name==="chunk"?n=t:t.name==="vertex"?i=t:t.name==="sh"&&(r=t);break;case"property":{if(!aa.has(f[1]))throw new Error(`Unrecognized property data type '${f[1]}' in ply header`);const h=aa.get(f[1]),g=h.BYTES_PER_ELEMENT*t.count;t.name==="vertex"&&(o+=h.BYTES_PER_ELEMENT),t.properties.push({type:f[1],name:f[2],storage:null,byteSize:h.BYTES_PER_ELEMENT,storageSizeByes:g}),t.storageSizeBytes+=g;break}case ra:l=!0;break;default:throw new Error(`Unrecognized header value '${f[0]}' in ply header`)}if(l)break}let c=0,u=0;return r&&(u=r.properties.length,r.properties.length>=45?c=3:r.properties.length>=24?c=2:r.properties.length>=9&&(c=1)),{chunkElement:n,vertexElement:i,shElement:r,bytesPerSplat:o,headerSizeBytes:e.indexOf(ra)+ra.length+1,sphericalHarmonicsDegree:c,sphericalHarmonicsPerSplat:u}}static decodeHeader(e){const t=(h,g)=>{const A=h.length-g.length;let m,p;for(m=0;m<=A;++m){for(p=0;p<g.length&&h[m+p]===g[p];++p);if(p===g.length)return m}return-1},n=(h,g)=>{if(h.length<g.length)return!1;for(let A=0;A<g.length;++A)if(h[A]!==g[A])return!1;return!0};let i=new Uint8Array(e),r;if(i.length>=kl.length&&!n(i,kl))throw new Error("Invalid PLY header");if(r=t(i,Vl),r===-1)throw new Error("End of PLY header not found");const a=new TextDecoder("ascii").decode(i.slice(0,r)),{chunkElement:o,vertexElement:l,shElement:c,sphericalHarmonicsDegree:u,sphericalHarmonicsPerSplat:d,bytesPerSplat:f}=lt.decodeHeaderText(a);return{headerSizeBytes:r+Vl.length,bytesPerSplat:f,chunkElement:o,vertexElement:l,shElement:c,sphericalHarmonicsDegree:u,sphericalHarmonicsPerSplat:d}}static readElementData(e,t,n,i,r,a=null){let o=t instanceof DataView?t:new DataView(t);i=i||0,r=r||e.count-1;for(let l=i;l<=r;++l)for(let c=0;c<e.properties.length;++c){const u=e.properties[c],d=aa.get(u.type),f=d.BYTES_PER_ELEMENT*e.count;if((!u.storage||u.storage.byteLength<f)&&(!a||a(u.name))&&(u.storage=new d(e.count)),u.storage)switch(u.type){case"char":u.storage[l]=o.getInt8(n);break;case"uchar":u.storage[l]=o.getUint8(n);break;case"short":u.storage[l]=o.getInt16(n,!0);break;case"ushort":u.storage[l]=o.getUint16(n,!0);break;case"int":u.storage[l]=o.getInt32(n,!0);break;case"uint":u.storage[l]=o.getUint32(n,!0);break;case"float":u.storage[l]=o.getFloat32(n,!0);break;case"double":u.storage[l]=o.getFloat64(n,!0);break}n+=u.byteSize}return n}static readPly(e,t=null){const n=lt.decodeHeader(e);let i=lt.readElementData(n.chunkElement,e,n.headerSizeBytes,null,null,t);return i=lt.readElementData(n.vertexElement,e,i,null,null,t),lt.readElementData(n.shElement,e,i,null,null,t),{chunkElement:n.chunkElement,vertexElement:n.vertexElement,shElement:n.shElement,sphericalHarmonicsDegree:n.sphericalHarmonicsDegree,sphericalHarmonicsPerSplat:n.sphericalHarmonicsPerSplat}}static getElementStorageArrays(e,t,n){const i={};if(t){const r=xt(e,"min_r"),a=xt(e,"min_g"),o=xt(e,"min_b"),l=xt(e,"max_r"),c=xt(e,"max_g"),u=xt(e,"max_b"),d=xt(e,"min_x"),f=xt(e,"min_y"),h=xt(e,"min_z"),g=xt(e,"max_x"),A=xt(e,"max_y"),m=xt(e,"max_z"),p=xt(e,"min_scale_x"),S=xt(e,"min_scale_y"),_=xt(e,"min_scale_z"),x=xt(e,"max_scale_x"),T=xt(e,"max_scale_y"),E=xt(e,"max_scale_z"),M=xt(t,"packed_position"),w=xt(t,"packed_rotation"),y=xt(t,"packed_scale"),v=xt(t,"packed_color");i.colorExtremes={minR:r,maxR:l,minG:a,maxG:c,minB:o,maxB:u},i.positionExtremes={minX:d,maxX:g,minY:f,maxY:A,minZ:h,maxZ:m},i.scaleExtremes={minScaleX:p,maxScaleX:x,minScaleY:S,maxScaleY:T,minScaleZ:_,maxScaleZ:E},i.position=M,i.rotation=w,i.scale=y,i.color=v}if(n){const r={};for(let a=0;a<45;a++){const o=`f_rest_${a}`,l=xt(n,o);if(l)r[o]=l;else break}i.sh=r}return i}static parseToUncompressedSplatBufferSection(e,t,n,i,r,a,o,l,c=null){lt.readElementData(t,a,0,n,i,c);const u=De.CompressionLevels[0].SphericalHarmonicsDegrees[0].BytesPerSplat,{positionExtremes:d,scaleExtremes:f,colorExtremes:h,position:g,rotation:A,scale:m,color:p}=lt.getElementStorageArrays(e,t),S=ge.createSplat();for(let _=n;_<=i;++_){lt.decompressBaseSplat(_,r,g,d,m,f,A,h,p,S);const x=_*u+l;De.writeSplatDataToSectionBuffer(S,o,x,0,0)}}static parseToUncompressedSplatArraySection(e,t,n,i,r,a,o,l=null){lt.readElementData(t,a,0,n,i,l);const{positionExtremes:c,scaleExtremes:u,colorExtremes:d,position:f,rotation:h,scale:g,color:A}=lt.getElementStorageArrays(e,t);for(let m=n;m<=i;++m){const p=ge.createSplat();lt.decompressBaseSplat(m,r,f,c,g,u,h,d,A,p),o.addSplat(p)}}static parseSphericalHarmonicsToUncompressedSplatArraySection(e,t,n,i,r,a,o,l,c,u=null){lt.readElementData(t,r,a,n,i,u);const{sh:d}=lt.getElementStorageArrays(e,void 0,t),f=Object.values(d);for(let h=n;h<=i;++h)lt.decompressSphericalHarmonics(h,f,o,l,c.splats[h])}static parseToUncompressedSplatArray(e,t){const{chunkElement:n,vertexElement:i,shElement:r,sphericalHarmonicsDegree:a}=lt.readPly(e);t=Math.min(t,a);const o=new ge(t),{positionExtremes:l,scaleExtremes:c,colorExtremes:u,position:d,rotation:f,scale:h,color:g}=lt.getElementStorageArrays(n,i);let A;if(t>0){const{sh:m}=lt.getElementStorageArrays(n,void 0,r);A=Object.values(m)}for(let m=0;m<i.count;++m){o.addDefaultSplat();const p=o.getSplat(o.splatCount-1);lt.decompressBaseSplat(m,0,d,l,h,c,f,u,g,p),t>0&&lt.decompressSphericalHarmonics(m,A,t,a,p)}return o}static parseToUncompressedSplatBuffer(e,t){const{chunkElement:n,vertexElement:i,shElement:r,sphericalHarmonicsDegree:a}=lt.readPly(e);t=Math.min(t,a);const{splatBuffer:o,splatBufferDataOffsetBytes:l}=De.preallocateUncompressed(i.count,t),{positionExtremes:c,scaleExtremes:u,colorExtremes:d,position:f,rotation:h,scale:g,color:A}=lt.getElementStorageArrays(n,i);let m;if(t>0){const{sh:_}=lt.getElementStorageArrays(n,void 0,r);m=Object.values(_)}const p=De.CompressionLevels[0].SphericalHarmonicsDegrees[t].BytesPerSplat,S=ge.createSplat(t);for(let _=0;_<i.count;++_){lt.decompressBaseSplat(_,0,f,c,g,u,h,d,A,S),t>0&&lt.decompressSphericalHarmonics(_,m,t,a,S);const x=_*p+l;De.writeSplatDataToSectionBuffer(S,o.bufferData,x,0,t)}return o}};fe(lt,"decompressBaseSplat",function(){const e=new P,t=new St,n=new P,i=new At,r=ge.OFFSET;return function(a,o,l,c,u,d,f,h,g,A){A=A||ge.createSplat();const m=Math.floor((o+a)/256);return Gl(e,l[a]),Fg(t,f[a]),Gl(n,u[a]),Pg(i,g[a]),A[r.X]=wn(c.minX[m],c.maxX[m],e.x),A[r.Y]=wn(c.minY[m],c.maxY[m],e.y),A[r.Z]=wn(c.minZ[m],c.maxZ[m],e.z),A[r.ROTATION0]=t.x,A[r.ROTATION1]=t.y,A[r.ROTATION2]=t.z,A[r.ROTATION3]=t.w,A[r.SCALE0]=Math.exp(wn(d.minScaleX[m],d.maxScaleX[m],n.x)),A[r.SCALE1]=Math.exp(wn(d.minScaleY[m],d.maxScaleY[m],n.y)),A[r.SCALE2]=Math.exp(wn(d.minScaleZ[m],d.maxScaleZ[m],n.z)),h.minR&&h.maxR?A[r.FDC0]=gt(Math.round(wn(h.minR[m],h.maxR[m],i.x)*255),0,255):A[r.FDC0]=gt(Math.floor(i.x*255),0,255),h.minG&&h.maxG?A[r.FDC1]=gt(Math.round(wn(h.minG[m],h.maxG[m],i.y)*255),0,255):A[r.FDC1]=gt(Math.floor(i.y*255),0,255),h.minB&&h.maxB?A[r.FDC2]=gt(Math.round(wn(h.minB[m],h.maxB[m],i.z)*255),0,255):A[r.FDC2]=gt(Math.floor(i.z*255),0,255),A[r.OPACITY]=gt(Math.floor(i.w*255),0,255),A}}()),fe(lt,"decompressSphericalHarmonics",function(){const e=[0,3,8,15],t=[0,1,2,9,10,11,12,13,24,25,26,27,28,29,30,3,4,5,14,15,16,17,18,31,32,33,34,35,36,37,6,7,8,19,20,21,22,23,38,39,40,41,42,43,44];return function(n,i,r,a,o){o=o||ge.createSplat();let l=e[r],c=e[a];for(let u=0;u<3;++u)for(let d=0;d<15;++d){const f=t[u*15+d];d<l&&d<c&&(o[ge.OFFSET.FRC0+f]=i[u*c+d][n]*(8/255)-4)}return o}}());let Fn=lt;const Ut={INRIAV1:0,INRIAV2:1,PlayCanvasCompressed:2},[Jc,_o,yo,Mo,Eo,Co,To]=[0,1,2,3,4,5,6],Wl={double:Jc,int:_o,uint:yo,float:Mo,short:Eo,ushort:Co,uchar:To},Bg={[Jc]:8,[_o]:4,[yo]:4,[Mo]:4,[Eo]:2,[Co]:2,[To]:1},kt=class kt{static decodeSectionHeader(e,t,n=0){const i=[];let r=!1,a=-1,o=0,l=!1,c=null;const u=[],d=[],f=[],h={};for(let p=n;p<e.length;p++){const S=e[p].trim();if(S.startsWith("element"))if(r){a--;break}else{r=!0,n=p,a=p;const _=S.split(" ");let x=0;for(let T of _){const E=T.trim();E.length>0&&(x++,x===2?c=E:x===3&&(o=parseInt(E)))}}else if(S.startsWith("property")){const _=S.match(/(\w+)\s+(\w+)\s+(\w+)/);if(_){const x=_[2],T=_[3];f.push(T);const E=t[T];h[T]=x;const M=Wl[x];E!==void 0&&(u.push(E),d[E]=M)}}if(S===kt.HeaderEndToken){l=!0;break}r&&(i.push(S),a++)}const g=[];let A=0;for(let p of f){const S=h[p];if(h.hasOwnProperty(p)){const _=t[p];_!==void 0&&(g[_]=A)}A+=Bg[Wl[S]]}const m=kt.decodeSphericalHarmonicsFromSectionHeader(f,t);return{headerLines:i,headerStartLine:n,headerEndLine:a,fieldTypes:d,fieldIds:u,fieldOffsets:g,bytesPerVertex:A,vertexCount:o,dataSizeBytes:A*o,endOfHeader:l,sectionName:c,sphericalHarmonicsDegree:m.degree,sphericalHarmonicsCoefficientsPerChannel:m.coefficientsPerChannel,sphericalHarmonicsDegree1Fields:m.degree1Fields,sphericalHarmonicsDegree2Fields:m.degree2Fields}}static decodeSphericalHarmonicsFromSectionHeader(e,t){let n=0,i=0;for(let l of e)l.startsWith("f_rest")&&n++;i=n/3;let r=0;i>=3&&(r=1),i>=8&&(r=2);let a=[],o=[];for(let l=0;l<3;l++){if(r>=1)for(let c=0;c<3;c++)a.push(t["f_rest_"+(c+i*l)]);if(r>=2)for(let c=0;c<5;c++)o.push(t["f_rest_"+(c+i*l+3)])}return{degree:r,coefficientsPerChannel:i,degree1Fields:a,degree2Fields:o}}static getHeaderSectionNames(e){const t=[];for(let n of e)if(n.startsWith("element")){const i=n.split(" ");let r=0;for(let a of i){const o=a.trim();o.length>0&&(r++,r===2&&t.push(o))}}return t}static checkTextForEndHeader(e){return!!e.includes(kt.HeaderEndToken)}static checkBufferForEndHeader(e,t,n,i){const r=new Uint8Array(e,Math.max(0,t-n),n),a=i.decode(r);return kt.checkTextForEndHeader(a)}static extractHeaderFromBufferToText(e){const t=new TextDecoder;let n=0,i="";const r=100;for(;;){if(n+r>=e.byteLength)throw new Error("End of file reached while searching for end of header");const a=new Uint8Array(e,n,r);if(i+=t.decode(a),n+=r,kt.checkBufferForEndHeader(e,n,r*2,t))break}return i}static readHeaderFromBuffer(e){const t=new TextDecoder;let n=0,i="";const r=100;for(;;){if(n+r>=e.byteLength)throw new Error("End of file reached while searching for end of header");const a=new Uint8Array(e,n,r);if(i+=t.decode(a),n+=r,kt.checkBufferForEndHeader(e,n,r*2,t))break}return i}static convertHeaderTextToLines(e){const t=e.split(`
`),n=[];for(let i=0;i<t.length;i++){const r=t[i].trim();if(n.push(r),r===kt.HeaderEndToken)break}return n}static determineHeaderFormatFromHeaderText(e){const t=kt.convertHeaderTextToLines(e);let n=Ut.INRIAV1;for(let i=0;i<t.length;i++){const r=t[i].trim();if(r.startsWith("element chunk")||r.match(/[A-Za-z]*packed_[A-Za-z]*/))n=Ut.PlayCanvasCompressed;else if(r.startsWith("element codebook_centers"))n=Ut.INRIAV2;else if(r===kt.HeaderEndToken)break}return n}static determineHeaderFormatFromPlyBuffer(e){const t=kt.extractHeaderFromBufferToText(e);return kt.determineHeaderFormatFromHeaderText(t)}static readVertex(e,t,n,i,r,a,o=!0){const l=n*t.bytesPerVertex+i,c=t.fieldOffsets,u=t.fieldTypes;for(let d of r){const f=u[d];f===Mo?a[d]=e.getFloat32(l+c[d],!0):f===Eo?a[d]=e.getInt16(l+c[d],!0):f===Co?a[d]=e.getUint16(l+c[d],!0):f===_o?a[d]=e.getInt32(l+c[d],!0):f===yo?a[d]=e.getUint32(l+c[d],!0):f===To&&(o?a[d]=e.getUint8(l+c[d])/255:a[d]=e.getUint8(l+c[d]))}}};fe(kt,"HeaderEndToken","end_header");let _t=kt;const eu=["scale_0","scale_1","scale_2","rot_0","rot_1","rot_2","rot_3","x","y","z","f_dc_0","f_dc_1","f_dc_2","opacity","red","green","blue","f_rest_0"],Lg=eu.map((s,e)=>e),[Xl,Ug,Ng,Og,zg,Hg,kg,Vg,Gg,Wg,ql,Xg,qg,Ql,Yl,Qg,Yg,Kg]=Lg,Jt=class Jt{static decodeHeaderLines(e){let t=0;e.forEach(u=>{u.includes("f_rest_")&&t++});let n=0;t>=45?n=45:t>=24?n=24:t>=9&&(n=9);let r=Array.from(Array(Math.max(n-1,0))).map((u,d)=>`f_rest_${d+1}`);const a=[...eu,...r],o=a.map((u,d)=>d),l=o.reduce((u,d)=>(u[a[d]]=d,u),{}),c=_t.decodeSectionHeader(e,l,0);return c.splatCount=c.vertexCount,c.bytesPerSplat=c.bytesPerVertex,c.fieldsToReadIndexes=o,c}static decodeHeaderText(e){const t=_t.convertHeaderTextToLines(e),n=Jt.decodeHeaderLines(t);return n.headerText=e,n.headerSizeBytes=e.indexOf(_t.HeaderEndToken)+_t.HeaderEndToken.length+1,n}static decodeHeaderFromBuffer(e){const t=_t.readHeaderFromBuffer(e);return Jt.decodeHeaderText(t)}static findSplatData(e,t){return new DataView(e,t.headerSizeBytes)}static parseToUncompressedSplatBufferSection(e,t,n,i,r,a,o,l=0){l=Math.min(l,e.sphericalHarmonicsDegree);const c=De.CompressionLevels[0].SphericalHarmonicsDegrees[l].BytesPerSplat;for(let u=t;u<=n;u++){const d=Jt.parseToUncompressedSplat(i,u,e,r,l),f=u*c+o;De.writeSplatDataToSectionBuffer(d,a,f,0,l)}}static parseToUncompressedSplatArraySection(e,t,n,i,r,a,o=0){o=Math.min(o,e.sphericalHarmonicsDegree);for(let l=t;l<=n;l++){const c=Jt.parseToUncompressedSplat(i,l,e,r,o);a.addSplat(c)}}static decodeSectionSplatData(e,t,n,i,r=!0){if(i=Math.min(i,n.sphericalHarmonicsDegree),r){const a=new ge(i);for(let o=0;o<t;o++){const l=Jt.parseToUncompressedSplat(e,o,n,0,i);a.addSplat(l)}return a}else{const{splatBuffer:a,splatBufferDataOffsetBytes:o}=De.preallocateUncompressed(t,i);return Jt.parseToUncompressedSplatBufferSection(n,0,t-1,e,0,a.bufferData,o,i),a}}static readSplat(e,t,n,i,r){return _t.readVertex(e,t,n,i,t.fieldsToReadIndexes,r,!0)}static parseToUncompressedSplatArray(e,t=0){const{header:n,splatCount:i,splatData:r}=Kl(e);return Jt.decodeSectionSplatData(r,i,n,t,!0)}static parseToUncompressedSplatBuffer(e,t=0){const{header:n,splatCount:i,splatData:r}=Kl(e);return Jt.decodeSectionSplatData(r,i,n,t,!1)}};fe(Jt,"parseToUncompressedSplat",function(){let e=[];const t=new St,n=ge.OFFSET.X,i=ge.OFFSET.Y,r=ge.OFFSET.Z,a=ge.OFFSET.SCALE0,o=ge.OFFSET.SCALE1,l=ge.OFFSET.SCALE2,c=ge.OFFSET.ROTATION0,u=ge.OFFSET.ROTATION1,d=ge.OFFSET.ROTATION2,f=ge.OFFSET.ROTATION3,h=ge.OFFSET.FDC0,g=ge.OFFSET.FDC1,A=ge.OFFSET.FDC2,m=ge.OFFSET.OPACITY,p=[];for(let S=0;S<45;S++)p[S]=ge.OFFSET.FRC0+S;return function(S,_,x,T=0,E=0){E=Math.min(E,x.sphericalHarmonicsDegree),Jt.readSplat(S,x,_,T,e);const M=ge.createSplat(E);if(e[Xl]!==void 0?(M[a]=Math.exp(e[Xl]),M[o]=Math.exp(e[Ug]),M[l]=Math.exp(e[Ng])):(M[a]=.01,M[o]=.01,M[l]=.01),e[ql]!==void 0){const w=.28209479177387814;M[h]=(.5+w*e[ql])*255,M[g]=(.5+w*e[Xg])*255,M[A]=(.5+w*e[qg])*255}else e[Yl]!==void 0?(M[h]=e[Yl]*255,M[g]=e[Qg]*255,M[A]=e[Yg]*255):(M[h]=0,M[g]=0,M[A]=0);if(e[Ql]!==void 0&&(M[m]=1/(1+Math.exp(-e[Ql]))*255),M[h]=gt(Math.floor(M[h]),0,255),M[g]=gt(Math.floor(M[g]),0,255),M[A]=gt(Math.floor(M[A]),0,255),M[m]=gt(Math.floor(M[m]),0,255),E>=1&&e[Kg]!==void 0){for(let w=0;w<9;w++)M[p[w]]=e[x.sphericalHarmonicsDegree1Fields[w]];if(E>=2)for(let w=0;w<15;w++)M[p[9+w]]=e[x.sphericalHarmonicsDegree2Fields[w]]}return t.set(e[Og],e[zg],e[Hg],e[kg]),t.normalize(),M[c]=t.x,M[u]=t.y,M[d]=t.z,M[f]=t.w,M[n]=e[Vg],M[i]=e[Gg],M[r]=e[Wg],M}}());let Un=Jt;function Kl(s){const e=Un.decodeHeaderFromBuffer(s),t=e.splatCount,n=Un.findSplatData(s,e);return{header:e,splatCount:t,splatData:n}}const tu=["features_dc","features_rest_0","features_rest_1","features_rest_2","features_rest_3","features_rest_4","features_rest_5","features_rest_6","features_rest_7","features_rest_8","features_rest_9","features_rest_10","features_rest_11","features_rest_12","features_rest_13","features_rest_14","opacity","scaling","rotation_re","rotation_im"],Zs=tu.map((s,e)=>e),[$s,jg,Zg,jl,Js,$g,oa]=[0,1,4,16,17,18,19],nu=["scale_0","scale_1","scale_2","rot_0","rot_1","rot_2","rot_3","x","y","z","f_dc_0","f_dc_1","f_dc_2","opacity","red","green","blue","f_rest_0","f_rest_1","f_rest_2","f_rest_3","f_rest_4","f_rest_5","f_rest_6","f_rest_7","f_rest_8","f_rest_9","f_rest_10","f_rest_11","f_rest_12","f_rest_13","f_rest_14","f_rest_15","f_rest_16","f_rest_17","f_rest_18","f_rest_19","f_rest_20","f_rest_21","f_rest_22","f_rest_23","f_rest_24","f_rest_25","f_rest_26","f_rest_27","f_rest_28","f_rest_29","f_rest_30","f_rest_31","f_rest_32","f_rest_33","f_rest_34","f_rest_35","f_rest_36","f_rest_37","f_rest_38","f_rest_39","f_rest_40","f_rest_41","f_rest_42","f_rest_43","f_rest_44","f_rest_45"],Ja=nu.map((s,e)=>e),[Zl,Jg,e0,t0,n0,i0,s0,r0,a0,o0,eo,iu,su,$l]=Ja,Jl=eo,l0=iu,c0=su,er=s=>{const e=(31744&s)>>10,t=1023&s;return(s>>15?-1:1)*(e?e===31?t?NaN:1/0:Math.pow(2,e-15)*(1+t/1024):t/1024*6103515625e-14)},Vt=class Vt{static decodeSectionHeadersFromHeaderLines(e){const t=Ja.reduce((u,d)=>(u[nu[d]]=d,u),{}),n=Zs.reduce((u,d)=>(u[tu[d]]=d,u),{}),i=_t.getHeaderSectionNames(e);let r;for(let u=0;u<i.length;u++)i[u]==="codebook_centers"&&(r=u);let a=0,o=!1;const l=[];let c=0;for(;!o;){let u;c===r?u=_t.decodeSectionHeader(e,n,a):u=_t.decodeSectionHeader(e,t,a),o=u.endOfHeader,a=u.headerEndLine+1,o||(u.splatCount=u.vertexCount,u.bytesPerSplat=u.bytesPerVertex),l.push(u),c++}return l}static decodeSectionHeadersFromHeaderText(e){const t=_t.convertHeaderTextToLines(e);return Vt.decodeSectionHeadersFromHeaderLines(t)}static getSplatCountFromSectionHeaders(e){let t=0;for(let n of e)n.sectionName!=="codebook_centers"&&(t+=n.vertexCount);return t}static decodeHeaderFromHeaderText(e){const t=e.indexOf(_t.HeaderEndToken)+_t.HeaderEndToken.length+1,n=Vt.decodeSectionHeadersFromHeaderText(e),i=Vt.getSplatCountFromSectionHeaders(n);return{headerSizeBytes:t,sectionHeaders:n,splatCount:i}}static decodeHeaderFromBuffer(e){const t=_t.readHeaderFromBuffer(e);return Vt.decodeHeaderFromHeaderText(t)}static findVertexData(e,t,n){let i=t.headerSizeBytes;for(let r=0;r<n&&r<t.sectionHeaders.length;r++){const a=t.sectionHeaders[r];i+=a.dataSizeBytes}return new DataView(e,i,t.sectionHeaders[n].dataSizeBytes)}static decodeCodeBook(e,t){const n=[],i=[];for(let r=0;r<t.vertexCount;r++){_t.readVertex(e,t,r,0,Zs,n);for(let a of Zs){const o=Zs[a];let l=i[o];l||(i[o]=l=[]),l.push(n[a])}}for(let r=0;r<i.length;r++){const a=i[r],o=.28209479177387814;for(let l=0;l<a.length;l++){const c=er(a[l]);r===jl?a[l]=Math.round(1/(1+Math.exp(-c))*255):r===$s?a[l]=Math.round((.5+o*c)*255):r===Js?a[l]=Math.exp(c):a[l]=c}}return i}static decodeSectionSplatData(e,t,n,i,r){r=Math.min(r,n.sphericalHarmonicsDegree);const a=new ge(r);for(let o=0;o<t;o++){const l=Vt.parseToUncompressedSplat(e,o,n,i,0,r);a.addSplat(l)}return a}static readSplat(e,t,n,i,r){return _t.readVertex(e,t,n,i,Ja,r,!1)}static parseToUncompressedSplatArray(e,t=0){const n=[],i=Vt.decodeHeaderFromBuffer(e,t);let r;for(let o=0;o<i.sectionHeaders.length;o++){const l=i.sectionHeaders[o];if(l.sectionName==="codebook_centers"){const c=Vt.findVertexData(e,i,o);r=Vt.decodeCodeBook(c,l)}}for(let o=0;o<i.sectionHeaders.length;o++){const l=i.sectionHeaders[o];if(l.sectionName!=="codebook_centers"){const c=l.vertexCount,u=Vt.findVertexData(e,i,o),d=Vt.decodeSectionSplatData(u,c,l,r,t);n.push(d)}}const a=new ge(t);for(let o of n)for(let l of o.splats)a.addSplat(l);return a}};fe(Vt,"parseToUncompressedSplat",function(){let e=[];const t=new St,n=ge.OFFSET.X,i=ge.OFFSET.Y,r=ge.OFFSET.Z,a=ge.OFFSET.SCALE0,o=ge.OFFSET.SCALE1,l=ge.OFFSET.SCALE2,c=ge.OFFSET.ROTATION0,u=ge.OFFSET.ROTATION1,d=ge.OFFSET.ROTATION2,f=ge.OFFSET.ROTATION3,h=ge.OFFSET.FDC0,g=ge.OFFSET.FDC1,A=ge.OFFSET.FDC2,m=ge.OFFSET.OPACITY,p=[];for(let S=0;S<45;S++)p[S]=ge.OFFSET.FRC0+S;return function(S,_,x,T,E=0,M=0){M=Math.min(M,x.sphericalHarmonicsDegree),Vt.readSplat(S,x,_,E,e);const w=ge.createSplat(M);if(e[Zl]!==void 0?(w[a]=T[Js][e[Zl]],w[o]=T[Js][e[Jg]],w[l]=T[Js][e[e0]]):(w[a]=.01,w[o]=.01,w[l]=.01),e[eo]!==void 0?(w[h]=T[$s][e[eo]],w[g]=T[$s][e[iu]],w[A]=T[$s][e[su]]):e[Jl]!==void 0?(w[h]=e[Jl]*255,w[g]=e[l0]*255,w[A]=e[c0]*255):(w[h]=0,w[g]=0,w[A]=0),e[$l]!==void 0&&(w[m]=T[jl][e[$l]]),w[h]=gt(Math.floor(w[h]),0,255),w[g]=gt(Math.floor(w[g]),0,255),w[A]=gt(Math.floor(w[A]),0,255),w[m]=gt(Math.floor(w[m]),0,255),M>=1&&x.sphericalHarmonicsDegree>=1){for(let F=0;F<9;F++){const B=T[jg+F%3];w[p[F]]=B[e[x.sphericalHarmonicsDegree1Fields[F]]]}if(M>=2&&x.sphericalHarmonicsDegree>=2)for(let F=0;F<15;F++){const B=T[Zg+F%5];w[p[9+F]]=B[e[x.sphericalHarmonicsDegree2Fields[F]]]}}const y=T[$g][e[t0]],v=T[oa][e[n0]],I=T[oa][e[i0]],U=T[oa][e[s0]];return t.set(y,v,I,U),t.normalize(),w[c]=t.x,w[u]=t.y,w[d]=t.z,w[f]=t.w,w[n]=er(e[r0]),w[i]=er(e[a0]),w[r]=er(e[o0]),w}}());let to=Vt;class ec{static parseToUncompressedSplatArray(e,t=0){const n=_t.determineHeaderFormatFromPlyBuffer(e);if(n===Ut.PlayCanvasCompressed)return Fn.parseToUncompressedSplatArray(e,t);if(n===Ut.INRIAV1)return Un.parseToUncompressedSplatArray(e,t);if(n===Ut.INRIAV2)return to.parseToUncompressedSplatArray(e,t)}static parseToUncompressedSplatBuffer(e,t=0){const n=_t.determineHeaderFormatFromPlyBuffer(e);if(n===Ut.PlayCanvasCompressed)return Fn.parseToUncompressedSplatBuffer(e,t);if(n===Ut.INRIAV1)return Un.parseToUncompressedSplatBuffer(e,t);if(n===Ut.INRIAV2)throw new Error("parseToUncompressedSplatBuffer() is not implemented for INRIA V2 PLY files")}}class bo{constructor(e,t,n,i){this.sectionCount=e,this.sectionFilters=t,this.groupingParameters=n,this.partitionGenerator=i}partitionUncompressedSplatArray(e){let t,n,i;if(this.partitionGenerator){const a=this.partitionGenerator(e);t=a.groupingParameters,n=a.sectionCount,i=a.sectionFilters}else t=this.groupingParameters,n=this.sectionCount,i=this.sectionFilters;const r=[];for(let a=0;a<n;a++){const o=new ge(e.sphericalHarmonicsDegree),l=i[a];for(let c=0;c<e.splatCount;c++)l(c)&&o.addSplat(e.splats[c]);r.push(o)}return{splatArrays:r,parameters:t}}static getStandardPartitioner(e=0,t=new P,n=De.BucketBlockSize,i=De.BucketSize){const r=a=>{const o=ge.OFFSET.X,l=ge.OFFSET.Y,c=ge.OFFSET.Z;e<=0&&(e=a.splatCount);const u=new P,d=.5,f=p=>{p.x=Math.floor(p.x/d)*d,p.y=Math.floor(p.y/d)*d,p.z=Math.floor(p.z/d)*d};a.splats.forEach(p=>{u.set(p[o],p[l],p[c]).sub(t),f(u),p.centerDist=u.lengthSq()}),a.splats.sort((p,S)=>{let _=p.centerDist,x=S.centerDist;return _>x?1:-1});const h=[],g=[];e=Math.min(a.splatCount,e);const A=Math.ceil(a.splatCount/e);let m=0;for(let p=0;p<A;p++){let S=m;h.push(_=>_>=S&&_<S+e),g.push({blocksSize:n,bucketSize:i}),m+=e}return{sectionCount:h.length,sectionFilters:h,groupingParameters:g}};return new bo(void 0,void 0,void 0,r)}}class Ts{constructor(e,t,n,i,r,a,o){this.splatPartitioner=e,this.alphaRemovalThreshold=t,this.compressionLevel=n,this.sectionSize=i,this.sceneCenter=r?new P().copy(r):void 0,this.blockSize=a,this.bucketSize=o}generateFromUncompressedSplatArray(e){const t=this.splatPartitioner.partitionUncompressedSplatArray(e);return De.generateFromUncompressedSplatArrays(t.splatArrays,this.alphaRemovalThreshold,this.compressionLevel,this.sceneCenter,this.blockSize,this.bucketSize,t.parameters)}static getStandardGenerator(e=1,t=1,n=0,i=new P,r=De.BucketBlockSize,a=De.BucketSize){const o=bo.getStandardPartitioner(n,i,r,a);return new Ts(o,e,t,n,i,r,a)}}const yt={Downloading:0,Processing:1,Done:2};class mr extends Error{constructor(e){super(e)}}const pt={ProgressiveToSplatBuffer:0,ProgressiveToSplatArray:1,DownloadBeforeProcessing:2};function tc(s,e){let t=0;for(let i of s)t+=i.sizeBytes;(!e||e.byteLength<t)&&(e=new ArrayBuffer(t));let n=0;for(let i of s)new Uint8Array(e,n,i.sizeBytes).set(i.data),n+=i.sizeBytes;return e}function nc(s,e,t,n,i,r,a,o){return e?Ts.getStandardGenerator(t,n,i,r,a,o).generateFromUncompressedSplatArray(s):De.generateFromUncompressedSplatArrays([s],t,0,new P)}class wo{static loadFromURL(e,t,n,i,r,a,o=!0,l=0,c,u,d,f,h){let g;!n&&!o?g=pt.DownloadBeforeProcessing:o?g=pt.ProgressiveToSplatArray:g=pt.ProgressiveToSplatBuffer;const A=Ze.ProgressiveLoadSectionSize,m=De.HeaderSizeBytes+De.SectionHeaderSizeBytes,p=1;let S,_,x,T,E,M=0,w=0,y=0,v=!1,I=!1,U=!1;const F=Ao();let B=0,z=0,N=0,q=0,H="",X=null,ee=[],he;const Re=new TextDecoder,ze=(W,te,le)=>{const se=W>=100;if(le&&(ee.push({data:le,sizeBytes:le.byteLength,startBytes:N,endBytes:N+le.byteLength}),N+=le.byteLength),g===pt.DownloadBeforeProcessing)se&&F.resolve(ee);else{if(v){if(S===Ut.PlayCanvasCompressed&&!I){const Ae=X.headerSizeBytes+X.chunkElement.storageSizeBytes;E=tc(ee,E),E.byteLength>=Ae&&(Fn.readElementData(X.chunkElement,E,X.headerSizeBytes),B=Ae,z=Ae,I=!0)}}else if(H+=Re.decode(le),_t.checkTextForEndHeader(H)){if(S=_t.determineHeaderFormatFromHeaderText(H),S===Ut.INRIAV1)X=Un.decodeHeaderText(H),l=Math.min(l,X.sphericalHarmonicsDegree),M=X.splatCount,I=!0,q=X.headerSizeBytes+X.bytesPerSplat*M;else if(S===Ut.PlayCanvasCompressed){if(X=Fn.decodeHeaderText(H),l=Math.min(l,X.sphericalHarmonicsDegree),g===pt.ProgressiveToSplatBuffer&&l>0)throw new mr("PlyLoader.loadFromURL() -> Selected PLY format has spherical harmonics data that cannot be progressively loaded.");M=X.vertexElement.count,q=X.headerSizeBytes+X.bytesPerSplat*M+X.chunkElement.storageSizeBytes}else{if(g===pt.ProgressiveToSplatBuffer)throw new mr("PlyLoader.loadFromURL() -> Selected PLY format cannot be progressively loaded.");g=pt.DownloadBeforeProcessing;return}if(g===pt.ProgressiveToSplatBuffer){const Ae=De.CompressionLevels[0].SphericalHarmonicsDegrees[l],Ee=m+Ae.BytesPerSplat*M;x=new ArrayBuffer(Ee),De.writeHeaderToBuffer({versionMajor:De.CurrentMajorVersion,versionMinor:De.CurrentMinorVersion,maxSectionCount:p,sectionCount:p,maxSplatCount:M,splatCount:0,compressionLevel:0,sceneCenter:new P},x)}else he=new ge(l);B=X.headerSizeBytes,z=X.headerSizeBytes,v=!0}if(v&&I&&ee.length>0&&(_=tc(ee,_),N-B>A||N>=q&&!U||se)){const Ee=U?X.sphericalHarmonicsPerSplat:X.bytesPerSplat,Ye=(U?N:Math.min(q,N))-z,Ie=Math.floor(Ye/Ee),Be=Ie*Ee,R=N-z-Be,ae=z-ee[0].startBytes,oe=new DataView(_,ae,Be);if(U)S===Ut.PlayCanvasCompressed&&g===pt.ProgressiveToSplatArray&&(Fn.parseSphericalHarmonicsToUncompressedSplatArraySection(X.chunkElement,X.shElement,y,y+Ie-1,oe,0,l,X.sphericalHarmonicsDegree,he),y+=Ie);else{if(g===pt.ProgressiveToSplatBuffer){const de=De.CompressionLevels[0].SphericalHarmonicsDegrees[l],ce=w*de.BytesPerSplat+m;S===Ut.PlayCanvasCompressed?Fn.parseToUncompressedSplatBufferSection(X.chunkElement,X.vertexElement,0,Ie-1,w,oe,x,ce):Un.parseToUncompressedSplatBufferSection(X,0,Ie-1,oe,0,x,ce,l)}else S===Ut.PlayCanvasCompressed?Fn.parseToUncompressedSplatArraySection(X.chunkElement,X.vertexElement,0,Ie-1,w,oe,he):Un.parseToUncompressedSplatArraySection(X,0,Ie-1,oe,0,he,l);w+=Ie,g===pt.ProgressiveToSplatBuffer&&(T||(De.writeSectionHeaderToBuffer({maxSplatCount:M,splatCount:w,bucketSize:0,bucketCount:0,bucketBlockSize:0,compressionScaleRange:0,storageSizeBytes:0,fullBucketCount:0,partiallyFilledBucketCount:0,sphericalHarmonicsDegree:l},0,x,De.HeaderSizeBytes),T=new De(x,!1)),T.updateLoadedCounts(1,w)),N>=q&&(U=!0)}if(R===0)ee=[];else{let de=[],ce=0;for(let Le=ee.length-1;Le>=0;Le--){const re=ee[Le];if(ce+=re.sizeBytes,de.unshift(re),ce>=R)break}ee=de}B+=A,z+=Be}i&&T&&i(T,se),se&&(g===pt.ProgressiveToSplatBuffer?F.resolve(T):F.resolve(he))}t&&t(W,te,yt.Downloading)};return t&&t(0,"0%",yt.Downloading),Cr(e,ze,!1,c).then(()=>(t&&t(0,"0%",yt.Processing),F.promise.then(W=>{if(t&&t(100,"100%",yt.Done),g===pt.DownloadBeforeProcessing){const te=ee.map(le=>le.data);return new Blob(te).arrayBuffer().then(le=>wo.loadFromFileData(le,r,a,o,l,u,d,f,h))}else return g===pt.ProgressiveToSplatBuffer?W:Qt(()=>nc(W,o,r,a,u,d,f,h))})))}static loadFromFileData(e,t,n,i,r=0,a,o,l,c){return i?Qt(()=>ec.parseToUncompressedSplatArray(e,r)).then(u=>nc(u,i,t,n,a,o,l,c)):Qt(()=>ec.parseToUncompressedSplatBuffer(e,r))}}const u0=s=>new ReadableStream({async start(e){e.enqueue(s),e.close()}});async function d0(s){try{const e=u0(s);if(!e)throw new Error("Failed to create stream from data");return await h0(e)}catch(e){throw console.error("Error decompressing gzipped data:",e),e}}async function h0(s){const e=s.pipeThrough(new DecompressionStream("gzip")),n=await new Response(e).arrayBuffer();return new Uint8Array(n)}const f0=1347635022,p0=1,m0=.15;function g0(s){const e=s>>15&1,t=s>>10&31,n=s&1023,i=e===1?-1:1;return t===0?i*Math.pow(2,-14)*n/1024:t===31?n!==0?NaN:i*(1/0):i*Math.pow(2,t-15)*(1+n/1024)}function A0(s){return(s-128)/128}function mi(s){switch(s){case 0:return 0;case 1:return 3;case 2:return 8;case 3:return 15;default:return console.error(`[SPZ: ERROR] Unsupported SH degree: ${s}`),0}}const S0=function(){let s=[];const e=new St,t=ge.OFFSET.X,n=ge.OFFSET.Y,i=ge.OFFSET.Z,r=ge.OFFSET.SCALE0,a=ge.OFFSET.SCALE1,o=ge.OFFSET.SCALE2,l=ge.OFFSET.ROTATION0,c=ge.OFFSET.ROTATION1,u=ge.OFFSET.ROTATION2,d=ge.OFFSET.ROTATION3,f=ge.OFFSET.FDC0,h=ge.OFFSET.FDC1,g=ge.OFFSET.FDC2,A=ge.OFFSET.OPACITY,m=[mi(0),mi(1),mi(2),mi(3)],p=[0,1,2,9,10,11,12,13,24,25,26,27,28,29,30,3,4,5,14,15,16,17,18,31,32,33,34,35,36,37,6,7,8,19,20,21,22,23,38,39,40,41,42,43,44];return function(S,_,x){x=Math.min(_,x);const T=ge.createSplat(x);S.scale[0]!==void 0?(T[r]=S.scale[0],T[a]=S.scale[1],T[o]=S.scale[2]):(T[r]=.01,T[a]=.01,T[o]=.01),S.color[0]!==void 0?(T[f]=S.color[0],T[h]=S.color[1],T[g]=S.color[2]):s[RED]!==void 0?(T[f]=s[RED]*255,T[h]=s[GREEN]*255,T[g]=s[BLUE]*255):(T[f]=0,T[h]=0,T[g]=0),S.alpha!==void 0&&(T[A]=S.alpha),T[f]=gt(Math.floor(T[f]),0,255),T[h]=gt(Math.floor(T[h]),0,255),T[g]=gt(Math.floor(T[g]),0,255),T[A]=gt(Math.floor(T[A]),0,255);let E=m[x],M=m[_];for(let w=0;w<3;++w)for(let y=0;y<15;++y){const v=p[w*15+y];y<E&&y<M&&(T[ge.OFFSET.FRC0+v]=S.sh[w*M+y])}return e.set(S.rotation[3],S.rotation[0],S.rotation[1],S.rotation[2]),e.normalize(),T[l]=e.x,T[c]=e.y,T[u]=e.z,T[d]=e.w,T[t]=S.position[0],T[n]=S.position[1],T[i]=S.position[2],T}}();function x0(s,e,t,n){return!(s.positions.length!==e*3*(n?2:3)||s.scales.length!==e*3||s.rotations.length!==e*3||s.alphas.length!==e||s.colors.length!==e*3||s.sh.length!==e*t*3)}function ic(s,e,t,n,i){e=Math.min(e,s.shDegree);const r=s.numPoints,a=mi(s.shDegree),o=s.positions.length===r*3*2;if(!x0(s,r,a,o))return null;const l={position:[],scale:[],rotation:[],alpha:void 0,color:[],sh:[]};let c;o&&(c=new Uint16Array(s.positions.buffer,s.positions.byteOffset,r*3));const u=1/(1<<s.fractionalBits),d=mi(s.shDegree),f=.28209479177387814;for(let h=0;h<r;h++){if(o)for(let S=0;S<3;S++)l.position[S]=g0(c[h*3+S]);else for(let S=0;S<3;S++){const _=h*9+S*3;let x=s.positions[_];x|=s.positions[_+1]<<8,x|=s.positions[_+2]<<16,x|=x&8388608?4278190080:0,l.position[S]=x*u}for(let S=0;S<3;S++)l.scale[S]=Math.exp(s.scales[h*3+S]/16-10);const g=s.rotations.subarray(h*3,h*3+3),A=[g[0]/127.5-1,g[1]/127.5-1,g[2]/127.5-1];l.rotation[0]=A[0],l.rotation[1]=A[1],l.rotation[2]=A[2];const m=A[0]*A[0]+A[1]*A[1]+A[2]*A[2];l.rotation[3]=Math.sqrt(Math.max(0,1-m)),l.alpha=Math.floor(s.alphas[h]);for(let S=0;S<3;S++)l.color[S]=Math.floor(((s.colors[h*3+S]/255-.5)/m0*f+.5)*255);for(let S=0;S<3;S++)for(let _=0;_<d;_++)l.sh[S*d+_]=A0(s.sh[d*3*h+_*3+S]);const p=S0(l,s.shDegree,e);if(t){const S=De.CompressionLevels[0].SphericalHarmonicsDegrees[e].BytesPerSplat,_=h*S+i;De.writeSplatDataToSectionBuffer(p,n,_,0,e)}else n.addSplat(p)}}const v0=16,_0=1e7;function y0(s){const e=new DataView(s);let t=0;const n={magic:e.getUint32(t,!0),version:e.getUint32(t+4,!0),numPoints:e.getUint32(t+8,!0),shDegree:e.getUint8(t+12),fractionalBits:e.getUint8(t+13),flags:e.getUint8(t+14),reserved:e.getUint8(t+15)};if(t+=v0,n.magic!==f0)return console.error("[SPZ ERROR] deserializePackedGaussians: header not found"),null;if(n.version<1||n.version>2)return console.error(`[SPZ ERROR] deserializePackedGaussians: version not supported: ${n.version}`),null;if(n.numPoints>_0)return console.error(`[SPZ ERROR] deserializePackedGaussians: Too many points: ${n.numPoints}`),null;if(n.shDegree>3)return console.error(`[SPZ ERROR] deserializePackedGaussians: Unsupported SH degree: ${n.shDegree}`),null;const i=n.numPoints,r=mi(n.shDegree),a=n.version===1,o={numPoints:i,shDegree:n.shDegree,fractionalBits:n.fractionalBits,antialiased:(n.flags&p0)!==0,positions:new Uint8Array(i*3*(a?2:3)),scales:new Uint8Array(i*3),rotations:new Uint8Array(i*3),alphas:new Uint8Array(i),colors:new Uint8Array(i*3),sh:new Uint8Array(i*r*3)};try{const l=new Uint8Array(s);let c=o.positions.length,u=t;if(o.positions.set(l.slice(u,u+c)),u+=c,o.alphas.set(l.slice(u,u+o.alphas.length)),u+=o.alphas.length,o.colors.set(l.slice(u,u+o.colors.length)),u+=o.colors.length,o.scales.set(l.slice(u,u+o.scales.length)),u+=o.scales.length,o.rotations.set(l.slice(u,u+o.rotations.length)),u+=o.rotations.length,o.sh.set(l.slice(u,u+o.sh.length)),u+o.sh.length!==s.byteLength)return console.error("[SPZ ERROR] deserializePackedGaussians: incorrect buffer size"),null}catch(l){return console.error("[SPZ ERROR] deserializePackedGaussians: read error",l),null}return o}async function M0(s){try{const e=await d0(s);return y0(e.buffer)}catch(e){return console.error("[SPZ ERROR] loadSpzPacked: decompression error",e),null}}class Ro{static loadFromURL(e,t,n,i,r=!0,a=0,o,l,c,u,d){return t&&t(0,"0%",yt.Downloading),Cr(e,t,!0,o).then(f=>(t&&t(0,"0%",yt.Processing),Ro.loadFromFileData(f,n,i,r,a,l,c,u,d)))}static async loadFromFileData(e,t,n,i,r=0,a,o,l,c){await Qt();const u=await M0(e);r=Math.min(u.shDegree,r);const d=new ge(r);if(i)return ic(u,r,!1,d,0),Ts.getStandardGenerator(t,n,a,o,l,c).generateFromUncompressedSplatArray(d);{const{splatBuffer:f,splatBufferDataOffsetBytes:h}=De.preallocateUncompressed(u.numPoints,r);return ic(u,r,!0,f.bufferData,h),f}}}const ot=class ot{static parseToUncompressedSplatBufferSection(e,t,n,i,r,a){const o=De.CompressionLevels[0].BytesPerCenter,l=De.CompressionLevels[0].BytesPerScale,c=De.CompressionLevels[0].BytesPerRotation,u=De.CompressionLevels[0].SphericalHarmonicsDegrees[0].BytesPerSplat;for(let d=e;d<=t;d++){const f=d*ot.RowSizeBytes+i,h=new Float32Array(n,f,3),g=new Float32Array(n,f+ot.CenterSizeBytes,3),A=new Uint8Array(n,f+ot.CenterSizeBytes+ot.ScaleSizeBytes,4),m=new Uint8Array(n,f+ot.CenterSizeBytes+ot.ScaleSizeBytes+ot.RotationSizeBytes,4),p=new St((m[1]-128)/128,(m[2]-128)/128,(m[3]-128)/128,(m[0]-128)/128);p.normalize();const S=d*u+a,_=new Float32Array(r,S,3),x=new Float32Array(r,S+o,3),T=new Float32Array(r,S+o+l,4),E=new Uint8Array(r,S+o+l+c,4);_[0]=h[0],_[1]=h[1],_[2]=h[2],x[0]=g[0],x[1]=g[1],x[2]=g[2],T[0]=p.w,T[1]=p.x,T[2]=p.y,T[3]=p.z,E[0]=A[0],E[1]=A[1],E[2]=A[2],E[3]=A[3]}}static parseToUncompressedSplatArraySection(e,t,n,i,r){for(let a=e;a<=t;a++){const o=a*ot.RowSizeBytes+i,l=new Float32Array(n,o,3),c=new Float32Array(n,o+ot.CenterSizeBytes,3),u=new Uint8Array(n,o+ot.CenterSizeBytes+ot.ScaleSizeBytes,4),d=new Uint8Array(n,o+ot.CenterSizeBytes+ot.ScaleSizeBytes+ot.RotationSizeBytes,4),f=new St((d[1]-128)/128,(d[2]-128)/128,(d[3]-128)/128,(d[0]-128)/128);f.normalize(),r.addSplatFromComonents(l[0],l[1],l[2],c[0],c[1],c[2],f.w,f.x,f.y,f.z,u[0],u[1],u[2],u[3])}}static parseStandardSplatToUncompressedSplatArray(e){const t=e.byteLength/ot.RowSizeBytes,n=new ge;for(let i=0;i<t;i++){const r=i*ot.RowSizeBytes,a=new Float32Array(e,r,3),o=new Float32Array(e,r+ot.CenterSizeBytes,3),l=new Uint8Array(e,r+ot.CenterSizeBytes+ot.ScaleSizeBytes,4),c=new Uint8Array(e,r+ot.CenterSizeBytes+ot.ScaleSizeBytes+ot.ColorSizeBytes,4),u=new St((c[1]-128)/128,(c[2]-128)/128,(c[3]-128)/128,(c[0]-128)/128);u.normalize(),n.addSplatFromComonents(a[0],a[1],a[2],o[0],o[1],o[2],u.w,u.x,u.y,u.z,l[0],l[1],l[2],l[3])}return n}};fe(ot,"RowSizeBytes",32),fe(ot,"CenterSizeBytes",12),fe(ot,"ScaleSizeBytes",12),fe(ot,"RotationSizeBytes",4),fe(ot,"ColorSizeBytes",4);let di=ot;function sc(s,e,t,n,i,r,a,o){return e?Ts.getStandardGenerator(t,n,i,r,a,o).generateFromUncompressedSplatArray(s):De.generateFromUncompressedSplatArrays([s],t,0,new P)}class Io{static loadFromURL(e,t,n,i,r,a,o=!0,l,c,u,d,f){let h=n?pt.ProgressiveToSplatBuffer:pt.ProgressiveToSplatArray;o&&(h=pt.ProgressiveToSplatArray);const g=De.HeaderSizeBytes+De.SectionHeaderSizeBytes,A=Ze.ProgressiveLoadSectionSize,m=1;let p,S,_,x=0,T=0,E;const M=Ao();let w=0,y=0,v=[];const I=(U,F,B,z)=>{const N=U>=100;if(B&&v.push(B),h===pt.DownloadBeforeProcessing){N&&M.resolve(v);return}if(!z){if(n)throw new mr("Cannon directly load .splat because no file size info is available.");h=pt.DownloadBeforeProcessing;return}if(!p){x=z/di.RowSizeBytes,p=new ArrayBuffer(z);const q=De.CompressionLevels[0].SphericalHarmonicsDegrees[0].BytesPerSplat,H=g+q*x;h===pt.ProgressiveToSplatBuffer?(S=new ArrayBuffer(H),De.writeHeaderToBuffer({versionMajor:De.CurrentMajorVersion,versionMinor:De.CurrentMinorVersion,maxSectionCount:m,sectionCount:m,maxSplatCount:x,splatCount:T,compressionLevel:0,sceneCenter:new P},S)):E=new ge(0)}if(B){new Uint8Array(p,y,B.byteLength).set(new Uint8Array(B)),y+=B.byteLength;const q=y-w;if(q>A||N){const X=(N?q:A)/di.RowSizeBytes,ee=T+X;h===pt.ProgressiveToSplatBuffer?di.parseToUncompressedSplatBufferSection(T,ee-1,p,0,S,g):di.parseToUncompressedSplatArraySection(T,ee-1,p,0,E),T=ee,h===pt.ProgressiveToSplatBuffer&&(_||(De.writeSectionHeaderToBuffer({maxSplatCount:x,splatCount:T,bucketSize:0,bucketCount:0,bucketBlockSize:0,compressionScaleRange:0,storageSizeBytes:0,fullBucketCount:0,partiallyFilledBucketCount:0},0,S,De.HeaderSizeBytes),_=new De(S,!1)),_.updateLoadedCounts(1,T),i&&i(_,N)),w+=A}}N&&(h===pt.ProgressiveToSplatBuffer?M.resolve(_):M.resolve(E)),t&&t(U,F,yt.Downloading)};return t&&t(0,"0%",yt.Downloading),Cr(e,I,!1,l).then(()=>(t&&t(0,"0%",yt.Processing),M.promise.then(U=>(t&&t(100,"100%",yt.Done),h===pt.DownloadBeforeProcessing?new Blob(v).arrayBuffer().then(F=>Io.loadFromFileData(F,r,a,o,c,u,d,f)):h===pt.ProgressiveToSplatBuffer?U:Qt(()=>sc(U,o,r,a,c,u,d,f))))))}static loadFromFileData(e,t,n,i,r,a,o,l){return Qt(()=>{const c=di.parseStandardSplatToUncompressedSplatArray(e);return sc(c,i,t,n,r,a,o,l)})}}const ki=class ki{static checkVersion(e){const t=De.CurrentMajorVersion,n=De.CurrentMinorVersion,i=De.parseHeader(e);if(i.versionMajor===t&&i.versionMinor>=n||i.versionMajor>t)return!0;throw new Error(`KSplat version not supported: v${i.versionMajor}.${i.versionMinor}. Minimum required: v${t}.${n}`)}static loadFromURL(e,t,n,i,r){let a,o,l,c,u=!1,d=!1,f,h=[],g=!1,A=!1,m=0,p=0,S=0,_=!1,x=!1,T=!1,E=[];const M=Ao(),w=()=>{!u&&!d&&m>=De.HeaderSizeBytes&&(d=!0,new Blob(E).arrayBuffer().then(z=>{l=new ArrayBuffer(De.HeaderSizeBytes),new Uint8Array(l).set(new Uint8Array(z,0,De.HeaderSizeBytes)),ki.checkVersion(l),d=!1,u=!0,c=De.parseHeader(l),window.setTimeout(()=>{I()},1)}))};let y=0;const v=()=>{y===0&&(y++,window.setTimeout(()=>{y--,U()},1))},I=()=>{const B=()=>{A=!0,new Blob(E).arrayBuffer().then(N=>{A=!1,g=!0,f=new ArrayBuffer(c.maxSectionCount*De.SectionHeaderSizeBytes),new Uint8Array(f).set(new Uint8Array(N,De.HeaderSizeBytes,c.maxSectionCount*De.SectionHeaderSizeBytes)),h=De.parseSectionHeaders(c,f,0,!1);let q=0;for(let X=0;X<c.maxSectionCount;X++)q+=h[X].storageSizeBytes;const H=De.HeaderSizeBytes+c.maxSectionCount*De.SectionHeaderSizeBytes+q;if(!a){a=new ArrayBuffer(H);let X=0;for(let ee=0;ee<E.length;ee++){const he=E[ee];new Uint8Array(a,X,he.byteLength).set(new Uint8Array(he)),X+=he.byteLength}}S=De.HeaderSizeBytes+De.SectionHeaderSizeBytes*c.maxSectionCount;for(let X=0;X<=h.length&&X<c.maxSectionCount;X++)S+=h[X].storageSizeBytes;v()})};!A&&!g&&u&&m>=De.HeaderSizeBytes+De.SectionHeaderSizeBytes*c.maxSectionCount&&B()},U=()=>{if(T)return;T=!0;const B=()=>{if(T=!1,g){if(x)return;if(_=m>=S,m-p>Ze.ProgressiveLoadSectionSize||_){p+=Ze.ProgressiveLoadSectionSize,x=p>=S,o||(o=new De(a,!1));const N=De.HeaderSizeBytes+De.SectionHeaderSizeBytes*c.maxSectionCount;let q=0,H=0,X=0;for(let Re=0;Re<c.maxSectionCount;Re++){const ze=h[Re],W=q+ze.partiallyFilledBucketCount*4+ze.bucketStorageSizeBytes*ze.bucketCount,te=N+W;if(p>=te){H++;const le=p-te,Ee=De.CompressionLevels[c.compressionLevel].SphericalHarmonicsDegrees[ze.sphericalHarmonicsDegree].BytesPerSplat;let be=Math.floor(le/Ee);be=Math.min(be,ze.maxSplatCount),X+=be,o.updateLoadedCounts(H,X),o.updateSectionLoadedCounts(Re,be)}else break;q+=ze.storageSizeBytes}i(o,x);const ee=p/S*100,he=ee.toFixed(2)+"%";t&&t(ee,he,yt.Downloading),x?M.resolve(o):U()}}};window.setTimeout(B,Ze.ProgressiveLoadSectionDelayDuration)};return Cr(e,(B,z,N)=>{N&&(E.push(N),a&&new Uint8Array(a,m,N.byteLength).set(new Uint8Array(N)),m+=N.byteLength),n?(w(),I(),U()):t&&t(B,z,yt.Downloading)},!n,r).then(B=>(t&&t(0,"0%",yt.Processing),(n?M.promise:ki.loadFromFileData(B)).then(N=>(t&&t(100,"100%",yt.Done),N))))}static loadFromFileData(e){return Qt(()=>(ki.checkVersion(e),new De(e)))}};fe(ki,"downloadFile",function(){let e;return function(t,n){const i=new Blob([t.bufferData],{type:"application/octet-stream"});e||(e=document.createElement("a"),document.body.appendChild(e)),e.download=n,e.href=URL.createObjectURL(i),e.click()}}());let no=ki;const Lt={Splat:0,KSplat:1,Ply:2,Spz:3},rc=s=>s.endsWith(".ply")?Lt.Ply:s.endsWith(".splat")?Lt.Splat:s.endsWith(".ksplat")?Lt.KSplat:s.endsWith(".spz")?Lt.Spz:null,ac={type:"change"},la={type:"start"},oc={type:"end"},tr=new Lc,lc=new Yn,E0=Math.cos(70*Dc.DEG2RAD);class nr extends Si{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"KeyA",UP:"KeyW",RIGHT:"KeyD",BOTTOM:"KeyS"},this.mouseButtons={LEFT:vi.ROTATE,MIDDLE:vi.DOLLY,RIGHT:vi.PAN},this.touches={ONE:_i.ROTATE,TWO:_i.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",$),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",$),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,this.clearDampedRotation(),this.clearDampedPan(),n.object.updateProjectionMatrix(),n.dispatchEvent(ac),n.update(),r=i.NONE},this.clearDampedRotation=function(){l.theta=0,l.phi=0},this.clearDampedPan=function(){u.set(0,0,0)},this.update=function(){const L=new P,ie=new St().setFromUnitVectors(e.up,new P(0,1,0)),we=ie.clone().invert(),me=new P,ke=new St,We=new P,$e=2*Math.PI;return function(){ie.setFromUnitVectors(e.up,new P(0,1,0)),we.copy(ie).invert();const _e=n.object.position;L.copy(_e).sub(n.target),L.applyQuaternion(ie),o.setFromVector3(L),n.autoRotate&&r===i.NONE&&I(y()),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let K=n.minAzimuthAngle,J=n.maxAzimuthAngle;isFinite(K)&&isFinite(J)&&(K<-Math.PI?K+=$e:K>Math.PI&&(K-=$e),J<-Math.PI?J+=$e:J>Math.PI&&(J-=$e),K<=J?o.theta=Math.max(K,Math.min(J,o.theta)):o.theta=o.theta>(K+J)/2?Math.max(K,o.theta):Math.min(J,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.zoomToCursor&&E||n.object.isOrthographicCamera?o.radius=X(o.radius):o.radius=X(o.radius*c),L.setFromSpherical(o),L.applyQuaternion(we),_e.copy(n.target).add(L),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0));let Me=!1;if(n.zoomToCursor&&E){let xe=null;if(n.object.isPerspectiveCamera){const Xe=L.length();xe=X(Xe*c);const ut=Xe-xe;n.object.position.addScaledVector(x,ut),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const Xe=new P(T.x,T.y,0);Xe.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Me=!0;const ut=new P(T.x,T.y,0);ut.unproject(n.object),n.object.position.sub(ut).add(Xe),n.object.updateMatrixWorld(),xe=L.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;xe!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(xe).add(n.object.position):(tr.origin.copy(n.object.position),tr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(tr.direction))<E0?e.lookAt(n.target):(lc.setFromNormalAndCoplanarPoint(n.object.up,n.target),tr.intersectPlane(lc,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Me=!0);return c=1,E=!1,Me||me.distanceToSquared(n.object.position)>a||8*(1-ke.dot(n.object.quaternion))>a||We.distanceToSquared(n.target)>0?(n.dispatchEvent(ac),me.copy(n.object.position),ke.copy(n.object.quaternion),We.copy(n.target),Me=!1,!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Pe),n.domElement.removeEventListener("pointerdown",ce),n.domElement.removeEventListener("pointercancel",re),n.domElement.removeEventListener("wheel",O),n.domElement.removeEventListener("pointermove",Le),n.domElement.removeEventListener("pointerup",re),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",$),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const a=1e-6,o=new Hl,l=new Hl;let c=1;const u=new P,d=new Fe,f=new Fe,h=new Fe,g=new Fe,A=new Fe,m=new Fe,p=new Fe,S=new Fe,_=new Fe,x=new P,T=new Fe;let E=!1;const M=[],w={};function y(){return 2*Math.PI/60/60*n.autoRotateSpeed}function v(){return Math.pow(.95,n.zoomSpeed)}function I(L){l.theta-=L}function U(L){l.phi-=L}const F=function(){const L=new P;return function(we,me){L.setFromMatrixColumn(me,0),L.multiplyScalar(-we),u.add(L)}}(),B=function(){const L=new P;return function(we,me){n.screenSpacePanning===!0?L.setFromMatrixColumn(me,1):(L.setFromMatrixColumn(me,0),L.crossVectors(n.object.up,L)),L.multiplyScalar(we),u.add(L)}}(),z=function(){const L=new P;return function(we,me){const ke=n.domElement;if(n.object.isPerspectiveCamera){const We=n.object.position;L.copy(We).sub(n.target);let $e=L.length();$e*=Math.tan(n.object.fov/2*Math.PI/180),F(2*we*$e/ke.clientHeight,n.object.matrix),B(2*me*$e/ke.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(F(we*(n.object.right-n.object.left)/n.object.zoom/ke.clientWidth,n.object.matrix),B(me*(n.object.top-n.object.bottom)/n.object.zoom/ke.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function N(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function H(L){if(!n.zoomToCursor)return;E=!0;const ie=n.domElement.getBoundingClientRect(),we=L.clientX-ie.left,me=L.clientY-ie.top,ke=ie.width,We=ie.height;T.x=we/ke*2-1,T.y=-(me/We)*2+1,x.set(T.x,T.y,1).unproject(e).sub(e.position).normalize()}function X(L){return Math.max(n.minDistance,Math.min(n.maxDistance,L))}function ee(L){d.set(L.clientX,L.clientY)}function he(L){H(L),p.set(L.clientX,L.clientY)}function Re(L){g.set(L.clientX,L.clientY)}function ze(L){f.set(L.clientX,L.clientY),h.subVectors(f,d).multiplyScalar(n.rotateSpeed);const ie=n.domElement;I(2*Math.PI*h.x/ie.clientHeight),U(2*Math.PI*h.y/ie.clientHeight),d.copy(f),n.update()}function W(L){S.set(L.clientX,L.clientY),_.subVectors(S,p),_.y>0?N(v()):_.y<0&&q(v()),p.copy(S),n.update()}function te(L){A.set(L.clientX,L.clientY),m.subVectors(A,g).multiplyScalar(n.panSpeed),z(m.x,m.y),g.copy(A),n.update()}function le(L){H(L),L.deltaY<0?q(v()):L.deltaY>0&&N(v()),n.update()}function se(L){let ie=!1;switch(L.code){case n.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?U(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(0,n.keyPanSpeed),ie=!0;break;case n.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?U(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(0,-n.keyPanSpeed),ie=!0;break;case n.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?I(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(n.keyPanSpeed,0),ie=!0;break;case n.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?I(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(-n.keyPanSpeed,0),ie=!0;break}ie&&(L.preventDefault(),n.update())}function Ae(){if(M.length===1)d.set(M[0].pageX,M[0].pageY);else{const L=.5*(M[0].pageX+M[1].pageX),ie=.5*(M[0].pageY+M[1].pageY);d.set(L,ie)}}function Ee(){if(M.length===1)g.set(M[0].pageX,M[0].pageY);else{const L=.5*(M[0].pageX+M[1].pageX),ie=.5*(M[0].pageY+M[1].pageY);g.set(L,ie)}}function be(){const L=M[0].pageX-M[1].pageX,ie=M[0].pageY-M[1].pageY,we=Math.sqrt(L*L+ie*ie);p.set(0,we)}function Ye(){n.enableZoom&&be(),n.enablePan&&Ee()}function Ie(){n.enableZoom&&be(),n.enableRotate&&Ae()}function Be(L){if(M.length==1)f.set(L.pageX,L.pageY);else{const we=ue(L),me=.5*(L.pageX+we.x),ke=.5*(L.pageY+we.y);f.set(me,ke)}h.subVectors(f,d).multiplyScalar(n.rotateSpeed);const ie=n.domElement;I(2*Math.PI*h.x/ie.clientHeight),U(2*Math.PI*h.y/ie.clientHeight),d.copy(f)}function R(L){if(M.length===1)A.set(L.pageX,L.pageY);else{const ie=ue(L),we=.5*(L.pageX+ie.x),me=.5*(L.pageY+ie.y);A.set(we,me)}m.subVectors(A,g).multiplyScalar(n.panSpeed),z(m.x,m.y),g.copy(A)}function ae(L){const ie=ue(L),we=L.pageX-ie.x,me=L.pageY-ie.y,ke=Math.sqrt(we*we+me*me);S.set(0,ke),_.set(0,Math.pow(S.y/p.y,n.zoomSpeed)),N(_.y),p.copy(S)}function oe(L){n.enableZoom&&ae(L),n.enablePan&&R(L)}function de(L){n.enableZoom&&ae(L),n.enableRotate&&Be(L)}function ce(L){n.enabled!==!1&&(M.length===0&&(n.domElement.setPointerCapture(L.pointerId),n.domElement.addEventListener("pointermove",Le),n.domElement.addEventListener("pointerup",re)),ve(L),L.pointerType==="touch"?ne(L):D(L))}function Le(L){n.enabled!==!1&&(L.pointerType==="touch"?Z(L):C(L))}function re(L){Te(L),M.length===0&&(n.domElement.releasePointerCapture(L.pointerId),n.domElement.removeEventListener("pointermove",Le),n.domElement.removeEventListener("pointerup",re)),n.dispatchEvent(oc),r=i.NONE}function D(L){let ie;switch(L.button){case 0:ie=n.mouseButtons.LEFT;break;case 1:ie=n.mouseButtons.MIDDLE;break;case 2:ie=n.mouseButtons.RIGHT;break;default:ie=-1}switch(ie){case vi.DOLLY:if(n.enableZoom===!1)return;he(L),r=i.DOLLY;break;case vi.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enablePan===!1)return;Re(L),r=i.PAN}else{if(n.enableRotate===!1)return;ee(L),r=i.ROTATE}break;case vi.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enableRotate===!1)return;ee(L),r=i.ROTATE}else{if(n.enablePan===!1)return;Re(L),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(la)}function C(L){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;ze(L);break;case i.DOLLY:if(n.enableZoom===!1)return;W(L);break;case i.PAN:if(n.enablePan===!1)return;te(L);break}}function O(L){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(L.preventDefault(),n.dispatchEvent(la),le(L),n.dispatchEvent(oc))}function $(L){n.enabled===!1||n.enablePan===!1||se(L)}function ne(L){switch(qe(L),M.length){case 1:switch(n.touches.ONE){case _i.ROTATE:if(n.enableRotate===!1)return;Ae(),r=i.TOUCH_ROTATE;break;case _i.PAN:if(n.enablePan===!1)return;Ee(),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case _i.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ye(),r=i.TOUCH_DOLLY_PAN;break;case _i.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ie(),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(la)}function Z(L){switch(qe(L),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Be(L),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;R(L),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;oe(L),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;de(L),n.update();break;default:r=i.NONE}}function Pe(L){n.enabled!==!1&&L.preventDefault()}function ve(L){M.push(L)}function Te(L){delete w[L.pointerId];for(let ie=0;ie<M.length;ie++)if(M[ie].pointerId==L.pointerId){M.splice(ie,1);return}}function qe(L){let ie=w[L.pointerId];ie===void 0&&(ie=new Fe,w[L.pointerId]=ie),ie.set(L.pageX,L.pageY)}function ue(L){const ie=L.pointerId===M[0].pointerId?M[1]:M[0];return w[ie.pointerId]}n.domElement.addEventListener("contextmenu",Pe),n.domElement.addEventListener("pointerdown",ce),n.domElement.addEventListener("pointercancel",re),n.domElement.addEventListener("wheel",O,{passive:!1}),this.update()}}const C0=(s,e,t,n,i)=>{const r=performance.now();let a=s.style.display==="none"?0:parseFloat(s.style.opacity);isNaN(a)&&(a=1);const o=window.setInterval(()=>{const c=performance.now()-r;let u=Math.min(c/n,1);u>.999&&(u=1);let d;e?(d=(1-u)*a,d<1e-4&&(d=0)):d=(1-a)*u+a,d>0?(s.style.display=t,s.style.opacity=d):s.style.display="none",u>=1&&(i&&i(),window.clearInterval(o))},16);return o},T0=500,Sr=class Sr{constructor(e,t){this.taskIDGen=0,this.elementID=Sr.elementIDGen++,this.tasks=[],this.message=e||"Loading...",this.container=t||document.body,this.spinnerContainerOuter=document.createElement("div"),this.spinnerContainerOuter.className=`spinnerOuterContainer${this.elementID}`,this.spinnerContainerOuter.style.display="none",this.spinnerContainerPrimary=document.createElement("div"),this.spinnerContainerPrimary.className=`spinnerContainerPrimary${this.elementID}`,this.spinnerPrimary=document.createElement("div"),this.spinnerPrimary.classList.add(`spinner${this.elementID}`,`spinnerPrimary${this.elementID}`),this.messageContainerPrimary=document.createElement("div"),this.messageContainerPrimary.classList.add(`messageContainer${this.elementID}`,`messageContainerPrimary${this.elementID}`),this.messageContainerPrimary.innerHTML=this.message,this.spinnerContainerMin=document.createElement("div"),this.spinnerContainerMin.className=`spinnerContainerMin${this.elementID}`,this.spinnerMin=document.createElement("div"),this.spinnerMin.classList.add(`spinner${this.elementID}`,`spinnerMin${this.elementID}`),this.messageContainerMin=document.createElement("div"),this.messageContainerMin.classList.add(`messageContainer${this.elementID}`,`messageContainerMin${this.elementID}`),this.messageContainerMin.innerHTML=this.message,this.spinnerContainerPrimary.appendChild(this.spinnerPrimary),this.spinnerContainerPrimary.appendChild(this.messageContainerPrimary),this.spinnerContainerOuter.appendChild(this.spinnerContainerPrimary),this.spinnerContainerMin.appendChild(this.spinnerMin),this.spinnerContainerMin.appendChild(this.messageContainerMin),this.spinnerContainerOuter.appendChild(this.spinnerContainerMin);const n=document.createElement("style");n.innerHTML=`

            .spinnerOuterContainer${this.elementID} {
                width: 100%;
                height: 100%;
                margin: 0;
                top: 0;
                left: 0;
                position: absolute;
                pointer-events: none;
            }

            .messageContainer${this.elementID} {
                height: 20px;
                font-family: arial;
                font-size: 12pt;
                color: #ffffff;
                text-align: center;
                vertical-align: middle;
            }

            .spinner${this.elementID} {
                padding: 15px;
                background: #07e8d6;
                z-index:99999;
            
                aspect-ratio: 1;
                border-radius: 50%;
                --_m: 
                    conic-gradient(#0000,#000),
                    linear-gradient(#000 0 0) content-box;
                -webkit-mask: var(--_m);
                    mask: var(--_m);
                -webkit-mask-composite: source-out;
                    mask-composite: subtract;
                box-sizing: border-box;
                animation: load 1s linear infinite;
            }

            .spinnerContainerPrimary${this.elementID} {
                z-index:99999;
                background-color: rgba(128, 128, 128, 0.75);
                border: #666666 1px solid;
                border-radius: 5px;
                padding-top: 20px;
                padding-bottom: 10px;
                margin: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-80px, -80px);
                width: 180px;
                pointer-events: auto;
            }

            .spinnerPrimary${this.elementID} {
                width: 120px;
                margin-left: 30px;
            }

            .messageContainerPrimary${this.elementID} {
                padding-top: 15px;
            }

            .spinnerContainerMin${this.elementID} {
                z-index:99999;
                background-color: rgba(128, 128, 128, 0.75);
                border: #666666 1px solid;
                border-radius: 5px;
                padding-top: 20px;
                padding-bottom: 15px;
                margin: 0;
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translate(-50%, 0);
                display: flex;
                flex-direction: left;
                pointer-events: auto;
                min-width: 250px;
            }

            .messageContainerMin${this.elementID} {
                margin-right: 15px;
            }

            .spinnerMin${this.elementID} {
                width: 50px;
                height: 50px;
                margin-left: 15px;
                margin-right: 25px;
            }

            .messageContainerMin${this.elementID} {
                padding-top: 15px;
            }
            
            @keyframes load {
                to{transform: rotate(1turn)}
            }

        `,this.spinnerContainerOuter.appendChild(n),this.container.appendChild(this.spinnerContainerOuter),this.setMinimized(!1,!0),this.fadeTransitions=[]}addTask(e){const t={message:e,id:this.taskIDGen++};return this.tasks.push(t),this.update(),t.id}removeTask(e){let t=0;for(let n of this.tasks){if(n.id===e){this.tasks.splice(t,1);break}t++}this.update()}removeAllTasks(){this.tasks=[],this.update()}setMessageForTask(e,t){for(let n of this.tasks)if(n.id===e){n.message=t;break}this.update()}update(){this.tasks.length>0?(this.show(),this.setMessage(this.tasks[this.tasks.length-1].message)):this.hide()}show(){this.spinnerContainerOuter.style.display="block",this.visible=!0}hide(){this.spinnerContainerOuter.style.display="none",this.visible=!1}setContainer(e){this.container&&this.spinnerContainerOuter.parentElement===this.container&&this.container.removeChild(this.spinnerContainerOuter),e&&(this.container=e,this.container.appendChild(this.spinnerContainerOuter),this.spinnerContainerOuter.style.zIndex=this.container.style.zIndex+1)}setMinimized(e,t){const n=(i,r,a,o,l)=>{a?i.style.display=r?o:"none":this.fadeTransitions[l]=C0(i,!r,o,T0,()=>{this.fadeTransitions[l]=null})};n(this.spinnerContainerPrimary,!e,t,"block",0),n(this.spinnerContainerMin,e,t,"flex",1),this.minimized=e}setMessage(e){this.messageContainerPrimary.innerHTML=e,this.messageContainerMin.innerHTML=e}};fe(Sr,"elementIDGen",0);let io=Sr;class b0{constructor(e){this.idGen=0,this.tasks=[],this.container=e||document.body,this.progressBarContainerOuter=document.createElement("div"),this.progressBarContainerOuter.className="progressBarOuterContainer",this.progressBarContainerOuter.style.display="none",this.progressBarBox=document.createElement("div"),this.progressBarBox.className="progressBarBox",this.progressBarBackground=document.createElement("div"),this.progressBarBackground.className="progressBarBackground",this.progressBar=document.createElement("div"),this.progressBar.className="progressBar",this.progressBarBackground.appendChild(this.progressBar),this.progressBarBox.appendChild(this.progressBarBackground),this.progressBarContainerOuter.appendChild(this.progressBarBox);const t=document.createElement("style");t.innerHTML=`

            .progressBarOuterContainer {
                width: 100%;
                height: 100%;
                margin: 0;
                top: 0;
                left: 0;
                position: absolute;
                pointer-events: none;
            }

            .progressBarBox {
                z-index:99999;
                padding: 7px 9px 5px 7px;
                background-color: rgba(190, 190, 190, 0.75);
                border: #555555 1px solid;
                border-radius: 15px;
                margin: 0;
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translate(-50%, 0);
                width: 180px;
                height: 30px;
                pointer-events: auto;
            }

            .progressBarBackground {
                width: 100%;
                height: 25px;
                border-radius:10px;
                background-color: rgba(128, 128, 128, 0.75);
                border: #444444 1px solid;
                box-shadow: inset 0 0 10px #333333;
            }

            .progressBar {
                height: 25px;
                width: 0px;
                border-radius:10px;
                background-color: rgba(0, 200, 0, 0.75);
                box-shadow: inset 0 0 10px #003300;
            }

        `,this.progressBarContainerOuter.appendChild(t),this.container.appendChild(this.progressBarContainerOuter)}show(){this.progressBarContainerOuter.style.display="block"}hide(){this.progressBarContainerOuter.style.display="none"}setProgress(e){this.progressBar.style.width=e+"%"}setContainer(e){this.container&&this.progressBarContainerOuter.parentElement===this.container&&this.container.removeChild(this.progressBarContainerOuter),e&&(this.container=e,this.container.appendChild(this.progressBarContainerOuter),this.progressBarContainerOuter.style.zIndex=this.container.style.zIndex+1)}}class w0{constructor(e){fe(this,"update",function(e,t,n,i,r,a,o,l,c,u,d,f,h,g){const A=`${t.x.toFixed(5)}, ${t.y.toFixed(5)}, ${t.z.toFixed(5)}`;if(this.infoCells.cameraPosition.innerHTML!==A&&(this.infoCells.cameraPosition.innerHTML=A),n){const p=n,S=`${p.x.toFixed(5)}, ${p.y.toFixed(5)}, ${p.z.toFixed(5)}`;this.infoCells.cameraLookAt.innerHTML!==S&&(this.infoCells.cameraLookAt.innerHTML=S)}const m=`${i.x.toFixed(5)}, ${i.y.toFixed(5)}, ${i.z.toFixed(5)}`;if(this.infoCells.cameraUp.innerHTML!==m&&(this.infoCells.cameraUp.innerHTML=m),this.infoCells.orthographicCamera.innerHTML=r?"Orthographic":"Perspective",a){const p=a,S=`${p.x.toFixed(5)}, ${p.y.toFixed(5)}, ${p.z.toFixed(5)}`;this.infoCells.cursorPosition.innerHTML=S}else this.infoCells.cursorPosition.innerHTML="N/A";this.infoCells.fps.innerHTML=o,this.infoCells.renderWindow.innerHTML=`${e.x} x ${e.y}`,this.infoCells.renderSplatCount.innerHTML=`${c} splats out of ${l} (${u.toFixed(2)}%)`,this.infoCells.sortTime.innerHTML=`${d.toFixed(3)} ms`,this.infoCells.focalAdjustment.innerHTML=`${f.toFixed(3)}`,this.infoCells.splatScale.innerHTML=`${h.toFixed(3)}`,this.infoCells.pointCloudMode.innerHTML=`${g}`});this.container=e||document.body,this.infoCells={};const t=[["Camera position","cameraPosition"],["Camera look-at","cameraLookAt"],["Camera up","cameraUp"],["Camera mode","orthographicCamera"],["Cursor position","cursorPosition"],["FPS","fps"],["Rendering:","renderSplatCount"],["Sort time","sortTime"],["Render window","renderWindow"],["Focal adjustment","focalAdjustment"],["Splat scale","splatScale"],["Point cloud mode","pointCloudMode"]];this.infoPanelContainer=document.createElement("div");const n=document.createElement("style");n.innerHTML=`

            .infoPanel {
                width: 430px;
                padding: 10px;
                background-color: rgba(50, 50, 50, 0.85);
                border: #555555 2px solid;
                color: #dddddd;
                border-radius: 10px;
                z-index: 9999;
                font-family: arial;
                font-size: 11pt;
                text-align: left;
                margin: 0;
                top: 10px;
                left:10px;
                position: absolute;
                pointer-events: auto;
            }

            .info-panel-cell {
                margin-bottom: 5px;
                padding-bottom: 2px;
            }

            .label-cell {
                font-weight: bold;
                font-size: 12pt;
                width: 140px;
            }

        `,this.infoPanelContainer.append(n),this.infoPanel=document.createElement("div"),this.infoPanel.className="infoPanel";const i=document.createElement("div");i.style.display="table";for(let r of t){const a=document.createElement("div");a.style.display="table-row",a.className="info-panel-row";const o=document.createElement("div");o.style.display="table-cell",o.innerHTML=`${r[0]}: `,o.classList.add("info-panel-cell","label-cell");const l=document.createElement("div");l.style.display="table-cell",l.style.width="10px",l.innerHTML=" ",l.className="info-panel-cell";const c=document.createElement("div");c.style.display="table-cell",c.innerHTML="",c.className="info-panel-cell",this.infoCells[r[1]]=c,a.appendChild(o),a.appendChild(l),a.appendChild(c),i.appendChild(a)}this.infoPanel.appendChild(i),this.infoPanelContainer.append(this.infoPanel),this.infoPanelContainer.style.display="none",this.container.appendChild(this.infoPanelContainer),this.visible=!1}setContainer(e){this.container&&this.infoPanelContainer.parentElement===this.container&&this.container.removeChild(this.infoPanelContainer),e&&(this.container=e,this.container.appendChild(this.infoPanelContainer),this.infoPanelContainer.style.zIndex=this.container.style.zIndex+1)}show(){this.infoPanelContainer.style.display="block",this.visible=!0}hide(){this.infoPanelContainer.style.display="none",this.visible=!1}}const cc=new P;class R0 extends Ct{constructor(e=new P(0,0,1),t=new P(0,0,0),n=1,i=.1,r=16776960,a=n*.2,o=a*.2){super(),this.type="ArrowHelper";const l=new Ms(i,i,n,32);l.translate(0,n/2,0);const c=new Ms(0,o,a,32);c.translate(0,n,0),this.position.copy(t),this.line=new vt(l,new Ai({color:r,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new vt(c,new Ai({color:r,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{cc.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(cc,t)}}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class ms{constructor(e){fe(this,"updateFocusMarker",function(){const e=new P,t=new Ge,n=new P;return function(i,r,a){t.copy(r.matrixWorld).invert(),e.copy(i).applyMatrix4(t),e.normalize().multiplyScalar(10),e.applyMatrix4(r.matrixWorld),n.copy(r.position).sub(i);const o=n.length();this.focusMarker.position.copy(i),this.focusMarker.scale.set(o,o,o),this.focusMarker.material.uniforms.realFocusPosition.value.copy(i),this.focusMarker.material.uniforms.viewport.value.copy(a),this.focusMarker.material.uniformsNeedUpdate=!0}}());fe(this,"positionAndOrientControlPlane",function(){const e=new St,t=new P(0,1,0);return function(n,i){e.setFromUnitVectors(t,i),this.controlPlane.position.copy(n),this.controlPlane.quaternion.copy(e)}}());this.threeScene=e,this.splatRenderTarget=null,this.renderTargetCopyQuad=null,this.renderTargetCopyCamera=null,this.meshCursor=null,this.focusMarker=null,this.controlPlane=null,this.debugRoot=null,this.secondaryDebugRoot=null}updateSplatRenderTargetForRenderDimensions(e,t){this.destroySplatRendertarget(),this.splatRenderTarget=new ei(e,t,{format:Nt,stencilBuffer:!1,depthBuffer:!0}),this.splatRenderTarget.depthTexture=new mo(e,t),this.splatRenderTarget.depthTexture.format=gi,this.splatRenderTarget.depthTexture.type=sn}destroySplatRendertarget(){this.splatRenderTarget&&(this.splatRenderTarget=null)}setupRenderTargetCopyObjects(){const e={sourceColorTexture:{type:"t",value:null},sourceDepthTexture:{type:"t",value:null}},t=new jt({vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4( position.xy, 0.0, 1.0 );    
                }
            `,fragmentShader:`
                #include <common>
                #include <packing>
                varying vec2 vUv;
                uniform sampler2D sourceColorTexture;
                uniform sampler2D sourceDepthTexture;
                void main() {
                    vec4 color = texture2D(sourceColorTexture, vUv);
                    float fragDepth = texture2D(sourceDepthTexture, vUv).x;
                    gl_FragDepth = fragDepth;
                    gl_FragColor = vec4(color.rgb, color.a * 2.0);
              }
            `,uniforms:e,depthWrite:!1,depthTest:!1,transparent:!0,blending:Ac,blendSrc:xs,blendSrcAlpha:xs,blendDst:vs,blendDstAlpha:vs});t.extensions.fragDepth=!0,this.renderTargetCopyQuad=new vt(new Ji(2,2),t),this.renderTargetCopyCamera=new fo(-1,1,1,-1,0,1)}destroyRenderTargetCopyObjects(){this.renderTargetCopyQuad&&(zi(this.renderTargetCopyQuad),this.renderTargetCopyQuad=null)}setupMeshCursor(){if(!this.meshCursor){const e=new go(.5,1.5,32),t=new Ai({color:16777215}),n=new vt(e,t);n.rotation.set(0,0,Math.PI),n.position.set(0,1,0);const i=new vt(e,t);i.position.set(0,-1,0);const r=new vt(e,t);r.rotation.set(0,0,Math.PI/2),r.position.set(1,0,0);const a=new vt(e,t);a.rotation.set(0,0,-Math.PI/2),a.position.set(-1,0,0),this.meshCursor=new Ct,this.meshCursor.add(n),this.meshCursor.add(i),this.meshCursor.add(r),this.meshCursor.add(a),this.meshCursor.scale.set(.1,.1,.1),this.threeScene.add(this.meshCursor),this.meshCursor.visible=!1}}destroyMeshCursor(){this.meshCursor&&(zi(this.meshCursor),this.threeScene.remove(this.meshCursor),this.meshCursor=null)}setMeshCursorVisibility(e){this.meshCursor.visible=e}getMeschCursorVisibility(){return this.meshCursor.visible}setMeshCursorPosition(e){this.meshCursor.position.copy(e)}positionAndOrientMeshCursor(e,t){this.meshCursor.position.copy(e),this.meshCursor.up.copy(t.up),this.meshCursor.lookAt(t.position)}setupFocusMarker(){if(!this.focusMarker){const e=new pr(.5,32,32),t=ms.buildFocusMarkerMaterial();t.depthTest=!1,t.depthWrite=!1,t.transparent=!0,this.focusMarker=new vt(e,t)}}destroyFocusMarker(){this.focusMarker&&(zi(this.focusMarker),this.focusMarker=null)}setFocusMarkerVisibility(e){this.focusMarker.visible=e}setFocusMarkerOpacity(e){this.focusMarker.material.uniforms.opacity.value=e,this.focusMarker.material.uniformsNeedUpdate=!0}getFocusMarkerOpacity(){return this.focusMarker.material.uniforms.opacity.value}setupControlPlane(){if(!this.controlPlane){const e=new Ji(1,1);e.rotateX(-Math.PI/2);const t=new Ai({color:16777215});t.transparent=!0,t.opacity=.6,t.depthTest=!1,t.depthWrite=!1,t.side=nn;const n=new vt(e,t),i=new P(0,1,0);i.normalize();const r=new P(0,0,0),a=.5,o=.01,l=56576,c=new R0(i,r,a,o,l,.1,.03);this.controlPlane=new Ct,this.controlPlane.add(n),this.controlPlane.add(c)}}destroyControlPlane(){this.controlPlane&&(zi(this.controlPlane),this.controlPlane=null)}setControlPlaneVisibility(e){this.controlPlane.visible=e}addDebugMeshes(){this.debugRoot=this.createDebugMeshes(),this.secondaryDebugRoot=this.createSecondaryDebugMeshes(),this.threeScene.add(this.debugRoot),this.threeScene.add(this.secondaryDebugRoot)}destroyDebugMeshes(){for(let e of[this.debugRoot,this.secondaryDebugRoot])e&&(zi(e),this.threeScene.remove(e));this.debugRoot=null,this.secondaryDebugRoot=null}createDebugMeshes(e){const t=new pr(1,32,32),n=new Ct,i=(r,a)=>{let o=new vt(t,ms.buildDebugMaterial(r));o.renderOrder=e,n.add(o),o.position.fromArray(a)};return i(16711680,[-50,0,0]),i(16711680,[50,0,0]),i(65280,[0,0,-50]),i(65280,[0,0,50]),i(16755200,[5,0,5]),n}createSecondaryDebugMeshes(e){const t=new is(3,3,3),n=new Ct;let i=12303291;const r=o=>{let l=new vt(t,ms.buildDebugMaterial(i));l.renderOrder=e,n.add(l),l.position.fromArray(o)};let a=10;return r([-a,0,-a]),r([-a,0,a]),r([a,0,-a]),r([a,0,a]),n}static buildDebugMaterial(e){const t=`
            #include <common>
            varying float ndcDepth;

            void main() {
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position.xyz, 1.0);
                ndcDepth = gl_Position.z / gl_Position.w;
                gl_Position.x = gl_Position.x / gl_Position.w;
                gl_Position.y = gl_Position.y / gl_Position.w;
                gl_Position.z = 0.0;
                gl_Position.w = 1.0;
    
            }
        `,n=`
            #include <common>
            uniform vec3 color;
            varying float ndcDepth;
            void main() {
                gl_FragDepth = (ndcDepth + 1.0) / 2.0;
                gl_FragColor = vec4(color.rgb, 0.0);
            }
        `,i={color:{type:"v3",value:new nt(e)}},r=new jt({uniforms:i,vertexShader:t,fragmentShader:n,transparent:!1,depthTest:!0,depthWrite:!0,side:xn});return r.extensions.fragDepth=!0,r}static buildFocusMarkerMaterial(e){const t=`
            #include <common>

            uniform vec2 viewport;
            uniform vec3 realFocusPosition;

            varying vec4 ndcPosition;
            varying vec4 ndcCenter;
            varying vec4 ndcFocusPosition;

            void main() {
                float radius = 0.01;

                vec4 viewPosition = modelViewMatrix * vec4(position.xyz, 1.0);
                vec4 viewCenter = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

                vec4 viewFocusPosition = modelViewMatrix * vec4(realFocusPosition, 1.0);

                ndcPosition = projectionMatrix * viewPosition;
                ndcPosition = ndcPosition * vec4(1.0 / ndcPosition.w);
                ndcCenter = projectionMatrix * viewCenter;
                ndcCenter = ndcCenter * vec4(1.0 / ndcCenter.w);

                ndcFocusPosition = projectionMatrix * viewFocusPosition;
                ndcFocusPosition = ndcFocusPosition * vec4(1.0 / ndcFocusPosition.w);

                gl_Position = projectionMatrix * viewPosition;

            }
        `,n=`
            #include <common>
            uniform vec3 color;
            uniform vec2 viewport;
            uniform float opacity;

            varying vec4 ndcPosition;
            varying vec4 ndcCenter;
            varying vec4 ndcFocusPosition;

            void main() {
                vec2 screenPosition = vec2(ndcPosition) * viewport;
                vec2 screenCenter = vec2(ndcCenter) * viewport;

                vec2 screenVec = screenPosition - screenCenter;

                float projectedRadius = length(screenVec);

                float lineWidth = 0.0005 * viewport.y;
                float aaRange = 0.0025 * viewport.y;
                float radius = 0.06 * viewport.y;
                float radDiff = abs(projectedRadius - radius) - lineWidth;
                float alpha = 1.0 - clamp(radDiff / 5.0, 0.0, 1.0); 

                gl_FragColor = vec4(color.rgb, alpha * opacity);
            }
        `,i={color:{type:"v3",value:new nt(e)},realFocusPosition:{type:"v3",value:new P},viewport:{type:"v2",value:new Fe},opacity:{value:0}};return new jt({uniforms:i,vertexShader:t,fragmentShader:n,transparent:!0,depthTest:!1,depthWrite:!1,side:xn})}dispose(){this.destroyMeshCursor(),this.destroyFocusMarker(),this.destroyDebugMeshes(),this.destroyControlPlane(),this.destroyRenderTargetCopyObjects(),this.destroySplatRendertarget()}}const I0=new P(1,0,0),D0=new P(0,1,0),P0=new P(0,0,1);class ca{constructor(e=new P,t=new P){fe(this,"intersectBox",function(){const e=new P,t=[],n=[],i=[];return function(r,a){if(n[0]=this.origin.x,n[1]=this.origin.y,n[2]=this.origin.z,i[0]=this.direction.x,i[1]=this.direction.y,i[2]=this.direction.z,this.boxContainsPoint(r,this.origin,1e-4))return a&&(a.origin.copy(this.origin),a.normal.set(0,0,0),a.distance=-1),!0;for(let o=0;o<3;o++){if(i[o]==0)continue;const l=o==0?I0:o==1?D0:P0,c=i[o]<0?r.max:r.min;let u=-Math.sign(i[o]);t[0]=o==0?c.x:o==1?c.y:c.z;let d=t[0]-n[o];if(d*u<0){const f=(o+1)%3,h=(o+2)%3;if(t[2]=i[f]/i[o]*d+n[f],t[1]=i[h]/i[o]*d+n[h],e.set(t[o],t[h],t[f]),this.boxContainsPoint(r,e,1e-4))return a&&(a.origin.copy(e),a.normal.copy(l).multiplyScalar(u),a.distance=e.sub(this.origin).length()),!0}}return!1}}());fe(this,"intersectSphere",function(){const e=new P;return function(t,n,i){e.copy(t).sub(this.origin);const r=e.dot(this.direction),a=r*r,l=e.dot(e)-a,c=n*n;if(l>c)return!1;const u=Math.sqrt(c-l),d=r-u,f=r+u;if(f<0)return!1;let h=d<0?f:d;return i&&(i.origin.copy(this.origin).addScaledVector(this.direction,h),i.normal.copy(i.origin).sub(t).normalize(),i.distance=h),!0}}());this.origin=new P,this.direction=new P,this.setParameters(e,t)}setParameters(e,t){this.origin.copy(e),this.direction.copy(t).normalize()}boxContainsPoint(e,t,n){return!(t.x<e.min.x-n||t.x>e.max.x+n||t.y<e.min.y-n||t.y>e.max.y+n||t.z<e.min.z-n||t.z>e.max.z+n)}}class Do{constructor(){this.origin=new P,this.normal=new P,this.distance=0,this.splatIndex=0}set(e,t,n,i){this.origin.copy(e),this.normal.copy(t),this.distance=n,this.splatIndex=i}clone(){const e=new Do;return e.origin.copy(this.origin),e.normal.copy(this.normal),e.distance=this.distance,e.splatIndex=this.splatIndex,e}}const Dn={ThreeD:0,TwoD:1};class F0{constructor(e,t,n=!1){fe(this,"setFromCameraAndScreenPosition",function(){const e=new Fe;return function(t,n,i){if(e.x=n.x/i.x*2-1,e.y=(i.y-n.y)/i.y*2-1,t.isPerspectiveCamera)this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t;else if(t.isOrthographicCamera)this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t;else throw new Error("Raycaster::setFromCameraAndScreenPosition() -> Unsupported camera type")}}());fe(this,"intersectSplatMesh",function(){const e=new Ge,t=new Ge,n=new Ge,i=new ca,r=new P;return function(a,o=[]){const l=a.getSplatTree();if(l){for(let c=0;c<l.subTrees.length;c++){const u=l.subTrees[c];t.copy(a.matrixWorld),a.dynamicMode&&(a.getSceneTransform(c,n),t.multiply(n)),e.copy(t).invert(),i.origin.copy(this.ray.origin).applyMatrix4(e),i.direction.copy(this.ray.origin).add(this.ray.direction),i.direction.applyMatrix4(e).sub(i.origin).normalize();const d=[];u.rootNode&&this.castRayAtSplatTreeNode(i,l,u.rootNode,d),d.forEach(f=>{f.origin.applyMatrix4(t),f.normal.applyMatrix4(t).normalize(),f.distance=r.copy(f.origin).sub(this.ray.origin).length()}),o.push(...d)}return o.sort((c,u)=>c.distance>u.distance?1:-1),o}}}());fe(this,"castRayAtSplatTreeNode",function(){const e=new At,t=new P,n=new P,i=new St,r=new Do,a=1e-7,o=new P(0,0,0),l=new Ge,c=new Ge,u=new Ge,d=new Ge,f=new Ge,h=new ca;return function(g,A,m,p=[]){if(g.intersectBox(m.boundingBox)){if(m.data&&m.data.indexes&&m.data.indexes.length>0)for(let S=0;S<m.data.indexes.length;S++){const _=m.data.indexes[S],x=A.splatMesh.getSceneIndexForSplat(_);if(A.splatMesh.getScene(x).visible&&(A.splatMesh.getSplatColor(_,e),A.splatMesh.getSplatCenter(_,t),A.splatMesh.getSplatScaleAndRotation(_,n,i),!(n.x<=a||n.y<=a||A.splatMesh.splatRenderMode===Dn.ThreeD&&n.z<=a)))if(this.raycastAgainstTrueSplatEllipsoid){c.makeScale(n.x,n.y,n.z),u.makeRotationFromQuaternion(i);const E=Math.log10(e.w)*2;if(l.makeScale(E,E,E),f.copy(l).multiply(u).multiply(c),d.copy(f).invert(),h.origin.copy(g.origin).sub(t).applyMatrix4(d),h.direction.copy(g.origin).add(g.direction).sub(t),h.direction.applyMatrix4(d).sub(h.origin).normalize(),h.intersectSphere(o,1,r)){const M=r.clone();M.splatIndex=_,M.origin.applyMatrix4(f).add(t),p.push(M)}}else{let E=n.x+n.y,M=2;if(A.splatMesh.splatRenderMode===Dn.ThreeD&&(E+=n.z,M=3),E=E/M,g.intersectSphere(t,E,r)){const w=r.clone();w.splatIndex=_,p.push(w)}}}if(m.children&&m.children.length>0)for(let S of m.children)this.castRayAtSplatTreeNode(g,A,S,p);return p}}}());this.ray=new ca(e,t),this.raycastAgainstTrueSplatEllipsoid=n}}class Xi{static buildVertexShaderBase(e=!1,t=!1,n=0,i=""){let r=`
        precision highp float;
        #include <common>

        attribute uint splatIndex;
        uniform highp usampler2D centersColorsTexture;
        uniform highp sampler2D sphericalHarmonicsTexture;
        uniform highp sampler2D sphericalHarmonicsTextureR;
        uniform highp sampler2D sphericalHarmonicsTextureG;
        uniform highp sampler2D sphericalHarmonicsTextureB;

        uniform highp usampler2D sceneIndexesTexture;
        uniform vec2 sceneIndexesTextureSize;
        uniform int sceneCount;
    `;return t&&(r+=`
            uniform float sceneOpacity[${Ze.MaxScenes}];
            uniform int sceneVisibility[${Ze.MaxScenes}];
        `),e&&(r+=`
            uniform highp mat4 transforms[${Ze.MaxScenes}];
        `),r+=`
        ${i}
        uniform vec2 focal;
        uniform float orthoZoom;
        uniform int orthographicMode;
        uniform int pointCloudModeEnabled;
        uniform float inverseFocalAdjustment;
        uniform vec2 viewport;
        uniform vec2 basisViewport;
        uniform vec2 centersColorsTextureSize;
        uniform int sphericalHarmonicsDegree;
        uniform vec2 sphericalHarmonicsTextureSize;
        uniform int sphericalHarmonics8BitMode;
        uniform int sphericalHarmonicsMultiTextureMode;
        uniform float visibleRegionRadius;
        uniform float visibleRegionFadeStartRadius;
        uniform float firstRenderTime;
        uniform float currentTime;
        uniform int fadeInComplete;
        uniform vec3 sceneCenter;
        uniform float splatScale;
        uniform float sphericalHarmonics8BitCompressionRangeMin[${Ze.MaxScenes}];
        uniform float sphericalHarmonics8BitCompressionRangeMax[${Ze.MaxScenes}];

        varying vec4 vColor;
        varying vec2 vUv;
        varying vec2 vPosition;

        mat3 quaternionToRotationMatrix(float x, float y, float z, float w) {
            float s = 1.0 / sqrt(w * w + x * x + y * y + z * z);
        
            return mat3(
                1. - 2. * (y * y + z * z),
                2. * (x * y + w * z),
                2. * (x * z - w * y),
                2. * (x * y - w * z),
                1. - 2. * (x * x + z * z),
                2. * (y * z + w * x),
                2. * (x * z + w * y),
                2. * (y * z - w * x),
                1. - 2. * (x * x + y * y)
            );
        }

        const float sqrt8 = sqrt(8.0);
        const float minAlpha = 1.0 / 255.0;

        const vec4 encodeNorm4 = vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0);
        const uvec4 mask4 = uvec4(uint(0x000000FF), uint(0x0000FF00), uint(0x00FF0000), uint(0xFF000000));
        const uvec4 shift4 = uvec4(0, 8, 16, 24);
        vec4 uintToRGBAVec (uint u) {
           uvec4 urgba = mask4 & u;
           urgba = urgba >> shift4;
           vec4 rgba = vec4(urgba) * encodeNorm4;
           return rgba;
        }

        vec2 getDataUV(in int stride, in int offset, in vec2 dimensions) {
            vec2 samplerUV = vec2(0.0, 0.0);
            float d = float(splatIndex * uint(stride) + uint(offset)) / dimensions.x;
            samplerUV.y = float(floor(d)) / dimensions.y;
            samplerUV.x = fract(d);
            return samplerUV;
        }

        vec2 getDataUVF(in uint sIndex, in float stride, in uint offset, in vec2 dimensions) {
            vec2 samplerUV = vec2(0.0, 0.0);
            float d = float(uint(float(sIndex) * stride) + offset) / dimensions.x;
            samplerUV.y = float(floor(d)) / dimensions.y;
            samplerUV.x = fract(d);
            return samplerUV;
        }

        const float SH_C1 = 0.4886025119029199f;
        const float[5] SH_C2 = float[](1.0925484, -1.0925484, 0.3153916, -1.0925484, 0.5462742);

        void main () {

            uint oddOffset = splatIndex & uint(0x00000001);
            uint doubleOddOffset = oddOffset * uint(2);
            bool isEven = oddOffset == uint(0);
            uint nearestEvenIndex = splatIndex - oddOffset;
            float fOddOffset = float(oddOffset);

            uvec4 sampledCenterColor = texture(centersColorsTexture, getDataUV(1, 0, centersColorsTextureSize));
            vec3 splatCenter = uintBitsToFloat(uvec3(sampledCenterColor.gba));

            uint sceneIndex = uint(0);
            if (sceneCount > 1) {
                sceneIndex = texture(sceneIndexesTexture, getDataUV(1, 0, sceneIndexesTextureSize)).r;
            }
            `,t&&(r+=`
                float splatOpacityFromScene = sceneOpacity[sceneIndex];
                int sceneVisible = sceneVisibility[sceneIndex];
                if (splatOpacityFromScene <= 0.01 || sceneVisible == 0) {
                    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
                    return;
                }
            `),e?r+=`
                mat4 transform = transforms[sceneIndex];
                mat4 transformModelViewMatrix = viewMatrix * transform;
            `:r+="mat4 transformModelViewMatrix = modelViewMatrix;",r+=`
            float sh8BitCompressionRangeMinForScene = sphericalHarmonics8BitCompressionRangeMin[sceneIndex];
            float sh8BitCompressionRangeMaxForScene = sphericalHarmonics8BitCompressionRangeMax[sceneIndex];
            float sh8BitCompressionRangeForScene = sh8BitCompressionRangeMaxForScene - sh8BitCompressionRangeMinForScene;
            float sh8BitCompressionHalfRangeForScene = sh8BitCompressionRangeForScene / 2.0;
            vec3 vec8BitSHShift = vec3(sh8BitCompressionRangeMinForScene);

            vec4 viewCenter = transformModelViewMatrix * vec4(splatCenter, 1.0);

            vec4 clipCenter = projectionMatrix * viewCenter;

            float clip = 1.2 * clipCenter.w;
            if (clipCenter.z < -clip || clipCenter.x < -clip || clipCenter.x > clip || clipCenter.y < -clip || clipCenter.y > clip) {
                gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
                return;
            }

            vec3 ndcCenter = clipCenter.xyz / clipCenter.w;

            vPosition = position.xy;
            vColor = uintToRGBAVec(sampledCenterColor.r);
        `,n>=1&&(r+=`   
            if (sphericalHarmonicsDegree >= 1) {
            `,e?r+=`
                    vec3 worldViewDir = normalize(splatCenter - vec3(inverse(transform) * vec4(cameraPosition, 1.0)));
                `:r+=`
                    vec3 worldViewDir = normalize(splatCenter - cameraPosition);
                `,r+=`
                vec3 sh1;
                vec3 sh2;
                vec3 sh3;
            `,n>=2&&(r+=`
                    vec3 sh4;
                    vec3 sh5;
                    vec3 sh6;
                    vec3 sh7;
                    vec3 sh8;
                `),n===1?r+=`
                    if (sphericalHarmonicsMultiTextureMode == 0) {
                        vec2 shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset, sphericalHarmonicsTextureSize);
                        vec4 sampledSH0123 = texture(sphericalHarmonicsTexture, shUV);
                        shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset + uint(1), sphericalHarmonicsTextureSize);
                        vec4 sampledSH4567 = texture(sphericalHarmonicsTexture, shUV);
                        shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset + uint(2), sphericalHarmonicsTextureSize);
                        vec4 sampledSH891011 = texture(sphericalHarmonicsTexture, shUV);
                        sh1 = vec3(sampledSH0123.rgb) * (1.0 - fOddOffset) + vec3(sampledSH0123.ba, sampledSH4567.r) * fOddOffset;
                        sh2 = vec3(sampledSH0123.a, sampledSH4567.rg) * (1.0 - fOddOffset) + vec3(sampledSH4567.gba) * fOddOffset;
                        sh3 = vec3(sampledSH4567.ba, sampledSH891011.r) * (1.0 - fOddOffset) + vec3(sampledSH891011.rgb) * fOddOffset;
                    } else {
                        vec2 sampledSH01R = texture(sphericalHarmonicsTextureR, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH23R = texture(sphericalHarmonicsTextureR, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH01G = texture(sphericalHarmonicsTextureG, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH23G = texture(sphericalHarmonicsTextureG, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH01B = texture(sphericalHarmonicsTextureB, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH23B = texture(sphericalHarmonicsTextureB, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;
                        sh1 = vec3(sampledSH01R.rg, sampledSH23R.r);
                        sh2 = vec3(sampledSH01G.rg, sampledSH23G.r);
                        sh3 = vec3(sampledSH01B.rg, sampledSH23B.r);
                    }
                `:n===2&&(r+=`
                    vec4 sampledSH0123;
                    vec4 sampledSH4567;
                    vec4 sampledSH891011;

                    vec4 sampledSH0123R;
                    vec4 sampledSH0123G;
                    vec4 sampledSH0123B;

                    if (sphericalHarmonicsMultiTextureMode == 0) {
                        sampledSH0123 = texture(sphericalHarmonicsTexture, getDataUV(6, 0, sphericalHarmonicsTextureSize));
                        sampledSH4567 = texture(sphericalHarmonicsTexture, getDataUV(6, 1, sphericalHarmonicsTextureSize));
                        sampledSH891011 = texture(sphericalHarmonicsTexture, getDataUV(6, 2, sphericalHarmonicsTextureSize));
                        sh1 = sampledSH0123.rgb;
                        sh2 = vec3(sampledSH0123.a, sampledSH4567.rg);
                        sh3 = vec3(sampledSH4567.ba, sampledSH891011.r);
                    } else {
                        sampledSH0123R = texture(sphericalHarmonicsTextureR, getDataUV(2, 0, sphericalHarmonicsTextureSize));
                        sampledSH0123G = texture(sphericalHarmonicsTextureG, getDataUV(2, 0, sphericalHarmonicsTextureSize));
                        sampledSH0123B = texture(sphericalHarmonicsTextureB, getDataUV(2, 0, sphericalHarmonicsTextureSize));
                        sh1 = vec3(sampledSH0123R.rgb);
                        sh2 = vec3(sampledSH0123G.rgb);
                        sh3 = vec3(sampledSH0123B.rgb);
                    }
                `),r+=`
                    if (sphericalHarmonics8BitMode == 1) {
                        sh1 = sh1 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                        sh2 = sh2 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                        sh3 = sh3 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                    }
                    float x = worldViewDir.x;
                    float y = worldViewDir.y;
                    float z = worldViewDir.z;
                    vColor.rgb += SH_C1 * (-sh1 * y + sh2 * z - sh3 * x);
            `,n>=2&&(r+=`
                    if (sphericalHarmonicsDegree >= 2) {
                        float xx = x * x;
                        float yy = y * y;
                        float zz = z * z;
                        float xy = x * y;
                        float yz = y * z;
                        float xz = x * z;
                `,n===2&&(r+=`
                        if (sphericalHarmonicsMultiTextureMode == 0) {
                            vec4 sampledSH12131415 = texture(sphericalHarmonicsTexture, getDataUV(6, 3, sphericalHarmonicsTextureSize));
                            vec4 sampledSH16171819 = texture(sphericalHarmonicsTexture, getDataUV(6, 4, sphericalHarmonicsTextureSize));
                            vec4 sampledSH20212223 = texture(sphericalHarmonicsTexture, getDataUV(6, 5, sphericalHarmonicsTextureSize));
                            sh4 = sampledSH891011.gba;
                            sh5 = sampledSH12131415.rgb;
                            sh6 = vec3(sampledSH12131415.a, sampledSH16171819.rg);
                            sh7 = vec3(sampledSH16171819.ba, sampledSH20212223.r);
                            sh8 = sampledSH20212223.gba;
                        } else {
                            vec4 sampledSH4567R = texture(sphericalHarmonicsTextureR, getDataUV(2, 1, sphericalHarmonicsTextureSize));
                            vec4 sampledSH4567G = texture(sphericalHarmonicsTextureG, getDataUV(2, 1, sphericalHarmonicsTextureSize));
                            vec4 sampledSH4567B = texture(sphericalHarmonicsTextureB, getDataUV(2, 1, sphericalHarmonicsTextureSize));
                            sh4 = vec3(sampledSH0123R.a, sampledSH4567R.rg);
                            sh5 = vec3(sampledSH4567R.ba, sampledSH0123G.a);
                            sh6 = vec3(sampledSH4567G.rgb);
                            sh7 = vec3(sampledSH4567G.a, sampledSH0123B.a, sampledSH4567B.r);
                            sh8 = vec3(sampledSH4567B.gba);
                        }
                    `),r+=`
                        if (sphericalHarmonics8BitMode == 1) {
                            sh4 = sh4 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh5 = sh5 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh6 = sh6 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh7 = sh7 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh8 = sh8 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                        }

                        vColor.rgb +=
                            (SH_C2[0] * xy) * sh4 +
                            (SH_C2[1] * yz) * sh5 +
                            (SH_C2[2] * (2.0 * zz - xx - yy)) * sh6 +
                            (SH_C2[3] * xz) * sh7 +
                            (SH_C2[4] * (xx - yy)) * sh8;
                    }
                `),r+=`

                vColor.rgb = clamp(vColor.rgb, vec3(0.), vec3(1.));

            }

            `),r}static getVertexShaderFadeIn(){return`
            if (fadeInComplete == 0) {
                float opacityAdjust = 1.0;
                float centerDist = length(splatCenter - sceneCenter);
                float renderTime = max(currentTime - firstRenderTime, 0.0);

                float fadeDistance = 0.75;
                float distanceLoadFadeInFactor = step(visibleRegionFadeStartRadius, centerDist);
                distanceLoadFadeInFactor = (1.0 - distanceLoadFadeInFactor) +
                                        (1.0 - clamp((centerDist - visibleRegionFadeStartRadius) / fadeDistance, 0.0, 1.0)) *
                                        distanceLoadFadeInFactor;
                opacityAdjust *= distanceLoadFadeInFactor;
                vColor.a *= opacityAdjust;
            }
        `}static getUniforms(e=!1,t=!1,n=0,i=1,r=!1){const a={sceneCenter:{type:"v3",value:new P},fadeInComplete:{type:"i",value:0},orthographicMode:{type:"i",value:0},visibleRegionFadeStartRadius:{type:"f",value:0},visibleRegionRadius:{type:"f",value:0},currentTime:{type:"f",value:0},firstRenderTime:{type:"f",value:0},centersColorsTexture:{type:"t",value:null},sphericalHarmonicsTexture:{type:"t",value:null},sphericalHarmonicsTextureR:{type:"t",value:null},sphericalHarmonicsTextureG:{type:"t",value:null},sphericalHarmonicsTextureB:{type:"t",value:null},sphericalHarmonics8BitCompressionRangeMin:{type:"f",value:[]},sphericalHarmonics8BitCompressionRangeMax:{type:"f",value:[]},focal:{type:"v2",value:new Fe},orthoZoom:{type:"f",value:1},inverseFocalAdjustment:{type:"f",value:1},viewport:{type:"v2",value:new Fe},basisViewport:{type:"v2",value:new Fe},debugColor:{type:"v3",value:new nt},centersColorsTextureSize:{type:"v2",value:new Fe(1024,1024)},sphericalHarmonicsDegree:{type:"i",value:n},sphericalHarmonicsTextureSize:{type:"v2",value:new Fe(1024,1024)},sphericalHarmonics8BitMode:{type:"i",value:0},sphericalHarmonicsMultiTextureMode:{type:"i",value:0},splatScale:{type:"f",value:i},pointCloudModeEnabled:{type:"i",value:r?1:0},sceneIndexesTexture:{type:"t",value:null},sceneIndexesTextureSize:{type:"v2",value:new Fe(1024,1024)},sceneCount:{type:"i",value:1}};for(let o=0;o<Ze.MaxScenes;o++)a.sphericalHarmonics8BitCompressionRangeMin.value.push(-3/2),a.sphericalHarmonics8BitCompressionRangeMax.value.push(Ze.SphericalHarmonics8BitCompressionRange/2);if(t){const o=[];for(let c=0;c<Ze.MaxScenes;c++)o.push(1);a.sceneOpacity={type:"f",value:o};const l=[];for(let c=0;c<Ze.MaxScenes;c++)l.push(1);a.sceneVisibility={type:"i",value:l}}if(e){const o=[];for(let l=0;l<Ze.MaxScenes;l++)o.push(new Ge);a.transforms={type:"mat4",value:o}}return a}}class gr{static build(e=!1,t=!1,n=!1,i=2048,r=1,a=!1,o=0,l=.3){let u=Xi.buildVertexShaderBase(e,t,o,`
            uniform vec2 covariancesTextureSize;
            uniform highp sampler2D covariancesTexture;
            uniform highp usampler2D covariancesTextureHalfFloat;
            uniform int covariancesAreHalfFloat;

            void fromCovarianceHalfFloatV4(uvec4 val, out vec4 first, out vec4 second) {
                vec2 r = unpackHalf2x16(val.r);
                vec2 g = unpackHalf2x16(val.g);
                vec2 b = unpackHalf2x16(val.b);

                first = vec4(r.x, r.y, g.x, g.y);
                second = vec4(b.x, b.y, 0.0, 0.0);
            }
        `);u+=gr.buildVertexShaderProjection(n,t,i,l);const d=gr.buildFragmentShader(),f=Xi.getUniforms(e,t,o,r,a);return f.covariancesTextureSize={type:"v2",value:new Fe(1024,1024)},f.covariancesTexture={type:"t",value:null},f.covariancesTextureHalfFloat={type:"t",value:null},f.covariancesAreHalfFloat={type:"i",value:0},new jt({uniforms:f,vertexShader:u,fragmentShader:d,transparent:!0,alphaTest:1,blending:$n,depthTest:!0,depthWrite:!1,side:nn})}static buildVertexShaderProjection(e,t,n,i){let r=`

            vec4 sampledCovarianceA;
            vec4 sampledCovarianceB;
            vec3 cov3D_M11_M12_M13;
            vec3 cov3D_M22_M23_M33;
            if (covariancesAreHalfFloat == 0) {
                sampledCovarianceA = texture(covariancesTexture, getDataUVF(nearestEvenIndex, 1.5, oddOffset,
                                                                            covariancesTextureSize));
                sampledCovarianceB = texture(covariancesTexture, getDataUVF(nearestEvenIndex, 1.5, oddOffset + uint(1),
                                                                            covariancesTextureSize));

                cov3D_M11_M12_M13 = vec3(sampledCovarianceA.rgb) * (1.0 - fOddOffset) +
                                    vec3(sampledCovarianceA.ba, sampledCovarianceB.r) * fOddOffset;
                cov3D_M22_M23_M33 = vec3(sampledCovarianceA.a, sampledCovarianceB.rg) * (1.0 - fOddOffset) +
                                    vec3(sampledCovarianceB.gba) * fOddOffset;
            } else {
                uvec4 sampledCovarianceU = texture(covariancesTextureHalfFloat, getDataUV(1, 0, covariancesTextureSize));
                fromCovarianceHalfFloatV4(sampledCovarianceU, sampledCovarianceA, sampledCovarianceB);
                cov3D_M11_M12_M13 = sampledCovarianceA.rgb;
                cov3D_M22_M23_M33 = vec3(sampledCovarianceA.a, sampledCovarianceB.rg);
            }
        
            // Construct the 3D covariance matrix
            mat3 Vrk = mat3(
                cov3D_M11_M12_M13.x, cov3D_M11_M12_M13.y, cov3D_M11_M12_M13.z,
                cov3D_M11_M12_M13.y, cov3D_M22_M23_M33.x, cov3D_M22_M23_M33.y,
                cov3D_M11_M12_M13.z, cov3D_M22_M23_M33.y, cov3D_M22_M23_M33.z
            );

            mat3 J;
            if (orthographicMode == 1) {
                // Since the projection is linear, we don't need an approximation
                J = transpose(mat3(orthoZoom, 0.0, 0.0,
                                0.0, orthoZoom, 0.0,
                                0.0, 0.0, 0.0));
            } else {
                // Construct the Jacobian of the affine approximation of the projection matrix. It will be used to transform the
                // 3D covariance matrix instead of using the actual projection matrix because that transformation would
                // require a non-linear component (perspective division) which would yield a non-gaussian result.
                float s = 1.0 / (viewCenter.z * viewCenter.z);
                J = mat3(
                    focal.x / viewCenter.z, 0., -(focal.x * viewCenter.x) * s,
                    0., focal.y / viewCenter.z, -(focal.y * viewCenter.y) * s,
                    0., 0., 0.
                );
            }

            // Concatenate the projection approximation with the model-view transformation
            mat3 W = transpose(mat3(transformModelViewMatrix));
            mat3 T = W * J;

            // Transform the 3D covariance matrix (Vrk) to compute the 2D covariance matrix
            mat3 cov2Dm = transpose(T) * Vrk * T;
            `;return e?r+=`
                float detOrig = cov2Dm[0][0] * cov2Dm[1][1] - cov2Dm[0][1] * cov2Dm[0][1];
                cov2Dm[0][0] += ${i};
                cov2Dm[1][1] += ${i};
                float detBlur = cov2Dm[0][0] * cov2Dm[1][1] - cov2Dm[0][1] * cov2Dm[0][1];
                vColor.a *= sqrt(max(detOrig / detBlur, 0.0));
                if (vColor.a < minAlpha) return;
            `:r+=`
                cov2Dm[0][0] += ${i};
                cov2Dm[1][1] += ${i};
            `,r+=`

            // We are interested in the upper-left 2x2 portion of the projected 3D covariance matrix because
            // we only care about the X and Y values. We want the X-diagonal, cov2Dm[0][0],
            // the Y-diagonal, cov2Dm[1][1], and the correlation between the two cov2Dm[0][1]. We don't
            // need cov2Dm[1][0] because it is a symetric matrix.
            vec3 cov2Dv = vec3(cov2Dm[0][0], cov2Dm[0][1], cov2Dm[1][1]);

            // We now need to solve for the eigen-values and eigen vectors of the 2D covariance matrix
            // so that we can determine the 2D basis for the splat. This is done using the method described
            // here: https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
            // After calculating the eigen-values and eigen-vectors, we calculate the basis for rendering the splat
            // by normalizing the eigen-vectors and then multiplying them by (sqrt(8) * sqrt(eigen-value)), which is
            // equal to scaling them by sqrt(8) standard deviations.
            //
            // This is a different approach than in the original work at INRIA. In that work they compute the
            // max extents of the projected splat in screen space to form a screen-space aligned bounding rectangle
            // which forms the geometry that is actually rasterized. The dimensions of that bounding box are 3.0
            // times the square root of the maximum eigen-value, or 3 standard deviations. They then use the inverse
            // 2D covariance matrix (called 'conic') in the CUDA rendering thread to determine fragment opacity by
            // calculating the full gaussian: exp(-0.5 * (X - mean) * conic * (X - mean)) * splat opacity
            float a = cov2Dv.x;
            float d = cov2Dv.z;
            float b = cov2Dv.y;
            float D = a * d - b * b;
            float trace = a + d;
            float traceOver2 = 0.5 * trace;
            float term2 = sqrt(max(0.1f, traceOver2 * traceOver2 - D));
            float eigenValue1 = traceOver2 + term2;
            float eigenValue2 = traceOver2 - term2;

            if (pointCloudModeEnabled == 1) {
                eigenValue1 = eigenValue2 = 0.2;
            }

            if (eigenValue2 <= 0.0) return;

            vec2 eigenVector1 = normalize(vec2(b, eigenValue1 - a));
            // since the eigen vectors are orthogonal, we derive the second one from the first
            vec2 eigenVector2 = vec2(eigenVector1.y, -eigenVector1.x);

            // We use sqrt(8) standard deviations instead of 3 to eliminate more of the splat with a very low opacity.
            vec2 basisVector1 = eigenVector1 * splatScale * min(sqrt8 * sqrt(eigenValue1), ${parseInt(n)}.0);
            vec2 basisVector2 = eigenVector2 * splatScale * min(sqrt8 * sqrt(eigenValue2), ${parseInt(n)}.0);
            `,t&&(r+=`
                vColor.a *= splatOpacityFromScene;
            `),r+=`
            vec2 ndcOffset = vec2(vPosition.x * basisVector1 + vPosition.y * basisVector2) *
                             basisViewport * 2.0 * inverseFocalAdjustment;

            vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);
            gl_Position = quadPos;

            // Scale the position data we send to the fragment shader
            vPosition *= sqrt8;
        `,r+=Xi.getVertexShaderFadeIn(),r+="}",r}static buildFragmentShader(){let e=`
            precision highp float;
            #include <common>
 
            uniform vec3 debugColor;

            varying vec4 vColor;
            varying vec2 vUv;
            varying vec2 vPosition;
        `;return e+=`
            void main () {
                // Compute the positional squared distance from the center of the splat to the current fragment.
                float A = dot(vPosition, vPosition);
                // Since the positional data in vPosition has been scaled by sqrt(8), the squared result will be
                // scaled by a factor of 8. If the squared result is larger than 8, it means it is outside the ellipse
                // defined by the rectangle formed by vPosition. It also means it's farther
                // away than sqrt(8) standard deviations from the mean.
                if (A > 8.0) discard;
                vec3 color = vColor.rgb;

                // Since the rendered splat is scaled by sqrt(8), the inverse covariance matrix that is part of
                // the gaussian formula becomes the identity matrix. We're then left with (X - mean) * (X - mean),
                // and since 'mean' is zero, we have X * X, which is the same as A:
                float opacity = exp(-0.5 * A) * vColor.a;

                gl_FragColor = vec4(color.rgb, opacity);
            }
        `,e}}class Ar{static build(e=!1,t=!1,n=1,i=!1,r=0){let o=Xi.buildVertexShaderBase(e,t,r,`
            uniform vec2 scaleRotationsTextureSize;
            uniform highp sampler2D scaleRotationsTexture;
            varying mat3 vT;
            varying vec2 vQuadCenter;
            varying vec2 vFragCoord;
        `);o+=Ar.buildVertexShaderProjection();const l=Ar.buildFragmentShader(),c=Xi.getUniforms(e,t,r,n,i);return c.scaleRotationsTexture={type:"t",value:null},c.scaleRotationsTextureSize={type:"v2",value:new Fe(1024,1024)},new jt({uniforms:c,vertexShader:o,fragmentShader:l,transparent:!0,alphaTest:1,blending:$n,depthTest:!0,depthWrite:!1,side:nn})}static buildVertexShaderProjection(){let e=`

            vec4 scaleRotationA = texture(scaleRotationsTexture, getDataUVF(nearestEvenIndex, 1.5,
                                                                            oddOffset, scaleRotationsTextureSize));
            vec4 scaleRotationB = texture(scaleRotationsTexture, getDataUVF(nearestEvenIndex, 1.5,
                                                                            oddOffset + uint(1), scaleRotationsTextureSize));

            vec3 scaleRotation123 = vec3(scaleRotationA.rgb) * (1.0 - fOddOffset) +
                                    vec3(scaleRotationA.ba, scaleRotationB.r) * fOddOffset;
            vec3 scaleRotation456 = vec3(scaleRotationA.a, scaleRotationB.rg) * (1.0 - fOddOffset) +
                                    vec3(scaleRotationB.gba) * fOddOffset;

            float missingW = sqrt(1.0 - scaleRotation456.x * scaleRotation456.x - scaleRotation456.y *
                                    scaleRotation456.y - scaleRotation456.z * scaleRotation456.z);
            mat3 R = quaternionToRotationMatrix(scaleRotation456.r, scaleRotation456.g, scaleRotation456.b, missingW);
            mat3 S = mat3(scaleRotation123.r, 0.0, 0.0,
                            0.0, scaleRotation123.g, 0.0,
                            0.0, 0.0, scaleRotation123.b);
            
            mat3 L = R * S;

            mat3x4 splat2World = mat3x4(vec4(L[0], 0.0),
                                        vec4(L[1], 0.0),
                                        vec4(splatCenter.x, splatCenter.y, splatCenter.z, 1.0));

            mat4 world2ndc = transpose(projectionMatrix * transformModelViewMatrix);

            mat3x4 ndc2pix = mat3x4(vec4(viewport.x / 2.0, 0.0, 0.0, (viewport.x - 1.0) / 2.0),
                                    vec4(0.0, viewport.y / 2.0, 0.0, (viewport.y - 1.0) / 2.0),
                                    vec4(0.0, 0.0, 0.0, 1.0));

            mat3 T = transpose(splat2World) * world2ndc * ndc2pix;
            vec3 normal = vec3(viewMatrix * vec4(L[0][2], L[1][2], L[2][2], 0.0));
        `;return e+=`

                mat4 splat2World4 = mat4(vec4(L[0], 0.0),
                                        vec4(L[1], 0.0),
                                        vec4(L[2], 0.0),
                                        vec4(splatCenter.x, splatCenter.y, splatCenter.z, 1.0));

                mat4 Tt = transpose(transpose(splat2World4) * world2ndc);

                vec4 tempPoint1 = Tt * vec4(1.0, 0.0, 0.0, 1.0);
                tempPoint1 /= tempPoint1.w;

                vec4 tempPoint2 = Tt * vec4(0.0, 1.0, 0.0, 1.0);
                tempPoint2 /= tempPoint2.w;

                vec4 center = Tt * vec4(0.0, 0.0, 0.0, 1.0);
                center /= center.w;

                vec2 basisVector1 = tempPoint1.xy - center.xy;
                vec2 basisVector2 = tempPoint2.xy - center.xy;

                vec2 basisVector1Screen = basisVector1 * 0.5 * viewport;
                vec2 basisVector2Screen = basisVector2 * 0.5 * viewport;

                const float minPix = 1.;
                if (length(basisVector1Screen) < minPix || length(basisVector2Screen) < minPix) {
                    
            vec3 T0 = vec3(T[0][0], T[0][1], T[0][2]);
            vec3 T1 = vec3(T[1][0], T[1][1], T[1][2]);
            vec3 T3 = vec3(T[2][0], T[2][1], T[2][2]);

            vec3 tempPoint = vec3(1.0, 1.0, -1.0);
            float distance = (T3.x * T3.x * tempPoint.x) + (T3.y * T3.y * tempPoint.y) + (T3.z * T3.z * tempPoint.z);
            vec3 f = (1.0 / distance) * tempPoint;
            if (abs(distance) < 0.00001) return;

            float pointImageX = (T0.x * T3.x * f.x) + (T0.y * T3.y * f.y) + (T0.z * T3.z * f.z);
            float pointImageY = (T1.x * T3.x * f.x) + (T1.y * T3.y * f.y) + (T1.z * T3.z * f.z);
            vec2 pointImage = vec2(pointImageX, pointImageY);

            float tempX = (T0.x * T0.x * f.x) + (T0.y * T0.y * f.y) + (T0.z * T0.z * f.z);
            float tempY = (T1.x * T1.x * f.x) + (T1.y * T1.y * f.y) + (T1.z * T1.z * f.z);
            vec2 temp = vec2(tempX, tempY);

            vec2 halfExtend = pointImage * pointImage - temp;
            vec2 extent = sqrt(max(vec2(0.0001), halfExtend));
            float radius = max(extent.x, extent.y);

            vec2 ndcOffset = ((position.xy * radius * 3.0) * basisViewport * 2.0);

            vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);
            gl_Position = quadPos;

            vT = T;
            vQuadCenter = pointImage;
            vFragCoord = (quadPos.xy * 0.5 + 0.5) * viewport;
        
                } else {
                    vec2 ndcOffset = vec2(position.x * basisVector1 + position.y * basisVector2) * 3.0 * inverseFocalAdjustment;
                    vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);
                    gl_Position = quadPos;

                    vT = T;
                    vQuadCenter = center.xy;
                    vFragCoord = (quadPos.xy * 0.5 + 0.5) * viewport;
                }
            `,e+=Xi.getVertexShaderFadeIn(),e+="}",e}static buildFragmentShader(){return`
            precision highp float;
            #include <common>

            uniform vec3 debugColor;

            varying vec4 vColor;
            varying vec2 vUv;
            varying vec2 vPosition;
            varying mat3 vT;
            varying vec2 vQuadCenter;
            varying vec2 vFragCoord;

            void main () {

                const float FilterInvSquare = 2.0;
                const float near_n = 0.2;
                const float T = 1.0;

                vec2 xy = vQuadCenter;
                vec3 Tu = vT[0];
                vec3 Tv = vT[1];
                vec3 Tw = vT[2];
                vec3 k = vFragCoord.x * Tw - Tu;
                vec3 l = vFragCoord.y * Tw - Tv;
                vec3 p = cross(k, l);
                if (p.z == 0.0) discard;
                vec2 s = vec2(p.x / p.z, p.y / p.z);
                float rho3d = (s.x * s.x + s.y * s.y); 
                vec2 d = vec2(xy.x - vFragCoord.x, xy.y - vFragCoord.y);
                float rho2d = FilterInvSquare * (d.x * d.x + d.y * d.y); 

                // compute intersection and depth
                float rho = min(rho3d, rho2d);
                float depth = (rho3d <= rho2d) ? (s.x * Tw.x + s.y * Tw.y) + Tw.z : Tw.z; 
                if (depth < near_n) discard;
                //  vec4 nor_o = collected_normal_opacity[j];
                //  float normal[3] = {nor_o.x, nor_o.y, nor_o.z};
                float opa = vColor.a;

                float power = -0.5f * rho;
                if (power > 0.0f) discard;

                // Eq. (2) from 3D Gaussian splatting paper.
                // Obtain alpha by multiplying with Gaussian opacity
                // and its exponential falloff from mean.
                // Avoid numerical instabilities (see paper appendix). 
                float alpha = min(0.99f, opa * exp(power));
                if (alpha < 1.0f / 255.0f) discard;
                float test_T = T * (1.0 - alpha);
                if (test_T < 0.0001)discard;

                float w = alpha * T;
                gl_FragColor = vec4(vColor.rgb, w);
            }
        `}}class B0{static build(e){const t=new an;t.setIndex([0,1,2,0,2,3]);const n=new Float32Array(4*3),i=new rn(n,3);t.setAttribute("position",i),i.setXYZ(0,-1,-1,0),i.setXYZ(1,-1,1,0),i.setXYZ(2,1,1,0),i.setXYZ(3,1,-1,0),i.needsUpdate=!0;const r=new Cg().copy(t),a=new Uint32Array(e),o=new Eg(a,1,!1);return o.setUsage(rd),r.setAttribute("splatIndex",o),r.instanceCount=0,r}}class L0 extends Ct{constructor(e,t=new P,n=new St,i=new P(1,1,1),r=1,a=1,o=!0){super(),this.splatBuffer=e,this.position.copy(t),this.quaternion.copy(n),this.scale.copy(i),this.transform=new Ge,this.minimumAlpha=r,this.opacity=a,this.visible=o}copyTransformData(e){this.position.copy(e.position),this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.transform.copy(e.transform)}updateTransform(e){e?(this.matrixWorldAutoUpdate&&this.updateWorldMatrix(!0,!1),this.transform.copy(this.matrixWorld)):(this.matrixAutoUpdate&&this.updateMatrix(),this.transform.copy(this.matrix))}}const xr=class xr{constructor(e,t,n,i){this.min=new P().copy(e),this.max=new P().copy(t),this.boundingBox=new An(this.min,this.max),this.center=new P().copy(this.max).sub(this.min).multiplyScalar(.5).add(this.min),this.depth=n,this.children=[],this.data=null,this.id=i||xr.idGen++}};fe(xr,"idGen",0);let so=xr;class gs{constructor(e,t){this.maxDepth=e,this.maxCentersPerNode=t,this.sceneDimensions=new P,this.sceneMin=new P,this.sceneMax=new P,this.rootNode=null,this.nodesWithIndexes=[],this.splatMesh=null}static convertWorkerSubTreeNode(e){const t=new P().fromArray(e.min),n=new P().fromArray(e.max),i=new so(t,n,e.depth,e.id);if(e.data.indexes){i.data={indexes:[]};for(let r of e.data.indexes)i.data.indexes.push(r)}if(e.children)for(let r of e.children)i.children.push(gs.convertWorkerSubTreeNode(r));return i}static convertWorkerSubTree(e,t){const n=new gs(e.maxDepth,e.maxCentersPerNode);n.sceneMin=new P().fromArray(e.sceneMin),n.sceneMax=new P().fromArray(e.sceneMax),n.splatMesh=t,n.rootNode=gs.convertWorkerSubTreeNode(e.rootNode);const i=(r,a)=>{r.children.length===0&&a(r);for(let o of r.children)i(o,a)};return n.nodesWithIndexes=[],i(n.rootNode,r=>{r.data&&r.data.indexes&&r.data.indexes.length>0&&n.nodesWithIndexes.push(r)}),n}}function U0(s){let e=0;class t{constructor(l,c){this.min=[l[0],l[1],l[2]],this.max=[c[0],c[1],c[2]]}containsPoint(l){return l[0]>=this.min[0]&&l[0]<=this.max[0]&&l[1]>=this.min[1]&&l[1]<=this.max[1]&&l[2]>=this.min[2]&&l[2]<=this.max[2]}}class n{constructor(l,c){this.maxDepth=l,this.maxCentersPerNode=c,this.sceneDimensions=[],this.sceneMin=[],this.sceneMax=[],this.rootNode=null,this.addedIndexes={},this.nodesWithIndexes=[],this.splatMesh=null,this.disposed=!1}}class i{constructor(l,c,u,d){this.min=[l[0],l[1],l[2]],this.max=[c[0],c[1],c[2]],this.center=[(c[0]-l[0])*.5+l[0],(c[1]-l[1])*.5+l[1],(c[2]-l[2])*.5+l[2]],this.depth=u,this.children=[],this.data=null,this.id=d||e++}}processSplatTreeNode=function(o,l,c,u){const d=l.data.indexes.length;if(d<o.maxCentersPerNode||l.depth>o.maxDepth){const S=[];for(let _=0;_<l.data.indexes.length;_++)o.addedIndexes[l.data.indexes[_]]||(S.push(l.data.indexes[_]),o.addedIndexes[l.data.indexes[_]]=!0);l.data.indexes=S,l.data.indexes.sort((_,x)=>_>x?1:-1),o.nodesWithIndexes.push(l);return}const f=[l.max[0]-l.min[0],l.max[1]-l.min[1],l.max[2]-l.min[2]],h=[f[0]*.5,f[1]*.5,f[2]*.5],g=[l.min[0]+h[0],l.min[1]+h[1],l.min[2]+h[2]],A=[new t([g[0]-h[0],g[1],g[2]-h[2]],[g[0],g[1]+h[1],g[2]]),new t([g[0],g[1],g[2]-h[2]],[g[0]+h[0],g[1]+h[1],g[2]]),new t([g[0],g[1],g[2]],[g[0]+h[0],g[1]+h[1],g[2]+h[2]]),new t([g[0]-h[0],g[1],g[2]],[g[0],g[1]+h[1],g[2]+h[2]]),new t([g[0]-h[0],g[1]-h[1],g[2]-h[2]],[g[0],g[1],g[2]]),new t([g[0],g[1]-h[1],g[2]-h[2]],[g[0]+h[0],g[1],g[2]]),new t([g[0],g[1]-h[1],g[2]],[g[0]+h[0],g[1],g[2]+h[2]]),new t([g[0]-h[0],g[1]-h[1],g[2]],[g[0],g[1],g[2]+h[2]])],m=[];for(let S=0;S<A.length;S++)m[S]=[];const p=[0,0,0];for(let S=0;S<d;S++){const _=l.data.indexes[S],x=c[_];p[0]=u[x],p[1]=u[x+1],p[2]=u[x+2];for(let T=0;T<A.length;T++)A[T].containsPoint(p)&&m[T].push(_)}for(let S=0;S<A.length;S++){const _=new i(A[S].min,A[S].max,l.depth+1);_.data={indexes:m[S]},l.children.push(_)}l.data={};for(let S of l.children)processSplatTreeNode(o,S,c,u)};const r=(o,l,c)=>{const u=[0,0,0],d=[0,0,0],f=[],h=Math.floor(o.length/4);for(let A=0;A<h;A++){const m=A*4,p=o[m],S=o[m+1],_=o[m+2],x=Math.round(o[m+3]);(A===0||p<u[0])&&(u[0]=p),(A===0||p>d[0])&&(d[0]=p),(A===0||S<u[1])&&(u[1]=S),(A===0||S>d[1])&&(d[1]=S),(A===0||_<u[2])&&(u[2]=_),(A===0||_>d[2])&&(d[2]=_),f.push(x)}const g=new n(l,c);return g.sceneMin=u,g.sceneMax=d,g.rootNode=new i(g.sceneMin,g.sceneMax,0),g.rootNode.data={indexes:f},g};function a(o,l,c){const u=[];for(let f of o){const h=Math.floor(f.length/4);for(let g=0;g<h;g++){const A=g*4,m=Math.round(f[A+3]);u[m]=A}}const d=[];for(let f of o){const h=r(f,l,c);d.push(h),processSplatTreeNode(h,h.rootNode,u,f)}s.postMessage({subTrees:d})}s.onmessage=o=>{o.data.process&&a(o.data.process.centers,o.data.process.maxDepth,o.data.process.maxCentersPerNode)}}function N0(s,e,t,n,i){s.postMessage({process:{centers:e,maxDepth:n,maxCentersPerNode:i}},t)}function O0(){return new Worker(URL.createObjectURL(new Blob(["(",U0.toString(),")(self)"],{type:"application/javascript"})))}class z0{constructor(e,t){fe(this,"processSplatMesh",function(e,t=()=>!0,n,i){this.splatTreeWorker||(this.splatTreeWorker=O0()),this.splatMesh=e,this.subTrees=[];const r=new P,a=(o,l)=>{const c=new Float32Array(l*4);let u=0;for(let d=0;d<l;d++){const f=d+o;if(t(f)){e.getSplatCenter(f,r);const h=u*4;c[h]=r.x,c[h+1]=r.y,c[h+2]=r.z,c[h+3]=f,u++}}return c};return new Promise(o=>{const l=()=>this.disposed?(this.diposeSplatTreeWorker(),o(),!0):!1;n&&n(!1),Qt(()=>{if(l())return;const c=[];if(e.dynamicMode){let u=0;for(let d=0;d<e.scenes.length;d++){const h=e.getScene(d).splatBuffer.getSplatCount(),g=a(u,h);c.push(g),u+=h}}else{const u=a(0,e.getSplatCount());c.push(u)}this.splatTreeWorker.onmessage=u=>{l()||u.data.subTrees&&(i&&i(!1),Qt(()=>{if(!l()){for(let d of u.data.subTrees){const f=gs.convertWorkerSubTree(d,e);this.subTrees.push(f)}this.diposeSplatTreeWorker(),i&&i(!0),Qt(()=>{o()})}}))},Qt(()=>{if(l())return;n&&n(!0);const u=c.map(d=>d.buffer);N0(this.splatTreeWorker,c,u,this.maxDepth,this.maxCentersPerNode)})})})});this.maxDepth=e,this.maxCentersPerNode=t,this.subTrees=[],this.splatMesh=null}dispose(){this.diposeSplatTreeWorker(),this.disposed=!0}diposeSplatTreeWorker(){this.splatTreeWorker&&this.splatTreeWorker.terminate(),this.splatTreeWorker=null}countLeaves(){let e=0;return this.visitLeaves(()=>{e++}),e}visitLeaves(e){const t=(n,i)=>{n.children.length===0&&i(n);for(let r of n.children)t(r,i)};for(let n of this.subTrees)t(n.rootNode,e)}}function H0(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function k0(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const M=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(M.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(M){if(M==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";M="mediump"}return M==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),A=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),S=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,x=a||e.has("OES_texture_float"),T=_&&x,E=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:f,maxTextureSize:h,maxCubemapSize:g,maxAttributes:A,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:S,vertexTextures:_,floatFragmentTextures:x,floatVertexTextures:T,maxSamples:E}}const As={Default:0,Instant:2},qi={None:0,Info:3},uc=new an,V0=new Ai,ir=6,G0=4,W0=4,X0=4,q0=6,Q0=8,ua=4,da=4,dc=1,Y0=.012,K0=.003,hc=1,fc=16777216;class Rt extends vt{constructor(t=Dn.ThreeD,n=!1,i=!1,r=!1,a=1,o=!0,l=!1,c=!1,u=1024,d=qi.None,f=0,h=1,g=.3){super(uc,V0);fe(this,"buildSplatTree",function(t=[],n,i){return new Promise(r=>{this.disposeSplatTree(),this.baseSplatTree=new z0(8,1e3);const a=performance.now(),o=new At;this.baseSplatTree.processSplatMesh(this,l=>{this.getSplatColor(l,o);const c=this.getSceneIndexForSplat(l),u=t[c]||1;return o.w>=u},n,i).then(()=>{const l=performance.now()-a;if(this.logLevel>=qi.Info&&console.log("SplatTree build: "+l+" ms"),this.disposed)r();else{this.splatTree=this.baseSplatTree,this.baseSplatTree=null;let c=0,u=0,d=0;this.splatTree.visitLeaves(f=>{const h=f.data.indexes.length;h>0&&(u+=h,d++,c++)}),this.logLevel>=qi.Info&&(console.log(`SplatTree leaves: ${this.splatTree.countLeaves()}`),console.log(`SplatTree leaves with splats:${c}`),u=u/d,console.log(`Avg splat count per node: ${u}`),console.log(`Total splat count: ${this.getSplatCount()}`)),r()}})})});fe(this,"updateUniforms",function(){const t=new Fe;return function(n,i,r,a,o,l){if(this.getSplatCount()>0){if(t.set(n.x*this.devicePixelRatio,n.y*this.devicePixelRatio),this.material.uniforms.viewport.value.copy(t),this.material.uniforms.basisViewport.value.set(1/t.x,1/t.y),this.material.uniforms.focal.value.set(i,r),this.material.uniforms.orthographicMode.value=a?1:0,this.material.uniforms.orthoZoom.value=o,this.material.uniforms.inverseFocalAdjustment.value=l,this.dynamicMode)for(let u=0;u<this.scenes.length;u++)this.material.uniforms.transforms.value[u].copy(this.getScene(u).transform);if(this.enableOptionalEffects)for(let u=0;u<this.scenes.length;u++)this.material.uniforms.sceneOpacity.value[u]=gt(this.getScene(u).opacity,0,1),this.material.uniforms.sceneVisibility.value[u]=this.getScene(u).visible?1:0,this.material.uniformsNeedUpdate=!0;this.material.uniformsNeedUpdate=!0}}}());fe(this,"setupDistancesComputationTransformFeedback",function(){let t;return function(){const n=this.getMaxSplatCount();if(!this.renderer)return;const i=this.lastRenderer!==this.renderer,r=t!==n;if(!i&&!r)return;i?this.disposeDistancesComputationGPUResources():r&&this.disposeDistancesComputationGPUBufferResources();const a=this.renderer.getContext(),o=(h,g,A)=>{const m=h.createShader(g);if(!m)return console.error("Fatal error: gl could not create a shader object."),null;if(h.shaderSource(m,A),h.compileShader(m),!h.getShaderParameter(m,h.COMPILE_STATUS)){let S="unknown";g===h.VERTEX_SHADER?S="vertex shader":g===h.FRAGMENT_SHADER&&(S="fragement shader");const _=h.getShaderInfoLog(m);return console.error("Failed to compile "+S+" with these errors:"+_),h.deleteShader(m),null}return m};let l;this.integerBasedDistancesComputation?(l=`#version 300 es
                in ivec4 center;
                flat out int distance;`,this.dynamicMode?l+=`
                        in uint sceneIndex;
                        uniform ivec4 transforms[${Ze.MaxScenes}];
                        void main(void) {
                            ivec4 transform = transforms[sceneIndex];
                            distance = center.x * transform.x + center.y * transform.y + center.z * transform.z + transform.w * center.w;
                        }
                    `:l+=`
                        uniform ivec3 modelViewProj;
                        void main(void) {
                            distance = center.x * modelViewProj.x + center.y * modelViewProj.y + center.z * modelViewProj.z;
                        }
                    `):(l=`#version 300 es
                in vec4 center;
                flat out float distance;`,this.dynamicMode?l+=`
                        in uint sceneIndex;
                        uniform mat4 transforms[${Ze.MaxScenes}];
                        void main(void) {
                            vec4 transformedCenter = transforms[sceneIndex] * vec4(center.xyz, 1.0);
                            distance = transformedCenter.z;
                        }
                    `:l+=`
                        uniform vec3 modelViewProj;
                        void main(void) {
                            distance = center.x * modelViewProj.x + center.y * modelViewProj.y + center.z * modelViewProj.z;
                        }
                    `);const c=`#version 300 es
                precision lowp float;
                out vec4 fragColor;
                void main(){}
            `,u=a.getParameter(a.VERTEX_ARRAY_BINDING),d=a.getParameter(a.CURRENT_PROGRAM),f=d?a.getProgramParameter(d,a.DELETE_STATUS):!1;if(i&&(this.distancesTransformFeedback.vao=a.createVertexArray()),a.bindVertexArray(this.distancesTransformFeedback.vao),i){const h=a.createProgram(),g=o(a,a.VERTEX_SHADER,l),A=o(a,a.FRAGMENT_SHADER,c);if(!g||!A)throw new Error("Could not compile shaders for distances computation on GPU.");if(a.attachShader(h,g),a.attachShader(h,A),a.transformFeedbackVaryings(h,["distance"],a.SEPARATE_ATTRIBS),a.linkProgram(h),!a.getProgramParameter(h,a.LINK_STATUS)){const p=a.getProgramInfoLog(h);throw console.error("Fatal error: Failed to link program: "+p),a.deleteProgram(h),a.deleteShader(A),a.deleteShader(g),new Error("Could not link shaders for distances computation on GPU.")}this.distancesTransformFeedback.program=h,this.distancesTransformFeedback.vertexShader=g,this.distancesTransformFeedback.vertexShader=A}if(a.useProgram(this.distancesTransformFeedback.program),this.distancesTransformFeedback.centersLoc=a.getAttribLocation(this.distancesTransformFeedback.program,"center"),this.dynamicMode){this.distancesTransformFeedback.sceneIndexesLoc=a.getAttribLocation(this.distancesTransformFeedback.program,"sceneIndex");for(let h=0;h<this.scenes.length;h++)this.distancesTransformFeedback.transformsLocs[h]=a.getUniformLocation(this.distancesTransformFeedback.program,`transforms[${h}]`)}else this.distancesTransformFeedback.modelViewProjLoc=a.getUniformLocation(this.distancesTransformFeedback.program,"modelViewProj");(i||r)&&(this.distancesTransformFeedback.centersBuffer=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,this.distancesTransformFeedback.centersBuffer),a.enableVertexAttribArray(this.distancesTransformFeedback.centersLoc),this.integerBasedDistancesComputation?a.vertexAttribIPointer(this.distancesTransformFeedback.centersLoc,4,a.INT,0,0):a.vertexAttribPointer(this.distancesTransformFeedback.centersLoc,4,a.FLOAT,!1,0,0),this.dynamicMode&&(this.distancesTransformFeedback.sceneIndexesBuffer=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,this.distancesTransformFeedback.sceneIndexesBuffer),a.enableVertexAttribArray(this.distancesTransformFeedback.sceneIndexesLoc),a.vertexAttribIPointer(this.distancesTransformFeedback.sceneIndexesLoc,1,a.UNSIGNED_INT,0,0))),(i||r)&&(this.distancesTransformFeedback.outDistancesBuffer=a.createBuffer()),a.bindBuffer(a.ARRAY_BUFFER,this.distancesTransformFeedback.outDistancesBuffer),a.bufferData(a.ARRAY_BUFFER,n*4,a.STATIC_READ),i&&(this.distancesTransformFeedback.id=a.createTransformFeedback()),a.bindTransformFeedback(a.TRANSFORM_FEEDBACK,this.distancesTransformFeedback.id),a.bindBufferBase(a.TRANSFORM_FEEDBACK_BUFFER,0,this.distancesTransformFeedback.outDistancesBuffer),d&&f!==!0&&a.useProgram(d),u&&a.bindVertexArray(u),this.lastRenderer=this.renderer,t=n}}());fe(this,"fillTransformsArray",function(){const t=[];return function(n){t.length!==n.length&&(t.length=n.length);for(let i=0;i<this.scenes.length;i++){const a=this.getScene(i).transform.elements;for(let o=0;o<16;o++)t[i*16+o]=a[o]}n.set(t)}}());fe(this,"computeDistancesOnGPU",function(){const t=new Ge;return function(n,i){if(!this.renderer)return;const r=this.renderer.getContext(),a=r.getParameter(r.VERTEX_ARRAY_BINDING),o=r.getParameter(r.CURRENT_PROGRAM),l=o?r.getProgramParameter(o,r.DELETE_STATUS):!1;if(r.bindVertexArray(this.distancesTransformFeedback.vao),r.useProgram(this.distancesTransformFeedback.program),r.enable(r.RASTERIZER_DISCARD),this.dynamicMode)for(let d=0;d<this.scenes.length;d++)if(t.copy(this.getScene(d).transform),t.premultiply(n),this.integerBasedDistancesComputation){const f=Rt.getIntegerMatrixArray(t),h=[f[2],f[6],f[10],f[14]];r.uniform4i(this.distancesTransformFeedback.transformsLocs[d],h[0],h[1],h[2],h[3])}else r.uniformMatrix4fv(this.distancesTransformFeedback.transformsLocs[d],!1,t.elements);else if(this.integerBasedDistancesComputation){const d=Rt.getIntegerMatrixArray(n),f=[d[2],d[6],d[10]];r.uniform3i(this.distancesTransformFeedback.modelViewProjLoc,f[0],f[1],f[2])}else{const d=[n.elements[2],n.elements[6],n.elements[10]];r.uniform3f(this.distancesTransformFeedback.modelViewProjLoc,d[0],d[1],d[2])}r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.centersBuffer),r.enableVertexAttribArray(this.distancesTransformFeedback.centersLoc),this.integerBasedDistancesComputation?r.vertexAttribIPointer(this.distancesTransformFeedback.centersLoc,4,r.INT,0,0):r.vertexAttribPointer(this.distancesTransformFeedback.centersLoc,4,r.FLOAT,!1,0,0),this.dynamicMode&&(r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.sceneIndexesBuffer),r.enableVertexAttribArray(this.distancesTransformFeedback.sceneIndexesLoc),r.vertexAttribIPointer(this.distancesTransformFeedback.sceneIndexesLoc,1,r.UNSIGNED_INT,0,0)),r.bindTransformFeedback(r.TRANSFORM_FEEDBACK,this.distancesTransformFeedback.id),r.bindBufferBase(r.TRANSFORM_FEEDBACK_BUFFER,0,this.distancesTransformFeedback.outDistancesBuffer),r.beginTransformFeedback(r.POINTS),r.drawArrays(r.POINTS,0,this.getSplatCount()),r.endTransformFeedback(),r.bindBufferBase(r.TRANSFORM_FEEDBACK_BUFFER,0,null),r.bindTransformFeedback(r.TRANSFORM_FEEDBACK,null),r.disable(r.RASTERIZER_DISCARD);const c=r.fenceSync(r.SYNC_GPU_COMMANDS_COMPLETE,0);r.flush();const u=new Promise(d=>{const f=()=>{if(this.disposed)d();else switch(r.clientWaitSync(c,0,0)){case r.TIMEOUT_EXPIRED:return this.computeDistancesOnGPUSyncTimeout=setTimeout(f),this.computeDistancesOnGPUSyncTimeout;case r.WAIT_FAILED:throw new Error("should never get here");default:this.computeDistancesOnGPUSyncTimeout=null,r.deleteSync(c);const m=r.getParameter(r.VERTEX_ARRAY_BINDING);r.bindVertexArray(this.distancesTransformFeedback.vao),r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.outDistancesBuffer),r.getBufferSubData(r.ARRAY_BUFFER,0,i),r.bindBuffer(r.ARRAY_BUFFER,null),m&&r.bindVertexArray(m),d()}};this.computeDistancesOnGPUSyncTimeout=setTimeout(f)});return o&&l!==!0&&r.useProgram(o),a&&r.bindVertexArray(a),u}}());fe(this,"getSplatCenter",function(){const t={};return function(n,i,r){this.getLocalSplatParameters(n,t,r),t.splatBuffer.getSplatCenter(t.localIndex,i,t.sceneTransform)}}());fe(this,"getSplatScaleAndRotation",function(){const t={},n=new P;return function(i,r,a,o){this.getLocalSplatParameters(i,t,o),n.x=void 0,n.y=void 0,n.z=void 0,this.splatRenderMode===Dn.TwoD&&(n.z=0),t.splatBuffer.getSplatScaleAndRotation(t.localIndex,r,a,t.sceneTransform,n)}}());fe(this,"getSplatColor",function(){const t={};return function(n,i){this.getLocalSplatParameters(n,t),t.splatBuffer.getSplatColor(t.localIndex,i)}}());this.renderer=void 0,this.splatRenderMode=t,this.dynamicMode=n,this.enableOptionalEffects=i,this.halfPrecisionCovariancesOnGPU=r,this.devicePixelRatio=a,this.enableDistancesComputationOnGPU=o,this.integerBasedDistancesComputation=l,this.antialiased=c,this.kernel2DSize=g,this.maxScreenSpaceSplatSize=u,this.logLevel=d,this.sphericalHarmonicsDegree=f,this.minSphericalHarmonicsDegree=0,this.sceneFadeInRateMultiplier=h,this.scenes=[],this.splatTree=null,this.baseSplatTree=null,this.splatDataTextures={},this.distancesTransformFeedback={id:null,vertexShader:null,fragmentShader:null,program:null,centersBuffer:null,sceneIndexesBuffer:null,outDistancesBuffer:null,centersLoc:-1,modelViewProjLoc:-1,sceneIndexesLoc:-1,transformsLocs:[]},this.globalSplatIndexToLocalSplatIndexMap=[],this.globalSplatIndexToSceneIndexMap=[],this.lastBuildSplatCount=0,this.lastBuildScenes=[],this.lastBuildMaxSplatCount=0,this.lastBuildSceneCount=0,this.firstRenderTime=-1,this.finalBuild=!1,this.webGLUtils=null,this.boundingBox=new An,this.calculatedSceneCenter=new P,this.maxSplatDistanceFromSceneCenter=0,this.visibleRegionBufferRadius=0,this.visibleRegionRadius=0,this.visibleRegionFadeStartRadius=0,this.visibleRegionChanging=!1,this.splatScale=1,this.pointCloudModeEnabled=!1,this.disposed=!1,this.lastRenderer=null,this.visible=!1}static buildScenes(t,n,i){const r=[];r.length=n.length;for(let a=0;a<n.length;a++){const o=n[a],l=i[a]||{};let c=l.position||[0,0,0],u=l.rotation||[0,0,0,1],d=l.scale||[1,1,1];const f=new P().fromArray(c),h=new St().fromArray(u),g=new P().fromArray(d),A=Rt.createScene(o,f,h,g,l.splatAlphaRemovalThreshold||1,l.opacity,l.visible);t.add(A),r[a]=A}return r}static createScene(t,n,i,r,a,o=1,l=!0){return new L0(t,n,i,r,a,o,l)}static buildSplatIndexMaps(t){const n=[],i=[];let r=0;for(let a=0;a<t.length;a++){const l=t[a].getMaxSplatCount();for(let c=0;c<l;c++)n[r]=c,i[r]=a,r++}return{localSplatIndexMap:n,sceneIndexMap:i}}build(t,n,i=!0,r=!1,a,o,l=!0){this.sceneOptions=n,this.finalBuild=r;const c=Rt.getTotalMaxSplatCountForSplatBuffers(t),u=Rt.buildScenes(this,t,n);if(i)for(let m=0;m<this.scenes.length&&m<u.length;m++){const p=u[m],S=this.getScene(m);p.copyTransformData(S)}this.scenes=u;let d=3;for(let m of t){const p=m.getMinSphericalHarmonicsDegree();p<d&&(d=p)}this.minSphericalHarmonicsDegree=Math.min(d,this.sphericalHarmonicsDegree);let f=!1;if(t.length!==this.lastBuildScenes.length)f=!0;else for(let m=0;m<t.length;m++)if(t[m]!==this.lastBuildScenes[m].splatBuffer){f=!0;break}let h=!0;if((this.scenes.length!==1||this.lastBuildSceneCount!==this.scenes.length||this.lastBuildMaxSplatCount!==c||f)&&(h=!1),!h){this.boundingBox=new An,l||(this.maxSplatDistanceFromSceneCenter=0,this.visibleRegionBufferRadius=0,this.visibleRegionRadius=0,this.visibleRegionFadeStartRadius=0,this.firstRenderTime=-1),this.lastBuildScenes=[],this.lastBuildSplatCount=0,this.lastBuildMaxSplatCount=0,this.disposeMeshData(),this.geometry=B0.build(c),this.splatRenderMode===Dn.ThreeD?this.material=gr.build(this.dynamicMode,this.enableOptionalEffects,this.antialiased,this.maxScreenSpaceSplatSize,this.splatScale,this.pointCloudModeEnabled,this.minSphericalHarmonicsDegree,this.kernel2DSize):this.material=Ar.build(this.dynamicMode,this.enableOptionalEffects,this.splatScale,this.pointCloudModeEnabled,this.minSphericalHarmonicsDegree);const m=Rt.buildSplatIndexMaps(t);this.globalSplatIndexToLocalSplatIndexMap=m.localSplatIndexMap,this.globalSplatIndexToSceneIndexMap=m.sceneIndexMap}const g=this.getSplatCount(!0);this.enableDistancesComputationOnGPU&&this.setupDistancesComputationTransformFeedback();const A=this.refreshGPUDataFromSplatBuffers(h);for(let m=0;m<this.scenes.length;m++)this.lastBuildScenes[m]=this.scenes[m];return this.lastBuildSplatCount=g,this.lastBuildMaxSplatCount=this.getMaxSplatCount(),this.lastBuildSceneCount=this.scenes.length,r&&this.scenes.length>0&&this.buildSplatTree(n.map(m=>m.splatAlphaRemovalThreshold||1),a,o).then(()=>{this.onSplatTreeReadyCallback&&this.onSplatTreeReadyCallback(this.splatTree),this.onSplatTreeReadyCallback=null}),this.visible=this.scenes.length>0,A}freeIntermediateSplatData(){const t=n=>{delete n.source.data,delete n.image,n.onUpdate=null};delete this.splatDataTextures.baseData.covariances,delete this.splatDataTextures.baseData.centers,delete this.splatDataTextures.baseData.colors,delete this.splatDataTextures.baseData.sphericalHarmonics,delete this.splatDataTextures.centerColors.data,delete this.splatDataTextures.covariances.data,this.splatDataTextures.sphericalHarmonics&&delete this.splatDataTextures.sphericalHarmonics.data,this.splatDataTextures.sceneIndexes&&delete this.splatDataTextures.sceneIndexes.data,this.splatDataTextures.centerColors.texture.needsUpdate=!0,this.splatDataTextures.centerColors.texture.onUpdate=()=>{t(this.splatDataTextures.centerColors.texture)},this.splatDataTextures.covariances.texture.needsUpdate=!0,this.splatDataTextures.covariances.texture.onUpdate=()=>{t(this.splatDataTextures.covariances.texture)},this.splatDataTextures.sphericalHarmonics&&(this.splatDataTextures.sphericalHarmonics.texture?(this.splatDataTextures.sphericalHarmonics.texture.needsUpdate=!0,this.splatDataTextures.sphericalHarmonics.texture.onUpdate=()=>{t(this.splatDataTextures.sphericalHarmonics.texture)}):this.splatDataTextures.sphericalHarmonics.textures.forEach(n=>{n.needsUpdate=!0,n.onUpdate=()=>{t(n)}})),this.splatDataTextures.sceneIndexes&&(this.splatDataTextures.sceneIndexes.texture.needsUpdate=!0,this.splatDataTextures.sceneIndexes.texture.onUpdate=()=>{t(this.splatDataTextures.sceneIndexes.texture)})}dispose(){this.disposeMeshData(),this.disposeTextures(),this.disposeSplatTree(),this.enableDistancesComputationOnGPU&&(this.computeDistancesOnGPUSyncTimeout&&(clearTimeout(this.computeDistancesOnGPUSyncTimeout),this.computeDistancesOnGPUSyncTimeout=null),this.disposeDistancesComputationGPUResources()),this.scenes=[],this.distancesTransformFeedback={id:null,vertexShader:null,fragmentShader:null,program:null,centersBuffer:null,sceneIndexesBuffer:null,outDistancesBuffer:null,centersLoc:-1,modelViewProjLoc:-1,sceneIndexesLoc:-1,transformsLocs:[]},this.renderer=null,this.globalSplatIndexToLocalSplatIndexMap=[],this.globalSplatIndexToSceneIndexMap=[],this.lastBuildSplatCount=0,this.lastBuildScenes=[],this.lastBuildMaxSplatCount=0,this.lastBuildSceneCount=0,this.firstRenderTime=-1,this.finalBuild=!1,this.webGLUtils=null,this.boundingBox=new An,this.calculatedSceneCenter=new P,this.maxSplatDistanceFromSceneCenter=0,this.visibleRegionBufferRadius=0,this.visibleRegionRadius=0,this.visibleRegionFadeStartRadius=0,this.visibleRegionChanging=!1,this.splatScale=1,this.pointCloudModeEnabled=!1,this.disposed=!0,this.lastRenderer=null,this.visible=!1}disposeMeshData(){this.geometry&&this.geometry!==uc&&(this.geometry.dispose(),this.geometry=null),this.material&&(this.material.dispose(),this.material=null)}disposeTextures(){for(let t in this.splatDataTextures)if(this.splatDataTextures.hasOwnProperty(t)){const n=this.splatDataTextures[t];n.texture&&(n.texture.dispose(),n.texture=null)}this.splatDataTextures=null}disposeSplatTree(){this.splatTree&&(this.splatTree.dispose(),this.splatTree=null),this.baseSplatTree&&(this.baseSplatTree.dispose(),this.baseSplatTree=null)}getSplatTree(){return this.splatTree}onSplatTreeReady(t){this.onSplatTreeReadyCallback=t}getDataForDistancesComputation(t,n){const i=this.integerBasedDistancesComputation?this.getIntegerCenters(t,n,!0):this.getFloatCenters(t,n,!0),r=this.getSceneIndexes(t,n);return{centers:i,sceneIndexes:r}}refreshGPUDataFromSplatBuffers(t){const n=this.getSplatCount(!0);this.refreshDataTexturesFromSplatBuffers(t);const i=t?this.lastBuildSplatCount:0,{centers:r,sceneIndexes:a}=this.getDataForDistancesComputation(i,n-1);return this.enableDistancesComputationOnGPU&&this.refreshGPUBuffersForDistancesComputation(r,a,t),{from:i,to:n-1,count:n-i,centers:r,sceneIndexes:a}}refreshGPUBuffersForDistancesComputation(t,n,i=!1){const r=i?this.lastBuildSplatCount:0;this.updateGPUCentersBufferForDistancesComputation(i,t,r),this.updateGPUTransformIndexesBufferForDistancesComputation(i,n,r)}refreshDataTexturesFromSplatBuffers(t){const n=this.getSplatCount(!0),i=this.lastBuildSplatCount,r=n-1;t?this.updateBaseDataFromSplatBuffers(i,r):(this.setupDataTextures(),this.updateBaseDataFromSplatBuffers()),this.updateDataTexturesFromBaseData(i,r),this.updateVisibleRegion(t)}setupDataTextures(){const t=this.getMaxSplatCount(),n=this.getSplatCount(!0);this.disposeTextures();const i=(w,y)=>{const v=new Fe(4096,1024);for(;v.x*v.y*w<t*y;)v.y*=2;return v},r=w=>w>=1?q0:W0,a=w=>{const y=r(w),v=i(y,6);return{elementsPerTexelStored:y,texSize:v}};let o=this.getTargetCovarianceCompressionLevel();const l=0,c=this.getTargetSphericalHarmonicsCompressionLevel();let u,d,f;if(this.splatRenderMode===Dn.ThreeD){const w=a(o);w.texSize.x*w.texSize.y>fc&&o===0&&(o=1),u=new Float32Array(t*ir)}else d=new Float32Array(t*3),f=new Float32Array(t*4);const h=new Float32Array(t*3),g=new Uint8Array(t*4);let A=Float32Array;c===1?A=Uint16Array:c===2&&(A=Uint8Array);const m=Wi(this.minSphericalHarmonicsDegree),p=this.minSphericalHarmonicsDegree?new A(t*m):void 0,S=i(da,4),_=new Uint32Array(S.x*S.y*da);Rt.updateCenterColorsPaddedData(0,n-1,h,g,_);const x=new qn(_,S.x,S.y,Vi,sn);if(x.internalFormat="RGBA32UI",x.needsUpdate=!0,this.material.uniforms.centersColorsTexture.value=x,this.material.uniforms.centersColorsTextureSize.value.copy(S),this.material.uniformsNeedUpdate=!0,this.splatDataTextures={baseData:{covariances:u,scales:d,rotations:f,centers:h,colors:g,sphericalHarmonics:p},centerColors:{data:_,texture:x,size:S}},this.splatRenderMode===Dn.ThreeD){const w=a(o),y=w.elementsPerTexelStored,v=w.texSize;let I=o>=1?Uint32Array:Float32Array;const U=o>=1?Q0:X0,F=new I(v.x*v.y*U);o===0?F.set(u):Rt.updatePaddedCompressedCovariancesTextureData(u,F,0,0,u.length);let B;if(o>=1)B=new qn(F,v.x,v.y,Vi,sn),B.internalFormat="RGBA32UI",this.material.uniforms.covariancesTextureHalfFloat.value=B;else{B=new qn(F,v.x,v.y,Nt,fn),this.material.uniforms.covariancesTexture.value=B;const z=new qn(new Uint32Array(32),2,2,Vi,sn);z.internalFormat="RGBA32UI",this.material.uniforms.covariancesTextureHalfFloat.value=z,z.needsUpdate=!0}B.needsUpdate=!0,this.material.uniforms.covariancesAreHalfFloat.value=o>=1?1:0,this.material.uniforms.covariancesTextureSize.value.copy(v),this.splatDataTextures.covariances={data:F,texture:B,size:v,compressionLevel:o,elementsPerTexelStored:y,elementsPerTexelAllocated:U}}else{const y=i(ua,6);let v=Float32Array,I=fn;const U=new v(y.x*y.y*ua);Rt.updateScaleRotationsPaddedData(0,n-1,d,f,U);const F=new qn(U,y.x,y.y,Nt,I);F.needsUpdate=!0,this.material.uniforms.scaleRotationsTexture.value=F,this.material.uniforms.scaleRotationsTextureSize.value.copy(y),this.splatDataTextures.scaleRotations={data:U,texture:F,size:y,compressionLevel:l}}if(p){const w=c===2?vn:ts;let y=m;y%2!==0&&y++;const v=4,I=Nt;let U=i(v,y);if(U.x*U.y<=fc){const F=U.x*U.y*v,B=new A(F);for(let N=0;N<n;N++){const q=m*N,H=y*N;for(let X=0;X<m;X++)B[H+X]=p[q+X]}const z=new qn(B,U.x,U.y,I,w);z.needsUpdate=!0,this.material.uniforms.sphericalHarmonicsTexture.value=z,this.splatDataTextures.sphericalHarmonics={componentCount:m,paddedComponentCount:y,data:B,textureCount:1,texture:z,size:U,compressionLevel:c,elementsPerTexel:v}}else{const F=m/3;y=F,y%2!==0&&y++,U=i(v,y);const B=U.x*U.y*v,z=[this.material.uniforms.sphericalHarmonicsTextureR,this.material.uniforms.sphericalHarmonicsTextureG,this.material.uniforms.sphericalHarmonicsTextureB],N=[],q=[];for(let H=0;H<3;H++){const X=new A(B);N.push(X);for(let he=0;he<n;he++){const Re=m*he,ze=y*he;if(F>=3){for(let W=0;W<3;W++)X[ze+W]=p[Re+H*3+W];if(F>=8)for(let W=0;W<5;W++)X[ze+3+W]=p[Re+9+H*5+W]}}const ee=new qn(X,U.x,U.y,I,w);q.push(ee),ee.needsUpdate=!0,z[H].value=ee}this.material.uniforms.sphericalHarmonicsMultiTextureMode.value=1,this.splatDataTextures.sphericalHarmonics={componentCount:m,componentCountPerChannel:F,paddedComponentCount:y,data:N,textureCount:3,textures:q,size:U,compressionLevel:c,elementsPerTexel:v}}this.material.uniforms.sphericalHarmonicsTextureSize.value.copy(U),this.material.uniforms.sphericalHarmonics8BitMode.value=c===2?1:0;for(let F=0;F<this.scenes.length;F++){const B=this.scenes[F].splatBuffer;this.material.uniforms.sphericalHarmonics8BitCompressionRangeMin.value[F]=B.minSphericalHarmonicsCoeff,this.material.uniforms.sphericalHarmonics8BitCompressionRangeMax.value[F]=B.maxSphericalHarmonicsCoeff}this.material.uniformsNeedUpdate=!0}const T=i(dc,4),E=new Uint32Array(T.x*T.y*dc);for(let w=0;w<n;w++)E[w]=this.globalSplatIndexToSceneIndexMap[w];const M=new qn(E,T.x,T.y,_r,sn);M.internalFormat="R32UI",M.needsUpdate=!0,this.material.uniforms.sceneIndexesTexture.value=M,this.material.uniforms.sceneIndexesTextureSize.value.copy(T),this.material.uniformsNeedUpdate=!0,this.splatDataTextures.sceneIndexes={data:E,texture:M,size:T},this.material.uniforms.sceneCount.value=this.scenes.length}updateBaseDataFromSplatBuffers(t,n){const i=this.splatDataTextures.covariances,r=i?i.compressionLevel:void 0,a=this.splatDataTextures.scaleRotations,o=a?a.compressionLevel:void 0,l=this.splatDataTextures.sphericalHarmonics,c=l?l.compressionLevel:0;this.fillSplatDataArrays(this.splatDataTextures.baseData.covariances,this.splatDataTextures.baseData.scales,this.splatDataTextures.baseData.rotations,this.splatDataTextures.baseData.centers,this.splatDataTextures.baseData.colors,this.splatDataTextures.baseData.sphericalHarmonics,void 0,r,o,c,t,n,t)}updateDataTexturesFromBaseData(t,n){const i=this.splatDataTextures.covariances,r=i?i.compressionLevel:void 0,a=this.splatDataTextures.scaleRotations,o=a?a.compressionLevel:void 0,l=this.splatDataTextures.sphericalHarmonics,c=l?l.compressionLevel:0,u=this.splatDataTextures.centerColors,d=u.data,f=u.texture;Rt.updateCenterColorsPaddedData(t,n,this.splatDataTextures.baseData.centers,this.splatDataTextures.baseData.colors,d);const h=this.renderer?this.renderer.properties.get(f):null;if(!h||!h.__webglTexture?f.needsUpdate=!0:this.updateDataTexture(d,u.texture,u.size,h,da,G0,4,t,n),i){const _=i.texture,x=t*ir,T=n*ir;if(r===0)for(let M=x;M<=T;M++){const w=this.splatDataTextures.baseData.covariances[M];i.data[M]=w}else Rt.updatePaddedCompressedCovariancesTextureData(this.splatDataTextures.baseData.covariances,i.data,t*i.elementsPerTexelAllocated,x,T);const E=this.renderer?this.renderer.properties.get(_):null;!E||!E.__webglTexture?_.needsUpdate=!0:r===0?this.updateDataTexture(i.data,i.texture,i.size,E,i.elementsPerTexelStored,ir,4,t,n):this.updateDataTexture(i.data,i.texture,i.size,E,i.elementsPerTexelAllocated,i.elementsPerTexelAllocated,2,t,n)}if(a){const _=a.data,x=a.texture,T=6,E=o===0?4:2;Rt.updateScaleRotationsPaddedData(t,n,this.splatDataTextures.baseData.scales,this.splatDataTextures.baseData.rotations,_);const M=this.renderer?this.renderer.properties.get(x):null;!M||!M.__webglTexture?x.needsUpdate=!0:this.updateDataTexture(_,a.texture,a.size,M,ua,T,E,t,n)}const g=this.splatDataTextures.baseData.sphericalHarmonics;if(g){let _=4;c===1?_=2:c===2&&(_=1);const x=(M,w,y,v,I)=>{const U=this.renderer?this.renderer.properties.get(M):null;!U||!U.__webglTexture?M.needsUpdate=!0:this.updateDataTexture(v,M,w,U,y,I,_,t,n)},T=l.componentCount,E=l.paddedComponentCount;if(l.textureCount===1){const M=l.data;for(let w=t;w<=n;w++){const y=T*w,v=E*w;for(let I=0;I<T;I++)M[v+I]=g[y+I]}x(l.texture,l.size,l.elementsPerTexel,M,E)}else{const M=l.componentCountPerChannel;for(let w=0;w<3;w++){const y=l.data[w];for(let v=t;v<=n;v++){const I=T*v,U=E*v;if(M>=3){for(let F=0;F<3;F++)y[U+F]=g[I+w*3+F];if(M>=8)for(let F=0;F<5;F++)y[U+3+F]=g[I+9+w*5+F]}}x(l.textures[w],l.size,l.elementsPerTexel,y,E)}}}const A=this.splatDataTextures.sceneIndexes,m=A.data;for(let _=this.lastBuildSplatCount;_<=n;_++)m[_]=this.globalSplatIndexToSceneIndexMap[_];const p=A.texture,S=this.renderer?this.renderer.properties.get(p):null;!S||!S.__webglTexture?p.needsUpdate=!0:this.updateDataTexture(m,A.texture,A.size,S,1,1,1,this.lastBuildSplatCount,n)}getTargetCovarianceCompressionLevel(){return this.halfPrecisionCovariancesOnGPU?1:0}getTargetSphericalHarmonicsCompressionLevel(){return Math.max(1,this.getMaximumSplatBufferCompressionLevel())}getMaximumSplatBufferCompressionLevel(){let t;for(let n=0;n<this.scenes.length;n++){const r=this.getScene(n).splatBuffer;(n===0||r.compressionLevel>t)&&(t=r.compressionLevel)}return t}getMinimumSplatBufferCompressionLevel(){let t;for(let n=0;n<this.scenes.length;n++){const r=this.getScene(n).splatBuffer;(n===0||r.compressionLevel<t)&&(t=r.compressionLevel)}return t}static computeTextureUpdateRegion(t,n,i,r,a){const o=a/r,l=t*o,c=Math.floor(l/i),u=c*i*r,d=n*o,f=Math.floor(d/i),h=f*i*r+i*r;return{dataStart:u,dataEnd:h,startRow:c,endRow:f}}updateDataTexture(t,n,i,r,a,o,l,c,u){const d=this.renderer.getContext(),f=Rt.computeTextureUpdateRegion(c,u,i.x,a,o),h=f.dataEnd-f.dataStart,g=new t.constructor(t.buffer,f.dataStart*l,h),A=f.endRow-f.startRow+1,m=this.webGLUtils.convert(n.type),p=this.webGLUtils.convert(n.format,n.colorSpace),S=d.getParameter(d.TEXTURE_BINDING_2D);d.bindTexture(d.TEXTURE_2D,r.__webglTexture),d.texSubImage2D(d.TEXTURE_2D,0,0,f.startRow,i.x,A,p,m,g),d.bindTexture(d.TEXTURE_2D,S)}static updatePaddedCompressedCovariancesTextureData(t,n,i,r,a){let o=new DataView(n.buffer),l=i,c=0;for(let u=r;u<=a;u+=2)o.setUint16(l*2,t[u],!0),o.setUint16(l*2+2,t[u+1],!0),l+=2,c++,c>=3&&(l+=2,c=0)}static updateCenterColorsPaddedData(t,n,i,r,a){for(let o=t;o<=n;o++){const l=o*4,c=o*3,u=o*4;a[u]=Tg(r,l),a[u+1]=ia(i[c]),a[u+2]=ia(i[c+1]),a[u+3]=ia(i[c+2])}}static updateScaleRotationsPaddedData(t,n,i,r,a){for(let l=t;l<=n;l++){const c=l*3,u=l*4,d=l*6;a[d]=i[c],a[d+1]=i[c+1],a[d+2]=i[c+2],a[d+3]=r[u],a[d+4]=r[u+1],a[d+5]=r[u+2]}}updateVisibleRegion(t){const n=this.getSplatCount(!0),i=new P;if(!t){const a=new P;this.scenes.forEach(o=>{a.add(o.splatBuffer.sceneCenter)}),a.multiplyScalar(1/this.scenes.length),this.calculatedSceneCenter.copy(a),this.material.uniforms.sceneCenter.value.copy(this.calculatedSceneCenter),this.material.uniformsNeedUpdate=!0}const r=t?this.lastBuildSplatCount:0;for(let a=r;a<n;a++){this.getSplatCenter(a,i,!0);const o=i.sub(this.calculatedSceneCenter).length();o>this.maxSplatDistanceFromSceneCenter&&(this.maxSplatDistanceFromSceneCenter=o)}this.maxSplatDistanceFromSceneCenter-this.visibleRegionBufferRadius>hc&&(this.visibleRegionBufferRadius=this.maxSplatDistanceFromSceneCenter,this.visibleRegionRadius=Math.max(this.visibleRegionBufferRadius-hc,0)),this.finalBuild&&(this.visibleRegionRadius=this.visibleRegionBufferRadius=this.maxSplatDistanceFromSceneCenter),this.updateVisibleRegionFadeDistance()}updateVisibleRegionFadeDistance(t=As.Default){const n=Y0*this.sceneFadeInRateMultiplier,i=K0*this.sceneFadeInRateMultiplier,r=this.finalBuild?n:i,a=t===As.Default?r:i;this.visibleRegionFadeStartRadius=(this.visibleRegionRadius-this.visibleRegionFadeStartRadius)*a+this.visibleRegionFadeStartRadius;const l=(this.visibleRegionBufferRadius>0?this.visibleRegionFadeStartRadius/this.visibleRegionBufferRadius:0)>.99,c=l||t===As.Instant?1:0;this.material.uniforms.visibleRegionFadeStartRadius.value=this.visibleRegionFadeStartRadius,this.material.uniforms.visibleRegionRadius.value=this.visibleRegionRadius,this.material.uniforms.firstRenderTime.value=this.firstRenderTime,this.material.uniforms.currentTime.value=performance.now(),this.material.uniforms.fadeInComplete.value=c,this.material.uniformsNeedUpdate=!0,this.visibleRegionChanging=!l}updateRenderIndexes(t,n){const i=this.geometry;i.attributes.splatIndex.set(t),i.attributes.splatIndex.needsUpdate=!0,n>0&&this.firstRenderTime===-1&&(this.firstRenderTime=performance.now()),i.instanceCount=n,i.setDrawRange(0,n)}updateTransforms(){for(let t=0;t<this.scenes.length;t++)this.getScene(t).updateTransform(this.dynamicMode)}setSplatScale(t=1){this.splatScale=t,this.material.uniforms.splatScale.value=t,this.material.uniformsNeedUpdate=!0}getSplatScale(){return this.splatScale}setPointCloudModeEnabled(t){this.pointCloudModeEnabled=t,this.material.uniforms.pointCloudModeEnabled.value=t?1:0,this.material.uniformsNeedUpdate=!0}getPointCloudModeEnabled(){return this.pointCloudModeEnabled}getSplatDataTextures(){return this.splatDataTextures}getSplatCount(t=!1){return t?Rt.getTotalSplatCountForScenes(this.scenes):this.lastBuildSplatCount}static getTotalSplatCountForScenes(t){let n=0;for(let i of t)i&&i.splatBuffer&&(n+=i.splatBuffer.getSplatCount());return n}static getTotalSplatCountForSplatBuffers(t){let n=0;for(let i of t)n+=i.getSplatCount();return n}getMaxSplatCount(){return Rt.getTotalMaxSplatCountForScenes(this.scenes)}static getTotalMaxSplatCountForScenes(t){let n=0;for(let i of t)i&&i.splatBuffer&&(n+=i.splatBuffer.getMaxSplatCount());return n}static getTotalMaxSplatCountForSplatBuffers(t){let n=0;for(let i of t)n+=i.getMaxSplatCount();return n}disposeDistancesComputationGPUResources(){if(!this.renderer)return;const t=this.renderer.getContext();this.distancesTransformFeedback.vao&&(t.deleteVertexArray(this.distancesTransformFeedback.vao),this.distancesTransformFeedback.vao=null),this.distancesTransformFeedback.program&&(t.deleteProgram(this.distancesTransformFeedback.program),t.deleteShader(this.distancesTransformFeedback.vertexShader),t.deleteShader(this.distancesTransformFeedback.fragmentShader),this.distancesTransformFeedback.program=null,this.distancesTransformFeedback.vertexShader=null,this.distancesTransformFeedback.fragmentShader=null),this.disposeDistancesComputationGPUBufferResources(),this.distancesTransformFeedback.id&&(t.deleteTransformFeedback(this.distancesTransformFeedback.id),this.distancesTransformFeedback.id=null)}disposeDistancesComputationGPUBufferResources(){if(!this.renderer)return;const t=this.renderer.getContext();this.distancesTransformFeedback.centersBuffer&&(this.distancesTransformFeedback.centersBuffer=null,t.deleteBuffer(this.distancesTransformFeedback.centersBuffer)),this.distancesTransformFeedback.outDistancesBuffer&&(t.deleteBuffer(this.distancesTransformFeedback.outDistancesBuffer),this.distancesTransformFeedback.outDistancesBuffer=null)}setRenderer(t){if(t!==this.renderer){this.renderer=t;const n=this.renderer.getContext(),i=new H0(n),r=new k0(n,i,{});if(i.init(r),this.webGLUtils=new Kc(n,i),this.enableDistancesComputationOnGPU&&this.getSplatCount()>0){this.setupDistancesComputationTransformFeedback();const{centers:a,sceneIndexes:o}=this.getDataForDistancesComputation(0,this.getSplatCount()-1);this.refreshGPUBuffersForDistancesComputation(a,o)}}}updateGPUCentersBufferForDistancesComputation(t,n,i){if(!this.renderer)return;const r=this.renderer.getContext(),a=r.getParameter(r.VERTEX_ARRAY_BINDING);r.bindVertexArray(this.distancesTransformFeedback.vao);const o=this.integerBasedDistancesComputation?Uint32Array:Float32Array,l=16,c=i*l;if(r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.centersBuffer),t)r.bufferSubData(r.ARRAY_BUFFER,c,n);else{const u=new o(this.getMaxSplatCount()*l);u.set(n),r.bufferData(r.ARRAY_BUFFER,u,r.STATIC_DRAW)}r.bindBuffer(r.ARRAY_BUFFER,null),a&&r.bindVertexArray(a)}updateGPUTransformIndexesBufferForDistancesComputation(t,n,i){if(!this.renderer||!this.dynamicMode)return;const r=this.renderer.getContext(),a=r.getParameter(r.VERTEX_ARRAY_BINDING);r.bindVertexArray(this.distancesTransformFeedback.vao);const o=i*4;if(r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.sceneIndexesBuffer),t)r.bufferSubData(r.ARRAY_BUFFER,o,n);else{const l=new Uint32Array(this.getMaxSplatCount()*4);l.set(n),r.bufferData(r.ARRAY_BUFFER,l,r.STATIC_DRAW)}r.bindBuffer(r.ARRAY_BUFFER,null),a&&r.bindVertexArray(a)}getSceneIndexes(t,n){let i;const r=n-t+1;i=new Uint32Array(r);for(let a=t;a<=n;a++)i[a]=this.globalSplatIndexToSceneIndexMap[a];return i}getLocalSplatParameters(t,n,i){i==null&&(i=!this.dynamicMode),n.splatBuffer=this.getSplatBufferForSplat(t),n.localIndex=this.getSplatLocalIndex(t),n.sceneTransform=i?this.getSceneTransformForSplat(t):null}fillSplatDataArrays(t,n,i,r,a,o,l,c=0,u=0,d=1,f,h,g=0,A){const m=new P;m.x=void 0,m.y=void 0,this.splatRenderMode===Dn.ThreeD?m.z=void 0:m.z=1;const p=new Ge;let S=0,_=this.scenes.length-1;A!=null&&A>=0&&A<=this.scenes.length&&(S=A,_=A);for(let x=S;x<=_;x++){l==null&&(l=!this.dynamicMode);const T=this.getScene(x),E=T.splatBuffer;let M;if(l&&(this.getSceneTransform(x,p),M=p),t&&E.fillSplatCovarianceArray(t,M,f,h,g,c),n||i){if(!n||!i)throw new Error('SplatMesh::fillSplatDataArrays() -> "scales" and "rotations" must both be valid.');E.fillSplatScaleRotationArray(n,i,M,f,h,g,u,m)}r&&E.fillSplatCenterArray(r,M,f,h,g),a&&E.fillSplatColorArray(a,T.minimumAlpha,f,h,g),o&&E.fillSphericalHarmonicsArray(o,this.minSphericalHarmonicsDegree,M,f,h,g,d),g+=E.getSplatCount()}}getIntegerCenters(t,n,i=!1){const r=n-t+1,a=new Float32Array(r*3);this.fillSplatDataArrays(null,null,null,a,null,null,void 0,void 0,void 0,void 0,t);let o,l=i?4:3;o=new Int32Array(r*l);for(let c=0;c<r;c++){for(let u=0;u<3;u++)o[c*l+u]=Math.round(a[c*3+u]*1e3);i&&(o[c*l+3]=1e3)}return o}getFloatCenters(t,n,i=!1){const r=n-t+1,a=new Float32Array(r*3);if(this.fillSplatDataArrays(null,null,null,a,null,null,void 0,void 0,void 0,void 0,t),!i)return a;let o=new Float32Array(r*4);for(let l=0;l<r;l++){for(let c=0;c<3;c++)o[l*4+c]=a[l*3+c];o[l*4+3]=1}return o}getSceneTransform(t,n){const i=this.getScene(t);i.updateTransform(this.dynamicMode),n.copy(i.transform)}getScene(t){if(t<0||t>=this.scenes.length)throw new Error("SplatMesh::getScene() -> Invalid scene index.");return this.scenes[t]}getSceneCount(){return this.scenes.length}getSplatBufferForSplat(t){return this.getScene(this.globalSplatIndexToSceneIndexMap[t]).splatBuffer}getSceneIndexForSplat(t){return this.globalSplatIndexToSceneIndexMap[t]}getSceneTransformForSplat(t){return this.getScene(this.globalSplatIndexToSceneIndexMap[t]).transform}getSplatLocalIndex(t){return this.globalSplatIndexToLocalSplatIndexMap[t]}static getIntegerMatrixArray(t){const n=t.elements,i=[];for(let r=0;r<16;r++)i[r]=Math.round(n[r]*1e3);return i}computeBoundingBox(t=!1,n){let i=this.getSplatCount();if(n!=null){if(n<0||n>=this.scenes.length)throw new Error("SplatMesh::computeBoundingBox() -> Invalid scene index.");i=this.scenes[n].splatBuffer.getSplatCount()}const r=new Float32Array(i*3);this.fillSplatDataArrays(null,null,null,r,null,null,t,void 0,void 0,void 0,void 0,n);const a=new P,o=new P;for(let l=0;l<i;l++){const c=l*3,u=r[c],d=r[c+1],f=r[c+2];(l===0||u<a.x)&&(a.x=u),(l===0||d<a.y)&&(a.y=d),(l===0||f<a.z)&&(a.z=f),(l===0||u>o.x)&&(o.x=u),(l===0||d>o.y)&&(o.y=d),(l===0||f>o.z)&&(o.z=f)}return new An(a,o)}}var j0="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEbA2AAAGAQf39/f39/f39/f39/f39/fwBgAAF/AhIBA2VudgZtZW1vcnkCAwCAgAQDBAMAAQIHVAQRX193YXNtX2NhbGxfY3RvcnMAABhfX3dhc21fYXBwbHlfZGF0YV9yZWxvY3MAAAtzb3J0SW5kZXhlcwABE2Vtc2NyaXB0ZW5fdGxzX2luaXQAAgqWEAMDAAELihAEAXwDewN/A30gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEBA0AgAyABQQJ0IgVqIAIgACAFaigCAEECdGooAgAiBTYCACAFIAogBSAKSBshCiAFIA0gBSANShshDSABQQFqIgEgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiFWooAgAiFkECdGooAgAiFEcEQAJ/IAX9CQI4IAggFEEGdGoiDv0JAgwgDioCHP0gASAOKgIs/SACIA4qAjz9IAP95gEgBf0JAiggDv0JAgggDioCGP0gASAOKgIo/SACIA4qAjj9IAP95gEgBf0JAgggDv0JAgAgDioCEP0gASAOKgIg/SACIA4qAjD9IAP95gEgBf0JAhggDv0JAgQgDioCFP0gASAOKgIk/SACIA4qAjT9IAP95gH95AH95AH95AEiEf1f/QwAAAAAAECPQAAAAAAAQI9AIhL98gEiE/0hASIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDgJ/IBP9IQAiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgL/REgDv0cAQJ/IBEgEf0NCAkKCwwNDg8AAAAAAAAAAP1fIBL98gEiEf0hACIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAv9HAICfyAR/SEBIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4C/0cAyESIBQhDwsgAyAVaiABIBZBBHRq/QAAACAS/bUBIhH9GwAgEf0bAWogEf0bAmogEf0bA2oiDjYCACAOIAogCiAOShshCiAOIA0gDSAOSBshDSACQQFqIgIgC0cNAAsMAwsCfyAFKgIIu/0UIAUqAhi7/SIB/QwAAAAAAECPQAAAAAAAQI9A/fIBIhH9IQEiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIQ4CfyAR/SEAIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyECAn8gBSoCKLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEFQfj///8HIQpBiICAgHghDSALIAxNDQIgAv0RIA79HAEgBf0cAiESIAwhBQNAIAMgBUECdCICaiABIAAgAmooAgBBBHRq/QAAACAS/bUBIhH9GwAgEf0bAWogEf0bAmoiAjYCACACIAogAiAKSBshCiACIA0gAiANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEBA0AgAyABQQJ0IgVqAn8gAiAAIAVqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAFBAWoiASALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIRcgBSoCGCEYIAUqAgghGUH4////ByEKQYiAgIB4IQ0gDCEFA0ACfyAXIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCAZIAIqAgCUIBggAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIUaigCAEECdCIVaigCACIORwRAIAX9CQI4IAggDkEGdGoiD/0JAgwgDyoCHP0gASAPKgIs/SACIA8qAjz9IAP95gEgBf0JAiggD/0JAgggDyoCGP0gASAPKgIo/SACIA8qAjj9IAP95gEgBf0JAgggD/0JAgAgDyoCEP0gASAPKgIg/SACIA8qAjD9IAP95gEgBf0JAhggD/0JAgQgDyoCFP0gASAPKgIk/SACIA8qAjT9IAP95gH95AH95AH95AEhESAOIQ8LIAMgFGoCfyAR/R8DIAEgFUECdCIOQQxyaioCAJQgEf0fAiABIA5BCHJqKgIAlCAR/R8AIAEgDmoqAgCUIBH9HwEgASAOQQRyaioCAJSSkpK7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAsiDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSACQQFqIgIgC0cNAAsMAQtBiICAgHghDUH4////ByEKCyALIAxLBEAgCUEBa7MgDbIgCrKTlSEXIAwhDQNAAn8gFyADIA1BAnRqIgEoAgAgCmuylCIYi0MAAABPXQRAIBioDAELQYCAgIB4CyEOIAEgDjYCACAEIA5BAnRqIgEgASgCAEEBajYCACANQQFqIg0gC0cNAAsLIAlBAk8EQCAEKAIAIQ1BASEKA0AgBCAKQQJ0aiIBIAEoAgAgDWoiDTYCACAKQQFqIgogCUcNAAsLIAxBAEoEQCAMIQoDQCAGIApBAWsiAUECdCICaiAAIAJqKAIANgIAIApBAUshAiABIQogAg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCwsEAEEACw==",pc="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACEgEDZW52Bm1lbW9yeQIDAICABAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQqiDwICAAucDwMBfAd9Bn8gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEFA0AgAyAFQQJ0IgFqIAIgACABaigCAEECdGooAgAiATYCACABIAogASAKSBshCiABIA0gASANShshDSAFQQFqIgUgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiGmooAgBBAnQiG2ooAgAiDkcEQAJ/IAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRgCfyARIA8qAiyUIBIgDyoCKJQgEyAPKgIglCAUIA8qAiSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRkCfyARIA8qAhyUIBIgDyoCGJQgEyAPKgIQlCAUIA8qAhSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRwCfyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIR0gDiEPCyADIBpqIAEgG0ECdGoiDigCBCAcbCAOKAIAIB1saiAOKAIIIBlsaiAOKAIMIBhsaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAii7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshAgJ/IAUqAhi7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshByALIAxNAn8gBSoCCLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEPQfj///8HIQpBiICAgHghDQ0CIAwhBQNAIAMgBUECdCIIaiABIAAgCGooAgBBBHRqIggoAgQgB2wgCCgCACAPbGogCCgCCCACbGoiCDYCACAIIAogCCAKSBshCiAIIA0gCCANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEFA0AgAyAFQQJ0IgFqAn8gAiAAIAFqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAVBAWoiBSALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIREgBSoCGCESIAUqAgghE0H4////ByEKQYiAgIB4IQ0gDCEFA0ACfyARIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCATIAIqAgCUIBIgAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIYaigCAEECdCIZaigCACIORwRAIAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSIRUgESAPKgIslCASIA8qAiiUIBMgDyoCIJQgFCAPKgIklJKSkiEWIBEgDyoCHJQgEiAPKgIYlCATIA8qAhCUIBQgDyoCFJSSkpIhFyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSIREgDiEPCyADIBhqAn8gFSABIBlBAnRqIg4qAgyUIBYgDioCCJQgESAOKgIAlCAXIA4qAgSUkpKSu0QAAAAAAACwQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIg42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gAkEBaiICIAtHDQALDAELQYiAgIB4IQ1B+P///wchCgsgCyAMSwRAIAlBAWuzIA2yIAqyk5UhESAMIQ0DQAJ/IBEgAyANQQJ0aiIBKAIAIAprspQiEotDAAAAT10EQCASqAwBC0GAgICAeAshDiABIA42AgAgBCAOQQJ0aiIBIAEoAgBBAWo2AgAgDUEBaiINIAtHDQALCyAJQQJPBEAgBCgCACENQQEhCgNAIAQgCkECdGoiASABKAIAIA1qIg02AgAgCkEBaiIKIAlHDQALCyAMQQBKBEAgDCEKA0AgBiAKQQFrIgFBAnQiAmogACACaigCADYCACAKQQFLIAEhCg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCws=",Z0="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACDwEDZW52Bm1lbW9yeQIAAAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQrrDwICAAvlDwQBfAN7B30DfyALIAprIQwCQAJAIA4EQCANBEBB+P///wchCkGIgICAeCENIAsgDE0NAyAMIQUDQCADIAVBAnQiAWogAiAAIAFqKAIAQQJ0aigCACIBNgIAIAEgCiABIApIGyEKIAEgDSABIA1KGyENIAVBAWoiBSALRw0ACwwDCyAPBEAgCyAMTQ0CQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIcaigCACIdQQJ0aigCACIbRwRAAn8gBf0JAjggCCAbQQZ0aiIO/QkCDCAOKgIc/SABIA4qAiz9IAIgDioCPP0gA/3mASAF/QkCKCAO/QkCCCAOKgIY/SABIA4qAij9IAIgDioCOP0gA/3mASAF/QkCCCAO/QkCACAOKgIQ/SABIA4qAiD9IAIgDioCMP0gA/3mASAF/QkCGCAO/QkCBCAOKgIU/SABIA4qAiT9IAIgDioCNP0gA/3mAf3kAf3kAf3kASIR/V/9DAAAAAAAQI9AAAAAAABAj0AiEv3yASIT/SEBIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOAn8gE/0hACIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAv9ESAO/RwBAn8gESAR/Q0ICQoLDA0ODwABAgMAAQID/V8gEv3yASIR/SEAIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4C/0cAgJ/IBH9IQEiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgL/RwDIRIgGyEPCyADIBxqIAEgHUEEdGr9AAAAIBL9tQEiEf0bACAR/RsBaiAR/RsCaiAR/RsDaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAgi7/RQgBSoCGLv9IgH9DAAAAAAAQI9AAAAAAABAj0D98gEiEf0hASIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDgJ/IBH9IQAiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLAn8gBSoCKLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEFQfj///8HIQpBiICAgHghDSALIAxNDQL9ESAO/RwBIAX9HAIhEiAMIQUDQCADIAVBAnQiAmogASAAIAJqKAIAQQR0av0AAAAgEv21ASIR/RsAIBH9GwFqIBH9GwJqIgI2AgAgAiAKIAIgCkgbIQogAiANIAIgDUobIQ0gBUEBaiIFIAtHDQALDAILIA0EQEH4////ByEKQYiAgIB4IQ0gCyAMTQ0CIAwhBQNAIAMgBUECdCIBagJ/IAIgACABaigCAEECdGoqAgC7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAsiDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgD0UEQCALIAxNDQEgBSoCKCEUIAUqAhghFSAFKgIIIRZB+P///wchCkGIgICAeCENIAwhBQNAAn8gFCABIAAgBUECdCIHaigCAEEEdGoiAioCCJQgFiACKgIAlCAVIAIqAgSUkpK7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDiADIAdqIA42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gBUEBaiIFIAtHDQALDAILIAsgDE0NAEF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiG2ooAgBBAnQiHGooAgAiDkcEQCAFKgI4IhQgCCAOQQZ0aiIPKgI8lCAFKgIoIhUgDyoCOJQgBSoCCCIWIA8qAjCUIAUqAhgiFyAPKgI0lJKSkiEYIBQgDyoCLJQgFSAPKgIolCAWIA8qAiCUIBcgDyoCJJSSkpIhGSAUIA8qAhyUIBUgDyoCGJQgFiAPKgIQlCAXIA8qAhSUkpKSIRogFCAPKgIMlCAVIA8qAgiUIBYgDyoCAJQgFyAPKgIElJKSkiEUIA4hDwsgAyAbagJ/IBggASAcQQJ0aiIOKgIMlCAZIA4qAgiUIBQgDioCAJQgGiAOKgIElJKSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAJBAWoiAiALRw0ACwwBC0GIgICAeCENQfj///8HIQoLIAsgDEsEQCAJQQFrsyANsiAKspOVIRQgDCENA0ACfyAUIAMgDUECdGoiASgCACAKa7KUIhWLQwAAAE9dBEAgFagMAQtBgICAgHgLIQ4gASAONgIAIAQgDkECdGoiASABKAIAQQFqNgIAIA1BAWoiDSALRw0ACwsgCUECTwRAIAQoAgAhDUEBIQoDQCAEIApBAnRqIgEgASgCACANaiINNgIAIApBAWoiCiAJRw0ACwsgDEEASgRAIAwhCgNAIAYgCkEBayIBQQJ0IgJqIAAgAmooAgA2AgAgCkEBSyABIQoNAAsLIAsgDEoEQCALIQoDQCAGIAsgBCADIApBAWsiCkECdCIBaigCAEECdGoiAigCACIFa0ECdGogACABaigCADYCACACIAVBAWs2AgAgCiAMSg0ACwsL",$0="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACDwEDZW52Bm1lbW9yeQIAAAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQqiDwICAAucDwMBfAd9Bn8gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEFA0AgAyAFQQJ0IgFqIAIgACABaigCAEECdGooAgAiATYCACABIAogASAKSBshCiABIA0gASANShshDSAFQQFqIgUgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiGmooAgBBAnQiG2ooAgAiDkcEQAJ/IAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRgCfyARIA8qAiyUIBIgDyoCKJQgEyAPKgIglCAUIA8qAiSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRkCfyARIA8qAhyUIBIgDyoCGJQgEyAPKgIQlCAUIA8qAhSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRwCfyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIR0gDiEPCyADIBpqIAEgG0ECdGoiDigCBCAcbCAOKAIAIB1saiAOKAIIIBlsaiAOKAIMIBhsaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAii7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshAgJ/IAUqAhi7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshByALIAxNAn8gBSoCCLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEPQfj///8HIQpBiICAgHghDQ0CIAwhBQNAIAMgBUECdCIIaiABIAAgCGooAgBBBHRqIggoAgQgB2wgCCgCACAPbGogCCgCCCACbGoiCDYCACAIIAogCCAKSBshCiAIIA0gCCANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEFA0AgAyAFQQJ0IgFqAn8gAiAAIAFqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAVBAWoiBSALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIREgBSoCGCESIAUqAgghE0H4////ByEKQYiAgIB4IQ0gDCEFA0ACfyARIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCATIAIqAgCUIBIgAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIYaigCAEECdCIZaigCACIORwRAIAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSIRUgESAPKgIslCASIA8qAiiUIBMgDyoCIJQgFCAPKgIklJKSkiEWIBEgDyoCHJQgEiAPKgIYlCATIA8qAhCUIBQgDyoCFJSSkpIhFyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSIREgDiEPCyADIBhqAn8gFSABIBlBAnRqIg4qAgyUIBYgDioCCJQgESAOKgIAlCAXIA4qAgSUkpKSu0QAAAAAAACwQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIg42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gAkEBaiICIAtHDQALDAELQYiAgIB4IQ1B+P///wchCgsgCyAMSwRAIAlBAWuzIA2yIAqyk5UhESAMIQ0DQAJ/IBEgAyANQQJ0aiIBKAIAIAprspQiEotDAAAAT10EQCASqAwBC0GAgICAeAshDiABIA42AgAgBCAOQQJ0aiIBIAEoAgBBAWo2AgAgDUEBaiINIAtHDQALCyAJQQJPBEAgBCgCACENQQEhCgNAIAQgCkECdGoiASABKAIAIA1qIg02AgAgCkEBaiIKIAlHDQALCyAMQQBKBEAgDCEKA0AgBiAKQQFrIgFBAnQiAmogACACaigCADYCACAKQQFLIAEhCg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCws=";function J0(s){let e,t,n,i,r,a,o,l,c,u,d,f,h,g,A,m,p,S,_,x;function T(E,M,w,y,v,I,U){const F=performance.now();if(!n&&(new Uint32Array(t,o,v.byteLength/x.BytesPerInt).set(v),new Float32Array(t,u,U.byteLength/x.BytesPerFloat).set(U),y)){let H;i?H=new Int32Array(t,d,I.byteLength/x.BytesPerInt):H=new Float32Array(t,d,I.byteLength/x.BytesPerFloat),H.set(I)}m||(m=new Uint32Array(S)),new Float32Array(t,A,16).set(w),new Uint32Array(t,h,S).set(m),e.exports.sortIndexes(o,g,d,f,h,A,l,c,u,S,E,M,a,y,i,r);const B={sortDone:!0,splatSortCount:E,splatRenderCount:M,sortTime:0};if(!n){const N=new Uint32Array(t,l,M);(!p||p.length<M)&&(p=new Uint32Array(M)),p.set(N),B.sortedIndexes=p}const z=performance.now();B.sortTime=z-F,s.postMessage(B)}s.onmessage=E=>{if(E.data.centers)centers=E.data.centers,sceneIndexes=E.data.sceneIndexes,i?new Int32Array(t,g+E.data.range.from*x.BytesPerInt*4,E.data.range.count*4).set(new Int32Array(centers)):new Float32Array(t,g+E.data.range.from*x.BytesPerFloat*4,E.data.range.count*4).set(new Float32Array(centers)),r&&new Uint32Array(t,c+E.data.range.from*4,E.data.range.count).set(new Uint32Array(sceneIndexes)),_=E.data.range.from+E.data.range.count;else if(E.data.sort){const M=Math.min(E.data.sort.splatRenderCount||0,_),w=Math.min(E.data.sort.splatSortCount||0,_),y=E.data.sort.usePrecomputedDistances;let v,I,U;n||(v=E.data.sort.indexesToSort,U=E.data.sort.transforms,y&&(I=E.data.sort.precomputedDistances)),T(w,M,E.data.sort.modelViewProj,y,v,I,U)}else if(E.data.init){x=E.data.init.Constants,a=E.data.init.splatCount,n=E.data.init.useSharedMemory,i=E.data.init.integerBasedSort,r=E.data.init.dynamicMode,S=E.data.init.distanceMapRange,_=0;const M=i?x.BytesPerInt*4:x.BytesPerFloat*4,w=new Uint8Array(E.data.init.sorterWasmBytes),y=16*x.BytesPerFloat,v=a*x.BytesPerInt,I=a*M,U=y,F=i?a*x.BytesPerInt:a*x.BytesPerFloat,B=a*x.BytesPerInt,z=a*x.BytesPerInt,N=i?S*x.BytesPerInt*2:S*x.BytesPerFloat*2,q=r?a*x.BytesPerInt:0,H=r?x.MaxScenes*y:0,X=x.MemoryPageSize*32,ee=v+I+U+F+B+N+z+q+H+X,he=Math.floor(ee/x.MemoryPageSize)+1,Re={module:{},env:{memory:new WebAssembly.Memory({initial:he,maximum:he,shared:!0})}};WebAssembly.compile(w).then(ze=>WebAssembly.instantiate(ze,Re)).then(ze=>{e=ze,o=0,g=o+v,A=g+I,d=A+U,f=d+F,h=f+B,l=h+N,c=l+z,u=c+q,t=Re.env.memory.buffer,n?s.postMessage({sortSetupPhase1Complete:!0,indexesToSortBuffer:t,indexesToSortOffset:o,sortedIndexesBuffer:t,sortedIndexesOffset:l,precomputedDistancesBuffer:t,precomputedDistancesOffset:d,transformsBuffer:t,transformsOffset:u}):s.postMessage({sortSetupPhase1Complete:!0})})}}}function eA(s,e,t,n,i,r=Ze.DefaultSplatSortDistanceMapPrecision){const a=new Worker(URL.createObjectURL(new Blob(["(",J0.toString(),")(self)"],{type:"application/javascript"})));let o=j0;const l=So()?Zc():null;!t&&!e?(o=pc,l&&l.major<=16&&l.minor<4&&(o=$0)):t?e||l&&l.major<=16&&l.minor<4&&(o=Z0):o=pc;const c=atob(o),u=new Uint8Array(c.length);for(let d=0;d<c.length;d++)u[d]=c.charCodeAt(d);return a.postMessage({init:{sorterWasmBytes:u.buffer,splatCount:s,useSharedMemory:e,integerBasedSort:n,dynamicMode:i,distanceMapRange:1<<r,Constants:{BytesPerFloat:Ze.BytesPerFloat,BytesPerInt:Ze.BytesPerInt,MemoryPageSize:Ze.MemoryPageSize,MaxScenes:Ze.MaxScenes}}}),a}const Oi={None:0,VR:1,AR:2};class es{static createButton(e,t={}){const n=document.createElement("button");function i(){let c=null;async function u(h){h.addEventListener("end",d),await e.xr.setSession(h),n.textContent="EXIT VR",c=h}function d(){c.removeEventListener("end",d),n.textContent="ENTER VR",c=null}n.style.display="",n.style.cursor="pointer",n.style.left="calc(50% - 50px)",n.style.width="100px",n.textContent="ENTER VR";const f={...t,optionalFeatures:["local-floor","bounded-floor","layers",...t.optionalFeatures||[]]};n.onmouseenter=function(){n.style.opacity="1.0"},n.onmouseleave=function(){n.style.opacity="0.5"},n.onclick=function(){c===null?navigator.xr.requestSession("immersive-vr",f).then(u):(c.end(),navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-vr",f).then(u).catch(h=>{console.warn(h)}))},navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-vr",f).then(u).catch(h=>{console.warn(h)})}function r(){n.style.display="",n.style.cursor="auto",n.style.left="calc(50% - 75px)",n.style.width="150px",n.onmouseenter=null,n.onmouseleave=null,n.onclick=null}function a(){r(),n.textContent="VR NOT SUPPORTED"}function o(c){r(),console.warn("Exception when trying to call xr.isSessionSupported",c),n.textContent="VR NOT ALLOWED"}function l(c){c.style.position="absolute",c.style.bottom="20px",c.style.padding="12px 6px",c.style.border="1px solid #fff",c.style.borderRadius="4px",c.style.background="rgba(0,0,0,0.1)",c.style.color="#fff",c.style.font="normal 13px sans-serif",c.style.textAlign="center",c.style.opacity="0.5",c.style.outline="none",c.style.zIndex="999"}if("xr"in navigator)return n.id="VRButton",n.style.display="none",l(n),navigator.xr.isSessionSupported("immersive-vr").then(function(c){c?i():a(),c&&es.xrSessionIsGranted&&n.click()}).catch(o),n;{const c=document.createElement("a");return window.isSecureContext===!1?(c.href=document.location.href.replace(/^http:/,"https:"),c.innerHTML="WEBXR NEEDS HTTPS"):(c.href="https://immersiveweb.dev/",c.innerHTML="WEBXR NOT AVAILABLE"),c.style.left="calc(50% - 90px)",c.style.width="180px",c.style.textDecoration="none",l(c),c}}static registerSessionGrantedListener(){if(typeof navigator<"u"&&"xr"in navigator){if(/WebXRViewer\//i.test(navigator.userAgent))return;navigator.xr.addEventListener("sessiongranted",()=>{es.xrSessionIsGranted=!0})}}}es.xrSessionIsGranted=!1;es.registerSessionGrantedListener();class tA{static createButton(e,t={}){const n=document.createElement("button");function i(){if(t.domOverlay===void 0){const f=document.createElement("div");f.style.display="none",document.body.appendChild(f);const h=document.createElementNS("http://www.w3.org/2000/svg","svg");h.setAttribute("width",38),h.setAttribute("height",38),h.style.position="absolute",h.style.right="20px",h.style.top="20px",h.addEventListener("click",function(){c.end()}),f.appendChild(h);const g=document.createElementNS("http://www.w3.org/2000/svg","path");g.setAttribute("d","M 12,12 L 28,28 M 28,12 12,28"),g.setAttribute("stroke","#fff"),g.setAttribute("stroke-width",2),h.appendChild(g),t.optionalFeatures===void 0&&(t.optionalFeatures=[]),t.optionalFeatures.push("dom-overlay"),t.domOverlay={root:f}}let c=null;async function u(f){f.addEventListener("end",d),e.xr.setReferenceSpaceType("local"),await e.xr.setSession(f),n.textContent="STOP AR",t.domOverlay.root.style.display="",c=f}function d(){c.removeEventListener("end",d),n.textContent="START AR",t.domOverlay.root.style.display="none",c=null}n.style.display="",n.style.cursor="pointer",n.style.left="calc(50% - 50px)",n.style.width="100px",n.textContent="START AR",n.onmouseenter=function(){n.style.opacity="1.0"},n.onmouseleave=function(){n.style.opacity="0.5"},n.onclick=function(){c===null?navigator.xr.requestSession("immersive-ar",t).then(u):(c.end(),navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-ar",t).then(u).catch(f=>{console.warn(f)}))},navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-ar",t).then(u).catch(f=>{console.warn(f)})}function r(){n.style.display="",n.style.cursor="auto",n.style.left="calc(50% - 75px)",n.style.width="150px",n.onmouseenter=null,n.onmouseleave=null,n.onclick=null}function a(){r(),n.textContent="AR NOT SUPPORTED"}function o(c){r(),console.warn("Exception when trying to call xr.isSessionSupported",c),n.textContent="AR NOT ALLOWED"}function l(c){c.style.position="absolute",c.style.bottom="20px",c.style.padding="12px 6px",c.style.border="1px solid #fff",c.style.borderRadius="4px",c.style.background="rgba(0,0,0,0.1)",c.style.color="#fff",c.style.font="normal 13px sans-serif",c.style.textAlign="center",c.style.opacity="0.5",c.style.outline="none",c.style.zIndex="999"}if("xr"in navigator)return n.id="ARButton",n.style.display="none",l(n),navigator.xr.isSessionSupported("immersive-ar").then(function(c){c?i():a()}).catch(o),n;{const c=document.createElement("a");return window.isSecureContext===!1?(c.href=document.location.href.replace(/^http:/,"https:"),c.innerHTML="WEBXR NEEDS HTTPS"):(c.href="https://immersiveweb.dev/",c.innerHTML="WEBXR NOT AVAILABLE"),c.style.left="calc(50% - 90px)",c.style.width="180px",c.style.textDecoration="none",l(c),c}}}const ha={Always:0,Never:2},nA=50,iA=.75,sA=15e5,rA=10,aA=2.5,oA=60,Kn=class Kn{constructor(e={}){fe(this,"onKeyDown",function(){const e=new P,t=new Ge,n=new Ge;return function(i){switch(e.set(0,0,-1),e.transformDirection(this.camera.matrixWorld),t.makeRotationAxis(e,Math.PI/128),n.makeRotationAxis(e,-Math.PI/128),i.code){case"KeyG":this.focalAdjustment+=.02,this.forceRenderNextFrame();break;case"KeyF":this.focalAdjustment-=.02,this.forceRenderNextFrame();break;case"ArrowLeft":this.camera.up.transformDirection(t);break;case"ArrowRight":this.camera.up.transformDirection(n);break;case"KeyC":this.showMeshCursor=!this.showMeshCursor;break;case"KeyU":this.showControlPlane=!this.showControlPlane;break;case"KeyI":this.showInfo=!this.showInfo,this.showInfo?this.infoPanel.show():this.infoPanel.hide();break;case"KeyO":this.usingExternalCamera||this.setOrthographicMode(!this.camera.isOrthographicCamera);break;case"KeyP":this.usingExternalCamera||this.splatMesh.setPointCloudModeEnabled(!this.splatMesh.getPointCloudModeEnabled());break;case"Equal":this.usingExternalCamera||this.splatMesh.setSplatScale(this.splatMesh.getSplatScale()+.05);break;case"Minus":this.usingExternalCamera||this.splatMesh.setSplatScale(Math.max(this.splatMesh.getSplatScale()-.05,0));break}}}());fe(this,"onMouseUp",function(){const e=new Fe;return function(t){e.copy(this.mousePosition).sub(this.mouseDownPosition),Ui()-this.mouseDownTime<.5&&e.length()<2&&this.onMouseClick(t)}}());fe(this,"checkForFocalPointChange",function(){const e=new Fe,t=new P,n=[];return function(){if(!this.transitioningCameraTarget&&(this.getRenderDimensions(e),n.length=0,this.raycaster.setFromCameraAndScreenPosition(this.camera,this.mousePosition,e),this.raycaster.intersectSplatMesh(this.splatMesh,n),n.length>0)){const r=n[0].origin;t.copy(r).sub(this.camera.position),t.length()>iA&&(this.previousCameraTarget.copy(this.controls.target),this.nextCameraTarget.copy(r),this.transitioningCameraTarget=!0,this.transitioningCameraTargetStartTime=Ui())}}}());fe(this,"updateSplatMesh",function(){const e=new Fe;return function(){if(!this.splatMesh)return;if(this.splatMesh.getSplatCount()>0){this.splatMesh.updateVisibleRegionFadeDistance(this.sceneRevealMode),this.splatMesh.updateTransforms(),this.getRenderDimensions(e);const n=this.camera.projectionMatrix.elements[0]*.5*this.devicePixelRatio*e.x,i=this.camera.projectionMatrix.elements[5]*.5*this.devicePixelRatio*e.y,r=this.camera.isOrthographicCamera?1/this.devicePixelRatio:1,a=this.focalAdjustment*r,o=1/a;this.adjustForWebXRStereo(e),this.splatMesh.updateUniforms(e,n*a,i*a,this.camera.isOrthographicCamera,this.camera.zoom||1,o)}}}());fe(this,"addSplatBuffers",function(){return function(e,t=[],n=!0,i=!0,r=!0,a=!1,o=!1,l=!0){if(this.isDisposingOrDisposed())return Promise.resolve();let c=null;const u=()=>{c!==null&&(this.loadingSpinner.removeTask(c),c=null)};return this.splatRenderReady=!1,new Promise(d=>{i&&(c=this.loadingSpinner.addTask("Processing splats...")),Qt(()=>{if(this.isDisposingOrDisposed())d();else{const f=this.addSplatBuffersToMesh(e,t,n,r,a,l),h=this.splatMesh.getMaxSplatCount();this.sortWorker&&this.sortWorker.maxSplatCount!==h&&this.disposeSortWorker(),this.gpuAcceleratedSort||this.preSortMessages.push({centers:f.centers.buffer,sceneIndexes:f.sceneIndexes.buffer,range:{from:f.from,to:f.to,count:f.count}}),(!this.sortWorker&&h>0?this.setupSortWorker(this.splatMesh):Promise.resolve()).then(()=>{this.isDisposingOrDisposed()||this.runSplatSort(!0,!0).then(A=>{!this.sortWorker||!A?(this.splatRenderReady=!0,u(),d()):(o?this.splatRenderReady=!0:this.runAfterNextSort.push(()=>{this.splatRenderReady=!0}),this.runAfterNextSort.push(()=>{u(),d()}))})})}},!0)})}}());fe(this,"addSplatBuffersToMesh",function(){let e;return function(t,n,i=!0,r=!1,a=!1,o=!0){if(this.isDisposingOrDisposed())return;let l=[],c=[];a||(l=this.splatMesh.scenes.map(h=>h.splatBuffer)||[],c=this.splatMesh.sceneOptions?this.splatMesh.sceneOptions.map(h=>h):[]),l.push(...t),c.push(...n),this.renderer&&this.splatMesh.setRenderer(this.renderer);const u=h=>{if(this.isDisposingOrDisposed())return;const g=this.splatMesh.getSplatCount();r&&g>=sA&&!h&&!e&&(this.loadingSpinner.setMinimized(!0,!0),e=this.loadingSpinner.addTask("Optimizing data structures..."))},d=h=>{this.isDisposingOrDisposed()||h&&e&&(this.loadingSpinner.removeTask(e),e=null)},f=this.splatMesh.build(l,c,!0,i,u,d,o);return i&&this.freeIntermediateSplatData&&this.splatMesh.freeIntermediateSplatData(),f}}());fe(this,"shouldRender",function(){let e=0;const t=new P,n=new St,i=1e-4;return function(){if(!this.initialized||!this.splatRenderReady||this.isDisposingOrDisposed())return!1;let r=!1,a=!1;if(this.camera){const o=this.camera.position,l=this.camera.quaternion;a=Math.abs(o.x-t.x)>i||Math.abs(o.y-t.y)>i||Math.abs(o.z-t.z)>i||Math.abs(l.x-n.x)>i||Math.abs(l.y-n.y)>i||Math.abs(l.z-n.z)>i||Math.abs(l.w-n.w)>i}return r=this.renderMode!==ha.Never&&(e===0||this.splatMesh.visibleRegionChanging||a||this.renderMode===ha.Always||this.dynamicMode===!0||this.renderNextFrame),this.camera&&(t.copy(this.camera.position),n.copy(this.camera.quaternion)),e++,r}}());fe(this,"render",function(){return function(){if(!this.initialized||!this.splatRenderReady||this.isDisposingOrDisposed())return;const e=n=>{for(let i of n.children)if(i.visible)return!0;return!1},t=this.renderer.autoClear;e(this.threeScene)&&(this.renderer.render(this.threeScene,this.camera),this.renderer.autoClear=!1),this.renderer.render(this.splatMesh,this.camera),this.renderer.autoClear=!1,this.sceneHelper.getFocusMarkerOpacity()>0&&this.renderer.render(this.sceneHelper.focusMarker,this.camera),this.showControlPlane&&this.renderer.render(this.sceneHelper.controlPlane,this.camera),this.renderer.autoClear=t}}());fe(this,"updateFPS",function(){let e=Ui(),t=0;return function(){if(this.consecutiveRenderFrames>oA){const n=Ui();n-e>=1?(this.currentFPS=t,t=0,e=n):t++}else this.currentFPS=null}}());fe(this,"updateForRendererSizeChanges",function(){const e=new Fe,t=new Fe;let n;return function(){this.usingExternalCamera||(this.renderer.getSize(t),(n===void 0||n!==this.camera.isOrthographicCamera||t.x!==e.x||t.y!==e.y)&&(this.camera.isOrthographicCamera?(this.camera.left=-t.x/2,this.camera.right=t.x/2,this.camera.top=t.y/2,this.camera.bottom=-t.y/2):this.camera.aspect=t.x/t.y,this.camera.updateProjectionMatrix(),e.copy(t),n=this.camera.isOrthographicCamera))}}());fe(this,"timingSensitiveUpdates",function(){let e;return function(){const t=Ui();e||(e=t);const n=t-e;this.updateCameraTransition(t),this.updateFocusMarker(n),e=t}}());fe(this,"updateCameraTransition",function(){let e=new P,t=new P,n=new P;return function(i){if(this.transitioningCameraTarget){t.copy(this.previousCameraTarget).sub(this.camera.position).normalize(),n.copy(this.nextCameraTarget).sub(this.camera.position).normalize();const r=Math.acos(t.dot(n)),o=(r/(Math.PI/3)*.65+.3)/r*(i-this.transitioningCameraTargetStartTime);e.copy(this.previousCameraTarget).lerp(this.nextCameraTarget,o),this.camera.lookAt(e),this.controls.target.copy(e),o>=1&&(this.transitioningCameraTarget=!1)}}}());fe(this,"updateFocusMarker",function(){const e=new Fe;let t=!1;return function(n){if(this.getRenderDimensions(e),this.transitioningCameraTarget){this.sceneHelper.setFocusMarkerVisibility(!0);const i=Math.max(this.sceneHelper.getFocusMarkerOpacity(),0);let r=Math.min(i+rA*n,1);this.sceneHelper.setFocusMarkerOpacity(r),this.sceneHelper.updateFocusMarker(this.nextCameraTarget,this.camera,e),t=!0,this.forceRenderNextFrame()}else{let i;if(t?i=1:i=Math.min(this.sceneHelper.getFocusMarkerOpacity(),1),i>0){this.sceneHelper.updateFocusMarker(this.nextCameraTarget,this.camera,e);let r=Math.max(i-aA*n,0);this.sceneHelper.setFocusMarkerOpacity(r),r===0&&this.sceneHelper.setFocusMarkerVisibility(!1)}i>0&&this.forceRenderNextFrame(),t=!1}}}());fe(this,"updateMeshCursor",function(){const e=[],t=new Fe;return function(){this.showMeshCursor?(this.forceRenderNextFrame(),this.getRenderDimensions(t),e.length=0,this.raycaster.setFromCameraAndScreenPosition(this.camera,this.mousePosition,t),this.raycaster.intersectSplatMesh(this.splatMesh,e),e.length>0?(this.sceneHelper.setMeshCursorVisibility(!0),this.sceneHelper.positionAndOrientMeshCursor(e[0].origin,this.camera)):this.sceneHelper.setMeshCursorVisibility(!1)):(this.sceneHelper.getMeschCursorVisibility()&&this.forceRenderNextFrame(),this.sceneHelper.setMeshCursorVisibility(!1))}}());fe(this,"updateInfoPanel",function(){const e=new Fe;return function(){if(!this.showInfo)return;const t=this.splatMesh.getSplatCount();this.getRenderDimensions(e);const n=this.controls?this.controls.target:null,i=this.showMeshCursor?this.sceneHelper.meshCursor.position:null,r=t>0?this.splatRenderCount/t*100:0;this.infoPanel.update(e,this.camera.position,n,this.camera.up,this.camera.isOrthographicCamera,i,this.currentFPS||"N/A",t,this.splatRenderCount,r,this.lastSortTime,this.focalAdjustment,this.splatMesh.getSplatScale(),this.splatMesh.getPointCloudModeEnabled())}}());fe(this,"runSplatSort",function(){const e=new Ge,t=[],n=new P(0,0,-1),i=new P(0,0,-1),r=new P,a=new P,o=[],l=[{angleThreshold:.55,sortFractions:[.125,.33333,.75]},{angleThreshold:.65,sortFractions:[.33333,.66667]},{angleThreshold:.8,sortFractions:[.5]}];return function(c=!1,u=!1){if(!this.initialized)return Promise.resolve(!1);if(this.sortRunning)return Promise.resolve(!0);if(this.splatMesh.getSplatCount()<=0)return this.splatRenderCount=0,Promise.resolve(!1);let d=0,f=0,h=!1,g=!1;if(i.set(0,0,-1).applyQuaternion(this.camera.quaternion),d=i.dot(n),f=a.copy(this.camera.position).sub(r).length(),!c&&!this.splatMesh.dynamicMode&&o.length===0&&(d<=.99&&(h=!0),f>=1&&(g=!0),!h&&!g))return Promise.resolve(!1);this.sortRunning=!0;let{splatRenderCount:A,shouldSortAll:m}=this.gatherSceneNodesForSort();m=m||u,this.splatRenderCount=A,e.copy(this.camera.matrixWorld).invert();const p=this.perspectiveCamera||this.camera;e.premultiply(p.projectionMatrix),this.splatMesh.dynamicMode||e.multiply(this.splatMesh.matrixWorld);let S=Promise.resolve(!0);return this.gpuAcceleratedSort&&(o.length<=1||o.length%2===0)&&(S=this.splatMesh.computeDistancesOnGPU(e,this.sortWorkerPrecomputedDistances)),S.then(()=>{if(o.length===0)if(this.splatMesh.dynamicMode||m)o.push(this.splatRenderCount);else{for(let T of l)if(d<T.angleThreshold){for(let E of T.sortFractions)o.push(Math.floor(this.splatRenderCount*E));break}o.push(this.splatRenderCount)}let _=Math.min(o.shift(),this.splatRenderCount);this.splatSortCount=_,t[0]=this.camera.position.x,t[1]=this.camera.position.y,t[2]=this.camera.position.z;const x={modelViewProj:e.elements,cameraPosition:t,splatRenderCount:this.splatRenderCount,splatSortCount:_,usePrecomputedDistances:this.gpuAcceleratedSort};return this.splatMesh.dynamicMode&&this.splatMesh.fillTransformsArray(this.sortWorkerTransforms),this.sharedMemoryForWorkers||(x.indexesToSort=this.sortWorkerIndexesToSort,x.transforms=this.sortWorkerTransforms,this.gpuAcceleratedSort&&(x.precomputedDistances=this.sortWorkerPrecomputedDistances)),this.sortPromise=new Promise(T=>{this.sortPromiseResolver=T}),this.preSortMessages.length>0&&(this.preSortMessages.forEach(T=>{this.sortWorker.postMessage(T)}),this.preSortMessages=[]),this.sortWorker.postMessage({sort:x}),o.length===0&&(r.copy(this.camera.position),n.copy(i)),!0}),S}}());fe(this,"gatherSceneNodesForSort",function(){const e=[];let t=null;const n=new P,i=new P,r=new P,a=new Ge,o=new Ge,l=new Ge,c=new P,u=new P(0,0,-1),d=new P,f=h=>d.copy(h.max).sub(h.min).length();return function(h=!1){this.getRenderDimensions(c);const g=c.y/2/Math.tan(this.camera.fov/2*Dc.DEG2RAD),A=Math.atan(c.x/2/g),m=Math.atan(c.y/2/g),p=Math.cos(A),S=Math.cos(m),_=this.splatMesh.getSplatTree();if(_){o.copy(this.camera.matrixWorld).invert(),this.splatMesh.dynamicMode||o.multiply(this.splatMesh.matrixWorld);let x=0,T=0;for(let M=0;M<_.subTrees.length;M++){const w=_.subTrees[M];a.copy(o),this.splatMesh.dynamicMode&&(this.splatMesh.getSceneTransform(M,l),a.multiply(l));const y=w.nodesWithIndexes.length;for(let v=0;v<y;v++){const I=w.nodesWithIndexes[v];if(!I.data||!I.data.indexes||I.data.indexes.length===0)continue;r.copy(I.center).applyMatrix4(a);const U=r.length();r.normalize(),n.copy(r).setX(0).normalize(),i.copy(r).setY(0).normalize();const F=u.dot(i),B=u.dot(n),z=f(I),N=B<S-.6,q=F<p-.6;!h&&(q||N)&&U>z||(T+=I.data.indexes.length,e[x]=I,I.data.distanceToNode=U,x++)}}e.length=x,e.sort((M,w)=>M.data.distanceToNode<w.data.distanceToNode?-1:1);let E=T*Ze.BytesPerInt;for(let M=0;M<x;M++){const w=e[M],y=w.data.indexes.length,v=y*Ze.BytesPerInt;new Uint32Array(this.sortWorkerIndexesToSort.buffer,E-v,y).set(w.data.indexes),E-=v}return{splatRenderCount:T,shouldSortAll:!1}}else{const x=this.splatMesh.getSplatCount();if(!t||t.length!==x){t=new Uint32Array(x);for(let T=0;T<x;T++)t[T]=T}return this.sortWorkerIndexesToSort.set(t),{splatRenderCount:x,shouldSortAll:!0}}}}());if(e.cameraUp||(e.cameraUp=[0,1,0]),this.cameraUp=new P().fromArray(e.cameraUp),e.initialCameraPosition||(e.initialCameraPosition=[0,10,15]),this.initialCameraPosition=new P().fromArray(e.initialCameraPosition),e.initialCameraLookAt||(e.initialCameraLookAt=[0,0,0]),this.initialCameraLookAt=new P().fromArray(e.initialCameraLookAt),this.dropInMode=e.dropInMode||!1,(e.selfDrivenMode===void 0||e.selfDrivenMode===null)&&(e.selfDrivenMode=!0),this.selfDrivenMode=e.selfDrivenMode&&!this.dropInMode,this.selfDrivenUpdateFunc=this.selfDrivenUpdate.bind(this),e.useBuiltInControls===void 0&&(e.useBuiltInControls=!0),this.useBuiltInControls=e.useBuiltInControls,this.rootElement=e.rootElement,this.ignoreDevicePixelRatio=e.ignoreDevicePixelRatio||!1,this.devicePixelRatio=this.ignoreDevicePixelRatio?1:window.devicePixelRatio||1,this.halfPrecisionCovariancesOnGPU=e.halfPrecisionCovariancesOnGPU||!1,this.threeScene=e.threeScene,this.renderer=e.renderer,this.camera=e.camera,this.gpuAcceleratedSort=e.gpuAcceleratedSort||!1,(e.integerBasedSort===void 0||e.integerBasedSort===null)&&(e.integerBasedSort=!0),this.integerBasedSort=e.integerBasedSort,(e.sharedMemoryForWorkers===void 0||e.sharedMemoryForWorkers===null)&&(e.sharedMemoryForWorkers=!0),this.sharedMemoryForWorkers=e.sharedMemoryForWorkers,this.dynamicScene=!!e.dynamicScene,this.antialiased=e.antialiased||!1,this.kernel2DSize=e.kernel2DSize===void 0?.3:e.kernel2DSize,this.webXRMode=e.webXRMode||Oi.None,this.webXRMode!==Oi.None&&(this.gpuAcceleratedSort=!1),this.webXRActive=!1,this.webXRSessionInit=e.webXRSessionInit||{},this.renderMode=e.renderMode||ha.Always,this.sceneRevealMode=e.sceneRevealMode||As.Default,this.focalAdjustment=e.focalAdjustment||1,this.maxScreenSpaceSplatSize=e.maxScreenSpaceSplatSize||1024,this.logLevel=e.logLevel||qi.None,this.sphericalHarmonicsDegree=e.sphericalHarmonicsDegree||0,this.enableOptionalEffects=e.enableOptionalEffects||!1,(e.enableSIMDInSort===void 0||e.enableSIMDInSort===null)&&(e.enableSIMDInSort=!0),this.enableSIMDInSort=e.enableSIMDInSort,(e.inMemoryCompressionLevel===void 0||e.inMemoryCompressionLevel===null)&&(e.inMemoryCompressionLevel=0),this.inMemoryCompressionLevel=e.inMemoryCompressionLevel,(e.optimizeSplatData===void 0||e.optimizeSplatData===null)&&(e.optimizeSplatData=!0),this.optimizeSplatData=e.optimizeSplatData,(e.freeIntermediateSplatData===void 0||e.freeIntermediateSplatData===null)&&(e.freeIntermediateSplatData=!1),this.freeIntermediateSplatData=e.freeIntermediateSplatData,So()){const n=Zc();n.major<17&&(this.enableSIMDInSort=!1),n.major<16&&(this.sharedMemoryForWorkers=!1)}(e.splatRenderMode===void 0||e.splatRenderMode===null)&&(e.splatRenderMode=Dn.ThreeD),this.splatRenderMode=e.splatRenderMode,this.sceneFadeInRateMultiplier=e.sceneFadeInRateMultiplier||1,this.splatSortDistanceMapPrecision=e.splatSortDistanceMapPrecision||Ze.DefaultSplatSortDistanceMapPrecision;const t=this.integerBasedSort?20:24;this.splatSortDistanceMapPrecision=gt(this.splatSortDistanceMapPrecision,10,t),this.onSplatMeshChangedCallback=null,this.createSplatMesh(),this.controls=null,this.perspectiveControls=null,this.orthographicControls=null,this.orthographicCamera=null,this.perspectiveCamera=null,this.showMeshCursor=!1,this.showControlPlane=!1,this.showInfo=!1,this.sceneHelper=null,this.sortWorker=null,this.sortRunning=!1,this.splatRenderCount=0,this.splatSortCount=0,this.lastSplatSortCount=0,this.sortWorkerIndexesToSort=null,this.sortWorkerSortedIndexes=null,this.sortWorkerPrecomputedDistances=null,this.sortWorkerTransforms=null,this.preSortMessages=[],this.runAfterNextSort=[],this.selfDrivenModeRunning=!1,this.splatRenderReady=!1,this.raycaster=new F0,this.infoPanel=null,this.startInOrthographicMode=!1,this.currentFPS=0,this.lastSortTime=0,this.consecutiveRenderFrames=0,this.previousCameraTarget=new P,this.nextCameraTarget=new P,this.mousePosition=new Fe,this.mouseDownPosition=new Fe,this.mouseDownTime=null,this.resizeObserver=null,this.mouseMoveListener=null,this.mouseDownListener=null,this.mouseUpListener=null,this.keyDownListener=null,this.sortPromise=null,this.sortPromiseResolver=null,this.splatSceneDownloadPromises={},this.splatSceneDownloadAndBuildPromise=null,this.splatSceneRemovalPromise=null,this.loadingSpinner=new io(null,this.rootElement||document.body),this.loadingSpinner.hide(),this.loadingProgressBar=new b0(this.rootElement||document.body),this.loadingProgressBar.hide(),this.infoPanel=new w0(this.rootElement||document.body),this.infoPanel.hide(),this.usingExternalCamera=!!(this.dropInMode||this.camera),this.usingExternalRenderer=!!(this.dropInMode||this.renderer),this.initialized=!1,this.disposing=!1,this.disposed=!1,this.disposePromise=null,this.dropInMode||this.init()}createSplatMesh(){this.splatMesh=new Rt(this.splatRenderMode,this.dynamicScene,this.enableOptionalEffects,this.halfPrecisionCovariancesOnGPU,this.devicePixelRatio,this.gpuAcceleratedSort,this.integerBasedSort,this.antialiased,this.maxScreenSpaceSplatSize,this.logLevel,this.sphericalHarmonicsDegree,this.sceneFadeInRateMultiplier,this.kernel2DSize),this.splatMesh.frustumCulled=!1,this.onSplatMeshChangedCallback&&this.onSplatMeshChangedCallback()}init(){this.initialized||(this.rootElement||(this.usingExternalRenderer?this.rootElement=this.renderer.domElement||document.body:(this.rootElement=document.createElement("div"),this.rootElement.style.width="100%",this.rootElement.style.height="100%",this.rootElement.style.position="absolute",document.body.appendChild(this.rootElement))),this.setupCamera(),this.setupRenderer(),this.setupWebXR(this.webXRSessionInit),this.setupControls(),this.setupEventHandlers(),this.threeScene=this.threeScene||new Mg,this.sceneHelper=new ms(this.threeScene),this.sceneHelper.setupMeshCursor(),this.sceneHelper.setupFocusMarker(),this.sceneHelper.setupControlPlane(),this.loadingProgressBar.setContainer(this.rootElement),this.loadingSpinner.setContainer(this.rootElement),this.infoPanel.setContainer(this.rootElement),this.initialized=!0)}setupCamera(){if(!this.usingExternalCamera){const e=new Fe;this.getRenderDimensions(e),this.perspectiveCamera=new tn(nA,e.x/e.y,.1,1e3),this.orthographicCamera=new fo(e.x/-2,e.x/2,e.y/2,e.y/-2,.1,1e3),this.camera=this.startInOrthographicMode?this.orthographicCamera:this.perspectiveCamera,this.camera.position.copy(this.initialCameraPosition),this.camera.up.copy(this.cameraUp).normalize(),this.camera.lookAt(this.initialCameraLookAt)}}setupRenderer(){if(!this.usingExternalRenderer){const e=new Fe;this.getRenderDimensions(e),this.renderer=new yg({antialias:!1,precision:"highp"}),this.renderer.setPixelRatio(this.devicePixelRatio),this.renderer.autoClear=!0,this.renderer.setClearColor(new nt(0),0),this.renderer.setSize(e.x,e.y),this.resizeObserver=new ResizeObserver(()=>{this.getRenderDimensions(e),this.renderer.setSize(e.x,e.y),this.forceRenderNextFrame()}),this.resizeObserver.observe(this.rootElement),this.rootElement.appendChild(this.renderer.domElement)}}setupWebXR(e){this.webXRMode&&(this.webXRMode===Oi.VR?this.rootElement.appendChild(es.createButton(this.renderer,e)):this.webXRMode===Oi.AR&&this.rootElement.appendChild(tA.createButton(this.renderer,e)),this.renderer.xr.addEventListener("sessionstart",t=>{this.webXRActive=!0}),this.renderer.xr.addEventListener("sessionend",t=>{this.webXRActive=!1}),this.renderer.xr.enabled=!0,this.camera.position.copy(this.initialCameraPosition),this.camera.up.copy(this.cameraUp).normalize(),this.camera.lookAt(this.initialCameraLookAt))}setupControls(){if(this.useBuiltInControls&&this.webXRMode===Oi.None){this.usingExternalCamera?this.camera.isOrthographicCamera?this.orthographicControls=new nr(this.camera,this.renderer.domElement):this.perspectiveControls=new nr(this.camera,this.renderer.domElement):(this.perspectiveControls=new nr(this.perspectiveCamera,this.renderer.domElement),this.orthographicControls=new nr(this.orthographicCamera,this.renderer.domElement));for(let e of[this.orthographicControls,this.perspectiveControls])e&&(e.listenToKeyEvents(window),e.rotateSpeed=.5,e.maxPolarAngle=Math.PI*.75,e.minPolarAngle=.1,e.enableDamping=!0,e.dampingFactor=.05,e.target.copy(this.initialCameraLookAt),e.update());this.controls=this.camera.isOrthographicCamera?this.orthographicControls:this.perspectiveControls,this.controls.update()}}setupEventHandlers(){this.useBuiltInControls&&this.webXRMode===Oi.None&&(this.mouseMoveListener=this.onMouseMove.bind(this),this.renderer.domElement.addEventListener("pointermove",this.mouseMoveListener,!1),this.mouseDownListener=this.onMouseDown.bind(this),this.renderer.domElement.addEventListener("pointerdown",this.mouseDownListener,!1),this.mouseUpListener=this.onMouseUp.bind(this),this.renderer.domElement.addEventListener("pointerup",this.mouseUpListener,!1),this.keyDownListener=this.onKeyDown.bind(this),window.addEventListener("keydown",this.keyDownListener,!1))}removeEventHandlers(){this.useBuiltInControls&&(this.renderer.domElement.removeEventListener("pointermove",this.mouseMoveListener),this.mouseMoveListener=null,this.renderer.domElement.removeEventListener("pointerdown",this.mouseDownListener),this.mouseDownListener=null,this.renderer.domElement.removeEventListener("pointerup",this.mouseUpListener),this.mouseUpListener=null,window.removeEventListener("keydown",this.keyDownListener),this.keyDownListener=null)}setRenderMode(e){this.renderMode=e}setActiveSphericalHarmonicsDegrees(e){this.splatMesh.material.uniforms.sphericalHarmonicsDegree.value=e,this.splatMesh.material.uniformsNeedUpdate=!0}onSplatMeshChanged(e){this.onSplatMeshChangedCallback=e}onMouseMove(e){this.mousePosition.set(e.offsetX,e.offsetY)}onMouseDown(){this.mouseDownPosition.copy(this.mousePosition),this.mouseDownTime=Ui()}onMouseClick(e){this.mousePosition.set(e.offsetX,e.offsetY),this.checkForFocalPointChange()}getRenderDimensions(e){this.rootElement?(e.x=this.rootElement.offsetWidth,e.y=this.rootElement.offsetHeight):this.renderer.getSize(e)}setOrthographicMode(e){if(e===this.camera.isOrthographicCamera)return;const t=this.camera,n=e?this.orthographicCamera:this.perspectiveCamera;if(n.position.copy(t.position),n.up.copy(t.up),n.rotation.copy(t.rotation),n.quaternion.copy(t.quaternion),n.matrix.copy(t.matrix),this.camera=n,this.controls){const i=o=>{o.saveState(),o.reset()},r=this.controls,a=e?this.orthographicControls:this.perspectiveControls;i(a),i(r),a.target.copy(r.target),e?Kn.setCameraZoomFromPosition(n,t,r):Kn.setCameraPositionFromZoom(n,t,a),this.controls=a,this.camera.lookAt(this.controls.target)}}adjustForWebXRStereo(e){if(this.camera&&this.webXRActive){const n=this.renderer.xr.getCamera().projectionMatrix.elements[0],i=this.camera.projectionMatrix.elements[0];e.x*=i/n}}isLoadingOrUnloading(){return Object.keys(this.splatSceneDownloadPromises).length>0||this.splatSceneDownloadAndBuildPromise!==null||this.splatSceneRemovalPromise!==null}isDisposingOrDisposed(){return this.disposing||this.disposed}addSplatSceneDownloadPromise(e){this.splatSceneDownloadPromises[e.id]=e}removeSplatSceneDownloadPromise(e){delete this.splatSceneDownloadPromises[e.id]}setSplatSceneDownloadAndBuildPromise(e){this.splatSceneDownloadAndBuildPromise=e}clearSplatSceneDownloadAndBuildPromise(){this.splatSceneDownloadAndBuildPromise=null}addSplatScene(e,t={}){if(this.isLoadingOrUnloading())throw new Error("Cannot add splat scene while another load or unload is already in progress.");if(this.isDisposingOrDisposed())throw new Error("Cannot add splat scene after dispose() is called.");t.progressiveLoad&&this.splatMesh.scenes&&this.splatMesh.scenes.length>0&&(console.log('addSplatScene(): "progressiveLoad" option ignore because there are multiple splat scenes'),t.progressiveLoad=!1);const n=t.format!==void 0&&t.format!==null?t.format:rc(e),i=Kn.isProgressivelyLoadable(n)&&t.progressiveLoad,r=t.showLoadingUI!==void 0&&t.showLoadingUI!==null?t.showLoadingUI:!0;let a=null;r&&(this.loadingSpinner.removeAllTasks(),a=this.loadingSpinner.addTask("Downloading..."));const o=()=>{this.loadingProgressBar.hide(),this.loadingSpinner.removeAllTasks()},l=(A,m,p)=>{if(r)if(p===yt.Downloading)if(A==100)this.loadingSpinner.setMessageForTask(a,"Download complete!");else if(i)this.loadingSpinner.setMessageForTask(a,"Downloading splats...");else{const S=m?`: ${m}`:"...";this.loadingSpinner.setMessageForTask(a,`Downloading${S}`)}else p===yt.Processing&&this.loadingSpinner.setMessageForTask(a,"Processing splats...")};let c=!1,u=0;const d=(A,m)=>{r&&((A&&i||m&&!i)&&(this.loadingSpinner.removeTask(a),!m&&!c&&this.loadingProgressBar.show()),i&&(m?(c=!0,this.loadingProgressBar.hide()):this.loadingProgressBar.setProgress(u)))},f=(A,m,p)=>{u=A,l(A,m,p),t.onProgress&&t.onProgress(A,m,p)},h=(A,m,p)=>{!i&&t.onProgress&&t.onProgress(0,"0%",yt.Processing);const S={rotation:t.rotation||t.orientation,position:t.position,scale:t.scale,splatAlphaRemovalThreshold:t.splatAlphaRemovalThreshold};return this.addSplatBuffers([A],[S],p,m&&r,r,i,i).then(()=>{!i&&t.onProgress&&t.onProgress(100,"100%",yt.Processing),d(m,p)})};return(i?this.downloadAndBuildSingleSplatSceneProgressiveLoad.bind(this):this.downloadAndBuildSingleSplatSceneStandardLoad.bind(this))(e,n,t.splatAlphaRemovalThreshold,h.bind(this),f,o.bind(this),t.headers)}downloadAndBuildSingleSplatSceneStandardLoad(e,t,n,i,r,a,o){const l=this.downloadSplatSceneToSplatBuffer(e,n,r,!1,void 0,t,o),c=sa(l.abortHandler);return l.then(u=>(this.removeSplatSceneDownloadPromise(l),i(u,!0,!0).then(()=>{c.resolve(),this.clearSplatSceneDownloadAndBuildPromise()}))).catch(u=>{a&&a(),this.clearSplatSceneDownloadAndBuildPromise(),this.removeSplatSceneDownloadPromise(l),c.reject(this.updateError(u,`Viewer::addSplatScene -> Could not load file ${e}`))}),this.addSplatSceneDownloadPromise(l),this.setSplatSceneDownloadAndBuildPromise(c.promise),c.promise}downloadAndBuildSingleSplatSceneProgressiveLoad(e,t,n,i,r,a,o){let l=0,c=!1;const u=[],d=()=>{if(u.length>0&&!c&&!this.isDisposingOrDisposed()){c=!0;const m=u.shift();i(m.splatBuffer,m.firstBuild,m.finalBuild).then(()=>{c=!1,m.firstBuild?g.resolve():m.finalBuild&&(A.resolve(),this.clearSplatSceneDownloadAndBuildPromise()),u.length>0&&Qt(()=>d())})}},f=(m,p)=>{this.isDisposingOrDisposed()||(p||u.length===0||m.getSplatCount()>u[0].splatBuffer.getSplatCount())&&(u.push({splatBuffer:m,firstBuild:l===0,finalBuild:p}),l++,d())},h=this.downloadSplatSceneToSplatBuffer(e,n,r,!0,f,t,o),g=sa(h.abortHandler),A=sa();return this.addSplatSceneDownloadPromise(h),this.setSplatSceneDownloadAndBuildPromise(A.promise),h.then(()=>{this.removeSplatSceneDownloadPromise(h)}).catch(m=>{this.clearSplatSceneDownloadAndBuildPromise(),this.removeSplatSceneDownloadPromise(h);const p=this.updateError(m,"Viewer::addSplatScene -> Could not load one or more scenes");g.reject(p),a&&a(p)}),g.promise}addSplatScenes(e,t=!0,n=void 0){if(this.isLoadingOrUnloading())throw new Error("Cannot add splat scene while another load or unload is already in progress.");if(this.isDisposingOrDisposed())throw new Error("Cannot add splat scene after dispose() is called.");const i=e.length,r=[];let a;t&&(this.loadingSpinner.removeAllTasks(),a=this.loadingSpinner.addTask("Downloading..."));const o=(d,f,h,g)=>{r[d]=f;let A=0;for(let m=0;m<i;m++)A+=r[m]||0;A=A/i,h=`${A.toFixed(2)}%`,t&&g===yt.Downloading&&this.loadingSpinner.setMessageForTask(a,A==100?"Download complete!":`Downloading: ${h}`),n&&n(A,h,g)},l=[],c=[];for(let d=0;d<e.length;d++){const f=e[d],h=f.format!==void 0&&f.format!==null?f.format:rc(f.path),g=this.downloadSplatSceneToSplatBuffer(f.path,f.splatAlphaRemovalThreshold,o.bind(this,d),!1,void 0,h,f.headers);l.push(g),c.push(g.promise)}const u=new Es((d,f)=>{Promise.all(c).then(h=>{t&&this.loadingSpinner.removeTask(a),n&&n(0,"0%",yt.Processing),this.addSplatBuffers(h,e,!0,t,t,!1,!1).then(()=>{n&&n(100,"100%",yt.Processing),this.clearSplatSceneDownloadAndBuildPromise(),d()})}).catch(h=>{t&&this.loadingSpinner.removeTask(a),this.clearSplatSceneDownloadAndBuildPromise(),f(this.updateError(h,"Viewer::addSplatScenes -> Could not load one or more splat scenes."))}).finally(()=>{this.removeSplatSceneDownloadPromise(u)})},d=>{for(let f of l)f.abort(d)});return this.addSplatSceneDownloadPromise(u),this.setSplatSceneDownloadAndBuildPromise(u),u}downloadSplatSceneToSplatBuffer(e,t=1,n=void 0,i=!1,r=void 0,a,o){try{if(a===Lt.Splat||a===Lt.KSplat||a===Lt.Ply){const l=i?!1:this.optimizeSplatData;if(a===Lt.Splat)return Io.loadFromURL(e,n,i,r,t,this.inMemoryCompressionLevel,l,o);if(a===Lt.KSplat)return no.loadFromURL(e,n,i,r,o);if(a===Lt.Ply)return wo.loadFromURL(e,n,i,r,t,this.inMemoryCompressionLevel,l,this.sphericalHarmonicsDegree,o)}else if(a===Lt.Spz)return Ro.loadFromURL(e,n,t,this.inMemoryCompressionLevel,this.optimizeSplatData,this.sphericalHarmonicsDegree,o)}catch(l){throw this.updateError(l,null)}throw new Error(`Viewer::downloadSplatSceneToSplatBuffer -> File format not supported: ${e}`)}static isProgressivelyLoadable(e){return e===Lt.Splat||e===Lt.KSplat||e===Lt.Ply}setupSortWorker(e){if(!this.isDisposingOrDisposed())return new Promise(t=>{const n=this.integerBasedSort?Int32Array:Float32Array,i=e.getSplatCount(),r=e.getMaxSplatCount();this.sortWorker=eA(r,this.sharedMemoryForWorkers,this.enableSIMDInSort,this.integerBasedSort,this.splatMesh.dynamicMode,this.splatSortDistanceMapPrecision),this.sortWorker.onmessage=a=>{if(a.data.sortDone){if(this.sortRunning=!1,this.sharedMemoryForWorkers)this.splatMesh.updateRenderIndexes(this.sortWorkerSortedIndexes,a.data.splatRenderCount);else{const o=new Uint32Array(a.data.sortedIndexes.buffer,0,a.data.splatRenderCount);this.splatMesh.updateRenderIndexes(o,a.data.splatRenderCount)}this.lastSplatSortCount=this.splatSortCount,this.lastSortTime=a.data.sortTime,this.sortPromiseResolver(),this.sortPromiseResolver=null,this.forceRenderNextFrame(),this.runAfterNextSort.length>0&&(this.runAfterNextSort.forEach(o=>{o()}),this.runAfterNextSort.length=0)}else if(a.data.sortCanceled)this.sortRunning=!1;else if(a.data.sortSetupPhase1Complete){this.logLevel>=qi.Info&&console.log("Sorting web worker WASM setup complete."),this.sharedMemoryForWorkers?(this.sortWorkerSortedIndexes=new Uint32Array(a.data.sortedIndexesBuffer,a.data.sortedIndexesOffset,r),this.sortWorkerIndexesToSort=new Uint32Array(a.data.indexesToSortBuffer,a.data.indexesToSortOffset,r),this.sortWorkerPrecomputedDistances=new n(a.data.precomputedDistancesBuffer,a.data.precomputedDistancesOffset,r),this.sortWorkerTransforms=new Float32Array(a.data.transformsBuffer,a.data.transformsOffset,Ze.MaxScenes*16)):(this.sortWorkerIndexesToSort=new Uint32Array(r),this.sortWorkerPrecomputedDistances=new n(r),this.sortWorkerTransforms=new Float32Array(Ze.MaxScenes*16));for(let o=0;o<i;o++)this.sortWorkerIndexesToSort[o]=o;if(this.sortWorker.maxSplatCount=r,this.logLevel>=qi.Info){console.log("Sorting web worker ready.");const o=this.splatMesh.getSplatDataTextures(),l=o.covariances.size,c=o.centerColors.size;console.log("Covariances texture size: "+l.x+" x "+l.y),console.log("Centers/colors texture size: "+c.x+" x "+c.y)}t()}}})}updateError(e,t){return e instanceof jc?e:e instanceof mr?new Error("File type or server does not support progressive loading."):t?new Error(t):e}disposeSortWorker(){this.sortWorker&&this.sortWorker.terminate(),this.sortWorker=null,this.sortPromise=null,this.sortPromiseResolver&&(this.sortPromiseResolver(),this.sortPromiseResolver=null),this.preSortMessages=[],this.sortRunning=!1}removeSplatScene(e,t=!0){return this.removeSplatScenes([e],t)}removeSplatScenes(e,t=!0){if(this.isLoadingOrUnloading())throw new Error("Cannot remove splat scene while another load or unload is already in progress.");if(this.isDisposingOrDisposed())throw new Error("Cannot remove splat scene after dispose() is called.");let n;return this.splatSceneRemovalPromise=new Promise((i,r)=>{let a;t&&(this.loadingSpinner.removeAllTasks(),this.loadingSpinner.show(),a=this.loadingSpinner.addTask("Removing splat scene..."));const o=()=>{t&&(this.loadingSpinner.hide(),this.loadingSpinner.removeTask(a))},l=u=>{o(),this.splatSceneRemovalPromise=null,u?r(u):i()},c=()=>this.isDisposingOrDisposed()?(l(),!0):!1;n=this.sortPromise||Promise.resolve(),n.then(()=>{if(c())return;const u=[],d=[],f=[];for(let h=0;h<this.splatMesh.scenes.length;h++){let g=!1;for(let A of e)if(A===h){g=!0;break}if(!g){const A=this.splatMesh.scenes[h];u.push(A.splatBuffer),d.push(this.splatMesh.sceneOptions[h]),f.push({position:A.position.clone(),quaternion:A.quaternion.clone(),scale:A.scale.clone()})}}this.disposeSortWorker(),this.splatMesh.dispose(),this.sceneRevealMode=As.Instant,this.createSplatMesh(),this.addSplatBuffers(u,d,!0,!1,!0).then(()=>{c()||(o(),this.splatMesh.scenes.forEach((h,g)=>{h.position.copy(f[g].position),h.quaternion.copy(f[g].quaternion),h.scale.copy(f[g].scale)}),this.splatMesh.updateTransforms(),this.splatRenderReady=!1,this.runSplatSort(!0).then(()=>{if(c()){this.splatRenderReady=!0;return}n=this.sortPromise||Promise.resolve(),n.then(()=>{this.splatRenderReady=!0,l()})}))}).catch(h=>{l(h)})})}),this.splatSceneRemovalPromise}start(){if(this.selfDrivenMode)this.webXRMode?this.renderer.setAnimationLoop(this.selfDrivenUpdateFunc):this.requestFrameId=requestAnimationFrame(this.selfDrivenUpdateFunc),this.selfDrivenModeRunning=!0;else throw new Error("Cannot start viewer unless it is in self driven mode.")}stop(){this.selfDrivenMode&&this.selfDrivenModeRunning&&(this.webXRMode?this.renderer.setAnimationLoop(null):cancelAnimationFrame(this.requestFrameId),this.selfDrivenModeRunning=!1)}async dispose(){if(this.isDisposingOrDisposed())return this.disposePromise;let e=[],t=[];for(let n in this.splatSceneDownloadPromises)if(this.splatSceneDownloadPromises.hasOwnProperty(n)){const i=this.splatSceneDownloadPromises[n];t.push(i),e.push(i.promise)}return this.sortPromise&&e.push(this.sortPromise),this.disposing=!0,this.disposePromise=Promise.all(e).finally(()=>{this.stop(),this.orthographicControls&&(this.orthographicControls.dispose(),this.orthographicControls=null),this.perspectiveControls&&(this.perspectiveControls.dispose(),this.perspectiveControls=null),this.controls=null,this.splatMesh&&(this.splatMesh.dispose(),this.splatMesh=null),this.sceneHelper&&(this.sceneHelper.dispose(),this.sceneHelper=null),this.resizeObserver&&(this.resizeObserver.unobserve(this.rootElement),this.resizeObserver=null),this.disposeSortWorker(),this.removeEventHandlers(),this.loadingSpinner.removeAllTasks(),this.loadingSpinner.setContainer(null),this.loadingProgressBar.hide(),this.loadingProgressBar.setContainer(null),this.infoPanel.setContainer(null),this.camera=null,this.threeScene=null,this.splatRenderReady=!1,this.initialized=!1,this.renderer&&(this.usingExternalRenderer||(this.rootElement.removeChild(this.renderer.domElement),this.renderer.dispose()),this.renderer=null),this.usingExternalRenderer||document.body.removeChild(this.rootElement),this.sortWorkerSortedIndexes=null,this.sortWorkerIndexesToSort=null,this.sortWorkerPrecomputedDistances=null,this.sortWorkerTransforms=null,this.disposed=!0,this.disposing=!1,this.disposePromise=null}),t.forEach(n=>{n.abort("Scene disposed")}),this.disposePromise}selfDrivenUpdate(){this.selfDrivenMode&&!this.webXRMode&&(this.requestFrameId=requestAnimationFrame(this.selfDrivenUpdateFunc)),this.update(),this.shouldRender()?(this.render(),this.consecutiveRenderFrames++):this.consecutiveRenderFrames=0,this.renderNextFrame=!1}forceRenderNextFrame(){this.renderNextFrame=!0}update(e,t){this.dropInMode&&this.updateForDropInMode(e,t),!(!this.initialized||!this.splatRenderReady||this.isDisposingOrDisposed())&&(this.controls&&(this.controls.update(),this.camera.isOrthographicCamera&&!this.usingExternalCamera&&Kn.setCameraPositionFromZoom(this.camera,this.camera,this.controls)),this.runSplatSort(),this.updateForRendererSizeChanges(),this.updateSplatMesh(),this.updateMeshCursor(),this.updateFPS(),this.timingSensitiveUpdates(),this.updateInfoPanel(),this.updateControlPlane())}updateForDropInMode(e,t){this.renderer=e,this.splatMesh&&this.splatMesh.setRenderer(this.renderer),this.camera=t,this.controls&&(this.controls.object=t),this.init()}updateControlPlane(){this.showControlPlane?(this.sceneHelper.setControlPlaneVisibility(!0),this.sceneHelper.positionAndOrientControlPlane(this.controls.target,this.camera.up)):this.sceneHelper.setControlPlaneVisibility(!1)}getSplatMesh(){return this.splatMesh}getSplatScene(e){return this.splatMesh.getScene(e)}getSceneCount(){return this.splatMesh.getSceneCount()}isMobile(){return navigator.userAgent.includes("Mobi")}};fe(Kn,"setCameraPositionFromZoom",function(){const e=new P;return function(t,n,i){const r=1/(n.zoom*.001);e.copy(i.target).sub(t.position).normalize().multiplyScalar(r).negate(),t.position.copy(i.target).add(e)}}()),fe(Kn,"setCameraZoomFromPosition",function(){const e=new P;return function(t,n,i){const r=e.copy(i.target).sub(n.position).length();t.zoom=1/(r*.001)}}());let ro=Kn;function fA(){const{runId:s}=du(),e=Number(s),{t}=hu(),[n,i]=tt.useState([]),{data:r}=Ho(()=>br.trainingRuns(40),[]),{data:a,error:o,reload:l}=Ho(()=>br.trainingPreview(e,n),[e,n]),[c,u]=tt.useState({}),[d,f]=tt.useState({}),[h,g]=tt.useState({}),[A,m]=tt.useState(null),[p,S]=tt.useState(!1),[_,x]=tt.useState(0),[T,E]=tt.useState(null),[M,w]=tt.useState(!1),[y,v]=tt.useState(null),[I,U]=tt.useState(null),[F,B]=tt.useState({}),[z,N]=tt.useState(!1),q=tt.useRef(null),H=tt.useRef(null),X=tt.useRef({}),ee=tt.useRef(a);ee.current=a;const he=tt.useRef(null);he.current=A;const[Re,ze]=tt.useState(!1),W=tt.useRef(!1);W.current=Re;const te=tt.useMemo(()=>a?a.scenes.map(R=>`${R.key}@${R.url}`).join("|"):"",[a]),le=tt.useMemo(()=>(r??[]).filter(R=>R.id!==e&&R.status==="succeeded"&&(R.artifacts??[]).some(ae=>ae.kind==="ply")),[r,e]);tt.useEffect(()=>{const R=q.current,ae=ee.current;if(!R||!ae)return;let oe=!1;S(!0),E(null),x(0),X.current={};const de=new ro({cameraUp:[0,-1,0],initialCameraPosition:[0,-3,9],initialCameraLookAt:[0,0,0],rootElement:R,selfDrivenMode:!0,useBuiltInControls:!0,sharedMemoryForWorkers:!1,dynamicScene:!0,enableOptionalEffects:!0});return H.current=de,de.start(),(async()=>{try{for(const ce of ae.scenes){if(oe||(await de.addSplatScene(ce.url,{format:Lt.Ply,showLoadingUI:!1,splatAlphaRemovalThreshold:2}),oe))return;X.current[ce.key]=de.splatMesh.scenes.length-1,x(Le=>Le+1)}}catch(ce){oe||E(ce instanceof Error?ce.message:String(ce))}finally{oe||S(!1)}})(),()=>{oe=!0;try{de.dispose()}catch{}H.current=null,X.current={}}},[te]),tt.useEffect(()=>{if(!a)return;const R={};for(const re of a.scenes)R[re.key]=ru(re.placement);u(R),f(fa(R));const ae=a.scenes.some(re=>!re.merged&&!re.is_reference),oe=new Set(a.scenes.filter(re=>re.is_reference&&re.merged).map(re=>re.run_id)),de={};for(const re of a.scenes)re.is_reference?!re.merged&&oe.has(re.run_id)&&(de[re.key]=!0):re.merged&&ae&&(de[re.key]=!0);g(de),B({});const Le=a.scenes.find(re=>!re.merged&&!re.is_reference)??a.scenes[0];m(re=>re&&R[re]?re:(Le==null?void 0:Le.key)??null)},[a]),tt.useEffect(()=>{const R=H.current;if(R)for(const[ae,oe]of Object.entries(c)){const de=X.current[ae];de!==void 0&&R.splatMesh.getScene(de).transform.copy(cA(oe))}},[c,_]),tt.useEffect(()=>{const R=H.current;if(R)for(const[ae,oe]of Object.entries(X.current)){const de=R.splatMesh.getScene(oe);de&&(de.visible=!h[ae])}},[h,_]),tt.useEffect(()=>{var de;const R=H.current,ae=(de=ee.current)==null?void 0:de.scenes;if(!R||!ae)return;const oe=ae.find(ce=>ce.key===A);for(const ce of ae){const Le=X.current[ce.key];if(Le===void 0)continue;const re=R.splatMesh.getScene(Le);if(!re)continue;const D=ce.is_reference===((oe==null?void 0:oe.is_reference)??!1),C=ce.key===A;re.opacity=!oe||C||!D?1:.45}},[A,_]);const se=tt.useCallback(R=>{const ae=H.current,oe=q.current;if(!ae||!oe)return .01;const de=new P(R.pivot[0]+R.offset[0],R.pivot[1]+R.offset[1],R.pivot[2]+R.offset[2]),ce=ae.camera.position.distanceTo(de),Le=oe.clientHeight||1,re=(ae.camera.fov||50)*Math.PI/180;return 2*Math.tan(re/2)*ce/Le},[]),Ae=tt.useCallback(R=>{const ae=he.current;ae&&u(oe=>{const de=oe[ae];return de?{...oe,[ae]:R(de)}:oe})},[]),Ee=tt.useCallback((R,ae)=>{const oe=he.current;if(!oe)return;const de=`${oe}:${R}`;B(ce=>{const Le={...ce};return ae===void 0?delete Le[de]:Le[de]=ae,Le})},[]);tt.useEffect(()=>{const R=q.current;if(!R)return;let ae=null,oe=0,de=0;const ce=O=>{var Z;if(!(O.altKey||W.current&&!O.shiftKey)||!he.current||O.button!==0&&O.button!==2)return;ae=O.button===2?"rotate":"move",oe=O.clientX,de=O.clientY,O.stopImmediatePropagation(),O.preventDefault();const ne=(Z=H.current)==null?void 0:Z.controls;ne&&(ne.enabled=!1),N(!0),B({}),window.addEventListener("pointermove",Le,!0),window.addEventListener("pointerup",re,!0),window.addEventListener("pointercancel",re,!0)},Le=O=>{if(!ae)return;const $=O.clientX-oe,ne=O.clientY-de;if(oe=O.clientX,de=O.clientY,O.stopPropagation(),O.preventDefault(),ae==="rotate"){Ae(qe=>({...qe,yaw:qe.yaw-$*.006}));return}const Z=H.current,Pe=Z==null?void 0:Z.camera;if(!Pe)return;const ve=new P().setFromMatrixColumn(Pe.matrixWorld,0),Te=new P().setFromMatrixColumn(Pe.matrixWorld,1);Ae(qe=>{const ue=se(qe),L=new P().addScaledVector(ve,$*ue).addScaledVector(Te,-ne*ue);return{...qe,offset:[qe.offset[0]+L.x,qe.offset[1]+L.y,qe.offset[2]+L.z]}})},re=()=>{var $;ae=null,N(!1);const O=($=H.current)==null?void 0:$.controls;O&&(O.enabled=!0),window.removeEventListener("pointermove",Le,!0),window.removeEventListener("pointerup",re,!0),window.removeEventListener("pointercancel",re,!0)},D=O=>{if(!(O.altKey||W.current&&!O.shiftKey)||!he.current)return;O.preventDefault(),O.stopImmediatePropagation();const ne=Math.exp(-O.deltaY*.0015);Ae(Z=>({...Z,scale:lA(Z.scale*ne,.02,50)}))},C=O=>{(O.altKey||W.current&&!O.shiftKey)&&O.preventDefault()};return R.addEventListener("pointerdown",ce,!0),R.addEventListener("wheel",D,{passive:!1,capture:!0}),R.addEventListener("contextmenu",C),()=>{var $;R.removeEventListener("pointerdown",ce,!0),R.removeEventListener("wheel",D,!0),R.removeEventListener("contextmenu",C),window.removeEventListener("pointermove",Le,!0),window.removeEventListener("pointerup",re,!0),window.removeEventListener("pointercancel",re,!0);const O=($=H.current)==null?void 0:$.controls;O&&(O.enabled=!0)}},[Ae,se]);const be=tt.useMemo(()=>Object.keys(c).filter(R=>!mc(c[R],d[R])),[c,d]);async function Ye(){if(!(!a||be.length===0)){w(!0),v(null),U(null);try{const R=[];for(const oe of a.scenes){if(!be.includes(oe.key))continue;const de=c[oe.key];R.push({key:oe.block_key??"merged",run_id:oe.is_reference?oe.run_id:null,offset:[...de.offset],yaw:de.yaw,pitch:de.pitch,roll:de.roll,scale:de.scale})}const ae=await br.updateTrainingTransforms(e,R);f(fa(c)),v(t("admin.preview.saved",{count:ae.saved})),await l(!0)}catch(R){U(t("admin.preview.saveFailed",{error:String(R)}))}finally{w(!1)}}}const Ie=(a==null?void 0:a.scenes.find(R=>R.key===A))??null,Be=A?c[A]:void 0;return o?Se.jsx("div",{className:"page-head",children:Se.jsxs("div",{children:[Se.jsx("h1",{children:t("admin.preview.title")}),Se.jsx(fu,{error:o}),Se.jsx(ko,{className:"btn btn-ghost",to:"/admin/training",children:t("admin.preview.back")})]})}):a?Se.jsxs("div",{className:"preview-shell",children:[Se.jsxs("div",{className:"preview-bar",children:[Se.jsxs("div",{className:"row",style:{gap:10,flexWrap:"wrap"},children:[Se.jsxs(ko,{className:"btn btn-ghost sm",to:"/admin/training",children:["← ",t("admin.preview.back")]}),Se.jsx("strong",{children:a.name}),Se.jsx(mu,{tone:gu(a.status),children:t(`training.status.${a.status}`)}),Se.jsxs("span",{className:"small muted",children:[t("admin.preview.coordinate"),":"," ",["colmap_world","enu_metres"].includes(a.coordinate_system)?t(`admin.preview.coordinate.${a.coordinate_system}`):a.coordinate_system]}),Se.jsxs("button",{type:"button",className:`btn sm ${Re?"btn-primary":"btn-ghost"}`,disabled:!Ie,title:t("admin.preview.editHint"),onClick:()=>ze(R=>!R),children:["✥ ",t(Re?"admin.preview.editExit":"admin.preview.editEnter")]})]}),Se.jsx("span",{className:"small muted",children:p?t("admin.preview.loadingScene",{done:_,total:a.scenes.length}):t("admin.preview.loaded",{count:_})})]}),Se.jsxs("div",{className:"preview-body",children:[Se.jsx("div",{className:`preview-canvas${Re&&Ie?" edit-active":""}`,ref:q,children:Re&&Ie&&Be?Se.jsxs("div",{className:"preview-toast",children:[Se.jsx("div",{children:Se.jsx("strong",{children:t("admin.preview.moving",{name:Ie.name})})}),Se.jsx("div",{children:z?Se.jsxs("span",{className:"ok-text",children:["● ",t("admin.preview.dragging")]}):t("admin.preview.editActive")}),Se.jsx("div",{className:"mono",children:`Δ ${Be.offset.map(R=>In(R,3)).join(", ")}  ·  ${sr(Be.yaw)}° / ${sr(Be.pitch)}° / ${sr(Be.roll)}°  ·  ×${In(Be.scale,3)}`})]}):null}),Se.jsxs("aside",{className:"preview-panel",children:[Se.jsx("h4",{children:t("admin.preview.referenceTitle")}),Se.jsx("p",{className:"small muted",children:t("admin.preview.referenceHint")}),le.length===0?Se.jsx("p",{className:"small muted",children:t("admin.preview.referenceEmpty")}):Se.jsx("ul",{className:"preview-scenes",children:le.map(R=>Se.jsxs("li",{className:n.includes(R.id)?"active":"",onClick:()=>i(ae=>ae.includes(R.id)?ae.filter(oe=>oe!==R.id):[...ae,R.id]),children:[Se.jsx("input",{type:"checkbox",checked:n.includes(R.id),readOnly:!0}),Se.jsxs("div",{className:"preview-scene-text",children:[Se.jsxs("div",{children:["#",R.id," ",R.name]}),Se.jsxs("div",{className:"small muted",children:[R.scope_kind==="outdoor"?t("admin.preview.outdoor"):t("admin.preview.indoor")," · ",t("admin.preview.blocksCount",{count:R.block_total})]})]})]},R.id))}),Se.jsx("div",{className:"divider"}),Se.jsx("h4",{children:t("admin.preview.scenes")}),a.scenes.length===0?Se.jsx("p",{className:"small muted",children:t("admin.preview.empty")}):Se.jsx("ul",{className:"preview-scenes",children:a.scenes.map(R=>Se.jsxs("li",{className:A===R.key?"active":"",onClick:()=>m(R.key),children:[Se.jsx("input",{type:"checkbox",checked:!h[R.key],onClick:ae=>ae.stopPropagation(),onChange:()=>g(ae=>({...ae,[R.key]:!ae[R.key]})),title:t("admin.preview.visible")}),Se.jsx("span",{className:"preview-dot",style:{background:`rgb(${R.color.map(ae=>Math.round(ae*255)).join(",")})`}}),Se.jsxs("div",{className:"preview-scene-text",children:[Se.jsxs("div",{children:[R.merged?t("admin.preview.merged"):`${t("admin.preview.block")}: ${R.name}`,R.is_reference?` · #${R.run_id}`:"",R.transform_source==="manual"?Se.jsxs("span",{className:"ok-text",title:t("admin.preview.placed"),children:[" ","✓"]}):null,mc(c[R.key],d[R.key])?null:Se.jsx("span",{className:"warn-text",children:" *"})]}),Se.jsxs("div",{className:"small muted",children:[R.gaussians>0?`${R.gaussians.toLocaleString()} ${t("admin.training.blockGaussians")}`:"",R.size_bytes?` · ${Au(R.size_bytes)}`:""]})]})]},R.key))}),Se.jsx("div",{className:"divider"}),Se.jsx("h4",{children:t("admin.preview.place")}),!Ie||!Be?Se.jsx("p",{className:"small muted",children:t("admin.preview.selectScene")}):Se.jsxs(Se.Fragment,{children:[Se.jsx("p",{className:"small muted",children:Ie.name}),Se.jsxs("div",{className:"placement-grid",children:[Se.jsx("span",{className:"small muted",children:t("admin.preview.position")}),["x","y","z"].map((R,ae)=>{const oe=`pos${ae}`,de=F[`${Ie.key}:${oe}`],ce=Be.pivot[ae]+Be.offset[ae];return Se.jsxs("label",{className:"placement-input",children:[Se.jsx("span",{children:R.toUpperCase()}),Se.jsx("input",{type:"number",step:.1,value:de??String(In(ce,3)),onChange:Le=>{const re=Le.target.value;if(Ee(oe,re),re.trim()==="")return;const D=Number(re);Number.isFinite(D)&&Ae(C=>{const O=[...C.offset];return O[ae]=D-C.pivot[ae],{...C,offset:O}})},onBlur:()=>Ee(oe)})]},R)})]}),Se.jsxs("div",{className:"placement-grid",children:[Se.jsx("span",{className:"small muted",children:t("admin.preview.rotation")}),[["pitch","X"],["yaw","Y"],["roll","Z"]].map(([R,ae])=>Se.jsxs("label",{className:"placement-input",children:[Se.jsx("span",{children:ae}),Se.jsx("input",{type:"number",step:1,value:F[`${Ie.key}:${R}`]??String(sr(Be[R])),onChange:oe=>{const de=oe.target.value;if(Ee(R,de),de.trim()==="")return;const ce=Number(de);Number.isFinite(ce)&&Ae(Le=>({...Le,[R]:ce*Math.PI/180}))},onBlur:()=>Ee(R)})]},R))]}),Se.jsxs("div",{className:"placement-grid",children:[Se.jsx("span",{className:"small muted",children:t("admin.preview.scale")}),Se.jsx("input",{type:"range",min:.1,max:4,step:.01,value:In(Be.scale,3),onChange:R=>Ae(ae=>({...ae,scale:Number(R.target.value)}))}),Se.jsx("input",{type:"number",step:.01,value:F[`${Ie.key}:scale`]??String(In(Be.scale,3)),onChange:R=>{const ae=R.target.value;if(Ee("scale",ae),ae.trim()==="")return;const oe=Number(ae);!Number.isFinite(oe)||oe<=0||Ae(de=>({...de,scale:oe}))},onBlur:()=>Ee("scale")})]}),Se.jsx("p",{className:"small muted",children:t("admin.preview.pivotHint",{x:In(Be.pivot[0],2),y:In(Be.pivot[1],2),z:In(Be.pivot[2],2)})}),Se.jsxs("div",{className:"row",style:{gap:6,marginTop:8,flexWrap:"wrap"},children:[Se.jsx("button",{type:"button",className:"btn btn-ghost sm",onClick:()=>{const R=d[Ie.key];R&&(B({}),u(ae=>({...ae,[Ie.key]:{pivot:[...R.pivot],offset:[0,0,0],yaw:0,pitch:0,roll:0,scale:1}})))},children:t("admin.preview.reset")}),Se.jsx("button",{type:"button",className:"btn btn-ghost sm",disabled:be.length===0,onClick:()=>{B({}),u(fa(d))},children:t("admin.preview.revert")})]}),Se.jsx("button",{type:"button",className:"btn btn-primary sm",style:{marginTop:8},disabled:M||be.length===0||p,onClick:()=>void Ye(),children:M?t("admin.preview.saving"):t("admin.preview.save",{count:be.length})}),y?Se.jsx("p",{className:"small ok-text",children:y}):null,I?Se.jsx("p",{className:"small warn-text",children:I}):null]}),T?Se.jsx("p",{className:"small warn-text",children:t("admin.preview.failed",{error:T})}):null,Se.jsx("div",{className:"divider"}),Se.jsx("p",{className:"small muted",children:t("admin.preview.gizmoHint")}),Se.jsx("p",{className:"small muted",children:t("admin.preview.cameraHint")}),Se.jsx("p",{className:"small muted",children:t("admin.preview.manualNote")})]})]})]}):Se.jsx(pu,{})}function ru(s){return{pivot:[...s.pivot],offset:[...s.offset],yaw:s.yaw,pitch:s.pitch,roll:s.roll,scale:s.scale}}function fa(s){const e={};for(const[t,n]of Object.entries(s))e[t]=ru(n);return e}function sr(s){const t=((s*180/Math.PI+180)%360+360)%360-180;return In(t===-180?180:t,1)}function mc(s,e){return!s||!e?!0:Math.abs(s.yaw-e.yaw)<1e-9&&Math.abs(s.pitch-e.pitch)<1e-9&&Math.abs(s.roll-e.roll)<1e-9&&Math.abs(s.scale-e.scale)<1e-9&&s.offset.every((t,n)=>Math.abs(t-e.offset[n])<1e-9)}function lA(s,e,t){return Math.max(e,Math.min(t,s))}function In(s,e=2){const t=10**e;return Math.round(s*t)/t}function cA(s){const[e,t,n]=s.pivot,[i,r,a]=s.offset,o=Math.cos(s.pitch),l=Math.sin(s.pitch),c=Math.cos(s.yaw),u=Math.sin(s.yaw),d=Math.cos(s.roll),f=Math.sin(s.roll),h=c*d,g=d*u*l-o*f,A=o*d*u+l*f,m=c*f,p=l*u*f+o*d,S=o*u*f-d*l,_=-u,x=c*l,T=o*c,E=s.scale,M=e+i-E*(h*e+g*t+A*n),w=t+r-E*(m*e+p*t+S*n),y=n+a-E*(_*e+x*t+T*n),v=new Ge;return v.set(E*h,E*g,E*A,M,E*m,E*p,E*S,w,E*_,E*x,E*T,y,0,0,0,1),v}export{fA as default};
