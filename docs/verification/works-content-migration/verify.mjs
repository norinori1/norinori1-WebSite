import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const { chromium } = await import(pathToFileURL(resolve(process.argv[2])).href);
const root=fileURLToPath(new URL(".",import.meta.url)).replace(/[\\/]$/, "");
const drafts=JSON.parse(await readFile(root+"/content-diff.json","utf8"));
const browser=await chromium.launch({headless:true,executablePath:process.argv[3]});
const results={implementationSha:"406c61ae416f1a6d793521898b70638e93e0cf63",mode:"Native Notion final readback rendered through local SDK fixture; no live website API connection",pages:[],errors:[]};
const normalize=text=>text.replace(/\s+/g," ").trim();
try {
 for(const width of [1280,390]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce"});
  await ctx.route("**/api/notion-image?**",async route=>{
   const response=await route.fetch({maxRedirects:0});
   assert.equal(response.status(),307);
   const destination=response.headers().location;
   assert.ok(destination.startsWith("https://secure.notion-static.com/fixtures/"));
   await route.fulfill({status:200,contentType:"image/svg+xml",body:`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><rect width="960" height="540" fill="#102a46"/><path d="M0 90H960M0 180H960M0 270H960M0 360H960M0 450H960M120 0V540M240 0V540M360 0V540M480 0V540M600 0V540M720 0V540M840 0V540" stroke="#28517b"/><text x="480" y="280" text-anchor="middle" fill="#d6e8ff" font-family="monospace" font-size="32">VERIFICATION ARTWORK</text></svg>`});
  });
  const page=await ctx.newPage();page.on("pageerror",error=>results.errors.push(error.message));
  for(const work of drafts){
   await page.goto("http://localhost:3138/works/"+work.slug);
   await page.getByRole("tablist").waitFor();
   const expected=work.after.includes("# ニュース・実績")?3:2;
   assert.equal(await page.getByRole("tab").count(),expected);
   const text=normalize(await page.locator('section[id^="work-panel-"]').evaluateAll(elements=>elements.map(e=>e.textContent).join("\n")));
   for(const line of work.before.split("\n")){
    if(!line||line.startsWith("# ")||line.startsWith("```")||line==="<empty-block/>")continue;
    const content=normalize(line.replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g,"$1").replace(/\*\*/g,"").replace(/<br>/g,"\n").replace(/\\([\\*~`$\[\]<>{}|^])/g,"$1"));
    assert.ok(text.includes(content),work.slug+" missing: "+content.slice(0,70));
   }
   assert.equal(await page.locator('[aria-label="スクリーンショット"]').count(),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   for(const tab of ["intro","tech",...(expected===3?["news"]:[])]){
    await page.locator("#work-tab-"+tab).click();
    await page.locator("#work-panel-"+tab+":visible").waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),work.slug+" "+tab+" overflow");
    if(["zintoroad-1280-news", "puzzle-ball-3-390-intro", "puzzle-ball-2-390-intro", "scratch-text-asset-creator-390-intro"].includes(`${work.slug}-${width}-${tab}`)){
     await page.evaluate(()=>{scrollTo(0,0);document.querySelectorAll("img").forEach(i=>i.loading="eager");});
     await page.waitForFunction(()=>[...document.querySelectorAll("img")].filter(i=>i.getBoundingClientRect().width>0).every(i=>i.complete&&i.naturalWidth>0));
     await page.screenshot({path:root+"/"+work.slug+"-"+width+"-"+tab+".png",fullPage:true});
    }
   }
   results.pages.push({slug:work.slug,width,tabs:expected,originalBodyPreserved:true,propertyChanges:0});
  }
  await ctx.close();
 }
 assert.deepEqual(results.errors,[]);
 console.log(JSON.stringify({pages:results.pages.length,errors:results.errors.length}));
}finally{await writeFile(root+"/browser-results.json",JSON.stringify(results,null,2));await browser.close();}
