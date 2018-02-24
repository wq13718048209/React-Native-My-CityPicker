# React-Native-My-CityPicker
A component of the selector, which is available for android and IOS, is still being tested.

npm i react-native-my-citypicker --save   or  yarn add react-native-citypicker
react-native link react-native-my-citypicker

Let me just write an example.

import {AndroidCityPicker,IosCityPicker} from 'react-native-my-citypicker';

class App extends Component {

    state={
        show:false,
        city:''
    }
   
    render(){
      return(
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
     )
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

This is just one of the most simple example, there are many properties of the unfolding and will continue to finished. Next AnZhuoDuan is native to write, so to ensure the fluency. IOS using ReactNative component, is also very smooth.

