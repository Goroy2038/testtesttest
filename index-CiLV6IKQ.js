var w=Object.defineProperty;var B=(a,e,t)=>e in a?w(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var o=(a,e,t)=>B(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const u of n.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const y=`
@group(0) @binding(0) var<uniform> cameraMatrix: mat4x4<f32>;
@group(0) @binding(1) var<uniform> winodwSize: vec2f;
@group(0) @binding(2) var<uniform> modelMatrix: mat4x4<f32>;


struct VertexInput {
    @location(0) position: vec4f,
};


struct MaterialInput {
    @location(1) color: vec4f
};


struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4f
};

@vertex
fn main(@builtin(instance_index) instIdx: u32, input: VertexInput, material: MaterialInput) -> VertexOutput {
    var output: VertexOutput;


    output.position = modelMatrix * vec4f( input.position[0] + f32(instIdx) / 30., input.position[1] + f32(instIdx) / 30., input.position[2], 1);
    output.color = material.color;


    return output;
}
`,M=`
@fragment
fn main(@location(0) color: vec4<f32>) -> @location(0) vec4f {
    // return color;  // Возвращаем цвет вершины
    return vec4f(color.r, 0.7, color.b, 1.);
}
`;class h{constructor(){o(this,"elements");this.elements=new Array(16).fill(0),this.identity()}identity(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}multiply(e){const t=new h;for(let i=0;i<4;i++)for(let r=0;r<4;r++){t.elements[i*4+r]=0;for(let n=0;n<4;n++)t.elements[i*4+r]+=this.elements[i*4+n]*e.elements[n*4+r]}return t}translate(e,t,i){return this.elements[12]+=e,this.elements[13]+=t,this.elements[14]+=i,this}rotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.elements[5]=t,this.elements[6]=i,this.elements[9]=-i,this.elements[10]=t,this}rotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.elements[0]=t,this.elements[8]=i,this.elements[2]=-i,this.elements[10]=t,this}ortho(e,t,i,r,n,u){const s=this.elements;return s[0]=2/(t-e),s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=2/(r-i),s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=1/(n-u),s[11]=0,s[12]=(t+e)/(e-t),s[13]=(r+i)/(i-r),s[14]=n/(n-u),s[15]=1,s}}var x=(a=>(a[a.Draw=0]="Draw",a[a.DrawIndexed=1]="DrawIndexed",a))(x||{});class S{constructor(e,t){o(this,"context");o(this,"device");o(this,"canvasTexture");o(this,"renderPassDescriptor");o(this,"depthTexture");o(this,"objectsToRender",[]);o(this,"cameraMatrix");o(this,"uniformBufferCamera");o(this,"windowSize",[0,0]);o(this,"uniformBufferWindowSize");this.context=e,this.device=t,this.cameraMatrix=new h,this.canvasTexture=this.context.getCurrentTexture(),this.renderPassDescriptor={label:"renderPassDescriptor",colorAttachments:[{view:this.canvasTexture.createView(),clearValue:{r:.1,g:0,b:.1,a:.9},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.canvasTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},this.uniformBufferCamera=this.device.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.uniformBufferWindowSize=this.device.createBuffer({size:8,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}addToRender(e){this.objectsToRender.push(e)}updateBundingGroups(e,t){const i=new Float32Array(this.cameraMatrix.elements);this.device.queue.writeBuffer(this.uniformBufferCamera,0,i);const r=new Float32Array(this.windowSize);return this.device.queue.writeBuffer(this.uniformBufferWindowSize,0,r),this.device.createBindGroup({label:"updateBundingGroups",layout:e,entries:[{binding:0,resource:{buffer:this.uniformBufferCamera}},{binding:1,resource:{buffer:this.uniformBufferWindowSize}},{binding:2,resource:{buffer:t}}]})}render(e){const t=this.context.getCurrentTexture();this.renderPassDescriptor.colorAttachments[0].view=t.createView(),(!this.depthTexture||this.depthTexture.width!==t.width||this.depthTexture.height!==t.height)&&(this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=this.device.createTexture({size:[t.width,t.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT})),this.renderPassDescriptor.depthStencilAttachment.view=this.depthTexture.createView();const i=this.device.createCommandEncoder(),r=i.beginRenderPass(this.renderPassDescriptor);r.setPipeline(e[0].pipeline),r.setVertexBuffer(0,e[0].buffers.vertex);for(let n=0;n<e.length;n++){const u=e[n];u.bindGroup||(u.bindGroup=this.updateBundingGroups(u.bindGroupLayout,u.uniformBufferModelMatrix)),r.setBindGroup(0,u.bindGroup),r.setVertexBuffer(1,u.colorBuffer),r.draw(3,5,0,0)}r.end(),this.device.queue.submit([i.finish()])}}class P{constructor(e){o(this,"device");o(this,"drawType",x.DrawIndexed);o(this,"vertexShaderWGSL",y);o(this,"fragmentShaderWGSL",M);o(this,"uniforms",[]);o(this,"buffers",{index:void 0,vertex:void 0,other:[]});o(this,"colorBuffer");o(this,"vertex",[0,.02,0,-.02,-.02,0,.02,-.02,0]);o(this,"index",[0,1,2]);o(this,"color",this.getRndInteger(0,100)/100);o(this,"material",{color:[this.color,this.color,this.color,.8,this.color,this.color,this.color,.8,this.color,this.color,this.color,.8]});o(this,"bindGroupLayout");o(this,"pipeline");o(this,"uniformBufferModelMatrix");o(this,"modelMatrix");o(this,"bindGroup");o(this,"renderOptions",{primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}});this.device=e,this.modelMatrix=new h,this.bindGroupLayout=this.updateBindingGroupLayout();const t=this.getRndInteger(0,100)/100,i=this.getRndInteger(0,100)/100,r=this.getRndInteger(0,100)/100;this.material.color=[t,i,r,.8,t,i,r,.8,t,i,r,.8];const n=new Float32Array(this.vertex);this.buffers.vertex=e.createBuffer({size:n.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),new Float32Array(this.buffers.vertex.getMappedRange()).set(n),this.buffers.vertex.unmap();const u=new Float32Array(this.index),s=Math.ceil(u.byteLength/4)*4;this.buffers.index=e.createBuffer({size:s,usage:GPUBufferUsage.INDEX,mappedAtCreation:!0}),new Uint16Array(this.buffers.index.getMappedRange()).set(u),this.buffers.index.unmap();const f=new Float32Array(this.material.color);this.colorBuffer=e.createBuffer({size:f.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.device.queue.writeBuffer(this.colorBuffer,0,f),this.uniformBufferModelMatrix=this.device.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.pipeline=this.updatePipeline()}getRndInteger(e,t){return Math.floor(Math.random()*(t-e+1))+e}updateModelMatrix(){const e=new Float32Array(this.modelMatrix.elements);this.device.queue.writeBuffer(this.uniformBufferModelMatrix,0,e)}updateMaterial(){const e=new Float32Array(this.material.color);this.device.queue.writeBuffer(this.colorBuffer,0,e)}updateBindingGroupLayout(){return this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})}updatePipeline(){return this.device.createRenderPipeline({layout:this.bindGroupLayout?this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}):"auto",vertex:{module:this.device.createShaderModule({code:this.vertexShaderWGSL}),entryPoint:"main",buffers:[{arrayStride:3*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},{arrayStride:2*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:1,offset:0,format:"float32x2"}]}]},fragment:{module:this.device.createShaderModule({code:this.fragmentShaderWGSL}),entryPoint:"main",targets:[{format:navigator.gpu.getPreferredCanvasFormat(),blend:this.renderOptions.blend}]},primitive:this.renderOptions.primitive,depthStencil:this.renderOptions.depthStencil})}}const l=document.getElementById("gpuCanvas");function v(){const a=window.devicePixelRatio||1,e=Math.floor(l.clientWidth*a),t=Math.floor(l.clientHeight*a);l.width=e,l.height=t}v();window.addEventListener("resize",v);async function G(){const a=document.getElementById("gpuCanvas"),e=await navigator.gpu.requestAdapter(),t=await(e==null?void 0:e.requestDevice());if(!t){console.error("WebGPU device initialization failed.");return}const i=a.getContext("webgpu"),r=navigator.gpu.getPreferredCanvasFormat();i.configure({device:t,format:r,alphaMode:"premultiplied"});const n=[];function u(c,d){return Math.floor(Math.random()*(d-c+1))+c}for(let c=0;c<100;c++){const d=new P(t);d.modelMatrix.ortho(0,2,2,0,4e3,-4e3),d.modelMatrix.translate(u(-100,100)/100+1,u(-100,100)/100-1,0),n.push(d)}const s=new S(i,t);let f=0,p=0;const b=document.getElementById("fps");function m(c){c-p>200&&(b.innerText=String(Math.round(1e3/(c-f))),p=c),f=c;for(let d=0;d<n.length;d++){const g=n[d];g.modelMatrix.rotationY(c/3e3/(d/1e3)),g.updateModelMatrix()}s.windowSize=[a.width,a.height],s.render(n),requestAnimationFrame(m)}requestAnimationFrame(m)}G();
