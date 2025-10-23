import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

const firebaseConfig = {
  // apna Firebase config yahan add karo
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [employees, setEmployees] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const setupAuth = async () => {
      try { await signInAnonymously(auth); } catch(e){ console.error(e); }
    };
    const unsub = onAuthStateChanged(auth, (user) => {
      if(user) setUserId(user.uid);
      else setUserId(crypto.randomUUID());
    });
    setupAuth();
    return () => unsub();
  }, []);

  useEffect(() => {
    if(!db || !userId) return;
    const ref = collection(db, `users/${userId}/employees`);
    const unsub = onSnapshot(ref, (snap) => setEmployees(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => unsub();
  }, [db, userId]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Vision HR & Payroll (Demo)</h1>
      <div>Employees: {employees.length}</div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
