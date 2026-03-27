// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Tools from "./pages/Tools";
import Users from "./pages/Users";
import NotificationPage from "./pages/NotificationPage";
import Consumables from "./pages/Consumables";
import DigitalBooks from "./pages/DigitalBooks";
import Approvals from "./pages/Approvals";
import HistoryPage from "./pages/HistoryPage";
import ReturnPage from "./pages/ReturnPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        {/* <Route path="/" element={<Dashboard/>} /> */}

        <Route path="/dashboard"
          element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />

        <Route path="/books"
          element={<ProtectedRoute><Books/></ProtectedRoute>} />

        <Route path="/tools"
          element={<ProtectedRoute><Tools/></ProtectedRoute>} />

        <Route path="/users"
          element={<ProtectedRoute><Users/></ProtectedRoute>} />

        <Route path="/consumables"
          element={<ProtectedRoute><Consumables/></ProtectedRoute>} />

        <Route path="/digital-books"
          element={<ProtectedRoute><DigitalBooks/></ProtectedRoute>} />

        <Route path="/approvals"
          element={<ProtectedRoute><Approvals/></ProtectedRoute>} />

        <Route path="/history"
          element={<ProtectedRoute><HistoryPage/></ProtectedRoute>} />

        <Route path="/return"
          element={<ProtectedRoute><ReturnPage/></ProtectedRoute>} />

        <Route path="/notifications"
          element={<ProtectedRoute><NotificationPage/></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
