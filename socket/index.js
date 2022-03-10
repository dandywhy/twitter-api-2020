const socketio = require('socket.io')
const { authenticatedSocket } = require('../middleware/auth')


const socket = server => {
  const io = socketio(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
    },
    allowEI03: true
  })

  let numUsers = 0
  let connectedUser = []

  io.use(authenticatedSocket).on('connection', async socket => {
    const sockets = await io.fetchSockets()
    console.log(sockets.user)
    let isHere = true
    ++numUsers
    const loginUser = {
      isHere,
      userId: socket.user.id,
      avatar: socket.user.avatar,
      name: socket.user.name,
      account: socket.user.account
    }

    connectedUser.push(loginUser)
    updateNumUsers()
    updateUser()
    console.log(connectedUser)
    socket.on('chat message', msg => {
      const userData = {
        isHere,
        userId: msg.userId,
        content: msg.msg,
        avatar: socket.user.avatar,
        name: socket.user.name,
        account: socket.user.account,
        createdTime: new Date(),
      }

      io.emit('chat message', userData)
    })

    // socket.on('join room', () => {
    //   if (joinUser) return

    //   const msg = '進入聊天室'
    //   console.log(msg)
    //   ++numUsers
    //   joinUser = true
    //   connectedUser.push(userName)
    //   updateUser()
    //   socket.emit('user join', msg)
    // })
    
    // socket.on('disconnect', () => {
    //   if (isHere) {
    //     const msg = `${socket.user.name} 已離開囉`
    //     --numUsers
    //     connectedUser.splice(connectedUser.indexOf(userName), 1)
    //     socket.emit('user disconnect', msg)
    //     updateUser()
    //     updateNumUsers
    //   }
    // })

    function updateUser() {
      io.emit('connectedUser', connectedUser)
    }
    function updateNumUsers () {
      io.emit('numUsers', numUsers)
    }
  })
}

module.exports = {
  socket
}
