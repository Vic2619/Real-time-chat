import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    try {

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Register success");

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Register failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex justify-center items-center p-5">

      <div className="w-full max-w-[420px] bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white mb-2">
            Create Account
          </h1>

          <p className="text-zinc-400">
            Register to start chatting
          </p>

        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value,
              })
            }
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-4 rounded-xl outline-none focus:border-green-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="w-full bg-zinc-800 border border-zinc-700 text-white p-4 rounded-xl outline-none focus:border-green-500 transition"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition p-4 rounded-xl font-semibold text-white"
          >
            {loading ? "Loading..." : "Create Account"}
          </button>

        </div>

        <div className="mt-8 text-center text-zinc-400">

          Already have an account?

          <Link
            to="/login"
            className="text-green-400 hover:text-green-300 ml-2 font-semibold"
          >
            Login
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Register;