import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dialog, Icon, Input, ListItem, Button } from '@rneui/themed';
import { FlatList } from 'react-native';
import firebase from '../database/configDB';
import { screens } from '.';

const DATA = [
    
    { id: 1, title: "AS Dhull" },
    { id: 2, title: "AS Ramrai" },
];


const Groups = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const groupsRef = firebase.firestore().collection('groups');

const [createGroupModal, setCreateGroupModal] = useState(false)
const [groups, setGroups] = useState([])
const [groupName, setGroupName] = useState("")
const [groupDescription, setGroupDescription] = useState("")
  const Item = ({title,onPress,key}) => {
    return (
      <ListItem key={key} onPress={onPress}>
        <Icon name="inbox" type="material-community" color="grey" />
        <ListItem.Content>
          <ListItem.Title>{title}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };
  const handleCreateGroup = ()=>{
    if(groupName.length && user?.uid){
    groupsRef.add({
      name: groupName || "Anonymous",
      description: groupDescription || "",
      isActive:true,
      createdBy:user?.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch((err)=>{
      Alert.alert(err.message)
    })
  }
    setGroupName("")
    setCreateGroupModal((prev) => false)
  }

  useEffect(() => {
    const unsubscribe = groupsRef.onSnapshot(querySnapshot => {
      const arr =[]
      querySnapshot.forEach(documentSnapshot => {
        arr.push({id:documentSnapshot.id,...documentSnapshot.data()})
      });
      setGroups(arr)
    });
    return () => unsubscribe() 
  }, []);


    // processGroupTransaction()

  const handleCreateGroupModal = ()=>{
    setCreateGroupModal((prev) => true)
  }

  return (
    <View>
      <Button onPress={handleCreateGroupModal} >Create Group</Button>
      <FlatList
        data={groups}
        renderItem={({ item }) => <Item key={item.id} onPress={()=>{navigation.navigate(screens.GROUP,{group:item})}} title={item.name} />}
        keyExtractor={(item) => item.id}
      />
      {createGroupModal && 
            <Dialog
            isVisible={createGroupModal}
            onBackdropPress={() => {
              setCreateGroupModal((prev) => !prev);
            }}
          >
            <Dialog.Title title="Create New Group" />
            <Text>Group Title</Text>
            <Input
              placeholder="group name"
              errorStyle={{ color: "red" }}
              errorMessage={false && "ENTER A VALID ERROR HERE"}
              onChangeText = {(value)=>setGroupName(value)}
            />
            <Input
              placeholder="group description"
              errorStyle={{ color: "red" }}
              errorMessage={false && "ENTER A VALID ERROR HERE"}
              onChangeText = {(value)=>setGroupDescription(value)}
            />
            <View>
              <Button onPress={handleCreateGroup}>Create</Button>
            </View>
          </Dialog>
      }
    </View>
  );
};

export default Groups;