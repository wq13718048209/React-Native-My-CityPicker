# React-Native-My-CityPicker
A component of the selector, which is available for android and IOS, is still being tested.

npm i react-native-my-citypicker --save   or  yarn add react-native-citypicker
react-native link react-native-my-citypicker

Let me just write an example.

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

 import {AndroidCityPicker,IosCityPicker} from 'react-native-my-citypicker';
export default class App extends Component {

    state={
        show:false,
        city:''
    }

  render() {
    return (
        <View style={{flex:1}}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:20}} onPress={()=>this.onPress()}>点击</Text>
            <View style={{flexDirection:'row',marginTop:30}}>
              <Text>{this.state.city}</Text>
            </View>

          </View>
          {this.state.show ?
              <IosCityPicker
                  selected={(selectedProvince,selectedCity,selectedArea)=>
                      this.setState({
                          city:selectedProvince+selectedCity+selectedArea,
                          show:false
                      })}
              cancel={()=>this.setState({show:false})}/>
              :null
          }
        </View>
    );
  }

    onPress(){

        Platform.OS==='ios'? this.setState({
                show:true
            }):

        AndroidCityPicker.showCityPicker((data)=>{
            this.setState({
                city:data
            })
        })

    }
}

const styles = StyleSheet.create({
    topView:{
      width:width,
        height:50,
        backgroundColor:'#F0F1F3',
        flexDirection:'row',
        alignItems:'center'
    },
    leftButton:{
        flex:1,
        width:width/3,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonTitle:{
      fontSize:16,
        color:'blue'
    },
    title:{
      fontSize:18
    }
});


This is just one of the most simple example, there are many properties of the unfolding and will continue to finished. Next AnZhuoDuan is native to write, so to ensure the fluency. IOS using ReactNative component, is also very smooth.

