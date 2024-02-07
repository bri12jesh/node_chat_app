const http=require('http')
const path=require('path')
const express=require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generatedMessag,generatedLocationMessage}=require('./utils/messages')
const { addUser,removeUser,getUser,getUsersinRoom}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))


// let count=0


//server (emit)->client (receive)-coutnUpdated
//client (emit)->server(receive)- increment


io.on('connection',(socket)=>{
console.log('new websocket connection')

// socket.emit('message',generatedMessag('Welcome!'))
// socket.broadcast.emit('message',generatedMessag('A new user has joined'))



socket.on('join',(options,callback)=>{

    const {error,user} =addUser({
        id:socket.id,
        ...options
    })

    if(error){

        return callback(error)

    }


    socket.join(user.room)

    //io.to.emit,socket.broadcast.to.emit
    socket.emit('message',generatedMessag(`Admin server  ${user.room}`,`Welcome ${user.username}`))

socket.broadcast.to(user.room).emit('message',generatedMessag(`Admin server  ${user.room}`,`${user.username} has joined`))
io.to(user.room).emit('roomData',{
    room:user.room,
    users:getUsersinRoom(user.room)
})
callback()

})


socket.on('sendMessage',(message,callback)=>{
    const user=getUser(socket.id)
    const filter=new Filter()
    if(filter.isProfane(message)){
        return callback('Profanity is not allowed!')
    }
    
    io.to(user.room).emit('message',generatedMessag(user.username,message))
    callback('Delivered!')
})

socket.on('disconnect',()=>{

    const user=removeUser(socket.id)
    if(user){
    io.to(user.room).emit('message',generatedMessag(`Admin server  ${user.room}`,` ${user.username} has left!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersinRoom(user.room)
        })
}
})

socket.on('sendLocation',(location,callback)=>{
    const user=getUser(socket.id)
    url=`https://google.com/maps?q=${location.latitude},${location.longitude}`
    io.to(user.room).emit('locationMessage',generatedLocationMessage(user.username,url))

    callback('location shared')
})


})

server.listen(port,()=>{
    console.log('server is up on port',port)
})





// socket.emit('countUpdated',count)
// socket.on('increment',()=>{
//     count++
//    // socket.emit('countUpdated',count)
// io.emit('countUpdated',count)//whole server
// })