export const groupCalculation = (group) => {
let groupUser = group.users || [];
let transactions = group.transactions || [];
let finalRecord = {};
groupUser.forEach((user)=>{
    console.log("transaction count for :",user.name)
    let currentRecord = {} 
		transactions && transactions.forEach((transaction)=>{
    	let perHead =transaction.amount /  transaction.totalUserInTransaction;

    	if(user.name.toLowerCase() == transaction.paid_by.toLowerCase()){
      			Object.keys(
            transaction.users).forEach((transactionUser)=>{
              transactionUser =   transactionUser.toLowerCase()
            if(!currentRecord[transactionUser]){
            	currentRecord[transactionUser] = {}
            }
            console.log("transaction involve user: ",transactionUser,currentRecord[transactionUser].total)

            currentRecord[transactionUser].total = 
            (currentRecord[transactionUser].total || 0 )  + perHead;
            
             console.log("transaction involve user: after ",transactionUser,currentRecord[transactionUser].total)
				})
      }
    })
    console.log("current Record for ",user.name,currentRecord)    
    finalRecord[user.name] = {...currentRecord}
  })

const expense = {};
console.log("final log=> ",finalRecord)
Object.keys(finalRecord).map((user) => {
  if(!expense[user]){
     expense[user] = {}
  }

  Object.keys(finalRecord[user]).map((friend) => {
   
    if((user || "").toLowerCase() != (friend || "").toLowerCase()){
      expense[user][friend]  = (finalRecord[user])[friend]?.total || 0  - (finalRecord[friend])[user]?.total || 0
      if(finalRecord[friend] &&  finalRecord[friend][user]){
        finalRecord[friend][user].total =  0;
      }
      console.log(
        "calculation for",user, " : ",
        friend ," =>  ", expense[user][friend] || 0,"  => ");
    }
  })
  console.log("expense calculation => ",expense)
// return (user || "").toLowerCase() != (friend || "").toLowerCase() && 
// {friend || `User ${ 1}`}{" "}{groupExpense[user][friend]?.total || 0}

})

return expense;
}