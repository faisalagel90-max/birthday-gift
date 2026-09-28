const express=require('express'),fs=require('fs'),path=require('path');
const app=express(),PORT=process.env.PORT||3000,DATA=path.join(__dirname,'responses.json');
if(!fs.existsSync(DATA))fs.writeFileSync(DATA,'[]');app.use(express.json({limit:'100kb'}));app.use(express.static(path.join(__dirname,'public')));
app.get('/',(_,r)=>r.sendFile(path.join(__dirname,'public','gift.html')));app.get('/gift',(_,r)=>r.sendFile(path.join(__dirname,'public','gift.html')));app.get('/responses',(_,r)=>r.sendFile(path.join(__dirname,'public','responses.html')));
app.post('/api/response',(q,r)=>{let {wish,message,createdAt}=q.body||{};if(!wish||typeof wish!=='string')return r.status(400).json({ok:false});let a=JSON.parse(fs.readFileSync(DATA));a.push({wish:wish.slice(0,5000),message:String(message||'').slice(0,5000),createdAt:createdAt||new Date().toISOString()});fs.writeFileSync(DATA,JSON.stringify(a,null,2));r.json({ok:true})});
app.get('/api/responses',(_,r)=>r.json({items:JSON.parse(fs.readFileSync(DATA))}));app.delete('/api/responses',(_,r)=>{fs.writeFileSync(DATA,'[]');r.json({ok:true})});
app.listen(PORT,()=>console.log('running '+PORT));