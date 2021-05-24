module.exports={
    adminLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            const mail="admin@book.com"
            const password="admin123"
            if(data.email==mail){
                if(data.password==password){
                    resolve()
                }else{
                    reject(mail)
                }
            }else{
                reject()
            }
        })
    }
}