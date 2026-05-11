import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

function ViewProfile() {

  const { id } = useParams();

  const navigate = useNavigate();

    const [darkMode] =
    useState(
        JSON.parse(
        localStorage.getItem(
            "darkMode"
        )
        ) || false
    );

  const [user, setUser] = useState(null);

  useEffect(() => {

    fetchUser();

  }, []);

  const fetchUser =
    async () => {

      const res =
        await api.get(
          `/api/users/${id}`
        );

      setUser(res.data);

    };

  if (!user) {

    return (
      <div>
        Loading...
      </div>
    );

  }

  return (
    <div className={`min-h-screen flex justify-center items-center p-5 ${ darkMode ? "bg-zinc-900" : "bg-gray-100" }`} >

      <div className={`p-8 rounded-2xl shadow w-full max-w-[500px] ${ darkMode ? "bg-zinc-800 text-white" : "bg-white" }`} >

        <img
          src={
            user.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
          }
          alt=""
          className="w-28 h-28 rounded-full mx-auto mb-4"
        />

        <h1 className="text-3xl font-bold">
          {user.username}
        </h1>

        <p className="text-gray-500 mt-3">
          {user.bio}
        </p>

        <button
          onClick={() =>
            navigate(-1)
          }
          className="mt-6 bg-blue-500 text-white px-5 py-2 rounded-xl"
        >
          Back
        </button>

      </div>
    </div>
  );
}

export default ViewProfile;