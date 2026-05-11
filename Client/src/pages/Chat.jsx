import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import EmojiPicker from "emoji-picker-react";

function Chat() {

  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const userId = localStorage.getItem("userId");

  const [darkMode, setDarkMode] =
    useState(
      JSON.parse(
        localStorage.getItem("darkMode")
      ) || false
    );

  const [room, setRoom] = useState(localStorage.getItem("room") || "");

  const [rooms, setRooms] = useState([]);

  const [newRoom, setNewRoom] = useState("");

  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editingMessage, setEditingMessage] = useState("");

  const [editingImage, setEditingImage] = useState("");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState(0);

  const messagesEndRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  // SOCKET

  useEffect(() => {

    socket.emit("join_room", room);

    socket.on(
      "load_messages",
      (data) => {

        setMessages(data);

      }
    );

    socket.on(
      "receive_message",
      (data) => {

        setMessages(prev => [
          ...prev,
          data,
        ]);

      }
    );

    socket.on(
      "room_renamed",
      ({
        oldName,
        newName,
      }) => {

        setRooms(prev =>
          prev.map(room =>
            room.name === oldName
              ? {
                  ...room,
                  name: newName,
                }
              : room
          )
        );

        if (room === oldName) {

          setRoom(newName);

          localStorage.setItem(
            "room",
            newName
          );

        }

      }
    );

    socket.on(
      "show_typing",
      (name) => {

        setTyping(
          `${name} is typing...`
        );

      }
    );

    socket.on(
      "hide_typing",
      () => {

        setTyping("");

      }
    );

    socket.on(
      "online_users",
      (count) => {

        setOnlineUsers(count);

      }
    );

    socket.on(
      "message_deleted",
      (id) => {

        setMessages(prev =>
          prev.filter(
            msg => msg._id !== id
          )
        );

      }
    );

    socket.on(
      "message_edited",
      (updatedMsg) => {

        setMessages(prev =>
          prev.map(msg =>
            msg._id ===
            updatedMsg._id
              ? updatedMsg
              : msg
          )
        );

      }
    );

    socket.emit("get_rooms");

    socket.on(
      "rooms_list",
      (data) => {

        setRooms(data);

        const exists =
          data.find(
            r => r.name === room
          );

        if (!exists) {

          if (data.length > 0) {

            setRoom(
              data[0].name
            );

            localStorage.setItem(
              "room",
              data[0].name
            );

            socket.emit(
              "join_room",
              data[0].name
            );

          } else {

            setRoom("");

            localStorage.removeItem(
              "room"
            );

          }

        }

      }
    );

    return () => {

      socket.off("load_messages");

      socket.off("receive_message");

      socket.off("show_typing");

      socket.off("hide_typing");

      socket.off("online_users");

      socket.off("message_deleted");

      socket.off("rooms_list");

      socket.off("room_renamed");

      socket.off("message_edited");
    };

  }, [room]);

  // AUTO SCROLL

  useEffect(() => {

    messagesEndRef.current?.
    scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // THEME

  const toggleTheme = () => {

    setDarkMode(!darkMode);

    localStorage.setItem(
      "darkMode",
      JSON.stringify(!darkMode)
    );

  };

  // ROOM

  const changeRoom = (newRoom) => {

    socket.emit(
      "stop_typing",
      room
    );

    setRoom(newRoom);

    localStorage.setItem(
      "room",
      newRoom
    );

    setMessages([]);

  };

  // LOGOUT

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "username"
    );

    navigate("/login");

  };

  // SEND MESSAGE

  const sendMessage = () => {

    if (
      !room) { alert( "Create a room first" ); 
    return; }
    
    if (
      !message.trim() &&
      !image
    ) return;

    const data = {
      room,
      username,
      message,
      image,
      userId: localStorage.getItem("userId"),
      avatar: localStorage.getItem("avatar"),

    };

    socket.emit(
      "send_message",
      data
    );

    setMessage("");

    setImage("");

    socket.emit(
      "stop_typing",
      room
    );

  };

  // TYPING

  const deleteMessage = (id) => {

    socket.emit(
      "delete_message",
      id
    );

    setMessages(prev =>
      prev.filter(
        msg => msg._id !== id
      )
    );

  };

  const handleTyping = (e) => {

    setMessage(
      e.target.value
    );

    socket.emit(
      "typing",
      {
        room,
        username,
      }
    );

    clearTimeout(
      typingTimeoutRef.current
    );

    typingTimeoutRef.current =
      setTimeout(() => {

        socket.emit(
          "stop_typing",
          room
        );

      }, 1000);

  };

  return (

    <div
      className={`flex h-screen ${
        darkMode
          ? "bg-zinc-900 text-white"
          : "bg-gray-100"
      }`}
    >

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <div
        className={`relative w-[250px] border-r p-5 ${
          darkMode
            ? "bg-zinc-800 border-zinc-700"
            : "bg-white"
        }`}
      >

        <h1 className="text-2xl font-bold mb-6 text-blue-500">
          Chat Rooms
        </h1>

        {
          rooms.map((r) => (

            <div
              key={r.name}
              className="flex items-center gap-2 mb-3"
            >

              <button
                onClick={() =>
                  changeRoom(r.name)
                }
                className={`flex-1 p-3 rounded-xl text-left transition ${
                  room === r.name
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "bg-zinc-700 hover:bg-zinc-600"
                      : "bg-gray-100 hover:bg-gray-200 text-black"
                }`}
              >
                # {r.name}
              </button>

              {
                r.ownerId === userId && (

                  <button
                    onClick={() => {

                      const newName =
                        prompt(
                          "Rename room"
                        );

                      if (!newName)
                        return;

                      socket.emit(
                        "rename_room",
                        {
                          oldName: r.name,
                          newName,
                          userId,
                        }
                      );

                    }}
                  >
                    ✏️
                  </button>

                )
              }

              {
            r.ownerId === userId && (

              <button
                onClick={() => {

                  const ok =
                    window.confirm(
                      `Delete ${r.name}?`
                    );

                  if (!ok) return;

                  socket.emit(
                    "delete_room",
                    {
                      roomId: r._id,
                      userId,
                    }
                  );

                  if (
                    room === r.name
                  ) {

                    const otherRooms =
                      rooms.filter(
                        room =>
                          room._id !== r._id
                      );

                    if (
                      otherRooms.length > 0
                    ) {

                      setRoom(
                        otherRooms[0].name
                      );

                      localStorage.setItem(
                        "room",
                        otherRooms[0].name
                      );

                    } else {

                      setRoom("");

                      localStorage.removeItem(
                        "room"
                      );

                    }

                  }

                }}
              >
                🗑️
              </button>

            )
          }

            </div>

          ))
        }

        {/* ADD ROOM */}

        <input
          type="text"
          placeholder="New room"
          value={newRoom}
          onChange={(e) =>
            setNewRoom(
              e.target.value
            )
          }
          className={`w-full p-3 rounded-xl border mt-4 outline-none ${
            darkMode
              ? "bg-zinc-700 border-zinc-600 text-white"
              : "bg-white text-black"
          }`}
        />

        <button
          onClick={() => {

            if (!newRoom)
              return;

            socket.emit(
            "create_room",
            {
              name: newRoom,
              userId,
            }
          );

            setNewRoom("");

          }}
          className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl"
        >
          Add
        </button>

      <div className="absolute bottom-5 left-5">

        <button
          onClick={() =>
            navigate("/profile")
          }
          className="flex items-center gap-3"
        >

          <img
            src={
              localStorage.getItem("avatar") ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
            }
            alt=""
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />

          <div className="text-left">

            <div className="font-semibold">
              {username}
            </div>

            <div className="text-sm text-gray-400">
              View Profile
            </div>

          </div>

        </button>

      </div>

      </div>

      {/* ========================= */}
      {/* CHAT AREA */}
      {/* ========================= */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div
          className={`border-b px-6 py-4 flex justify-between items-center ${
            darkMode
              ? "bg-zinc-800 border-zinc-700"
              : "bg-white"
          }`}
        >

          <div>

            <h1
              className={`text-2xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {room}
            </h1>

            <p className="text-gray-500 text-sm">
              Online Users:
              {" "}
              {onlineUsers}
            </p>

          </div>

          <div className="flex items-center gap-4">

            <span
              className={`${
                darkMode
                  ? "text-gray-200"
                  : "text-gray-600"
              }`}
            >
              {username}
            </span>

            <button
              onClick={toggleTheme}
              className="text-2xl"
            >
              {
                darkMode
                  ? "☀️"
                  : "🌙"
              }
            </button>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {
            messages.map(
              (msg, index) => (

                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    msg.userId === userId
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >

                  <img
                    src={
                      msg.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.username}`
                    }
                    alt=""

                    onClick={() =>
                      navigate(
                        `/user/${msg.userId}`
                      )
                    }

                    className="w-10 h-10 rounded-full cursor-pointer"
                  />

                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                      msg.userId === userId
                        ? "bg-blue-500 text-white rounded-bl-none"
                        : darkMode
                          ? "bg-zinc-700 text-white rounded-br-none"
                          : "bg-white border text-gray-800 rounded-br-none"
                    }`}
                  >

                    <div className="text-sm font-semibold mb-1">
                      {
                        msg.username
                      }
                    </div>

                    <div className="break-words">
                      {msg.message}
                    </div>

                    {
                      msg.image && (

                        <img
                          src={
                            msg.image
                          }
                          alt=""
                          className="mt-2 rounded-xl max-w-[250px]"
                        />

                      )
                    }

                    <div
                      className={`text-xs mt-2 ${
                        msg.userId === userId
                          ? "text-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      {
                        new Date(
                          msg.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )
                      }
                    </div>

                      {
                        msg.userId === userId && (

                          <div className="flex gap-2 mt-2">

                            <button
                              onClick={() => {

                                setEditingId(
                                  msg._id
                                );

                                setEditingMessage(
                                  msg.message
                                );

                                setEditingImage(
                                  msg.image || ""
                                );

                              }}
                              className="text-sm"
                            >
                              ✏️
                            </button>

                            <button
                              onClick={() => {

                                socket.emit(
                                  "delete_message",
                                  msg._id
                                );

                              }}
                              className="text-sm"
                            >
                              🗑️
                            </button>

                          </div>

                        )
                      }

                      {
                        editingId ===
                        msg._id && (

                          <div className="mt-3 space-y-2">

                            <input
                              type="text"
                              value={editingMessage}
                              onChange={(e) =>
                                setEditingMessage(
                                  e.target.value
                                )
                              }
                              className="w-full border p-2 rounded text-black"
                            />

                          <label className="cursor-pointer">

                            <div className="text-sm text-white hover:underline w-fit">
                              Change Image
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

                                    setEditingImage(
                                      reader.result
                                    );

                                  };

                                reader.readAsDataURL(
                                  file
                                );

                              }}
                            />

                          </label>

                              {
                                editingImage && (

                                  <img
                                    src={editingImage}
                                    alt=""
                                    className="w-32 rounded-xl"
                                  />

                                )
                              }

                            <div className="flex gap-2">

                              <button
                                onClick={() => {

                                  socket.emit(
                                    "edit_message",
                                    {
                                      messageId:
                                        msg._id,

                                      message:
                                        editingMessage,

                                      image:
                                        editingImage,

                                      userId,
                                    }
                                  );

                                  setEditingId(
                                    null
                                  );

                                }}
                                className="bg-green-500 hover:bg-green-600 transition px-3 py-1 rounded text-white mt-1"
                              >
                                Save
                              </button>

                              <button
                                onClick={() =>
                                  setEditingId(
                                    null
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 transition px-3 py-1 rounded text-white mt-1"
                              >
                                Cancel
                              </button>

                            </div>

                          </div>

                        )
                      }

                  </div>

                </div>

              )
            )
          }

          <div ref={messagesEndRef}></div>

        </div>

        {/* TYPING */}

        <div className="px-6 text-sm text-gray-500 h-6">
          {typing}
        </div>

        {/* INPUT */}

        <div
          className={`border-t p-4 ${
            darkMode
              ? "bg-zinc-800 border-zinc-700"
              : "bg-white"
          }`}
        >

          <div
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
              darkMode
                ? "bg-zinc-700"
                : "bg-gray-100"
            }`}
          >

            {/* IMAGE PREVIEW */}

            {
              image && (

                <img
                  src={image}
                  alt=""
                  className="w-20 h-20 object-cover rounded-xl"
                />

              )
            }

            {/* FILE */}

            <label className="cursor-pointer text-2xl">

              📷

              <input
                type="file"
                disabled={!room}
                accept="image/*"
                className="hidden"
                onChange={(e) => {

                  const file =
                    e.target.files[0];

                  if (!file)
                    return;

                  const reader =
                    new FileReader();

                  reader.onloadend =
                    () => {

                      setImage(
                        reader.result
                      );

                    };

                  reader.readAsDataURL(
                    file
                  );

                }}
              />

            </label>

            {/* INPUT */}

            <input
              type="text"
              disabled={!room}
              placeholder={ room ? "Type a message..." : "Create a room first" }
              value={message}
              onChange={
                handleTyping
              }
              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  sendMessage();

                }

              }}
              className={`flex-1 bg-transparent outline-none ${
                darkMode
                  ? "text-white"
                  : "text-black"
              }`}
            />

            {/* EMOJI */}

            <div className="relative">

              <button
                disabled={!room}
                onClick={() =>
                  setShowEmoji(
                    !showEmoji
                  )
                }
                className="text-2xl"
              >
                😀
              </button>

              {
                showEmoji && (

                  <div className="absolute bottom-16 right-0 z-50">

                    <EmojiPicker
                      onEmojiClick={(
                        e
                      ) => {

                        setMessage(
                          prev =>
                            prev +
                            e.emoji
                        );

                        setShowEmoji(
                          false
                        );

                      }}
                    />

                  </div>

                )
              }

            </div>

            {/* SEND */}

            <button
              disabled={!room}
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Chat;