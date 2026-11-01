"use client";
import { useState, useEffect } from "react";
export default function LifeOS() {
  const [key, setKey] = useState("");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([{role:"assistant", text:"سلام سمیرا! من مربی شوخ و سختگیرتم 😈 امروز کدوم کارو انجام دادی؟"}]);
  useEffect(()=>{ const k=localStorage.getItem("gemini_key"); if(k) setKey(k); },[]);
  async function send(){
    if(!input) return;
    const newChat=[...chat,{role:"user",text:input}]; setChat(newChat); setInput("");
    const prompt=`تو مربی ADHD فارسی، شوخ، سختگیر، کوتاه‌گو. ۳ هدف کاربر: اپ حسابداری، زبان، پیلاتس. کاربر: ${input}. تشویق کوتاه + برنامه فردا ۳ تسک ۲۰ دقیقه‌ای`;
    try{
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
      const data=await res.json(); const reply=data.candidates?.[0]?.content?.parts?.[0]?.text||"کلید API اشتباهه!";
      setChat([...newChat,{role:"assistant",text:reply}]);
    }catch(e){ setChat([...newChat,{role:"assistant",text:"خطا در اتصال"}]) }
  }
  if(!key) return <div dir="rtl" style={{padding:20}}><h2>کلید Gemini رو وارد کن</h2><p style={{fontSize:12}}>از aistudio.google.com/app/apikey بساز</p><input style={{border:"1px solid #ccc",padding:8,width:"100%"}} value={key} onChange={e=>{setKey(e.target.value); localStorage.setItem("gemini_key",e.target.value)}} placeholder="AIza..."/></div>
  return <div dir="rtl" style={{padding:16,maxWidth:400,margin:"0 auto",fontFamily:"sans-serif"}}><h1>LifeOS 📱</h1><div style={{height:"60vh",overflow:"auto",border:"1px solid #eee",padding:10,background:"#fafafa"}}>{chat.map((c,i)=><div key={i} style={{margin:8,padding:8,borderRadius:10,background:c.role=="user"?"#dbeafe":"white"}}>{c.text}</div>)}</div><div style={{display:"flex",gap:8,marginTop:10}}><input style={{flex:1,border:"1px solid #ccc",padding:10,borderRadius:10}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key=="Enter"&&send()} placeholder="امروز چی شد؟"/><button onClick={send} style={{background:"black",color:"white",padding:"0 16px",borderRadius:10}}>ارسال</button></div></div>
}