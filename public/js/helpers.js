// --- Data store ---
// Server-injected app data (see the inline bootstrap script in the HTML shell).
var D = window.__APP_DATA__;

function esc(s){
  if(!s)return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function avatarStack(avatars){
  if(!avatars||!avatars.length) return '';
  var h = '<div class="avatar-stack">';
  avatars.forEach(function(a){
    var url = (typeof a === 'string') ? a : (a && a.url);
    var faded = (typeof a === 'object') && a && a.faded;
    var letter = (typeof a === 'object') && a && a.letter ? a.letter.charAt(0) : '';
    var styleAttr = faded ? ' style="opacity:0.25"' : '';
    if(url){ cacheAvatar(url); h += '<img src="'+esc(getCachedAvatar(url))+'" alt=""'+styleAttr+'>'; }
    else h += '<div class="avatar-placeholder"'+styleAttr+'>'+esc(letter)+'</div>';
  });
  h += '</div>';
  return h;
}

function fmtAmt(v){
  var n = parseFloat(v);
  if(n % 1 === 0) return '$'+n.toFixed(0);
  var s = n.toFixed(2);
  return '$'+s;
}

function balancePill(g){
  if(!g.expense_count) return '';
  var bal = g.my_balance || 0;
  if(Math.abs(bal) < 0.01){
    return '<span style="display:inline-flex;align-items:center;gap:0.4rem;flex-shrink:0;font-size:0.875rem;padding-right:4px;color:var(--gray-500)">'
      + '<i class="fa-solid fa-check"></i>'
      + '<span style="font-weight:500">Settled</span>'
      + '</span>';
  }
  var label = bal < 0 ? 'You owe' : 'Owed';
  var color = bal < 0 ? '#dc2626' : 'var(--green-600)';
  var amt = fmtAmt(Math.abs(bal));
  return '<span style="display:inline-flex;align-items:baseline;gap:0.375rem;flex-shrink:0;font-size:0.875rem;padding-right:4px">'
    + '<span style="font-weight:500">'+label+'</span>'
    + '<span style="font-family:var(--mono);font-weight:600;color:'+color+'">'+amt+'</span>'
    + '</span>';
}

// Build a map of userId → display name for a group. Uses first names unless
// two or more members share a first name — those keep full names.
function buildDisplayNames(members){
  var counts = {};
  (members||[]).forEach(function(m){
    var first = ((m.name||'').trim().split(/\s+/)[0] || m.name || '').toLowerCase();
    counts[first] = (counts[first]||0) + 1;
  });
  var map = {};
  (members||[]).forEach(function(m){
    var raw = (m.name||'').trim();
    var first = raw.split(/\s+/)[0] || raw;
    map[m.id] = counts[first.toLowerCase()] > 1 ? raw : first;
  });
  return map;
}

function timeAgo(dateStr){
  if(!dateStr) return '';
  var d = new Date(dateStr+'Z');
  var now = new Date();
  var s = Math.floor((now - d) / 1000);
  if(s < 60) return 'Just now';
  var m = Math.floor(s / 60);
  if(m < 60) return m + 'm ago';
  var h = Math.floor(m / 60);
  if(h < 24) return h + 'h ago';
  var days = Math.floor(h / 24);
  if(days < 7) return days + 'd ago';
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate();
}

function fmtDate(dateStr){
  if(!dateStr) return '';
  var d = new Date(dateStr+'Z');
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var hr = d.getHours();
  var min = d.getMinutes();
  var ampm = hr >= 12 ? 'PM' : 'AM';
  hr = hr % 12 || 12;
  var minStr = min < 10 ? '0'+min : ''+min;
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + hr + ':' + minStr + ' ' + ampm;
}

function catLabel(cat){
  var labels = {food:'Food',transport:'Transport',housing:'Housing',entertainment:'Entertainment',shopping:'Shopping',utilities:'Utilities',health:'Health',education:'Education',subscriptions:'Subscriptions',gifts:'Gifts',pets:'Pets',settlement:'Settlement',general:'General'};
  return labels[cat] || 'General';
}

// --- Category detection ---
var CATS = {
  food:          {icon:'fa-utensils',       kw:['food','grocery','groceries','restaurant','pizza','burger','sushi','lunch','dinner','breakfast','cafe','coffee','starbucks','mcdonald','kfc','subway','taco','noodle','rice','bread','meal','eat','snack','bakery','deli','brunch']},
  transport:     {icon:'fa-car',            kw:['uber','lyft','taxi','cab','bus','train','metro','gas','fuel','parking','toll','flight','airline','travel','trip']},
  housing:       {icon:'fa-house',          kw:['rent','mortgage','airbnb','hotel','lodging','lease','apartment']},
  entertainment: {icon:'fa-film',           kw:['movie','cinema','netflix','spotify','concert','show','theater','game','ticket','museum','bar','club','party','beer','wine','drink','alcohol']},
  shopping:      {icon:'fa-bag-shopping',   kw:['amazon','walmart','target','clothes','shirt','shoes','electronics','phone','laptop','furniture','ikea','home','decor']},
  utilities:     {icon:'fa-bolt',           kw:['electric','electricity','water','internet','wifi','phone','mobile','bill','utility','utilities','insurance']},
  health:        {icon:'fa-heart-pulse',    kw:['doctor','hospital','pharmacy','medicine','gym','fitness','health','dental','medical','prescription','vitamin']},
  education:     {icon:'fa-graduation-cap', kw:['book','books','course','school','tuition','class','study','education','library','textbook']},
  subscriptions: {icon:'fa-credit-card',    kw:['subscription','membership','hosting','domain','renewal','plan','dropbox','prime','adobe','icloud']},
  gifts:         {icon:'fa-gift',           kw:['gift','present','birthday','anniversary','wedding','donation','charity']},
  pets:          {icon:'fa-paw',            kw:['pet','dog','cat','vet','kibble','litter','grooming']},
  settlement:    {icon:'fa-dollar-sign',     kw:[]},
  general:       {icon:'fa-receipt',        kw:[]}
};
function detectCat(name){
  var l=name.toLowerCase();
  for(var c in CATS){if(c==='general')continue;var kw=CATS[c].kw;for(var i=0;i<kw.length;i++){if(l.indexOf(kw[i])!==-1)return c;}}
  return 'general';
}
function catIcon(c){return '<i class="fa-solid '+(CATS[c]||CATS.general).icon+'"></i>';}
function expenseIcon(ex, size){
  // Settlements always render as the dollar-sign icon, regardless of any stored value.
  if(ex && (ex.category === 'settlement' || ex.settled_with)) return '<i class="fa-solid '+CATS.settlement.icon+'"></i>';
  if(ex && ex.icon) return '<i class="fa-solid '+ex.icon+'"></i>';
  // No icon yet — show a spinner while Haiku picks one.
  var s = size || 18;
  var bw = Math.max(2, Math.round(s/9));
  return '<div class="spinner" style="width:'+s+'px;height:'+s+'px;border-width:'+bw+'px;margin:0;border-color:rgba(34,197,94,0.2);border-top-color:currentColor"></div>';
}

// --- Balance calculation ---
function calcSettlements(members, expenses){
  if(!expenses||!expenses.length||!members.length) return [];
  var n = members.length;
  var allIds = members.map(function(m){return m.id;});
  var bal = {}; // userId -> net balance (positive = owed money, negative = owes)
  members.forEach(function(m){bal[m.id]=0;});
  expenses.forEach(function(ex){
    if(ex.settled_with){
      // Settlement: direct payment between two people
      bal[ex.paid_by] += ex.amount;
      bal[ex.settled_with] -= ex.amount;
    } else if(ex.split_type === 'full'){
      // Full amount owed by specific participants to the payer
      var owes = ex.split_participants ? JSON.parse(ex.split_participants) : [];
      if(owes.length){
        bal[ex.paid_by] += ex.amount;
        var perPerson = ex.amount / owes.length;
        owes.forEach(function(pid){
          if(bal[pid] !== undefined) bal[pid] -= perPerson;
        });
      }
    } else if(ex.split_type === 'custom'){
      // Each participant owes a specific custom amount
      var customParts = ex.split_participants ? JSON.parse(ex.split_participants) : [];
      var customAmts = ex.split_amounts ? JSON.parse(ex.split_amounts) : [];
      if(customParts.length){
        bal[ex.paid_by] += ex.amount;
        customParts.forEach(function(pid, i){
          var owed = customAmts[i] || 0;
          if(bal[pid] !== undefined) bal[pid] -= owed;
        });
      }
    } else {
      // Equal split among participants (default: all members)
      var participants = ex.split_participants ? JSON.parse(ex.split_participants) : allIds;
      var pn = participants.length || n;
      var share = ex.amount / pn;
      var payerInList = participants.indexOf(ex.paid_by) !== -1;
      if(payerInList){
        participants.forEach(function(pid){
          if(pid === ex.paid_by) bal[pid] += ex.amount - share;
          else if(bal[pid] !== undefined) bal[pid] -= share;
        });
      } else {
        bal[ex.paid_by] += ex.amount;
        participants.forEach(function(pid){
          if(bal[pid] !== undefined) bal[pid] -= share;
        });
      }
    }
  });
  // Build name/venmo map
  var names = {}, venmos = {}, cashapps = {};
  members.forEach(function(m){names[m.id]=m.name; venmos[m.id]=m.venmo_handle; cashapps[m.id]=m.cashapp_handle;});
  // Greedy settle: debtors pay creditors
  var debtors=[], creditors=[];
  for(var id in bal){
    var v=Math.round(bal[id]*100)/100;
    if(v<-0.01) debtors.push({id:id,amt:-v});
    else if(v>0.01) creditors.push({id:id,amt:v});
  }
  debtors.sort(function(a,b){return b.amt-a.amt;});
  creditors.sort(function(a,b){return b.amt-a.amt;});
  var settlements=[];
  var di=0,ci=0;
  while(di<debtors.length && ci<creditors.length){
    var pay=Math.min(debtors[di].amt,creditors[ci].amt);
    if(pay>0.01){
      settlements.push({from:debtors[di].id,to:creditors[ci].id,amt:pay,
        fromName:names[debtors[di].id],toName:names[creditors[ci].id],
        toVenmo:venmos[creditors[ci].id],toCashapp:cashapps[creditors[ci].id],
        fromVenmo:venmos[debtors[di].id],fromCashapp:cashapps[debtors[di].id]});
    }
    debtors[di].amt-=pay;
    creditors[ci].amt-=pay;
    if(debtors[di].amt<0.01) di++;
    if(creditors[ci].amt<0.01) ci++;
  }
  return settlements;
}

