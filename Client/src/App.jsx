import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Chat from "./pages/Chat";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Profile from "./pages/Profile";

import ChangePassword from "./pages/ChangePassword";

import ViewProfile from "./pages/ViewProfile";

import ProtectedRoute
from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;