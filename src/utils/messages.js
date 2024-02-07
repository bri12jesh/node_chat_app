const generatedMessag=(username,text)=>{
    return{
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const generatedLocationMessage=(username,url)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generatedMessag,
    generatedLocationMessage
}