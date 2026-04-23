import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 text-stone-900">
      <div className="text-center">
        <h1 className="mb-4 bg-gradient-to-r from-amber-700 to-stone-900 bg-clip-text text-5xl font-bold text-transparent">Welcome to FairCred Dashboard</h1>
        <p className="text-xl text-stone-600">React + TypeScript + Tailwind Setup Complete</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
