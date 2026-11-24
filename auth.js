(async()=>{
 const c=window.BARBER_CONFIG||{}, panel=document.querySelector('#private-panel'), form=document.querySelector('#login'), msg=document.querySelector('#auth-msg');
 const configured=c.url&&c.anonKey&&c.adminId&&window.supabase;
 const load=()=>{const s=document.createElement('script');s.src='app.js?v=19';document.body.append(s)};
 if(!panel&&!form)load();
 if(!configured){if(panel)location.replace('login.html');if(msg)msg.textContent='Configura Supabase antes de iniciar sesión.';return;}
 const db=window.supabase.createClient(c.url,c.anonKey);
 async function allowed(){const {data,error}=await db.auth.getUser();return !error&&data.user?.id===c.adminId;}
 if(form){form.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='Verificando…';try{const {error}=await db.auth.signInWithPassword({email:form.email.value,password:form.password.value});if(error||!await allowed()){await db.auth.signOut();msg.textContent='Acceso no autorizado.';return;}location.replace('index.html');}catch{msg.textContent='No se pudo conectar.';}});return;}
 let ok=false;try{ok=await allowed()}catch{}
 if(panel&&!ok){location.replace('login.html');return;}
 if(ok){document.querySelectorAll('[data-admin],[data-logout]').forEach(el=>el.hidden=false);if(panel){panel.hidden=false;load();}}
 document.querySelectorAll('[data-logout]').forEach(el=>el.onclick=async()=>{const {error}=await db.auth.signOut();if(error){alert('No se pudo cerrar sesión. Intenta nuevamente.');return;}location.replace('index.html');});
 db.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'&&panel)location.replace('login.html');});
})();