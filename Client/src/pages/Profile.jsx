import { useEffect, useState } from "react";

import api from "../api/axios";

import { useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const [darkMode] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "darkMode"
        )
      ) || false
    );

  const [form, setForm] = useState({
    username: "",
    avatar: "",
    bio: "",
  });

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/api/users/profile",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setForm({
        username:
          res.data.username,
        avatar:
          res.data.avatar,
        bio:
          res.data.bio,
      });

    } catch (err) {

      console.log(err);

    }

  };

  const updateProfile =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await api.put(
          "/api/users/profile",
          form,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem(
          "username",
          form.username
        );
        localStorage.setItem(
          "avatar",
          form.avatar
        );

        alert(
          "Profile updated"
        );

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
          Profile
        </h1>

        <div className="flex justify-center mb-5">

          <img
            src={
              form.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username}`
            }
            alt=""
            className="w-24 h-24 rounded-full"
          />

        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username:
                  e.target.value,
              })
            }
            className={`w-full border p-3 rounded ${ darkMode ? "bg-zinc-700 text-white border-zinc-600" : "bg-white" }`}
          />

          <label className="cursor-pointer">

            <div className="bg-green-500 text-white p-3 rounded-xl text-center transition hover:bg-green-600 w-full">

                Upload Avatar

            </div>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {

                const file =
                    e.target.files[0];

                if (!file) return;

                const reader =
                    new FileReader();

                reader.onloadend =
                    () => {

                    setForm({
                        ...form,
                        avatar:
                        reader.result,
                    });

                    };

                reader.readAsDataURL(file);

                }}
            />

            </label>

            <div className="mt-4"></div>

          <textarea
            placeholder="Bio"
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio:
                  e.target.value,
              })
            }
            className={`w-full border p-3 rounded ${ darkMode ? "bg-zinc-700 text-white border-zinc-600" : "bg-white" }`}
          />

          <button
            onClick={updateProfile}
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition"
          >
            Save Profile
          </button>

        </div>

        <div className="flex justify-end mt-4">

        <button
            onClick={() =>
            navigate(
                "/change-password"
            )
            }
            className="text-blue-500 hover:underline"
        >
            Change Password
        </button>

        </div>

        <button
          onClick={() => navigate("/")}
          className={`mt-6 w-full p-3 rounded transition ${darkMode ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-gray-300 hover:bg-gray-400"}`}
        >
          Back
        </button>

      </div>
    </div>
  );
}

export default Profile;