import { Server as SocketIOServer } from 'socket.io'
import http from 'http'

export const initSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server)

    io.on('connection', (socket) => {
        console.log(`User connected`)

        //Listen for 'notification' event from the client
        socket.on('notification', (data) => {
            //broadcast the notification data to all connected cliends (admin dashboard)
            io.emit('newNotification', data)
        })
        socket.on('disconnect', () => {
            console.log(`User disconnected`)
        })
    })
}
