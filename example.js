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
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');
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
