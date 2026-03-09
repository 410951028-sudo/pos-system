const menu=[

{name:"雞腿",price:150},
{name:"牛肋條",price:150},
{name:"牛丼飯",price:150},
{name:"墨魚香腸",price:150}

];

let orders=JSON.parse(localStorage.getItem("orders"))||[];
let completed=JSON.parse(localStorage.getItem("completed"))||[];
let orderNumber=JSON.parse(localStorage.getItem("orderNumber"))||1;

let tempOrder={};

function save(){

localStorage.setItem("orders",JSON.stringify(orders));
localStorage.setItem("completed",JSON.stringify(completed));
localStorage.setItem("orderNumber",orderNumber);

}

function renderMenu(){

let menuDiv=document.getElementById("menuItems");
menuDiv.innerHTML="";

menu.forEach((item,i)=>{

tempOrder[i]=0;

let div=document.createElement("div");
div.className="menuItem";

div.innerHTML=`

${item.name}

<div>

<button onclick="changeQty(${i},-1)">-</button>

<span id="qty${i}">0</span>

<button onclick="changeQty(${i},1)">+</button>

</div>

`;

menuDiv.appendChild(div);

});

}

function changeQty(i,val){

tempOrder[i]+=val;

if(tempOrder[i]<0) tempOrder[i]=0;

document.getElementById("qty"+i).innerText=tempOrder[i];

}

function createOrder(){

let items=[];
let total=0;

menu.forEach((item,i)=>{

if(tempOrder[i]>0){

items.push({
name:item.name,
qty:tempOrder[i],
price:item.price
});

total+=item.price*tempOrder[i];

}

});

if(items.length==0) return;

orders.push({

id:orderNumber++,
items:items,
total:total

});

save();
closeModal();
render();

}

function render(){

let orderList=document.getElementById("orderList");
orderList.innerHTML="";

orders.forEach((o,i)=>{

let content="";

o.items.forEach(it=>{

content+=`${it.name} ${it.qty}份<br>`;

});

let row=document.createElement("tr");

row.innerHTML=`

<td>${o.id}</td>

<td>${content}</td>

<td>${o.total}元</td>

<td>

<button class="doneBtn" onclick="finishOrder(${i})">✔</button>

<button class="deleteBtn" onclick="deleteOrder(${i})">✖</button>

</td>

`;

orderList.appendChild(row);

});

renderCompleted();
renderStats();

}

function finishOrder(i){

completed.push(orders[i]);
orders.splice(i,1);

save();
render();

}

function deleteOrder(i){

orders.splice(i,1);

save();
render();

}

function renderCompleted(){

let div=document.getElementById("completedList");
div.innerHTML="";

completed.forEach(o=>{

let text=`#${o.id}<br>`;

o.items.forEach(it=>{

text+=`${it.name} ${it.qty}份<br>`;

});

div.innerHTML+=`<div>${text}</div><hr>`;

});

}

let chart;

function renderStats(){

let stats=document.getElementById("stats");

let items={};
let total=0;

completed.forEach(o=>{

total+=o.total;

o.items.forEach(it=>{

items[it.name]=(items[it.name]||0)+it.qty;

});

});

let html="";

for(let k in items){

html+=`${k} ${items[k]}<br>`;

}

html+=`<br>應收 ${total} 元`;

stats.innerHTML=html;

renderChart(items);

}

function renderChart(items){

let labels=Object.keys(items);
let data=Object.values(items);

let ctx=document.getElementById("salesChart");

if(chart){
chart.destroy();
}

chart=new Chart(ctx,{
  type:"bar",
  data:{
    labels:labels,
    datasets:[{
      label:'今日銷量',
      data:data
    }]
  },
  options:{
    responsive:true,
    maintainAspectRatio:false,

    animation:{
      duration:1000
    },

    plugins:{
      legend:{display:false}
    }
  }
});

let stats=document.getElementById("stats");

let items={};
let total=0;

completed.forEach(o=>{

total+=o.total;

o.items.forEach(it=>{

items[it.name]=(items[it.name]||0)+it.qty;

});

});

let html="";

for(let k in items){

html+=`${k} ${items[k]}<br>`;

}

html+=`<br>應收 ${total} 元`;

stats.innerHTML=html;



function openModal(){

document.getElementById("orderModal").style.display="flex";
renderMenu();

}

function closeModal(){

document.getElementById("orderModal").style.display="none";

}

function clearDay(){

if(confirm("確定日結清空？")){

localStorage.clear();
location.reload();

}

}

function checkDay(){

let today=new Date().toDateString();
let saved=localStorage.getItem("day");

if(saved!=today){

localStorage.clear();
localStorage.setItem("day",today);

}

}

checkDay();

render();
