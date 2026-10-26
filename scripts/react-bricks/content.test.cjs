const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const cli = require('./content.cjs')

const page = {id:'p1',language:'en',type:'page',name:'Home',slug:'/',status:'PUBLISHED',meta:{title:'Home'},content:[{id:'b1',type:'hero',props:{image:{hashId:'master-old',src:'https://assets.reactbricks.com/app-old/images/original/crop-old.webp',fallbackSrc:'https://assets.reactbricks.com/app-old/images/original/crop-old.jpg',width:100,height:50,crop:{x:0,y:0,width:100,height:50},transform:{rotate:0}}}}],customValues:{},tags:[],isLocked:false,updatedAt:'2026-01-01'}
function server(appId, existing=[]) {
  const calls=[]
  global.fetch=async (input,options={})=>{
    const url=String(input), method=options.method || 'GET'
    calls.push({url,method,body:options.body && JSON.parse(options.body)})
    let result
    if(url.includes('/images/master/')) return {ok:true,status:200}
    if(url.includes('/admin/session?')) result={user:{appId,useWorkingCopy:false}}
    else if(url.endsWith('/admin/pages') && method==='GET') result=existing
    else if(url.includes('/admin/pages/p1/translations/en') && method==='GET') result=page
    else if(url.endsWith('/admin/media/images/create_from_url')) result={appHashId:'app-new',hashId:'master-new',croppedImage:{hashId:'crop-new'}}
    else result={id:'created'}
    return {ok:true,status:200,json:async()=>result}
  }
  return calls
}
test('snapshot, inspect and publish only the edited page; refuse a changed baseline',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'rb-test-')),file=path.join(dir,'content.json')
  process.env.REACT_BRICKS_ADMIN_TOKEN='test';let calls=server('source',[{id:'p1',name:'Home',language:'en'}])
  await cli.main(['snapshot',file,'--app-id','source'])
  const data=JSON.parse(await fs.readFile(file));data.pages[0].page.name='New title';await fs.writeFile(file,JSON.stringify(data))
  await cli.main(['diff',file,'--app-id','source']);assert.equal(calls.filter(c=>c.method==='PUT').length,0)
  await cli.main(['publish',file,'--app-id','source','--apply']);assert.equal(calls.filter(c=>c.method==='PUT').length,1)
  data.pages[0].base='outdated';await fs.writeFile(file,JSON.stringify(data))
  await assert.rejects(cli.main(['publish',file,'--app-id','source','--apply']),/Conflict/)
  assert.equal(calls.filter(c=>c.method==='PUT').length,1)
  await fs.rm(dir,{recursive:true,force:true})
})
test('seed checks the target and copies master and crop IDs into the new page',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'rb-test-')),file=path.join(dir,'content.json')
  const record={id:'p1',language:'en',base:cli.baseline(page),original:cli.pick(page),page:cli.pick(page)}
  await fs.writeFile(file,JSON.stringify({format:'ark-react-bricks-snapshot-v2',appId:'source',pages:[record]}))
  process.env.REACT_BRICKS_ADMIN_TOKEN='test';let calls=server('target',[{id:'existing'}])
  await assert.rejects(cli.main(['seed',file,'--app-id','target','--apply']),/empty apps/)
  assert.equal(calls.filter(c=>c.method==='POST').length,0)
  calls=server('target');await cli.main(['seed',file,'--app-id','target','--apply'])
  const upload=calls.find(c=>c.url.includes('create_from_url'));assert.match(upload.body.url,/images\/master\/master-old\.jpg$/)
  const created=calls.find(c=>c.url.endsWith('/admin/pages')&&c.method==='POST');const image=JSON.parse(created.body.content)[0].props.image
  assert.equal(image.hashId,'master-new');assert.match(image.src,/app-new\/images\/original\/crop-new\.webp$/)
  await fs.rm(dir,{recursive:true,force:true})
})
test('reused images are uploaded once',async()=>{
  const calls=server('target')
  const image=page.content[0].props.image
  const copied=await cli.copyImages('test',[{content:[image,image]}])
  assert.equal(calls.filter(c=>c.url.includes('create_from_url')).length,1)
  assert.equal(copied[0].content[1].hashId,'master-new')
})
test('seed creates translations under their new page',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'rb-test-')),file=path.join(dir,'content.json')
  const en={id:'p1',language:'en',base:cli.baseline(page),original:cli.pick(page),page:cli.pick(page)}
  const frPage={...cli.pick(page),language:'fr',slug:'/fr'}
  const fr={id:'p1',language:'fr',base:'unused',original:frPage,page:frPage}
  await fs.writeFile(file,JSON.stringify({format:'ark-react-bricks-snapshot-v2',appId:'source',pages:[en,fr]}))
  process.env.REACT_BRICKS_ADMIN_TOKEN='test';const calls=server('target')
  await cli.main(['seed',file,'--app-id','target','--apply'])
  assert(calls.some(c=>c.url.endsWith('/admin/pages/created/translations') && c.body.language==='fr'))
  assert(calls.some(c=>c.url.endsWith('/admin/pages/created/translations/fr') && c.method==='PATCH'))
  await fs.rm(dir,{recursive:true,force:true})
})
