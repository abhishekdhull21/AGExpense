import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import {CheckBox}  from "@rneui/themed";
import _ from "lodash"

const CheckBoxStack = ({
    onChange,
    options = []
}) => {
  const [checkedItem,setCheckedItem] = useState({}) 
  const checkBoxSwitch = (key, checked) => {
    const checkedItemClone = _.cloneDeep(checkedItem);
    checkedItemClone[key] = !checked;
    setCheckedItem((prev) => ({
      ...checkedItemClone,
    }));
  };
  const checked = (key)=>{
    return checkedItem[key]
  }

  useEffect(() => {
    if(typeof(onChange) === 'function'){
      onChange(checkedItem);
    }

  }, [checkedItem]);
  return (
    <>
        {options.map((item,index)=>{
          return (
            <CheckBox
              key={index}
              checked={ checked(item?.key || index)}
              onPress={()=>{
                checkBoxSwitch(item?.key || index, checkedItem[item.key || index])
              }}
              title={item?.title}
            />
          );
        })}
    </>
  );
}

export default CheckBoxStack