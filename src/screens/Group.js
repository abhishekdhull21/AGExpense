import { View, Text, StyleSheet, Pressable, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Card,  Dialog, Input } from "@rneui/themed";
import { FlatList } from "react-native";
import { now } from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from "../database/configDB";
import CheckBoxStack from "../components/CheckBoxStack";
import { screens } from ".";

const Group = ({ navigation, route }) => {
  const {group} = route.params;
  const [modal, setModal] = useState(false);
  const [modalTransaction, setModalTransaction] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState();
  const [loadGroup, setLoadGroup] = useState(false);
  const [remarks, setRemarks] = useState();
  const [transactionUser, setTransactionUser] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [groupUser, setGroupUser] = useState([]);
  const [groupTransaction, setGroupTransaction] = useState([]);
  const [inputName, setInputName] = useState();
  const groupRef = firebase.firestore().collection("groups");

  const handleAddNewUser = () => {
    setModal((pre) => !pre);
  };
  const handleGroupUser = () => {

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
    setShowDateTimePicker(true)
  };
  const handleTransaction = () => {
    setModalTransaction(prev => !prev)
  };

  
  const handleDateChange = (e,date) => {
    setDate(date);
    setShowDateTimePicker(false)
  }
  const handleNewTransaction = () => {
    console.log(
      "idf ",
      group.id,
      "amt",
      amount,
      "ln",
      Object.keys(transactionUser).length
    );
    if (group.id && amount && Object.keys(transactionUser).length) {
      groupRef
        .doc(group?.id)
        .update({
          transactions: firebase.firestore.FieldValue.arrayUnion({
            amount: amount,
            remarks,
            paid_by: "",
            users: transactionUser,
            at: date,
          }),
        })
        .then((v) => {
          setLoadGroup(true)
          Alert.alert("Transaction added");
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
          setLoadGroup(true)
          Alert.alert("User added");
        })
        .catch((err) => {
          Alert.alert(err.message);
        });
    }
    setModal(false);
  };

  useEffect(()=>{
    const user = firebase.auth().currentUser;
    if(user?.uid && user?.uid != ""){
      setCurrentUser(user);
    }else{
      navigation.navigate(screens.LOGIN)
    }
  },[])

  useEffect(()=>{
    setGroupTransaction(group.transaction ||group.transactions || [])
    setGroupUser(group.users || [])
  },[])
  useEffect(() => {
    groupRef.doc(group.id).onSnapshot((documentSnapshot) => {
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        setGroupUser(data?.users)
        setGroupTransaction(data?.transactions || data?.transaction)
      } else {
        console.log("group not found");
      }
    });
  }, [loadGroup]);

  return (
    <View style={[styles.container]}>
      <Card>
        <Card.Title style={{ alignContent: "space-between" }}>
          <Text style={{ flex: 4 }}>Users</Text>
          <Button onPress={handleAddNewUser} style={{ flex: 1 }}>
            Add New
          </Button>
        </Card.Title>
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
        <Card.Title>Transactions</Card.Title>
        <Card.Divider />
        <Button onPress={handleTransaction}>Add New </Button>
        <View>
          <FlatList
            data={groupTransaction}
            renderItem={({ item }) => (
              <View style={[styles.container, styles.row]}>
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
            <Text>Transaction Date</Text>
            <TouchableOpacity onPress={handleDatePicker}>
              <Text>
                {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
              </Text>
            </TouchableOpacity>
          </View>
          <CheckBoxStack
          onChange={setTransactionUser}
            options={[
              { title: "Abhishek", key: "abhishek" },
              { title: "Abhishek Dhull", key: "abhishek dhull" },
            ]}
          />
          <View>
            <Button onPress={handleNewTransaction}>Create</Button>
          </View>
        </Dialog>
      )}
      {showDateTimePicker && (
        <DateTimePicker value={date} onChange={handleDateChange} />
      )}
    </View>
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
