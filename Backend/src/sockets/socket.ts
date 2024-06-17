const socketIo_Config = (io: any) => {
  let users: { userId: string; socketId: string }[] = [];

  io.on("connection", (socket: any) => {
    console.log("A client connected", socket.id);

    io.emit("welcome", "Welcome to the server!"); // Emit a welcome message to the client upon connection

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      removeUser(socket.id); // Remove disconnected user from the users array
      io.emit("getUsers", users); // Broadcast updated users array to all clients
    });

    const removeUser = (socketId: string) => {
      users = users.filter((user) => user.socketId !== socketId);
    };

    const addUser = (userId: string, socketId: string) => {
      if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId });
      }
    };

    // const getUser = (userId: string) => {
    //   return users.find((user) => user.userId === userId);
    // };

    // Handle 'addUser' event
    socket.on("addUser", (userId: string) => {
      console.log("Add User Event:", userId);
      addUser(userId, socket.id); // Add user to the users array
      io.emit("getUsers", users); // Broadcast updated users array to all clients
    });


  });


  
};

export default socketIo_Config;
