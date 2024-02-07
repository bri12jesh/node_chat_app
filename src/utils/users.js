const users = []


//addUser,removeUser,getUser,getUsersinRoom

const addUser = ({ id, username, room }) => {
    //clean the data 
    username = username.trim().toLowerCase()

    room = room.trim().toLowerCase()

    //validate the data

    if(!username || !room){
        return {
            error:'Username and room are required!'
            
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username    })
        

        //validate username
        if(existingUser){
            return {
                error:"Username is in user!"
            }
        }

        //Store user
         const user={id,username,room}
         users.push(user)
         return {user}

}


const removeUser=(id)=>{

    const index=users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    
    return users.find((user)=>user.id===id)

  
    
}

const getUsersinRoom=(room)=>{
    return users.filter((user)=>user.room===room)
}



module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}





// addUser({id:22,
// username:'Brijesh',
// room:'12'})

// addUser({id:23,
//     username:'Bri',
//     room:'12'})


// addUser({id:23,
//         username:'Br',
//         room:'1'})

// console.log(getUser(22))

// console.log(users)


// const removedUser=removeUser(22)
// console.log(removedUser,users)
// const res=addUser({
//     id:33,
//     username:'Brijesh',
//     room:'12'

// })
// console.log(res)

// const userList=getUsersinRoom('1')
// console.log(userList)