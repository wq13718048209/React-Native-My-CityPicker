package com.example.react_native_citypicker.bean;

import android.graphics.Color;
import android.util.Log;
import android.view.View;

import com.bigkoo.pickerview.OptionsPickerView;
import com.bigkoo.pickerview.TimePickerView;
import com.example.react_native_citypicker.bean.JsonBean;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.google.gson.Gson;

import org.json.JSONArray;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;


/**
 * Created by wangqiang on 2018/1/30.
 */

public class RnPickerView extends ReactContextBaseJavaModule{

    public static final String REACT_CLASS = "com.example.react_native_citypicker.bean.RnPickerView";
    private TimePickerView timePickerView;

    private ArrayList<JsonBean> options1Items = new ArrayList<>();
    private ArrayList<ArrayList<String>> options2Items = new ArrayList<>();
    private ArrayList<ArrayList<ArrayList<String>>> options3Items = new ArrayList<>();


    public RnPickerView(ReactApplicationContext reactContext) {
        super(reactContext);

    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }


    /**
     * 接受一个自定义的数组
     * @param readableArray
     * @param callback
     */
    @ReactMethod
    public void showCustomPicker(final ReadableArray readableArray, final Callback callback){

        Log.i("Tag", String.valueOf(readableArray));


        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                OptionsPickerView pvOptions= new OptionsPickerView.Builder(getCurrentActivity(), new OptionsPickerView.OnOptionsSelectListener() {
                    @Override
                    public void onOptionsSelect(int options1, int options2, int options3, View v) {
                        String tx = readableArray.getString(options1);
                        callback.invoke(tx);
                    }
                }).build();

                pvOptions.setPicker(readableArray.toArrayList());
                pvOptions.show();
            }
        });
    }

    /**
     * 时间
     * @param callback
     */
    @ReactMethod
    public void showTimePicker(final Callback callback){

         getCurrentActivity().runOnUiThread(new Runnable() {
             @Override
             public void run() {
                 timePickerView = new TimePickerView.Builder(getCurrentActivity(), new TimePickerView.OnTimeSelectListener() {
                     @Override
                     public void onTimeSelect(Date date, View v) {
                            callback.invoke(getTime(date));
                     }
                 }).build();
                 timePickerView.setDate(Calendar.getInstance());
                 timePickerView.show();
             }
         });

    }

    private String getTime(Date date) {//可根据需要自行截取数据显示
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date);
    }

    /**
     * 城市
     * @param callback
     */
    @ReactMethod
    public void  showCityPicker(final Callback callback){

        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                initJsonData();
                OptionsPickerView pvOptions = new OptionsPickerView.Builder(getCurrentActivity(), new OptionsPickerView.OnOptionsSelectListener() {
                    @Override
                    public void onOptionsSelect(int options1, int options2, int options3, View v) {
                        String tx = options1Items.get(options1).getPickerViewText()+
                                options2Items.get(options1).get(options2)+
                                options3Items.get(options1).get(options2).get(options3);
                        callback.invoke(tx);
                    }
                }).setTitleText("城市选择").setDividerColor(Color.BLACK)
                        .setTextColorCenter(Color.BLACK) //设置选中项文字颜色
                        .setContentTextSize(20)
                        .build();
                /*pvOptions.setPicker(options1Items);//一级选择器
                pvOptions.setPicker(options1Items, options2Items);//二级选择器*/
                pvOptions.setPicker(options1Items,options2Items,options3Items);//三级选择器
                pvOptions.show();
            }
        });
    }


    private void initJsonData() {//解析数据

        /**
         * 注意：assets 目录下的Json文件仅供参考，实际使用可自行替换文件
         * 关键逻辑在于循环体
         *
         * */
        String JsonData = new GetJsonDataUtil().getJson(getCurrentActivity(),"province.json");//获取assets目录下的json文件数据

        ArrayList<JsonBean> jsonBean = parseData(JsonData);//用Gson 转成实体

        /**
         * 添加省份数据
         *
         * 注意：如果是添加的JavaBean实体，则实体类需要实现 IPickerViewData 接口，
         * PickerView会通过getPickerViewText方法获取字符串显示出来。
         */
        options1Items = jsonBean;

        for (int i=0;i<jsonBean.size();i++){//遍历省份
            ArrayList<String> CityList = new ArrayList<>();//该省的城市列表（第二级）
            ArrayList<ArrayList<String>> Province_AreaList = new ArrayList<>();//该省的所有地区列表（第三极）

            for (int c=0; c<jsonBean.get(i).getCityList().size(); c++){//遍历该省份的所有城市
                String CityName = jsonBean.get(i).getCityList().get(c).getName();
                CityList.add(CityName);//添加城市

                ArrayList<String> City_AreaList = new ArrayList<>();//该城市的所有地区列表

                //如果无地区数据，建议添加空字符串，防止数据为null 导致三个选项长度不匹配造成崩溃
                if (jsonBean.get(i).getCityList().get(c).getArea() == null
                        ||jsonBean.get(i).getCityList().get(c).getArea().size()==0) {
                    City_AreaList.add("");
                }else {

                    for (int d=0; d < jsonBean.get(i).getCityList().get(c).getArea().size(); d++) {//该城市对应地区所有数据
                        String AreaName = jsonBean.get(i).getCityList().get(c).getArea().get(d);

                        City_AreaList.add(AreaName);//添加该城市所有地区数据
                    }
                }
                Province_AreaList.add(City_AreaList);//添加该省所有地区数据
            }

            /**
             * 添加城市数据
             */
            options2Items.add(CityList);

            /**
             * 添加地区数据
             */
            options3Items.add(Province_AreaList);
        }

    }



    public ArrayList<JsonBean> parseData(String result) {
        ArrayList<JsonBean> detail = new ArrayList<>();
        try {
            JSONArray data = new JSONArray(result);
            Gson gson = new Gson();
            for (int i = 0; i < data.length(); i++) {
                JsonBean entity = gson.fromJson(data.optJSONObject(i).toString(), JsonBean.class);
                detail.add(entity);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return detail;
    }

}
