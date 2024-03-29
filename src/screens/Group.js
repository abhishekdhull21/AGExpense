import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  VirtualizedList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Card, Dialog, Input } from "@rneui/themed";
import { FlatList } from "react-native";
import { now } from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import firebase from "../database/configDB";
import CheckBoxStack from "../components/CheckBoxStack";
import { screens } from ".";
import processGroupTransaction from "../common.js/processGroupTransaction";
import SelectDropdown from "react-native-select-dropdown";
import tw from 'twrnc';
import { groupCalculation } from "../common.js/groupCalculation";

const Group = ({ navigation, route }) => {
  const { group } = route.params;
  const [modal, setModal] = useState(false);
  const [modalTransaction, setModalTransaction] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState();
  const [paidBy, setPaidBy] = useState();
  const [loadGroup, setLoadGroup] = useState(false);
  const [remarks, setRemarks] = useState();
  const [transactionUser, setTransactionUser] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [groupUser, setGroupUser] = useState([]);
  const [groupTransaction, setGroupTransaction] = useState([]);
  const [groupRecord, setGroupRecord] = useState({});
  const [inputName, setInputName] = useState();
  const [groupExpense, setGroupExpense] = useState({});
  const groupRef = firebase.firestore().collection("groups");

  const handleAddNewUser = () => {
    setModal((pre) => !pre);
  };

  // useEffect(() => {
  //   const unsubscribe = groupsUserRef
  //     .where("groupId", "==", group?.id)
  //     .onSnapshot((querySnapshot) => {
  //       const groupsUser = [];
  //       querySnapshot.forEach((documentSnapshot) => {
  //         groupsUser.push({
  //           id: documentSnapshot.id,
  //           ...documentSnapshot.data(),
  //         });
  //       });
  //       setUsers(groupsUser);
  //     });
  //   return () => unsubscribe();
  // },[]);

  const handleDatePicker = () => {
    setShowDateTimePicker(true);
  };
  const handleTransaction = () => {
    setModalTransaction((prev) => !prev);
  };

  const handleDateChange = (e, date) => {
    setDate(date);
    setShowDateTimePicker(false);
  };
  const handleNewTransaction = () => {
    if (group.id && amount && Object.keys(transactionUser).length) {
      const trueInvolvedUsers = Object.entries(transactionUser).filter(
        (entry) => entry[1] === true
      );
      const involvedUsers = Object.fromEntries(trueInvolvedUsers);
      let totalUserInTransaction = trueInvolvedUsers?.length;

      groupRef
        .doc(group?.id)
        .update({
          transactions: firebase.firestore.FieldValue.arrayUnion({
            amount: amount,
            remarks,
            paid_by: paidBy || currentUser?.name || "self",
            users: involvedUsers,
            totalUserInTransaction,
            at: date,
          }),
        })
        .then((v) => {
          setLoadGroup(true);
        })
        .catch((err) => {
          Alert.alert(err.message);
        });
    }
    setModalTransaction((prev) => false);
  };

  const handleAddUserToGroup = () => {
    if (group.id && inputName) {
      groupRef
        .doc(group?.id)
        .update({
          users: firebase.firestore.FieldValue.arrayUnion({
            name: inputName,
          }),
        })
        .then((v) => {
          setLoadGroup(true);
        })
        .catch((err) => {
          Alert.alert(err.message);
        });
    }
    setModal(false);
  };

  const convertToCheckboxData = (data) => {
    let convertedData = data?.reduce((acc, curr) => {
      let obj = {
        title: curr.name,
        key: curr.name.toLowerCase(),
      };
      acc.push(obj);
      return acc;
    }, []);

    return convertedData;
  };
  const convertToSelectData = (data) => {
    let convertedData = data?.reduce((acc, curr) => {
      acc.push(curr.name.toLowerCase());
      return acc;
    }, []);

    return convertedData;
  };

  const payOrPaidString = (totalExpense = 0, totalPaid = 0) => {
    let balance = totalExpense - totalPaid;
    return balance > 0
      ? ` have to pay Rs ${balance.toFixed(2)}`
      : balance != 0
      ? ` have to take ${(balance * -1).toFixed(2)}`
      : " ";
  };

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user?.uid && user?.uid != "") {
      setCurrentUser(user);
    } else {
      navigation.navigate(screens.LOGIN);
    }
  }, []);

  useEffect(() => {
    setGroupTransaction(group.transaction || group.transactions || []);
    setGroupUser(group.users || []);
    // console.log("group calculation ",groupCalculation(group))
    setGroupExpense(groupCalculation(group))
  }, []);


  useEffect(() => {
    groupRef.doc(group.id).onSnapshot((documentSnapshot) => {
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        setGroupUser(data?.users);
        setGroupTransaction(data?.transactions || data?.transaction);
        const groupTransactionRecord = processGroupTransaction({ group: data });
        // console.log("group transaction loaded...", groupTransactionRecord);
        setGroupRecord(groupTransactionRecord);
      } else {
        console.log("group not found");
      }
    });

  }, [loadGroup]);

  // useEffect(()=>{


  // },[groupUser,groupTransaction])

  useEffect(()=>{
    groupRecord?.users?.forEach((record,i)=>{
      const balance = record?.totalExpense - record?.totalPaid;
      
      // console.log("record=>",record)
    })
    // console.log('group info', JSON.stringify(group, null, 2))
  },[loadGroup])

  return (
    <ScrollView>
      <View style={[styles.container]}>
        <Card>
          <Card.Title style={{ alignContent: "space-between" }}>
            <Text style={{ flex: 4 }}>{group.name}</Text>
          </Card.Title>
          <Card.Divider />
          <Text>Total Transaction Amount: {groupRecord?.totalSpend || 0}</Text>
          {/* {console.log("groupExpense",groupExpense)} */}
          {Object.keys(groupExpense || {}).map((user) => (
            <View>
              <Text>
                   {user || `User ${ 1}`}{" => "}
                   {/* {payOrPaidString(record?.totalExpense, record?.totalPaid)}{" "} */}
                 </Text>
              {Object.keys(groupExpense[user] || {}).map((friend) => {
                                 {console.log(user,"groupExpense user",friend)}

                   return (user || "").toLowerCase() != (friend || "").toLowerCase() && <Text>
                   {friend || `User ${ 1}`}{" "}{groupExpense[user][friend] || 0}
                   {/* {payOrPaidString(record?.totalExpense, record?.totalPaid)}{" "} */}
                 </Text>
              })}
             
              {/* <Text>Rs Paid: {record?.totalPaid || 0}</Text>
              <Text>Expense: {record?.totalExpense || 0}</Text> */}
            </View>
          ))}
        </Card>
       
        <Card>
          <Card.Title style={{ alignContent: "space-between" }}>
            <Text style={{ flex: 4 }}>{group.name}</Text>
          </Card.Title>
          <Card.Divider />
          <Text>Total Transaction Amount: {groupRecord?.totalSpend || 0}</Text>
          {groupRecord?.users?.map((record) => (
            <View>
              <Text>
                {record?.name || `User ${i + 1}`}{" "}
                {payOrPaidString(record?.totalExpense, record?.totalPaid)}{" "}
              </Text>
              <Text>Rs Paid: {record?.totalPaid || 0}</Text>
              <Text>Expense: {record?.totalExpense || 0}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <View style={{flex:1,flexDirection:"row"}}>
            <View style={{flex:1}}>

              <Text >Users</Text>
            </View>
            <View style={{flex:2}}>
              <Button onPress={handleAddNewUser} style={tw`justify-self-end`}> Add New
              </Button>
            </View>


          </View>
          <Card.Divider />
          <FlatList
            data={groupUser}
            renderItem={({ item }) => (
              <View style={[styles.container, styles.row]}>
                <View style={{ flex: 3 }}>
                  <Text>{item.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.amount || 0}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.name}
          />
        </Card>
        <Card>
          <View style={{ flex: 1, flexDirection: "row" }}>

            <View style={{ flex: 1 }}>
              <Text>Transaction</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Button onPress={handleTransaction}>Add New </Button>
            </View>

            <Card.Divider />
          </View>
          
          <View>
            <FlatList
              data={groupTransaction}
              renderItem={({ item }) => (
                <View key={item?.id} style={[styles.container, styles.row]}>
                  <View style={{ flex: 3 }}>
                    <Text>{item.remarks || ""}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>{item.amount || 0}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </Card>
        {modal && (
          <Dialog
            isVisible={modal}
            onBackdropPress={() => {
              setModal((prev) => !prev);
            }}
          >
            <Dialog.Title title="Add User to Group" />
            <Text>Name</Text>
            <Input
              placeholder="ex. Abhishek "
              errorStyle={{ color: "red" }}
              errorMessage={false && "ENTER A VALID ERROR HERE"}
              onChangeText={setInputName}
            />
            <View>
              <Button onPress={handleAddUserToGroup}>Add To Group</Button>
            </View>
          </Dialog>
        )}
        {modalTransaction && (
          <Dialog
            isVisible={modalTransaction}
            onBackdropPress={() => {
              setModalTransaction((prev) => !prev);
            }}
          >
            <Dialog.Title title="Add New Transaction" />

            <View>
              <Text>Amount</Text>
              <Input
                placeholder="00.00"
                errorStyle={{ color: "red" }}
                errorMessage={false && "ENTER A VALID ERROR HERE"}
                keyboardType="numeric"
                onChangeText={setAmount}
              />
              <Text>Remarks</Text>
              <Input
                placeholder="Remarks about transaction"
                errorStyle={{ color: "red" }}
                errorMessage={false && "ENTER A VALID ERROR HERE"}
                onChangeText={setRemarks}
              />

              <Text>Paid By</Text>
              <SelectDropdown
                data={convertToSelectData(groupUser)}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setPaidBy(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown

                  return item;
                }}
              />
              <Text>Transaction Date</Text>
              <TouchableOpacity onPress={handleDatePicker}>
                <Text>
                  {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 216 }}>
              <CheckBoxStack
                onChange={setTransactionUser}
                options={convertToCheckboxData(groupUser)}
              />
            </ScrollView>
            <View>
              <Button onPress={handleNewTransaction}>Create</Button>
            </View>
          </Dialog>
        )}
        {showDateTimePicker && (
          <DateTimePicker value={date} onChange={handleDateChange} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   backgroundColor: "#000",
    //   alignItems: "center",
    //   justifyContent: "center",
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
});

export default Group;
