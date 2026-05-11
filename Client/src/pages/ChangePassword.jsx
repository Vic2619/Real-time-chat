import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function ChangePassword() {

  const navigate = useNavigate();

  const [darkMode] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "darkMode"
        )
      ) || false
    );

  const [form, setForm] =
    useState({
      oldPassword: "",
      newPassword: "",
    });

  const handleChangePassword =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await api.put(
          "/api/users/password",
          form,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Password updated"
        );

        navigate("/profile");

      } catch (err) {

        alert(
          err.response?.data
            ?.message
        );

      }

    };

  return (

    <div className={`min-h-screen flex justify-center items-center p-5 ${ darkMode ? "bg-zinc-900" : "bg-gray-100" }`} >

      <div className={`p-8 rounded-2xl shadow w-full max-w-[500px] ${ darkMode ? "bg-zinc-800 text-white" : "bg-white" }`} >

        <h1 className="text-3xl font-bold mb-6">
          Change Password
        </h1>

        <div className="space-y-4">

          <input
            type="password"
            placeholder="Old Password"
            value={
              form.oldPassword
            }
            onChange={(e) =>
              setForm({
                ...form,
                oldPassword:
                  e.target.value,
              })
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="New Password"
            value={
              form.newPassword
            }
            onChange={(e) =>
              setForm({
                ...form,
                newPassword:
                  e.target.value,
              })
            }
            className="w-full border p-3 rounded"
          />

          <button
            onClick={
              handleChangePassword
            }
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition"
          >
            Save Password
          </button>

          <button
            onClick={() =>
              navigate("/profile")
            }
            className={`w-full p-3 rounded transition ${
              darkMode
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Back
          </button>

        </div>

      </div>

    </div>

  );

}

export default ChangePassword;