const axios = require('axios');
const firebase = require("../services/firebase");
const FirebaseDb = require('../services/firebase');
const baseUrl = "https://graph.facebook.com/v17.0/101564042742370/messages";
const openai_base_url = "https://api.openai.com/v1/chat/completions"
const whatappToken = "<API_KEY>";
class Generate{

    ApiToHit=async(intent, order, ph)=>{
        const firebaseDb = new FirebaseDb();
        const headers = {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${whatappToken}`
        };
        if(String(intent).includes("1")){
            firebaseDb.addOrderToDb( ph , order.toString())
            console.log("adding order")
        }
        else if (String(intent).includes("2")){
            await firebaseDb.deleteOrder(ph)
            console.log("delete order")
        }
        else if (String(intent).includes("3")){
            var lastOrder = await firebaseDb.readOrder(ph)
            if (lastOrder==null || lastOrder == ""){
                lastOrder = "There is no last order for today"
            }
            const data = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": ph,
                "type": "text",
                "text": { 
                "preview_url": false,
                "body": String(lastOrder)
                }
            }
            const response = await axios.post(baseUrl, data, 
                {
                    "headers":headers
            })
            console.log("read order");
            return false;
        }

        return true;
    }
    
    GenerateMessage=async(ph,query)=>{
        const menu = "Menu \nBurgers:\n Whopper - Flame-grilled beef patty, lettuce, tomato, onions, pickles, mayo, ketchup on a sesame seed bun.\n Cheeseburger = Flame-grilled beef patty, American cheese, pickles, onions, ketchup, mustard on a sesame seed bun. \n Bacon King =Two flame-grilled beef patties, American cheese, bacon, mayo, ketchup on a sesame seed bun. \n Veggie Burger: Plant-based patty, lettuce, tomato, onions, pickles, ketchup, mayo on a sesame seed bun. \n Fries \n Classic Fries: Crispy, golden, and seasoned with salt. \n Bacon & Cheese Fries: Classic fries topped with melted cheese and crispy bacon bits. \n Loaded Fries: Classic fries topped with cheese sauce, bacon, and jalapenos. \n Beverages \n Soft Drinks - Coca-Cola, Diet Coke, Sprite, Fanta, and more.\n Iced Coffee - Creamy iced coffee with your choice of flavors.\n Milkshakes - Chocolate, vanilla, strawberry, and oreo flavors.\n Bottled Water - Refreshing purified water. \n Note: The menu items and availability may vary based on location. Please refer to the Burger King website or app for the most accurate and up-to-date information. \n Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 24 Version"
        const firebaseDb = new FirebaseDb();
        const chat_list = await firebaseDb.readFromDb(ph);
        const data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": `You are a assistant that take burger King order from the ${menu} . If user ask you to help them pick a order or the user is unsure what to order give them the menu or a combination . when user ask to add an item display it as item name and Quantity by default 1 . And if user ask to checkout give them the list of what they have order with the exact qunatity in a excel sheet format . And If they drop the order, you will display the message that, "Your order is being deleted". And if they ask for there last order , display message saying your order is being loaded from database.`
                },
                ...chat_list,
                {
                    "role": "user",
                    "content": query
                }
            ],
            "temperature": 1,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "max_tokens": 250,
            "presence_penalty": 0,
            "frequency_penalty": 0
        }


        const headers = {
            "Authorization":"Bearer <API_KEY>",
            "Content-Type":"application/json"
        }

        const ai_response = await axios.post(openai_base_url, data, {"headers":headers})
        
            
        try {
            const api_data = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": `You are an assistant that respond with integer 1 to 4 only Which indicate the intent of user while ordering food. 1 if the give test indication finalizing menu . 2 if the you want to cancel the order . 3 if you want read from the last from , And resond with 4 if the query is anything else or you are not sure.So what does the user messaging indicate between 1-4 choices?  `
                    },
                    {
                        "role": "user",
                        "content": `${query}  `
                    },
            
                ],
                "temperature": 1,
                "top_p": 1,
                "n": 1,
                "stream": false,
                "max_tokens": 250,
                "presence_penalty": 0,
                "frequency_penalty": 0
            }

            const api_to_hit = await axios.post(openai_base_url , api_data , {"headers":headers})
            const message_to_send = this.ApiToHit(api_to_hit.data.choices[0].message.content , ai_response.data.choices[0].message.content, ph)
            console.log(api_to_hit.data.choices[0].message.content)
            return [ai_response.data.choices[0].message.content , message_to_send]

        } catch ( e ) {
            return ["Sorry, Something went wrong" , True]
        }
    }

    HandleResponse = async (req) => {
        const val  = JSON.parse(req.body);
        const msg = val.entry[0].changes[0].value.messages[0].text.body;
        const ph = val.entry[0].changes[0].value.messages[0].from
        const headers = {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${whatappToken}`
        };

        const firebaseDb = new FirebaseDb()
        var response;
        if (ph!="15550476952"){
            const [reply , message_to_send] = await this.GenerateMessage(ph,msg);
            if (message_to_send == true){

                const data = 
                {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": ph,
                    "type": "text",
                    "text": { 
                        "preview_url": false,
                        "body": reply
                    }
                }
                response = await axios.post(baseUrl, data, 
                    {
                        "headers":headers
                    })
                    
                    await firebaseDb.addToDb(ph,msg , reply)
                }
            
        }

        return "Success"
        
    }
}
module.exports = Generate;