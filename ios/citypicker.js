import React, {Component} from 'react'
import {
    View,
    Text,
    Picker,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native'
// 读取本地json文件
let jsonData = require('./province.json');
const {width, height} = Dimensions.get('window');
export default class CityPicker extends Component {

    // 定义默认属性
    static defaultProps = {
        // 默认显示北京(省)
        selectedProvince: '北京',
        // 默认显示北京省会市)
        selectedCity: '北京',
        // 默认显示(区)
        selectedArea: '东城区',
        //标题
        title:'城市选择',
        //左边
        leftButtonTitle:'取消',
        //右边
        rightButtonTitle:'确认'
    }

    // 通过 state 更新
    constructor(props) {
        super(props);

        this.state={
            // 省
            province: [],
            // 市
            city: [],
            // 区
            area: [],
            // 选中的省
            selectedProvince: this.props.selectedProvince,
            // 选中的市
            selectedCity: this.props.selectedCity,
            // 选中的地区
            selectedArea: this.props.selectedArea,
        }
    }

    // 获取全国省: ['省1', '省2', '省3'......]
    getProvince() {
        let result = [];
        for (let code in jsonData) {
            result.push(jsonData[code].name);
        }
        return result;
    }

    // 获取各个省的城市[['省1-城市1', '省1-城市2', '省1-城市3'......],['省2-城市1', '省2-城市2', '省2-城市3'......]]
    getProvinceCity(province) {
        let  result = [];
        let  cityData = [];

        for (let code in jsonData) {

            let temp = jsonData[code].name;
            if (temp == province) {
                cityData = jsonData[code].city
                for (let j in cityData) {
                    result.push(cityData[j].name);
                }
                break;
            }
        }

        return result;
    }

    // 获取各个省的城市[['省1-城市1-区1', '省1-城市1-区2', '省1-城市1-区3'......]......]
    getProvinceCityArea(province, city) {

        let result = [];
        let cityData = [];

        for (let code in jsonData) {

            let tempProvince = jsonData[code].name;
            if (tempProvince == province) {

                cityData = jsonData[code].city
                for (let j in cityData) {
                    let tempCity = cityData[j].name

                    // console.log('查询省: ' + tempProvince + '    查询城市: ' + city)

                    if (tempCity == city) {

                        result = cityData[j].area;
                        // console.log('查询区: ' + result)

                        break;
                    }
                }
            }
        }

        return result;
    }


    componentDidMount() {

        let province = this.getProvince();
        this.state.selectedProvince = province[0];

        let city = this.getProvinceCity(this.state.selectedProvince)
        this.state.selectedCity = city[0]

        let area = this.getProvinceCityArea(this.state.selectedProvince, this.state.selectedCity)
        this.state.selectedArea = area[0]


        this.setState({
            province: province,
            city: city,
            area: area
        });
    }

    updateProvince(param) {

        let cityData = this.getProvinceCity(param)
        let defaultCity = cityData[0]

        let areaData = this.getProvinceCityArea(param, defaultCity)
        let defaultArea = areaData[0]

        this.setState({
            selectedProvince: param,
            selectedCity: defaultCity,
            selectedArea: defaultArea,
            city: cityData,
            area: areaData,

        })
    }

    updateProvinceCity(city) {

        let areaData = this.getProvinceCityArea(this.state.selectedProvince, city);
        let defaultArea = areaData[0]

        // console.log(this.state.selectedProvince, city, areaData)

        this.setState({
            selectedCity: city,
            selectedArea: defaultArea,
            area: areaData,

        })
    }

    updateProvinceCityArea(area) {

        this.setState({
            selectedArea: area,

        })
    }

    renderPicker(key, i) {

        return <Picker.Item key={i} label={key} value={key} />
    }

    render() {

        const {styleTopView,styleLeftButton,styleTitle,styleRightButton} = this.props;

        return (
            <TouchableOpacity
                onPress={this.props.cancel}
                style={styles.container}>
                <View style={[styles.topView,styleTopView]}>
                    <TouchableOpacity
                        onPress={this.props.cancel}
                            style={styles.leftButton}><Text style={[styles.title,styleLeftButton]}>{this.props.leftButtonTitle}</Text></TouchableOpacity>
                            <View style={styles.leftButton}><Text style={[{fontSize:18},styleTitle]}>{this.props.title}</Text></View>
                            <TouchableOpacity
                            onPress={()=>this.props.selected(this.state.selectedProvince,this.state.selectedCity,this.state.selectedArea)}
                        style={styles.leftButton}><Text style={[styles.title,styleRightButton]}>{this.props.rightButtonTitle}</Text></TouchableOpacity>
                </View>
                <View style={styles.pickerViewContainer}>
                    <Picker style={{flex: 1}}
                            selectedValue={this.state.selectedProvince}
                            onValueChange={(language) => this.updateProvince(language)}>
                        {this.state.province.map((key, i) => this.renderPicker(key, i))}
                    </Picker>
                    <Picker style={styles.pickerItem}
                            selectedValue={this.state.selectedCity}
                            onValueChange={(language) => this.updateProvinceCity(language)}>
                        {this.state.city.map((key, i) => this.renderPicker(key, i))}
                    </Picker>
                    <Picker style={{flex: 1}}
                            selectedValue={this.state.selectedArea}
                            onValueChange={(area) => this.updateProvinceCityArea(area)}>
                        {this.state.area.map((key, i) => this.renderPicker(key, i))}
                    </Picker>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent:'flex-end',
        backgroundColor:'rgba(0,0,0,0.5)',
        position:'absolute',
        top:0,
        left:0,
        width:width,
        height:height
    },
    topView:{
        width:width,
        height:50,
        backgroundColor:'#F0F1F3',
        flexDirection:'row',
        alignItems:'center'
    },
    text: {
        width: 200,
        height: 60,
        marginTop: 100,
        backgroundColor: 'white',
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    pickerViewContainer: {
        flexDirection: 'row',
        backgroundColor:'#D0D5DC'
    },
    pickerItem: {
        flex: 1,
    },
    leftButton:{
        flex:1,
        width:width/3,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    title:{
       fontSize:18,
       color:'#41aaff'
    }
})