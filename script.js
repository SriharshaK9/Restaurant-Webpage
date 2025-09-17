// Menu items
const MENU = [
  {id:1, name:"Garlic Prawns", cat:"Starters", desc:"Sautéed prawns with garlic butter", price:9.5},
  {id:2, name:"Tomato Bruschetta", cat:"Starters", desc:"Toasted bread, tomato, basil", price:5.0},
  {id:3, name:"Grilled Salmon", cat:"Mains", desc:"Served with seasonal veggies", price:14.0},
  {id:4, name:"Ribeye Steak", cat:"Mains", desc:"200g with herb butter", price:18.0},
  {id:5, name:"Chocolate Mousse", cat:"Desserts", desc:"Dark chocolate mousse", price:6.0},
  {id:6, name:"Panna Cotta", cat:"Desserts", desc:"Creamy vanilla panna cotta", price:6.5},
  {id:7, name:"Lemonade", cat:"Drinks", desc:"House-made lemonade", price:3.0},
  {id:8, name:"Red Wine (glass)", cat:"Drinks", desc:"Daily selection", price:7.0}
];

// Only run menu logic if menu container exists
const menuContainer = document.getElementById('menu-items');
if(menuContainer){
  const searchInput = document.getElementById('search');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  function renderMenu(items){
    menuContainer.innerHTML = '';
    if(items.length === 0){ menuContainer.innerHTML='<div class="card">No items found.</div>'; return; }
    items.forEach(it=>{
      const el=document.createElement('div');
      el.className='card';
      el.innerHTML=`<h3>${it.name} <span class="price">₹${it.price.toFixed(2)}</span></h3>
        <p><em>${it.cat}</em></p><p style="margin:0;color:#555">${it.desc}</p>`;
      menuContainer.appendChild(el);
    });
  }
  function applyFilters(){
    const q=searchInput.value.trim().toLowerCase();
    const active=document.querySelector('.filter-btn.active').dataset.cat;
    let items=MENU.slice();
    if(active!=='All') items=items.filter(i=>i.cat===active);
    if(q) items=items.filter(i=>i.name.toLowerCase().includes(q)||i.desc.toLowerCase().includes(q));
    renderMenu(items);
  }
  searchInput.addEventListener('input', applyFilters);
  filterBtns.forEach(b=>b.addEventListener('click', ()=>{
    filterBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); applyFilters();
  }));
  renderMenu(MENU);
}

// Reservation logic
const form=document.getElementById('reservation-form');
if(form){
  const result=document.getElementById('reservation-result');
  const viewBtn=document.getElementById('view-reservations');

  function loadReservations(){ try{return JSON.parse(localStorage.getItem('reservations')||'[]');}catch(e){return[];} }
  function saveReservation(data){ const arr=loadReservations(); arr.push(data); localStorage.setItem('reservations',JSON.stringify(arr)); }
  function showMessage(msg,type="info",autoHide=true){
    result.textContent=msg;
    result.className=`result ${type}`;
    result.style.opacity="1";
    if(autoHide&&type==="success"){ setTimeout(()=>{result.style.opacity="0";},4000); }
  }

  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name=document.getElementById('rname').value.trim();
    const email=document.getElementById('remail').value.trim();
    const phone=document.getElementById('rphone').value.trim();
    const date=document.getElementById('rdate').value;
    const time=document.getElementById('rtime').value;
    const guests=document.getElementById('rguests').value;
    const notes=document.getElementById('rnotes').value.trim();

    if(!name||!email||!phone||!date||!time||!guests){
      showMessage("Please fill all required fields.","error",false); return;
    }
    const today=new Date().toISOString().slice(0,10);
    if(date<today){ showMessage("Please choose a current or future date.","error",false); return; }

    const reservation={name,email,phone,date,time,guests,notes,created:new Date().toISOString()};
    saveReservation(reservation);
    showMessage(`Reservation confirmed for ${name} on ${date} at ${time} — ${guests} guests.`,"success",true);
    form.reset();
  });

  viewBtn.addEventListener('click', ()=>{
    const arr=loadReservations();
    if(arr.length===0){ showMessage("No saved reservations.","info",false); return; }
    const last=arr.slice(-5).reverse();
    result.innerHTML=`<strong>Saved reservations (latest):</strong><ul>
      ${last.map(r=>`<li>${r.name} — ${r.date} ${r.time} (${r.guests} guests)</li>`).join('')}
    </ul>`;
    result.className="result info";
    result.style.opacity="1";
  });
}
