export type Item = { id: string; label: string; box: [number, number, number, number] | null; source: "detected" | "manual" | "sample"; confidence?: number };
export type Photo = { id: string; location: string; notes: string; items: Item[]; width: number; height: number; createdAt: string; imageUrl: string; sample?: boolean };
const aliases: Record<string,string> = {mobile:"phone",smartphone:"phone",cellphone:"phone",mug:"cup",mugs:"cup",cups:"cup",sofa:"couch",controller:"remote",remotes:"remote",notebook:"book",notebooks:"book",books:"book",scissor:"scissors",cord:"cable",charger:"cable",charging:"cable",adapter:"cable",cords:"cable",cables:"cable",computer:"laptop",plant:"potted plant",headphones:"headphone",earbuds:"headphone"};
const stop = new Set("where did do i put my the a an is are find me please locate looking for last seen can you show of to it some in on at with and".split(" "));
export function terms(text:string) { return text.toLowerCase().replace(/cell phone/g,"phone").replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t&&!stop.has(t)).map(t=>aliases[t] || (t.endsWith("s") && t.length>4 && t!=="scissors" ? t.slice(0,-1) : t)); }
export function matches(query:string, text:string) { const q=terms(query), value=terms(text).join(" "); return q.length>0 && q.every(t=>value.includes(t)); }
export function searchPhotos(photos:Photo[],query:string,location="All locations") {
  return photos.filter(p=>location==="All locations"||p.location===location).map(p=>({photo:p,matches:query.trim()?p.items.filter(i=>matches(query,i.label+" "+p.location+" "+p.notes)):p.items})).filter(r=>!query.trim()||r.matches.length>0||matches(query,r.photo.location+" "+r.photo.notes));
}
export const samplePhoto: Photo = { id:"sample-desk",location:"Home office · Desk",notes:"Illustrative sample photo with manually labeled items. Your photos are kept separately.",width:1536,height:1024,createdAt:"",imageUrl:`${import.meta.env.BASE_URL}demo-desk.jpg`,sample:true,items:[
 {id:"sample-remote",label:"Remote control",box:[.047,.564,.211,.384],source:"sample"},
 {id:"sample-book",label:"Green notebook",box:[.177,.166,.262,.547],source:"sample"},
 {id:"sample-phone",label:"Black phone",box:[.481,.309,.168,.376],source:"sample"},
 {id:"sample-cup",label:"Blue mug",box:[.734,.006,.223,.316],source:"sample"},
 {id:"sample-scissors",label:"Scissors",box:[.696,.324,.242,.336],source:"sample"},
 {id:"sample-cable",label:"White charging cable",box:[.619,.637,.247,.258],source:"sample"}
] };
