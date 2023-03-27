import { View, Text } from "react-native";
import React, { useEffect } from "react";

const processGroupTransaction = ({ group }) => {
  console.log("processGroupTransaction,")
  let groupRecord = { syncAt: new Date() };
  if (group && group.transactions) {
    let total = 0;
    let groupUsers = [];
    let userExpense = [];
    let userTotalPaid = [];
    group.transactions?.map((transaction) => {
      total += parseInt(transaction?.amount) || 0;

      groupUsers = group?.users?.map((groupUser) => {
        let totalExpense = 0;
        let totalPaid = 0;
        // console.log("Group User",(groupUser?.name).toLowerCase() )
        if ((groupUser?.name).toLowerCase() === (transaction?.paid_by).toLowerCase()) {
          // console.log("transaction?.paid_by User",(transaction?.paid_by).toLowerCase() )
          let isUserExistInUserTotalPaid = false;
          userTotalPaid.forEach((paidUser, i) => {
            // console.log("paidUser",paidUser)
            if (paidUser?.name == groupUser?.name) {
              totalPaid = parseInt(transaction?.amount || 0) +  parseInt(paidUser?.totalPaid || 0);
              userTotalPaid[i].totalPaid = totalPaid;
              isUserExistInUserTotalPaid = true;
            } 
          });
          if (!isUserExistInUserTotalPaid) {
            // console.log("false");
            totalPaid = parseInt(transaction?.amount || 0);
            userTotalPaid.push({
              name: groupUser?.name?.toLowerCase(),
              totalPaid,
            });
          }
          groupUser.totalPaid = (totalPaid || 0).toFixed(2);
          // console.log("Total paid ",(totalPaid || 0).toFixed(2))
        }

        //if current user involve in transaction
        if (transaction?.users[(groupUser?.name?.toLowerCase()).toLowerCase()]) {
          totalExpense =
            transaction?.amount / (transaction?.totalUserInTransaction || 1);
          let isUserExistInUserExpense = false;
          userExpense.forEach((expenseUser, i) => {
            if (expenseUser?.name == groupUser?.name) {
              totalExpense += expenseUser?.totalExpense || 0;
              userExpense[i].totalExpense = totalExpense;
              isUserExistInUserExpense = true;
            }
          });
          if (!isUserExistInUserExpense) {
            userExpense.push({ name: groupUser?.name?.toLowerCase(), totalExpense });
          }
          groupUser.totalExpense = totalExpense.toFixed(2);
        }
        return groupUser;
      });
      // v?.paid_by;
    });
    groupRecord["users"] = groupUsers;
    groupRecord["totalSpend"] = total.toFixed(2);
  }
  return groupRecord;
};

// const processGroupTransaction = ({ group }) => {
//   console.log("group transaction analyzing")
//   let groupRecord = {syncAt: new Date()};
//   if (group && group.transactions) {
//     let total = 0;
//     let groupUsers = [];
//     group.transactions?.map((transaction) => {
//       total += parseInt(transaction?.amount) || 0;
//       group.users?.map((groupUser) => {
//         const newGroupUser = { ...groupUser };
//         if(newGroupUser?.name === transaction?.paid_by){
//           newGroupUser.total_paid = parseInt(transaction?.amount) + parseInt(newGroupUser?.total_paid) || 0;
//         }

//         if(transaction?.users[(newGroupUser?.name).toLowerCase()]){
//           console.log("user: ",newGroupUser?.name," amount: ",transaction?.amount, " in ", transaction?.totalUserInTransaction)
//           console.log("user: ",newGroupUser?.name," amount: ",newGroupUser?.totalExpense)
//           newGroupUser.totalExpense =  (transaction?.amount) / (transaction?.totalUserInTransaction || 1)   + (groupUser?.totalExpense || 0)
//           console.log("Total user expense", newGroupUser?.totalExpense)
//         }
//         console.log("group transaction=>",newGroupUser)
//         groupUsers.push(newGroupUser);
//       });
//     });
//     console.log(groupUsers)
//     groupRecord["users"] = groupUsers;
//     groupRecord["totalSpend"] = total;
//   }
//   return groupRecord;
// };

export default processGroupTransaction;
