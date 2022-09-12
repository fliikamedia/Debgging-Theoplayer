import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-spinkit";
import { SIZES } from "../constants";
import LinearGradient from "react-native-linear-gradient";
import { MOMOPASS } from "../constants/RouteNames";

const MomoPassClientDetails = ({ navigation, route }) => {
  const [userCurrency, setUserCurrency] = useState("GHS");
  const [currency, setCurrency] = useState(userCurrency);
  const [localPrice, setLocalPrice] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const exchange_url = `https://api.apilayer.com/exchangerates_data/convert?to=${userCurrency}&from=USD&amount=${conversionAmount}`;
  const { conversionAmount, planNickname } = route.params;
  const data = [
    { label: "GHS", value: "GHS" },
    { label: "KES", value: "KES" },
    { label: "RWF", value: "RWF" },
    { label: "UGX", value: "UGX" },
    { label: "TSZ", value: "TSZ" },
    { label: "ZMW", value: "ZMW" },
    { label: "XOF", value: "XOF" },
    { label: "XAF", value: "XAF" },
    { label: "MWK", value: "MWK" },
  ];

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const getUserLocation = async () => {
    await axios
      .get(
        "https://ipgeolocation.abstractapi.com/v1/?api_key=1a9aca489f7a4011bf341eb6c3883062"
      )
      .then((response) => {
        //console.log(response.data.currency.currency_code)
        setUserCurrency(response.data.currency.currency_code);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // useEffect(() => {
  //   getUserLocation();
  //   return () => getUserLocation();
  // }, []);
  useEffect(() => {
    if (!userCurrency) return;
    getLocalCurrencyRate();
    return () => getLocalCurrencyRate();
  }, [userCurrency, value]);
  const getLocalCurrencyRate = async () => {
    await axios
      .get(
        `https://api.apilayer.com/exchangerates_data/convert?to=${userCurrency}&from=USD&amount=${conversionAmount}`,
        {
          headers: {
            apikey: "BDNDzZTdhlTDbVM6HAjERXBTHJcGPWOw",
          },
        }
      )
      .then((response) => {
        //console.log("conversion =>", response.data.result)
        setLocalPrice(response.data.result);
        setValue(userCurrency);
        setIsReady(true);
      })
      .catch((err) => {
        console.log("err", err);
        setIsReady(true);
      });
  };
  console.log("converted price", value, localPrice);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  if (!isReady) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner
          isVisible={!isReady}
          size={70}
          type={"ThreeBounce"}
          color={"#fff"}
        />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.planDescription}>
        <Text style={styles.planTitle}>Your Plan</Text>
        <Text
          style={styles.planDesc}
        >{`${planNickname} $${conversionAmount} (${Math.round(
          localPrice
        )}${userCurrency})`}</Text>
        <Text style={styles.enterDetails}>Enter Your Payment Details</Text>
        <View style={styles.inputsContainer}>
          <View style={styles.inputItemContainer}>
            <Text style={styles.inputLael}>Select Currency</Text>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={{
                TextStyle: { color: "white" },
              }}
              iconStyle={styles.iconStyle}
              containerStyle={styles.itemContainer}
              data={data}
              statusBarIsTranslucent={true}
              activeColor="#404040"
              // search
              // maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={userCurrency}
              // searchPlaceholder="Search..."
              dropdownPosition="down"
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setIsReady(false);
                setValue(item.value);
                setUserCurrency(item.value);
                setIsFocus(false);
              }}
              renderItem={(item) => renderItem(item)}
              // renderLeftIcon={() => (
              //   <AntDesign
              //     style={styles.icon}
              //     color={isFocus ? "blue" : "black"}
              //     name="Safety"
              //     size={20}
              //   />
              // )}
            />
          </View>
          <View style={styles.inputItemContainer}>
            <Text style={styles.inputLael}>Full Name</Text>
            <TextInput
              keyboardType="default"
              placeholder=""
              style={styles.inputStyle}
              value={fullName}
              onChangeText={(val) => setFullName(val)}
              autoCorrect={false}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputItemContainer}>
            <Text style={styles.inputLael}>Email</Text>
            <TextInput
              keyboardType="email-address"
              placeholder=""
              style={styles.inputStyle}
              value={email}
              onChangeText={(val) => setEmail(val)}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputItemContainer}>
            <Text style={styles.inputLael}>Phone Number</Text>
            <TextInput
              keyboardType="numeric"
              placeholder=""
              style={styles.inputStyle}
              value={phoneNumber}
              onChangeText={(val) => setPhoneNumber(val)}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>
        <LinearGradient
          style={styles.confirmBtn}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["#000428", "#004e92", "#000428"]}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(MOMOPASS, {
                userCurrency: value,
                email,
                fullName,
                phoneNumber,
                amountToPay: Math.round(localPrice),
              })
            }
            disabled={!value || !fullName || !email || !phoneNumber}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    // alignItems: "center",
  },
  planDescription: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  planTitle: {
    fontFamily: "Sora-Regular",
    fontSize: 28,
    color: "#fff",
    marginBottom: 10,
  },
  planDesc: {
    fontFamily: "Sora-Regular",
    fontSize: 20,
    color: "#A9A9A9",
    marginBottom: 30,
  },
  inputsContainer: {
    // backgroundColor: "red",
    // flex: 1,
    // width: "100%",
    alignItems: "center",
  },
  inputItemContainer: {
    alignItems: "flex-start",
    width: SIZES.width * 0.8,
    marginBottom: 20,
  },
  enterDetails: {
    fontFamily: "Sora-Regular",
    fontSize: 20,
    color: "#fff",
    marginBottom: 30,
  },
  dropdown: {
    // height: 50,
    // borderColor: "gray",
    // borderWidth: 0.5,
    // borderRadius: 8,
    // paddingHorizontal: 8,
    // width: 140,
    height: 60,
    backgroundColor: "black",
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    width: "100%",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#fff",
    // marginLeft: 5,
  },
  selectedTextStyle: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 5,
    fontFamily: "Sora-Regular",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    // height: 40,
    // fontSize: 16,
  },
  itemContainer: {
    backgroundColor: "#202020",
  },
  spinnerContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLael: {
    color: "#fff",
    fontFamily: "Sora-Regular",
  },
  inputStyle: {
    width: "100%",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  textItem: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 20,
    paddingLeft: 10,
  },
  confirmBtn: {
    backgroundColor: "teal",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  confirmText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Sora-Regular",
  },
});
export default MomoPassClientDetails;
