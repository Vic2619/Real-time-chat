const Message = require("../models/Message");
const Room = require("../models/Room");

module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("User connected");
    
    socket.on(
      "join_room",
      async (room) => {

      socket.rooms.forEach(
        (r) => {

          if (
            r !== socket.id
          ) {

            socket.leave(r);

          }

        }
      );

        socket.join(room);

        const messages =
          await Message.find({
            room,
          })
            .sort({
              createdAt: 1,
            })
            .limit(100);

        socket.emit(
          "load_messages",
          messages
        );

        const count =
          io.sockets.adapter.rooms
            .get(room)?.size || 0;

        io.to(room).emit(
          "online_users",
          count
        );

      }
    );

    socket.on("send_message", async (data) => {
      const newMessage = await Message.create(data);

      io.to(data.room).emit("receive_message", newMessage);
    });

    socket.on("delete_message", async (id) => {
        await Message.findByIdAndDelete(
          id
        );

        io.emit(
          "message_deleted",
          id
        );
      }
    );

    socket.on(
      "edit_message",
      async (data) => {

        const {
          messageId,
          message,
          image,
          userId,
        } = data;

        const msg =
          await Message.findById(
            messageId
          );

        if (!msg) return;

        if (
          msg.userId !== userId
        ) return;

        msg.message = message;
        msg.image = image;

        await msg.save();

        io.to(msg.room).emit(
          "message_edited",
          msg
        );

      }
    );

    socket.on("typing", (data) => {
      socket.to(data.room).emit("show_typing", data.username);
    });

    socket.on("stop_typing", (room) => {
      socket.to(room).emit("hide_typing");
    });
    socket.on(
      "get_rooms",
      async () => {

        const rooms =
          await Room.find();

        socket.emit(
          "rooms_list",
          rooms
        );
      }
    );

    socket.on(
      "create_room",
      async (data) => {

        const exists =
          await Room.findOne({
            name: data.name,
          });

        if (exists) return;

        await Room.create({

          name: data.name,

          ownerId:
            data.userId,

        });

        const rooms =
          await Room.find();

        io.emit(
          "rooms_list",
          rooms
        );

      }
    );

    socket.on(
      "rename_room",
      async ({
        oldName,
        newName,
        userId,
      }) => {

        const room =
          await Room.findOne({
            name: oldName,
          });

        if (!room) return;

        if (
          room.ownerId.toString() !==
          userId
        ) {
          return;
        }

        room.name = newName;

        await room.save();

        await Message.updateMany(
          { room: oldName },
          {
            $set: {
              room: newName,
            },
          }
        );

        io.emit(
          "room_renamed",
          {
            oldName,
            newName,
          }
        );

      }
    );

    socket.on(
      "delete_room",
      async ({
        roomId,
        userId,
      }) => {

        const room =
          await Room.findById(
            roomId
          );

        if (!room) return;

        if (
          room.ownerId !== userId
        ) {
          return;
        }

        await Message.deleteMany({
          room: room.name,
        });

        await Room.findByIdAndDelete(
          roomId
        );

        const rooms =
          await Room.find();

        io.emit(
          "rooms_list",
          rooms
        );

      }
    );

    socket.on(
      "disconnecting",
      () => {

        socket.rooms.forEach(
          (room) => {

            if (
              room !== socket.id
            ) {

              setTimeout(() => {

                const count =
                  io.sockets.adapter.rooms
                    .get(room)?.size || 0;

                io.to(room).emit(
                  "online_users",
                  count
                );

              }, 100);

            }

          }
        );

        console.log(
          "User disconnected"
        );
      });
    }
  );
};