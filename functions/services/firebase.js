const {getDatabase, ref,push, onValue, set, remove} = require("firebase/database")
const  app  = require("../firebase");
class FirebaseDb{
    constructor(){
        this.db = getDatabase(app)
    }

    async readFromDb(ph){
        const date = this.currentDate();
        const reference = ref(
                               this.db,
                               "Chats/" + String(ph) + "/" + date + "/" 
                            );
        return new Promise((resolve, reject)=>{

            onValue(reference, (snapshot)=>{
                const data = snapshot.val();
                const message = []
                for(const item in data){
                    message.push(data[item]);
                }
                resolve( message );
            },(error)=>{
                reject( [] )
            } )
        })

    }

    currentDate(){
        
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;

    }

    async addToDb(ph ,query, reply){
        const date = this.currentDate();
        const reference = ref(
                                this.db,
                                "Chats/" + String(ph) + "/"+ date+ "/"
                            );
            
        await push(reference, {"role": "user","content":query} )
        await push(reference, {"role": "assistant","content":reply} )
           
        
    }

    async addOrderToDb(ph, order){
        const date = this.currentDate()
        const reference = ref(this.db,"Orders/"+String(ph)+"/"+date.toString()+"/");
        await set(reference , String(order) )

    }

    async deleteOrder(ph){
        const date = this.currentDate()
        const reference = ref(this.db,"Orders/"+String(ph)+"/"+date.toString()+"/");
        remove(reference).then((val)=>{
            console.log("reference deleted sucessfully")
        }).catch((e)=>{
            console.log(e)
        })

    }

    async readOrder(ph){
        const date = this.currentDate()
        const reference = ref(this.db,"Orders/"+ String(ph) + "/" + date.toString() + "/");
        return new Promise((resolve, reject)=>{
            onValue(reference , (snapshot)=>{
                console.log(snapshot.val())
                resolve(snapshot.val())
            } , (error)=>{
                reject("no order found")
            })
        })
        
    }
}
module.exports = FirebaseDb;