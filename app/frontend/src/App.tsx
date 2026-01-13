import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationPage from "./pages/auth/RegistrationPage";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          padding: '16px',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: '600',
        },
        success: {
          style: {
            background: 'green', 
          },
        },
        error: {
          style: {
            background: 'red', 
          },
        },
      }}
    />
    <Routes>
      <Route path="/register" element={<RegistrationPage/>} />
      <Route path="/404" element={<NotFoundStranica />} />
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    </>
  );
}

export default App;
