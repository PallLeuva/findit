import type { Item } from "./findit";
let modelPromise: Promise<import("@tensorflow-models/coco-ssd").ObjectDetection> | null = null;
export async function detectItems(image: HTMLImageElement):Promise<Item[]> {
  if (!modelPromise) modelPromise=(async()=>{
    const tf=await import("@tensorflow/tfjs");
    await tf.ready();
    const coco=await import("@tensorflow-models/coco-ssd");
    return coco.load({base:"lite_mobilenet_v2",modelUrl:new URL(`${import.meta.env.BASE_URL}models/coco/model.json`, document.baseURI).href});
  })().catch(e=>{modelPromise=null;throw e});
  const model=await modelPromise;
  const result=await model.detect(image,35,0.45);
  return result.filter(p=>p.class!=="person").map(p=>({id:crypto.randomUUID(),label:p.class,source:"detected",confidence:p.score,box:[Math.max(0,p.bbox[0]/image.naturalWidth),Math.max(0,p.bbox[1]/image.naturalHeight),Math.min(1-Math.max(0,p.bbox[0]/image.naturalWidth),p.bbox[2]/image.naturalWidth),Math.min(1-Math.max(0,p.bbox[1]/image.naturalHeight),p.bbox[3]/image.naturalHeight)]}));
}
export async function preparePhoto(file: File) {
 if(file.size>20*1024*1024) throw new Error("Choose a photo smaller than 20 MB.");
 if(!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG, or WebP photo.");
 const url=URL.createObjectURL(file), source=new Image();
 try { source.src=url; await source.decode(); const scale=Math.min(1,1600/Math.max(source.naturalWidth,source.naturalHeight)); const canvas=document.createElement("canvas"); canvas.width=Math.round(source.naturalWidth*scale);canvas.height=Math.round(source.naturalHeight*scale); const ctx=canvas.getContext("2d");if(!ctx) throw new Error("This browser could not process the photo.");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(source,0,0,canvas.width,canvas.height);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Could not read this photo.")),"image/jpeg",.88));return {blob,width:canvas.width,height:canvas.height,url:URL.createObjectURL(blob)}; } finally { URL.revokeObjectURL(url); }
}
