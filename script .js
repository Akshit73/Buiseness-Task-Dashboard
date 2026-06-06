if(localStorage.getItem('loggedIn')!=='true'){window.location='login.html';}
let tasks=JSON.parse(localStorage.getItem('tasks'))||[];
let chart;

function logout(){localStorage.removeItem('loggedIn');window.location='login.html';}
function saveTasks(){localStorage.setItem('tasks',JSON.stringify(tasks));}

function addTask(){
const employee=document.getElementById('employee').value.trim();
const task=document.getElementById('task').value.trim();
const priority=document.getElementById('priority').value;
const deadline=document.getElementById('deadline').value;
if(!employee||!task||!deadline){alert('Please fill all fields');return;}
tasks.push({employee,task,priority,deadline,status:'Pending'});
saveTasks();
document.getElementById('employee').value='';
document.getElementById('task').value='';
document.getElementById('deadline').value='';
displayTasks();
updateSummary();
}

function markComplete(i){tasks[i].status='Completed';saveTasks();displayTasks();updateSummary();}

function editTask(i){
const value=prompt('Edit Task',tasks[i].task);
if(value){tasks[i].task=value;saveTasks();displayTasks();updateSummary();}
}

function deleteTask(i){
if(confirm('Delete this task?')){
tasks.splice(i,1);
saveTasks();
displayTasks();
updateSummary();
}
}

function displayTasks(){
const search=(document.getElementById('search')?.value||'').toLowerCase();
const tbody=document.querySelector('#taskTable tbody');
tbody.innerHTML='';
tasks.filter(t=>t.employee.toLowerCase().includes(search)).forEach((t,i)=>{
const today=new Date();today.setHours(0,0,0,0);
const overdue=t.status!=='Completed'&&new Date(t.deadline)<today;
tbody.innerHTML+=`<tr class="${overdue?'overdue':''}"><td>${t.employee}</td><td>${t.task}</td><td>${t.priority}</td><td>${t.deadline}</td><td class="${t.status==='Completed'?'completed':'status'}">${t.status}</td><td><button onclick="markComplete(${i})">Complete</button> <button onclick="editTask(${i})">Edit</button> <button onclick="deleteTask(${i})">Delete</button></td></tr>`;
});
}

function updateSummary(){
document.getElementById('totalTasks').textContent=tasks.length;
document.getElementById('completedTasks').textContent=tasks.filter(t=>t.status==='Completed').length;
document.getElementById('pendingTasks').textContent=tasks.filter(t=>t.status==='Pending').length;

const summary=document.getElementById('summary');
summary.innerHTML='';
const stats={},labels=[],data=[];
tasks.forEach(t=>{
if(!stats[t.employee]) stats[t.employee]={total:0,completed:0};
stats[t.employee].total++;
if(t.status==='Completed') stats[t.employee].completed++;
});

for(const emp in stats){
const percent=(stats[emp].completed/stats[emp].total)*100||0;
summary.innerHTML+=`<p><b>${emp}</b> — ${stats[emp].completed}/${stats[emp].total} tasks completed</p><div class="progress-bar"><div class="progress" style="width:${percent}%"></div></div>`;
labels.push(emp);
data.push(percent);
}

const ctx=document.getElementById('performanceChart').getContext('2d');
if(chart) chart.destroy();
chart=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Task Completion Rate (%)',data,backgroundColor:'#2563eb'}]},options:{responsive:true,scales:{y:{beginAtZero:true,max:100}}}});
}

displayTasks();
updateSummary();
