// ===== 裝置偵測 =====

function detectDevice(){

const ua = navigator.userAgent.toLowerCase();

const isMobile =
/android|iphone|ipod|blackberry|windows phone/.test(ua);

if(isMobile){
document.body.classList.add("mobile-ui");
}

}

detectDevice();
// ===== 系統資訊 =====

const APP_INFO = {

name:"擺攤老大 POS",
version:"1.1",
update:"2026-03-14",
developer:"AL"

};// ===== 菜單 =====

const menu=[

{name:"雞腿",price:150},
{name:"牛肋條",price:150},
{name:"牛丼飯",price:150},
{name:"墨魚香腸",price:150},
{name:"百威搭擠杯",price:150},
{name:"喝不了三杯",price:250},
{name:"欸洪淦攏來",price:300}


];


// ===== 資料 =====

let orders=JSON.parse(localStorage.getItem("orders"))||[];
let completed=JSON.parse(localStorage.getItem("completed"))||[];
let orderNumber=JSON.parse(localStorage.getItem("orderNumber"))||1;

let tempOrder={};

let chart;

let versionClick = 0;


// ===== 儲存 =====

function save(){

localStorage.setItem("orders",JSON.stringify(orders));
localStorage.setItem("completed",JSON.stringify(completed));
localStorage.setItem("orderNumber",orderNumber);

}


// ===== 菜單畫面 =====

function renderMenu(){

let menuDiv=document.getElementById("menuItems");
menuDiv.innerHTML="";

menu.forEach((item,i)=>{

// 修正：避免每次開modal重置
if(tempOrder[i]===undefined){
tempOrder[i]=0;
}

let div=document.createElement("div");
div.className="menuItem";

div.innerHTML=`

${item.name}

<div>

<button onclick="changeQty(${i},-1)">-</button>

<span id="qty${i}">${tempOrder[i]}</span>

<button onclick="changeQty(${i},1)">+</button>

</div>

`;

menuDiv.appendChild(div);

});

}


// ===== 修改數量 =====

function changeQty(i,val){

tempOrder[i]+=val;

if(tempOrder[i]<0) tempOrder[i]=0;

document.getElementById("qty"+i).innerText=tempOrder[i];

}


// ===== 新增訂單 =====

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

// 新訂單建立後清空暫存
tempOrder={};

save();
closeModal();
render();

}


// ===== 出餐區 =====

function render(){

let orderList=document.getElementById("orderList");
orderList.innerHTML="";

orders.forEach((o,i)=>{

let content="";

o.items.forEach(it=>{

content+=`${it.name} ${it.qty}份<br>`;

});

let row=document.createElement("tr");
row.classList.add("orderCard");

row.innerHTML=`

<td>${o.id}</td>

<td>${content}</td>

<td>${o.total}元</td>

<td>

<button class="doneBtn" onclick="finishOrder(${i},this)">✔</button>

<button class="deleteBtn" onclick="deleteOrder(${i})">✖</button>

</td>

`;

orderList.appendChild(row);

});

renderCompleted();
renderStats();

}


// ===== 完成訂單 =====

function finishOrder(i,btn){

let row=btn.closest("tr");

row.classList.add("removing");

setTimeout(()=>{

let finishedOrder = orders[i];

// 不影響UI，只在資料內加入時間
finishedOrder.time = new Date().toLocaleTimeString("zh-TW",{hour:'2-digit',minute:'2-digit'});

completed.push(finishedOrder);
orders.splice(i,1);

save();
render();

},300);

}


// ===== 刪除訂單 =====

function deleteOrder(i){

orders.splice(i,1);

save();
render();

}


// ===== 已完成訂單 =====

function renderCompleted(){

let div=document.getElementById("completedList");

let html="";

completed.forEach(o=>{

let text=`#${o.id}<br>`;

o.items.forEach(it=>{

text+=`${it.name} ${it.qty}份<br>`;

});

html+=`<div>${text}</div><hr>`;

});

div.innerHTML=html;

}


// ===== 統計 =====

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


// ===== 圖表 =====

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
label:"今日銷量",
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

}


// ===== Modal =====

function openModal(){

document.getElementById("orderModal").style.display="flex";
renderMenu();

}

function closeModal(){

document.getElementById("orderModal").style.display="none";

}


// ===== 日結 =====

function clearDay(){

if(confirm("確定日結清空？")){

localStorage.clear();
location.reload();

}

}


// ===== 自動換日 =====

function checkDay(){

let today=new Date().toDateString();
let saved=localStorage.getItem("day");

if(saved!=today){

localStorage.clear();
localStorage.setItem("day",today);

}

}


// ===== 初始化 =====

checkDay();
render();

// ===== 版本資訊 =====

function showVersion(){

versionClick++;

let html = `
${APP_INFO.name}<br><br>
版本：v${APP_INFO.version}<br>
更新：${APP_INFO.update}<br>
開發：${APP_INFO.developer}
`;

if(versionClick >= 3){

html += `
<br><br>
<hr>
🎉 Special Thanks 🎉<br>
猛男 X RJ X 硬漢<br>
陪伴店裡走了好段時間的男人<br>
`;
versionClick = 0;
}

document.getElementById("versionInfo").innerHTML = html;

document.getElementById("versionModal").style.display="flex";

}

function closeVersion(){


document.getElementById("versionModal").style.display="none";

}
// ===== 匯出 CSV =====

function exportCSV(){

if(completed.length===0){
alert("沒有營收資料");
return;
}

let csv="訂單編號,時間,品項,數量,單價,小計\n";

completed.forEach(o=>{

o.items.forEach(it=>{

let subtotal = it.qty * it.price;

csv += `${o.id},${o.time||""},${it.name},${it.qty},${it.price},${subtotal}\n`;

});

});

let blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

let a=document.createElement("a");

let today=new Date().toLocaleDateString("sv-SE");

a.href=URL.createObjectURL(blob);
a.download="sales_"+today+".csv";

a.click();

}
// ===== POS 更新提示 =====

let refreshing;

navigator.serviceWorker?.addEventListener("controllerchange",function(){

if(refreshing) return;

refreshing=true;

alert("POS 已更新，將重新載入");

location.reload();

});

