import { useState, useEffect, useRef } from "react";

// ── Theme ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#060B18",
  surface: "rgba(11,19,42,0.98)",
  surface2: "rgba(16,27,58,0.9)",
  border: "rgba(0,208,180,0.14)",
  borderHover: "rgba(0,208,180,0.45)",
  divider: "rgba(255,255,255,0.05)",
  primary: "#00D0B4",
  primaryDim: "rgba(0,208,180,0.12)",
  coral: "#FF6B6B",
  coralDim: "rgba(255,107,107,0.13)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.13)",
  purple: "#A78BFA",
  purpleDim: "rgba(167,139,250,0.13)",
  green: "#10B981",
  greenDim: "rgba(16,185,129,0.13)",
  text: "#DDE8F8",
  muted: "#637099",
  faint: "rgba(255,255,255,0.04)",
};

// ── Medicine Database ──────────────────────────────────────────────────────
const MEDS = [
  { name:"Dolo 650", generic:"Paracetamol 650mg", cat:"fever", use:"Fever, headache, mild body pain", dose:"1 tab every 6–8 hrs (max 4g/day)", price:"₹30 / 10 tabs", rx:false, note:"Avoid alcohol. Safe in pregnancy. Do not exceed 4 grams per day." },
  { name:"Crocin Advance", generic:"Paracetamol 500mg", cat:"fever", use:"Fever, cold, body ache", dose:"1–2 tabs every 4–6 hrs", price:"₹25 / 15 tabs", rx:false, note:"Do not combine with other paracetamol products." },
  { name:"Combiflam", generic:"Ibuprofen 400mg + Paracetamol 325mg", cat:"pain", use:"Pain, fever, inflammation, toothache", dose:"1 tab after food, twice daily", price:"₹35 / 10 tabs", rx:false, note:"Avoid if stomach ulcer, kidney disease, or pregnancy third trimester." },
  { name:"Brufen 400", generic:"Ibuprofen 400mg", cat:"pain", use:"Joint pain, muscular pain, arthritis, dental pain", dose:"1 tab 3× daily after food", price:"₹22 / 10 tabs", rx:false, note:"Always take with food. Avoid in kidney disease." },
  { name:"Voveran SR 100", generic:"Diclofenac 100mg SR", cat:"pain", use:"Severe muscle pain, orthopedic pain, post-surgery", dose:"1 tab after food once daily", price:"₹55 / 10 tabs", rx:true, note:"Short-term use only. Not for children." },
  { name:"Cetirizine 10mg", generic:"Cetirizine HCl 10mg", cat:"allergy", use:"Allergy, runny nose, itching, skin rashes, hives", dose:"1 tab at night", price:"₹12 / 10 tabs", rx:false, note:"May cause drowsiness. Avoid driving after taking." },
  { name:"Allegra 120", generic:"Fexofenadine 120mg", cat:"allergy", use:"Allergic rhinitis, chronic urticaria, hay fever", dose:"1 tab twice daily", price:"₹85 / 10 tabs", rx:false, note:"Avoid antacids within 2 hrs. Non-drowsy formula." },
  { name:"Montair LC", generic:"Montelukast 10mg + Levocetirizine 5mg", cat:"allergy", use:"Allergic rhinitis, asthma, chronic allergy", dose:"1 tab at night", price:"₹95 / 10 tabs", rx:true, note:"Consult doctor for asthma management. Not for under 6 years." },
  { name:"Digene Gel", generic:"Aluminium + Magnesium Hydroxide", cat:"digestion", use:"Acidity, heartburn, gas, indigestion, sour belching", dose:"2 tsp after meals & at bedtime", price:"₹65 / 200ml", rx:false, note:"Not for chronic kidney disease. Shake well before use." },
  { name:"Pantop 40", generic:"Pantoprazole 40mg", cat:"digestion", use:"GERD, stomach ulcers, acidity, H. pylori", dose:"1 tab 30 min before breakfast", price:"₹48 / 10 tabs", rx:true, note:"Long-term use needs periodic monitoring." },
  { name:"Omez D 20", generic:"Omeprazole 20mg + Domperidone 10mg", cat:"digestion", use:"Acidity with nausea, gastritis, bloating", dose:"1 cap before breakfast", price:"₹42 / 10 caps", rx:true, note:"Avoid in liver disease." },
  { name:"Norflox-TZ", generic:"Norfloxacin 400mg + Tinidazole 600mg", cat:"digestion", use:"Acute diarrhea, gut infections, traveller's diarrhea", dose:"1 tab twice daily after food × 3 days", price:"₹55 / 10 tabs", rx:true, note:"Complete full course. Avoid alcohol." },
  { name:"Glucophage 500", generic:"Metformin HCl 500mg", cat:"diabetes", use:"Type 2 Diabetes management", dose:"1 tab twice daily with meals", price:"₹25 / 10 tabs", rx:true, note:"Monitor blood sugar. Avoid if kidney disease. No alcohol." },
  { name:"Glycomet GP 1", generic:"Glimepiride 1mg + Metformin 500mg", cat:"diabetes", use:"Type 2 Diabetes (combination therapy)", dose:"1 tab before breakfast", price:"₹55 / 10 tabs", rx:true, note:"Watch for hypoglycemia (low sugar) signs." },
  { name:"Amlokind 5", generic:"Amlodipine Besylate 5mg", cat:"bp", use:"High blood pressure, stable angina", dose:"1 tab daily (morning)", price:"₹35 / 10 tabs", rx:true, note:"Do not stop suddenly. Monitor BP regularly." },
  { name:"Telma 40", generic:"Telmisartan 40mg", cat:"bp", use:"Hypertension, heart failure prevention", dose:"1 tab daily", price:"₹58 / 10 tabs", rx:true, note:"Avoid in pregnancy. Check kidney function periodically." },
  { name:"Aten 25", generic:"Atenolol 25mg", cat:"bp", use:"High BP, rapid heart rate, angina", dose:"1 tab daily morning", price:"₹28 / 10 tabs", rx:true, note:"Do not stop abruptly. May cause cold hands/feet." },
  { name:"Calcirol 60K", generic:"Cholecalciferol 60,000 IU (Vitamin D3)", cat:"vitamins", use:"Vitamin D deficiency, bone pain, muscle weakness", dose:"1 sachet/week with fatty meal × 8 weeks", price:"₹80 / 4 sachets", rx:false, note:"Take with full-fat milk or food containing fat for absorption." },
  { name:"Becosules Z", generic:"Vitamin B-Complex + Vitamin C + Zinc", cat:"vitamins", use:"Nutritional deficiency, weakness, nerve health, wound healing", dose:"1 cap after breakfast daily", price:"₹38 / 20 caps", rx:false, note:"Urine turns bright yellow — completely normal." },
  { name:"Limcee 500", generic:"Vitamin C (Ascorbic Acid) 500mg", cat:"vitamins", use:"Immunity boost, antioxidant, iron absorption", dose:"1 chewable tab daily", price:"₹22 / 15 tabs", rx:false, note:"High doses may cause kidney stones in susceptible people." },
  { name:"Shelcal 500", generic:"Calcium Carbonate 1250mg + Vitamin D3 250 IU", cat:"vitamins", use:"Calcium deficiency, osteoporosis prevention, pregnancy", dose:"1 tab twice daily after food", price:"₹98 / 15 tabs", rx:false, note:"Take after meals. Avoid with iron tablets (take 2 hrs apart)." },
  { name:"Azithral 500", generic:"Azithromycin 500mg", cat:"infection", use:"Respiratory tract, throat, ear, skin bacterial infections", dose:"1 tab daily × 3–5 days", price:"₹82 / 3 tabs", rx:true, note:"Must complete full course. Can cause stomach upset." },
  { name:"Augmentin 625", generic:"Amoxicillin 500mg + Clavulanate 125mg", cat:"infection", use:"Sinusitis, UTI, skin infections, pneumonia", dose:"1 tab twice daily after food × 5–7 days", price:"₹125 / 10 tabs", rx:true, note:"Avoid if penicillin allergy. Take with food to reduce GI upset." },
  { name:"Ciprobid 500", generic:"Ciprofloxacin 500mg", cat:"infection", use:"UTI, gut infections, typhoid, skin infections", dose:"1 tab twice daily × 5–7 days", price:"₹48 / 10 tabs", rx:true, note:"Drink plenty of water. Avoid antacids. Sun sensitivity possible." },
  { name:"Electral ORS", generic:"WHO-ORS (Sodium, Potassium, Glucose, Bicarbonate)", cat:"hydration", use:"Dehydration from diarrhea, vomiting, heatstroke", dose:"1 sachet in 1 litre boiled cooled water, sip slowly", price:"₹22 / 5 sachets", rx:false, note:"Prepare fresh each time. Do not add extra sugar or salt." },
  { name:"ORS Zip (with Zinc)", generic:"ORS + Zinc 20mg", cat:"hydration", use:"Acute diarrhea (especially in children)", dose:"As per age — consult doctor for children's dose", price:"₹28 / 5 sachets", rx:false, note:"Zinc reduces diarrhea duration and severity." },
];

// ── Doctor Database ────────────────────────────────────────────────────────
const DOCTORS = [
  { name:"Dr. Priya Sharma", spec:"General Physician", hospital:"Apollo Clinic", city:"Delhi", rating:4.8, fee:"₹500", exp:"12 yrs", avail:true, init:"PS", lat:28.6, lng:77.2 },
  { name:"Dr. Rohan Malhotra", spec:"Cardiologist", hospital:"Fortis Heart Institute", city:"Delhi", rating:4.9, fee:"₹1500", exp:"20 yrs", avail:false, init:"RM", lat:28.7, lng:77.1 },
  { name:"Dr. Rajesh Kumar", spec:"Cardiologist", hospital:"Fortis Hospital", city:"Mumbai", rating:4.9, fee:"₹1200", exp:"18 yrs", avail:true, init:"RK", lat:19.0, lng:72.8 },
  { name:"Dr. Farhan Sheikh", spec:"Pulmonologist", hospital:"Chest & Lung Clinic", city:"Mumbai", rating:4.7, fee:"₹1100", exp:"15 yrs", avail:true, init:"FS", lat:19.1, lng:72.9 },
  { name:"Dr. Anita Patel", spec:"Dermatologist", hospital:"SkinCare Institute", city:"Bangalore", rating:4.7, fee:"₹800", exp:"10 yrs", avail:false, init:"AP", lat:12.9, lng:77.5 },
  { name:"Dr. Kavitha Reddy", spec:"Diabetologist", hospital:"Diabetes Care Plus", city:"Bangalore", rating:4.8, fee:"₹700", exp:"13 yrs", avail:true, init:"KR", lat:12.9, lng:77.6 },
  { name:"Dr. Suresh Iyer", spec:"Pediatrician", hospital:"Rainbow Children's Hospital", city:"Chennai", rating:4.9, fee:"₹600", exp:"15 yrs", avail:true, init:"SI", lat:13.0, lng:80.2 },
  { name:"Dr. Meera Singh", spec:"Gynecologist", hospital:"Motherhood Clinic", city:"Delhi", rating:4.8, fee:"₹900", exp:"14 yrs", avail:true, init:"MS", lat:28.5, lng:77.2 },
  { name:"Dr. Vikram Nair", spec:"Psychiatrist", hospital:"Mind Wellness Center", city:"Hyderabad", rating:4.6, fee:"₹1000", exp:"11 yrs", avail:true, init:"VN", lat:17.4, lng:78.4 },
  { name:"Dr. Lakshmi Rao", spec:"General Physician", hospital:"LifeCare Hospital", city:"Hyderabad", rating:4.5, fee:"₹400", exp:"8 yrs", avail:true, init:"LR", lat:17.4, lng:78.5 },
  { name:"Dr. Amit Joshi", spec:"Orthopedic", hospital:"Bone & Joint Clinic", city:"Pune", rating:4.8, fee:"₹1000", exp:"16 yrs", avail:false, init:"AJ", lat:18.5, lng:73.8 },
  { name:"Dr. Sunita Yadav", spec:"General Physician", hospital:"City Health Center", city:"Pune", rating:4.6, fee:"₹450", exp:"9 yrs", avail:true, init:"SY", lat:18.5, lng:73.9 },
];

const SPECS = ["All","General Physician","Cardiologist","Dermatologist","Pediatrician","Gynecologist","Psychiatrist","Diabetologist","Orthopedic","Pulmonologist"];
const CITIES = ["All","Delhi","Mumbai","Bangalore","Chennai","Hyderabad","Pune"];
const CATS = ["all","fever","pain","allergy","digestion","diabetes","bp","vitamins","infection","hydration"];
const CAT_META = { all:"🔍 All", fever:"🌡️ Fever", pain:"🤕 Pain", allergy:"🤧 Allergy", digestion:"🫀 Digestion", diabetes:"🍬 Diabetes", bp:"❤️ Blood Pressure", vitamins:"💊 Vitamins", infection:"🦠 Infection", hydration:"💧 Hydration" };
const NAV = [
  { id:"dashboard", icon:"🏥", label:"Dashboard" },
  { id:"symptoms", icon:"🩺", label:"Symptom Checker" },
  { id:"reports", icon:"📊", label:"Report Analyzer" },
  { id:"medicines", icon:"💊", label:"Medicines (India)" },
  { id:"doctors", icon:"👨‍⚕️", label:"Find Doctors" },
  { id:"reminders", icon:"⏰", label:"Reminders" },
  { id:"emergency", icon:"🚨", label:"Emergency" },
];

// ── Claude API ─────────────────────────────────────────────────────────────
async function claudeChat(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1024, messages })
  });
  const d = await res.json();
  return d.content?.map(b => b.text||"").join("\n") || "Unable to get response.";
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function MediMindAI() {
  const [tab, setTab] = useState("dashboard");

  // Symptom checker
  const [syms, setSyms] = useState("");
  const [age, setAge] = useState("");
  const [pt, setPt] = useState("Adult");
  const [symRes, setSymRes] = useState("");
  const [symLoad, setSymLoad] = useState(false);

  // Report analyzer
  const [repText, setRepText] = useState("");
  const [repImg, setRepImg] = useState(null);
  const [repRes, setRepRes] = useState("");
  const [repLoad, setRepLoad] = useState(false);
  const fileRef = useRef();

  // Medicines
  const [medQ, setMedQ] = useState("");
  const [medCat, setMedCat] = useState("all");
  const [expanded, setExpanded] = useState(null);

  // Doctors
  const [docSpec, setDocSpec] = useState("All");
  const [docCity, setDocCity] = useState("All");
  const [booked, setBooked] = useState({});

  // Reminders
  const [reminders, setReminders] = useState([
    { id:1, name:"Metformin 500mg", time:"08:00", active:true, note:"After breakfast" },
    { id:2, name:"Amlodipine 5mg", time:"21:00", active:true, note:"After dinner" },
    { id:3, name:"Vitamin D3 Calcirol", time:"13:00", active:false, note:"With lunch (fatty meal)" },
  ]);
  const [rMed, setRMed] = useState("");
  const [rTime, setRTime] = useState("08:00");
  const [rNote, setRNote] = useState("");

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#060B18;}
      ::-webkit-scrollbar{width:5px;}
      ::-webkit-scrollbar-thumb{background:rgba(0,208,180,.25);border-radius:4px;}
      input,textarea,select{outline:none;}
      button{cursor:pointer;font-family:inherit;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
      @keyframes spin{to{transform:rotate(360deg);}}
      @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
      @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,208,180,.2);}50%{box-shadow:0 0 40px rgba(0,208,180,.5);}}
      .fade-up{animation:fadeUp .4s ease forwards;}
      .ch{transition:all .22s ease;}
      .ch:hover{transform:translateY(-2px);border-color:rgba(0,208,180,.45)!important;box-shadow:0 8px 28px rgba(0,208,180,.1)!important;}
      .nav-item{transition:all .18s ease;}
      .nav-item:hover{background:rgba(0,208,180,.07)!important;color:#00D0B4!important;}
      .btn-t{transition:all .18s ease;}
      .btn-t:hover{filter:brightness(1.12);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,208,180,.25);}
      .pill-t{transition:all .18s ease;}
      .pill-t:hover{opacity:.85;}
      .sos-btn{animation:glow 2s ease infinite;}
    `;
    document.head.appendChild(s);
    return () => { document.head.removeChild(l); document.head.removeChild(s); };
  }, []);

  // Filtered data
  const filtMeds = MEDS.filter(m =>
    (medCat === "all" || m.cat === medCat) &&
    (!medQ || [m.name, m.generic, m.use].some(s => s.toLowerCase().includes(medQ.toLowerCase())))
  );
  const filtDocs = DOCTORS.filter(d =>
    (docSpec === "All" || d.spec === docSpec) &&
    (docCity === "All" || d.city === docCity)
  );

  // API Actions
  async function checkSymptoms() {
    if (!syms.trim()) return;
    setSymLoad(true); setSymRes("");
    try {
      const r = await claudeChat([{ role:"user", content:`You are MediMind AI, an expert medical assistant for Indian patients. Analyze these symptoms and respond ONLY in the exact structured format below.

Patient: ${age ? age + " year old" : "Age not specified"} ${pt}
Symptoms: ${syms}

🔍 POSSIBLE CONDITIONS
(List 2–3 most likely conditions with a one-line explanation each)

⚠️ SEVERITY LEVEL
[Mild / Moderate / Severe] — Explain why in 1–2 sentences

🏠 HOME CARE TIPS
(3–5 practical tips; include Indian home remedies like haldi doodh, adrak chai, tulsi, jeera water, etc. when relevant)

💊 MEDICINES AVAILABLE IN INDIA
(1–3 specific OTC or common Rx medicines available in India like Dolo 650, Cetirizine, Digene, Azithral. Mention dosage and whether prescription is needed.)

🏥 WHEN TO SEE A DOCTOR
(Specific warning signs that need medical attention)

🚨 EMERGENCY — CALL 108 IMMEDIATELY IF
(Life-threatening red flag symptoms)

⚕️ This is AI guidance only. Consult a qualified doctor for diagnosis and treatment.` }]);
      setSymRes(r);
    } catch(e) { setSymRes("⚠️ Could not connect to AI. Please check your connection and try again."); }
    setSymLoad(false);
  }

  async function analyzeReport() {
    if (!repText.trim() && !repImg) return;
    setRepLoad(true); setRepRes("");
    try {
      let msgs;
      if (repImg) {
        msgs = [{ role:"user", content:[
          { type:"image", source:{ type:"base64", media_type:repImg.type, data:repImg.data }},
          { type:"text", text:`You are MediMind AI. Analyze this medical report/document image for an Indian patient and explain EVERYTHING in very simple, easy-to-understand language (as if explaining to someone with no medical background). Use this exact format:

📋 REPORT TYPE & OVERVIEW
(What kind of report this is and a one-line summary)

📊 KEY FINDINGS — What Your Results Mean
(For each important parameter/finding: state the value, whether it is Normal / High / Low, and what it means in plain simple language)

⚠️ AREAS NEEDING ATTENTION
(Any values or findings that are abnormal and why they matter)

💡 IN SIMPLE WORDS
(Explain the complete health picture in 3–4 sentences as if talking to a family member — no medical jargon)

🥗 DIET RECOMMENDATIONS (Indian Foods)
(Specific Indian foods to eat more of and foods to avoid based on findings — mention dal, sabzi, fruits, ghee etc.)

👨‍⚕️ WHICH DOCTOR TO CONSULT
(Specific type of specialist and why)

📅 NEXT STEPS & FOLLOW-UP
(What to do next — retest timeline, lifestyle changes, medications to ask about)

⚕️ AI analysis only. Always consult a qualified doctor before making any health decisions.` }
        ]}];
      } else {
        msgs = [{ role:"user", content:`You are MediMind AI. Analyze this medical report text for an Indian patient and explain in very simple, clear language. Use this exact format:

📋 REPORT TYPE & OVERVIEW
(What type of report and one-line summary)

📊 KEY FINDINGS — What Your Results Mean
(For each parameter: value, Normal/High/Low status, plain English explanation)

⚠️ AREAS NEEDING ATTENTION
(Abnormal values and why they matter)

💡 IN SIMPLE WORDS
(3–4 sentence health summary in everyday language — no jargon)

🥗 DIET RECOMMENDATIONS (Indian Foods)
(Specific Indian foods to eat/avoid based on findings)

👨‍⚕️ WHICH DOCTOR TO CONSULT
(Type of specialist needed and why)

📅 NEXT STEPS & FOLLOW-UP
(Action plan — retesting timeline, lifestyle changes)

Report Content:
${repText}

⚕️ AI analysis only. Consult a doctor before any health decisions.` }];
      }
      const r = await claudeChat(msgs);
      setRepRes(r);
    } catch(e) { setRepRes("⚠️ Analysis failed. Please check your connection and try again."); }
    setRepLoad(false);
  }

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setRepImg({ data: ev.target.result.split(",")[1], type: f.type, name: f.name });
    reader.readAsDataURL(f);
  }

  function addReminder() {
    if (!rMed.trim()) return;
    setReminders(p => [...p, { id:Date.now(), name:rMed, time:rTime, active:true, note:rNote }]);
    setRMed(""); setRTime("08:00"); setRNote("");
  }

  // ── Shared UI ────────────────────────────────────────────────────────────
  const inp = (extra={}) => ({
    background: C.surface2, border:`1px solid ${C.border}`, borderRadius:10,
    padding:"11px 14px", color:C.text, fontSize:14, width:"100%",
    fontFamily:"inherit", ...extra
  });
  const sel = (extra={}) => ({ ...inp(), ...extra });

  const Spinner = () => (
    <div style={{ display:"flex", alignItems:"center", gap:12, color:C.muted, padding:"18px 0" }}>
      <div style={{ width:18, height:18, border:`2px solid ${C.border}`, borderTop:`2px solid ${C.primary}`, borderRadius:"50%", animation:"spin .7s linear infinite" }} />
      <span style={{ fontSize:13 }}>AI is analyzing your input…</span>
    </div>
  );

  const ResultBox = ({ txt }) => !txt ? null : (
    <div className="fade-up" style={{ background:"rgba(0,208,180,.04)", border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginTop:18, whiteSpace:"pre-wrap", lineHeight:1.8, fontSize:13.5, color:C.text, maxHeight:520, overflowY:"auto" }}>
      {txt}
    </div>
  );

  const SectionHead = ({ title, sub }) => (
    <div style={{ marginBottom:26 }}>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:27, fontWeight:800, color:C.text }}>{title}</h1>
      {sub && <p style={{ color:C.muted, fontSize:13.5, marginTop:5 }}>{sub}</p>}
    </div>
  );

  // ── Pages ────────────────────────────────────────────────────────────────
  const pages = {

    dashboard: (
      <div className="fade-up">
        <SectionHead title="Welcome to MediMind AI 🏥" sub="Your AI-powered health companion — trusted by families across India" />

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:30 }}>
          {[
            { v:`${MEDS.length}+`, l:"Medicines", i:"💊", col:C.primary },
            { v:`${DOCTORS.length}+`, l:"Doctors Listed", i:"👨‍⚕️", col:C.purple },
            { v:"8+", l:"Languages", i:"🗣️", col:C.amber },
            { v:"24/7", l:"AI Available", i:"🤖", col:C.green },
          ].map(s => (
            <div key={s.l} className="ch" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 16px" }}>
              <div style={{ fontSize:26, marginBottom:8 }}>{s.i}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:s.col }}>{s.v}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:C.text, marginBottom:14 }}>🚀 Quick Access</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:14, marginBottom:28 }}>
          {[
            { id:"symptoms", i:"🩺", t:"Symptom Checker", d:"Describe symptoms, get AI guidance instantly", col:C.primary, dim:C.primaryDim },
            { id:"reports", i:"📊", t:"Report Analyzer", d:"Upload blood test, X-ray, prescription", col:C.purple, dim:C.purpleDim },
            { id:"medicines", i:"💊", t:"Medicine Guide", d:`${MEDS.length}+ medicines available in India`, col:C.amber, dim:C.amberDim },
            { id:"doctors", i:"👨‍⚕️", t:"Find Doctors", d:"Specialists by city & specialty", col:C.coral, dim:C.coralDim },
            { id:"reminders", i:"⏰", t:"Med Reminders", d:"Daily medicine alarm & tracking", col:C.green, dim:C.greenDim },
            { id:"emergency", i:"🚨", t:"Emergency", d:"Quick access to 108 & helplines", col:C.coral, dim:C.coralDim },
          ].map(m => (
            <div key={m.id} className="ch" onClick={() => setTab(m.id)} style={{ background:m.dim, border:`1px solid ${m.col}30`, borderRadius:16, padding:20, cursor:"pointer" }}>
              <div style={{ fontSize:32, marginBottom:10 }}>{m.i}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:m.col, fontSize:15, marginBottom:5 }}>{m.t}</div>
              <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.5 }}>{m.d}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ background:C.amberDim, border:`1px solid ${C.amber}40`, borderRadius:13, padding:16, display:"flex", gap:12 }}>
          <span style={{ fontSize:22 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, color:C.amber, fontSize:13, marginBottom:4 }}>Medical Disclaimer</div>
            <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.65 }}>MediMind AI provides <strong style={{ color:C.text }}>educational health information only</strong>. It is NOT a replacement for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional. In emergencies, call <strong style={{ color:C.coral }}>108</strong> immediately.</div>
          </div>
        </div>
      </div>
    ),

    symptoms: (
      <div className="fade-up">
        <SectionHead title="🩺 AI Symptom Checker" sub="Describe your symptoms in plain language — AI will analyze and guide you" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div>
            <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:5, letterSpacing:.5 }}>AGE (OPTIONAL)</label>
            <input style={inp()} type="number" placeholder="e.g. 35" value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:5, letterSpacing:.5 }}>PATIENT TYPE</label>
            <select style={sel()} value={pt} onChange={e => setPt(e.target.value)}>
              {["Adult","Child (Under 12)","Elderly (60+)","Pregnant Woman"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:5, letterSpacing:.5 }}>DESCRIBE YOUR SYMPTOMS *</label>
          <textarea style={{ ...inp(), resize:"vertical", minHeight:120 }}
            placeholder={"Type symptoms in plain language...\n\nExamples:\n• 'Fever for 2 days, headache, body pain, no appetite'\n• 'Chest tightness, breathlessness while climbing stairs'\n• 'Child vomiting, stomach pain, loose stools'\nया हिंदी में लिखें: 'बुखार, सिरदर्द, थकान'"}
            value={syms} onChange={e => setSyms(e.target.value)} />
        </div>
        <button className="btn-t" onClick={checkSymptoms} disabled={symLoad} style={{ background: symLoad ? C.surface2 : `linear-gradient(135deg,${C.primary},#00B8A0)`, color: symLoad ? C.muted : "#060B18", border:"none", borderRadius:11, padding:"13px 20px", fontSize:15, fontWeight:700, width:"100%" }}>
          {symLoad ? "🔄 AI is analyzing…" : "🔍 Check Symptoms with AI"}
        </button>
        {symLoad && <Spinner />}
        <ResultBox txt={symRes} />
        {symRes && (
          <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
            <button className="btn-t" onClick={() => setTab("doctors")} style={{ flex:1, background:C.primary, color:"#060B18", border:"none", borderRadius:10, padding:"11px", fontWeight:700, fontSize:13 }}>👨‍⚕️ Find a Doctor</button>
            <button className="btn-t" onClick={() => setTab("medicines")} style={{ flex:1, background:C.surface2, color:C.text, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px", fontWeight:600, fontSize:13 }}>💊 View Medicines</button>
            <button className="btn-t" onClick={() => setTab("emergency")} style={{ flex:1, background:C.coralDim, color:C.coral, border:`1px solid ${C.coral}40`, borderRadius:10, padding:"11px", fontWeight:600, fontSize:13 }}>🚨 Emergency</button>
          </div>
        )}
      </div>
    ),

    reports: (
      <div className="fade-up">
        <SectionHead title="📊 Medical Report Analyzer" sub="Upload your blood test, X-ray, MRI, or prescription — AI explains it in simple language" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          <div onClick={() => fileRef.current?.click()} style={{ background: repImg ? C.primaryDim : C.surface2, border:`2px dashed ${repImg ? C.primary : C.border}`, borderRadius:14, padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"all .2s" }}>
            <div style={{ fontSize:34, marginBottom:8 }}>{repImg ? "✅" : "📷"}</div>
            <div style={{ fontWeight:700, color: repImg ? C.primary : C.text, fontSize:14, marginBottom:5 }}>{repImg ? repImg.name : "Upload Report / Photo"}</div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>Blood report · X-Ray · MRI<br/>Prescription · Lab result<br/><span style={{ color:C.primary }}>JPG · PNG · PDF supported</span></div>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display:"none" }} onChange={handleFile} />
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:5, letterSpacing:.5 }}>OR PASTE REPORT TEXT</div>
            <textarea style={{ ...inp(), flex:1, minHeight:160, resize:"none" }}
              placeholder={"Paste values from your report here...\n\nExample:\nHemoglobin: 9.2 g/dL\nBlood Sugar (Fasting): 142 mg/dL\nCreatinine: 1.8 mg/dL\nVitamin B12: 185 pg/mL\nTSH: 6.8 mIU/L"}
              value={repText} onChange={e => setRepText(e.target.value)} />
          </div>
        </div>
        {repImg && (
          <button onClick={() => setRepImg(null)} style={{ background:C.coralDim, color:C.coral, border:"none", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, marginBottom:12 }}>
            ✕ Remove Image
          </button>
        )}
        <button className="btn-t" onClick={analyzeReport} disabled={repLoad} style={{ background: repLoad ? C.surface2 : `linear-gradient(135deg,${C.purple},#8B5CF6)`, color: repLoad ? C.muted : "#fff", border:"none", borderRadius:11, padding:"13px 20px", fontSize:15, fontWeight:700, width:"100%" }}>
          {repLoad ? "🔄 AI is analyzing your report…" : "🧠 Analyze Report with AI"}
        </button>
        {repLoad && <Spinner />}
        <ResultBox txt={repRes} />
        {repRes && (
          <div style={{ display:"flex", gap:10, marginTop:14 }}>
            <button className="btn-t" onClick={() => setTab("doctors")} style={{ flex:1, background:C.primary, color:"#060B18", border:"none", borderRadius:10, padding:"11px", fontWeight:700, fontSize:13 }}>👨‍⚕️ Find Specialist Doctor</button>
          </div>
        )}
      </div>
    ),

    medicines: (
      <div className="fade-up">
        <SectionHead title="💊 Medicine Guide — India" sub="Common medicines at Indian pharmacies with dosage, pricing, and safety notes" />
        <input style={{ ...inp(), marginBottom:14 }} placeholder="Search by name, generic name, or condition…" value={medQ} onChange={e => setMedQ(e.target.value)} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
          {CATS.map(cat => (
            <button key={cat} className="pill-t" onClick={() => setMedCat(cat)} style={{ background: medCat===cat ? C.primary : C.surface2, color: medCat===cat ? "#060B18" : C.muted, border:`1px solid ${medCat===cat ? C.primary : C.border}`, borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight: medCat===cat ? 700 : 400 }}>
              {CAT_META[cat]}
            </button>
          ))}
        </div>
        {filtMeds.length === 0 && (
          <div style={{ textAlign:"center", color:C.muted, padding:"40px 0" }}>No medicines found. Try a different search.</div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:14 }}>
          {filtMeds.map(m => (
            <div key={m.name} className="ch" onClick={() => setExpanded(expanded===m.name ? null : m.name)} style={{ background:C.surface, border:`1px solid ${expanded===m.name ? C.primary : C.border}`, borderRadius:14, padding:18, cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:C.text, fontSize:15 }}>{m.name}</div>
                  <div style={{ fontSize:11.5, color:C.muted, marginTop:1 }}>{m.generic}</div>
                </div>
                <span style={{ background: m.rx ? C.coralDim : C.greenDim, color: m.rx ? C.coral : C.green, borderRadius:6, padding:"2px 9px", fontSize:11, fontWeight:700, flexShrink:0, marginLeft:8 }}>
                  {m.rx ? "Rx" : "OTC"}
                </span>
              </div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:8, lineHeight:1.45 }}>{m.use}</div>
              <div style={{ fontWeight:700, color:C.primary, fontSize:13 }}>{m.price}</div>
              {expanded === m.name && (
                <div className="fade-up" style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.divider}` }}>
                  <div style={{ fontSize:13, marginBottom:8 }}>
                    <span style={{ color:C.muted }}>Dosage: </span>
                    <span style={{ color:C.text, fontWeight:500 }}>{m.dose}</span>
                  </div>
                  <div style={{ background:C.amberDim, border:`1px solid ${C.amber}35`, borderRadius:9, padding:"9px 13px", fontSize:12, color:C.amber, lineHeight:1.5 }}>
                    ⚠️ {m.note}
                  </div>
                </div>
              )}
              <div style={{ fontSize:11, color:C.muted, marginTop:8, textAlign:"right" }}>{expanded===m.name ? "▲ Less" : "▼ More details"}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, background:C.coralDim, border:`1px solid ${C.coral}35`, borderRadius:13, padding:"13px 16px", fontSize:13, color:C.coral, lineHeight:1.6 }}>
          🚨 <strong>Important:</strong> Always consult a doctor before taking any medicine, especially those marked Rx (prescription required). Self-medication can be dangerous.
        </div>
      </div>
    ),

    doctors: (
      <div className="fade-up">
        <SectionHead title="👨‍⚕️ Find Doctors Near You" sub="Qualified specialists across major Indian cities — filter by specialty and city" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          <div>
            <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:5, letterSpacing:.5 }}>SPECIALTY</label>
            <select style={sel()} value={docSpec} onChange={e => setDocSpec(e.target.value)}>
              {SPECS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:5, letterSpacing:.5 }}>CITY</label>
            <select style={sel()} value={docCity} onChange={e => setDocCity(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {filtDocs.length === 0 && (
          <div style={{ textAlign:"center", color:C.muted, padding:"40px 0" }}>No doctors found. Try different filters.</div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
          {filtDocs.map(d => (
            <div key={d.name} className="ch" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:15, padding:18 }}>
              <div style={{ display:"flex", gap:13, marginBottom:13 }}>
                <div style={{ width:50, height:50, borderRadius:"50%", background:`linear-gradient(135deg,${C.primary}30,${C.purple}30)`, border:`2px solid ${C.primary}55`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:C.primary, fontSize:14, flexShrink:0 }}>
                  {d.init}
                </div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:C.text, fontSize:14 }}>{d.name}</div>
                  <div style={{ fontSize:12.5, color:C.primary, fontWeight:600 }}>{d.spec}</div>
                  <div style={{ fontSize:11.5, color:C.muted }}>{d.hospital} · {d.city}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
                {[
                  { v:`⭐ ${d.rating}`, l:"Rating" },
                  { v:d.fee, l:"Consult Fee" },
                  { v:d.exp, l:"Experience" },
                ].map(s => (
                  <div key={s.l} style={{ background:C.surface2, borderRadius:8, padding:"7px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:C.text }}>{s.v}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ flex:1, background: d.avail ? C.greenDim : C.coralDim, borderRadius:7, padding:"5px 10px", fontSize:11.5, color: d.avail ? C.green : C.coral, fontWeight:600 }}>
                  {d.avail ? "✅ Available Today" : "📅 Next Available"}
                </div>
                <button className="btn-t" onClick={() => setBooked(p => ({ ...p, [d.name]: !p[d.name] }))} style={{ background: booked[d.name] ? C.greenDim : C.primary, color: booked[d.name] ? C.green : "#060B18", border: booked[d.name] ? `1px solid ${C.green}50` : "none", borderRadius:9, padding:"7px 14px", fontSize:12, fontWeight:700 }}>
                  {booked[d.name] ? "✓ Booked" : "Book"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    reminders: (
      <div className="fade-up">
        <SectionHead title="⏰ Medicine Reminders" sub="Set daily alarms so you never miss an important medicine" />
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:15, padding:22, marginBottom:24 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:C.text, marginBottom:16 }}>➕ Add New Reminder</div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:10 }}>
            <input style={inp()} placeholder="Medicine name (e.g. Metformin 500mg)" value={rMed} onChange={e => setRMed(e.target.value)} />
            <input style={inp()} type="time" value={rTime} onChange={e => setRTime(e.target.value)} />
          </div>
          <input style={{ ...inp(), marginBottom:12 }} placeholder="Note (optional — e.g. 'After breakfast with water')" value={rNote} onChange={e => setRNote(e.target.value)} />
          <button className="btn-t" onClick={addReminder} style={{ background:`linear-gradient(135deg,${C.primary},#00B8A0)`, color:"#060B18", border:"none", borderRadius:10, padding:"11px 22px", fontWeight:700, fontSize:14 }}>
            Add Reminder
          </button>
        </div>
        <div style={{ display:"grid", gap:11 }}>
          {reminders.map(r => (
            <div key={r.id} className="ch" style={{ background:C.surface, border:`1px solid ${r.active ? C.border : C.divider}`, borderRadius:13, padding:16, display:"flex", alignItems:"center", gap:14, opacity: r.active ? 1 : 0.55 }}>
              <div style={{ width:46, height:46, borderRadius:"50%", background: r.active ? C.primaryDim : C.faint, border:`2px solid ${r.active ? C.primary+"50" : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>💊</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:C.text, fontSize:14 }}>{r.name}</div>
                <div style={{ fontSize:13.5, color: r.active ? C.primary : C.muted, fontWeight:600 }}>🕐 {r.time}</div>
                {r.note && <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{r.note}</div>}
              </div>
              <div style={{ display:"flex", gap:7, flexShrink:0 }}>
                <button onClick={() => setReminders(p => p.map(x => x.id===r.id ? {...x, active:!x.active} : x))} style={{ background: r.active ? C.primaryDim : C.surface2, color: r.active ? C.primary : C.muted, border:`1px solid ${r.active ? C.primary+"45" : C.border}`, borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700 }}>
                  {r.active ? "ON" : "OFF"}
                </button>
                <button onClick={() => setReminders(p => p.filter(x => x.id!==r.id))} style={{ background:C.coralDim, color:C.coral, border:"none", borderRadius:8, padding:"6px 11px", fontSize:15 }}>
                  🗑
                </button>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <div style={{ textAlign:"center", color:C.muted, padding:"40px 0" }}>No reminders yet. Add one above.</div>
          )}
        </div>
        <div style={{ marginTop:20, background:C.primaryDim, border:`1px solid ${C.primary}35`, borderRadius:12, padding:"12px 16px", fontSize:13, color:C.primary }}>
          💡 <strong>Tip:</strong> Set reminders 5–10 minutes before meal times for medicines that need to be taken with food.
        </div>
      </div>
    ),

    emergency: (
      <div className="fade-up">
        <SectionHead title="🚨 Emergency Contacts — India" sub="Quick access to emergency medical services available 24/7 across India" />
        {/* 108 SOS */}
        <a href="tel:108" style={{ textDecoration:"none", display:"block", marginBottom:22 }}>
          <div className="sos-btn" style={{ background:"linear-gradient(135deg,#FF5050,#CC2020)", borderRadius:20, padding:"30px 24px", textAlign:"center", cursor:"pointer" }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🚑</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:52, fontWeight:800, color:"#fff", lineHeight:1 }}>108</div>
            <div style={{ color:"rgba(255,255,255,.85)", fontSize:16, marginTop:8, fontWeight:600 }}>Emergency Ambulance — Tap to Call</div>
            <div style={{ fontSize:12.5, color:"rgba(255,255,255,.6)", marginTop:6 }}>Free · 24/7 · Available across India · Fastest emergency response</div>
          </div>
        </a>

        {/* Other helplines */}
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:C.text, marginBottom:14 }}>📞 All Emergency & Health Helplines</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12, marginBottom:24 }}>
          {[
            { num:"102", i:"🤰", t:"Women & Child Helpline", d:"Maternal care, pregnancy emergencies", col:C.purple },
            { num:"104", i:"🏥", t:"Health Helpline (NHM)", d:"Medical advice, hospital info, first aid", col:C.primary },
            { num:"112", i:"🚔", t:"National Emergency", d:"Police + Fire + Ambulance combined", col:C.coral },
            { num:"1800-599-0019", i:"🧠", t:"iCall Mental Health", d:"Free 24/7 mental health support", col:C.purple },
            { num:"1098", i:"👶", t:"Childline India", d:"Children in distress or danger", col:C.amber },
            { num:"181", i:"👩", t:"Women Helpline", d:"Women facing violence or danger", col:C.coral },
            { num:"1800-11-0031", i:"🧪", t:"Poison Control", d:"Accidental poisoning, overdose", col:C.green },
            { num:"14410", i:"❤️", t:"NIMHANS Helpline", d:"Mental health crisis & guidance", col:C.purple },
            { num:"1800-180-1553", i:"🫀", t:"CGHS Health Line", d:"Government health scheme queries", col:C.primary },
            { num:"011-23978046", i:"🔬", t:"COVID / Disease Control", d:"Epidemic & outbreak reporting", col:C.amber },
          ].map(e => (
            <a key={e.num} href={`tel:${e.num}`} style={{ textDecoration:"none" }}>
              <div className="ch" style={{ background:C.surface, border:`1px solid ${e.col}30`, borderRadius:14, padding:16, cursor:"pointer" }}>
                <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
                  <div style={{ fontSize:26 }}>{e.i}</div>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:e.col }}>{e.num}</div>
                    <div style={{ fontWeight:600, color:C.text, fontSize:12.5, marginBottom:2 }}>{e.t}</div>
                    <div style={{ fontSize:11.5, color:C.muted, lineHeight:1.4 }}>{e.d}</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* First Aid */}
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:C.text, marginBottom:14 }}>🩹 Quick First Aid Reference</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:12 }}>
          {[
            { i:"🫀", t:"Chest Pain", tip:"Sit upright, loosen clothing. Give aspirin 325mg if available (not allergic). Call 108 immediately. If unconscious & no pulse, start CPR." },
            { i:"🤕", t:"Head Injury", tip:"Do NOT move the person if neck injury suspected. Keep still. Apply cold pack to reduce swelling. Call 108 for any loss of consciousness." },
            { i:"🔥", t:"Burns", tip:"Cool with running water for 20 minutes. Do NOT use ice, butter, or toothpaste. Cover loosely with clean cloth. Go to hospital for large burns." },
            { i:"😮‍💨", t:"Choking", tip:"Ask to cough forcefully. If unable: 5 firm back blows between shoulder blades, then 5 abdominal thrusts (Heimlich). Call 108 if unresolved." },
            { i:"🐍", t:"Snake Bite", tip:"Keep calm, immobilize and lower the limb. Remove jewelry. Do NOT cut, suck, or tourniquet. Identify snake if possible. Reach hospital ASAP. Call 108." },
            { i:"💊", t:"Overdose / Poisoning", tip:"Call 108 & Poison Control (1800-11-0031). Note what was taken, quantity, and when. Keep person awake if conscious. Do NOT induce vomiting unless instructed." },
            { i:"🌊", t:"Drowning / Near-Drowning", tip:"Remove from water safely. Check breathing. If not breathing, start CPR. Call 108. Even if person seems fine, get medical evaluation." },
            { i:"🩸", t:"Severe Bleeding", tip:"Apply firm, direct pressure with clean cloth. Elevate the injured area above heart level. Do NOT remove cloth. Add more if soaked. Call 108." },
          ].map(f => (
            <div key={f.t} style={{ background:C.surface2, borderRadius:12, padding:16 }}>
              <div style={{ fontSize:22, marginBottom:7 }}>{f.i}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:C.text, fontSize:13.5, marginBottom:6 }}>{f.t}</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{f.tip}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  // ── Layout ───────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg, color:C.text, minHeight:"100vh", display:"flex", overflow:"hidden", height:"100vh" }}>

      {/* Sidebar */}
      <aside style={{ width:218, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
        {/* Brand */}
        <div style={{ padding:"22px 20px 18px", borderBottom:`1px solid ${C.divider}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:34, height:34, background:`linear-gradient(135deg,${C.primary},#00916B)`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏥</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:C.primary, lineHeight:1 }}>MediMind</div>
              <div style={{ fontSize:9.5, color:C.muted, letterSpacing:1.5, marginTop:2 }}>INDIA HEALTH AI</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {NAV.map(n => (
            <button key={n.id} className="nav-item" onClick={() => setTab(n.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 13px", background: tab===n.id ? C.primaryDim : "transparent", border:`1px solid ${tab===n.id ? C.primary+"40" : "transparent"}`, borderRadius:10, color: tab===n.id ? C.primary : C.muted, width:"100%", textAlign:"left", marginBottom:2, fontSize:13, fontWeight: tab===n.id ? 600 : 400 }}>
              <span style={{ fontSize:15, width:18, textAlign:"center" }}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* SOS */}
        <div style={{ padding:"8px 8px 16px" }}>
          <a href="tel:108" style={{ textDecoration:"none" }}>
            <div style={{ background:"linear-gradient(135deg,#FF5050,#CC2020)", borderRadius:11, padding:"11px 14px", display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
              <span style={{ fontSize:16 }}>🚑</span>
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:15, fontFamily:"'Syne',sans-serif", lineHeight:1 }}>Call 108</div>
                <div style={{ color:"rgba(255,255,255,.65)", fontSize:10, marginTop:1 }}>Emergency Ambulance</div>
              </div>
            </div>
          </a>
          <div style={{ fontSize:10, color:C.muted, textAlign:"center", marginTop:9, lineHeight:1.5 }}>
            AI guidance · Not medical advice<br/>Consult a doctor for diagnosis
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex:1, overflowY:"auto", padding:"28px 30px" }}>
        {pages[tab]}
      </main>
    </div>
  );
}
