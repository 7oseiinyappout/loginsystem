(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[520],{2217:(e,t,o)=>{Promise.resolve().then(o.bind(o,6960))},5695:(e,t,o)=>{"use strict";var n=o(8999);o.o(n,"useRouter")&&o.d(t,{useRouter:function(){return n.useRouter}})},6960:(e,t,o)=>{"use strict";o.r(t),o.d(t,{default:()=>l});var n=o(5155),r=o(2115),i=o(4752),s=o.n(i),a=o(5695);function l(){let e=(0,a.useRouter)(),[t,o]=(0,r.useState)({email:"",password:""}),i=e=>{o({...t,[e.target.name]:e.target.value})},l=async o=>{o.preventDefault();let n=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),r=await n.json();n.ok?(localStorage.setItem("token",r.token),localStorage.setItem("userId",r.user._id),s().fire({icon:"success",title:"Welcome!",text:r.message,confirmButtonText:"Continue",confirmButtonColor:"#0070f3"}).then(()=>{e.push("/clipboard")})):s().fire({icon:"error",title:"Login Failed",text:r.message,confirmButtonColor:"#d33"})};return(0,n.jsxs)("div",{style:u.container,children:[(0,n.jsx)("h2",{style:u.title,children:"Login"}),(0,n.jsxs)("form",{onSubmit:l,style:u.form,children:[(0,n.jsx)("input",{style:u.input,name:"ref",type:"text",placeholder:"Email or Username",onChange:i}),(0,n.jsx)("input",{style:u.input,name:"password",type:"password",placeholder:"Password",onChange:i}),(0,n.jsx)("button",{type:"submit",style:u.button,children:"Login"})]})]})}let u={container:{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"40px"},title:{fontSize:"28px",fontWeight:"bold",marginBottom:"20px"},form:{display:"flex",flexDirection:"column",width:"300px",gap:"10px"},input:{padding:"10px",fontSize:"16px",borderRadius:"6px",border:"1px solid #ccc"},button:{padding:"10px",backgroundColor:"#0070f3",color:"white",border:"none",borderRadius:"6px",fontSize:"16px",cursor:"pointer"}}}},e=>{var t=t=>e(e.s=t);e.O(0,[320,441,684,358],()=>t(2217)),_N_E=e.O()}]);