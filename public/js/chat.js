const socket=io()


//Elements 
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendlocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')



//Templates 
const messageTemplate=document.querySelector("#message-template").innerHTML
const locationTemplate=document.querySelector("#location-message-template").innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML


//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
//new message element
const $newMessage=$messages.lastElementChild

//height of the new message
const newMessageStyles=getComputedStyle($newMessage)
const newMessageMargin=parseInt(newMessageStyles.marginBottom)
const newMessageHeight=$newMessage.offsetHeight+newMessageMargin


// console.log(newMessageMargin)

//visible height
const visibleHeight=$messages.offsetHeight

//height
const containerHeight=$messages.scrollHeight

//how far have i scrolled?
const scrollOffset=$messages.scrollTop+visibleHeight


if(containerHeight-newMessageHeight<=scrollOffset){
    $messages.scrollTop=$messages.scrollHeight

}
}



socket.on('message',(message)=>{
    
    const html =Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})




socket.on('locationMessage',(locationMessage)=>{

    const html =Mustache.render(locationTemplate,{
        username:locationMessage.username,
        url:locationMessage.url,
        createdAt:moment(locationMessage.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})


socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html

})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    //disable
$messageFormButton.setAttribute('disabled','disabled')

    const message=e.target.elements.message.value//document.querySelector('input').value
   
    socket.emit('sendMessage',message,(error)=>{
      

        //enable
       
        $messageFormButton.removeAttribute('disabled')
       

        $messageFormInput.value=''
        $messageFormInput.focus()
       
        if(error)
        {
            return console.log(error)
        }
        console.log('Message delivered')
    })
})



$sendlocationButton.addEventListener('click',()=>{
   
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    $sendlocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
    
      const location={
        latitude:position['coords'].latitude,
        longitude:position['coords'].longitude
      }
      
      
     socket.emit("sendLocation",location,(msg)=>{
$sendlocationButton.removeAttribute('disabled')
        console.log(msg)
      })

     
    })

})

socket.emit('join',{username,room},(error)=>{
    if(error){
        location.href='/'
        alert(error)
        
    }
})




// socket.on('countUpdated',(count)=>{
//     console.log("the count has been updated",count)


// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })