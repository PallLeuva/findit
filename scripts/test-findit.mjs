import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source=await readFile(new URL('../lib/findit.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {searchPhotos,samplePhoto}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
for(const [query,wanted] of [['Where is my remote?','Remote control'],['mug','Blue mug'],['cup','Blue mug'],['charger','White charging cable'],['phone','Black phone'],['notebook','Green notebook'],['scissors','Scissors']]){
 const results=searchPhotos([samplePhoto],query);
 assert.equal(results.length,1,query);assert.equal(results[0].matches[0].label,wanted,query);
}
assert.equal(searchPhotos([samplePhoto],'keys').length,0);
assert.equal(searchPhotos([samplePhoto],'remote','Kitchen').length,0);
assert.equal(searchPhotos([samplePhoto],'','All locations').length,1);
assert.equal(searchPhotos([samplePhoto],'office').length,1);
for(const item of samplePhoto.items){const [x,y,w,h]=item.box;assert(x>=0&&y>=0&&x+w<=1&&y+h<=1);}
console.log('Passed 12 search/location cases and six sample highlight bounds.');
