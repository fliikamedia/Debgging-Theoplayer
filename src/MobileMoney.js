import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import MobileMoneyPassCard from "./components/MobileMoneyPassCard";
import LinearGradient from "react-native-linear-gradient";
const MobileMoney = () => {
  //   const exchange_url = `https://api.apilayer.com/exchangerates_data/convert?to=${userCurrency}&from=USD&amount=${conversionAmount}`;
  //   const key = "BDNDzZTdhlTDbVM6HAjERXBTHJcGPWOw";
  const mobileMoneyPasses = [
    {
      nickname: "1 Month Pass",
      unit_amount: "$6.99",
      trialText: "Get All Access for 30days",
      description: "Create up to 5 profiles for family members and loved ones",
      id: 0,
      conversionAmount: 6.99,
      planNickname: "Monthly Pass",
    },
    {
      nickname: "6 Months Pass",
      unit_amount: "$29.99",
      trialText: "Get All Access for 6months",
      description: "Create up to 5 profiles for family members and loved ones",
      id: 1,
      conversionAmount: 29.99,
      planNickname: "6 Months Pass",
    },
    {
      nickname: "12 Months Pass",
      unit_amount: "$49.99",
      trialText: "Get All Access for a full year",
      description: "Create up to 5 profiles for family members and loved ones",
      id: 2,
      conversionAmount: 49.99,
      planNickname: "Yearly Pass",
    },
  ];

  const showMobileMoneyPasses = () => {
    return (
      <View>
        {mobileMoneyPasses.map((pass, index) => (
          <MobileMoneyPassCard
            key={index}
            plan={pass?.nickname}
            trialText={pass.trialText}
            price={pass?.unit_amount}
            description="Create up to 5 profiles for family members and loved ones"
            btnText="Buy Access"
            id={pass.id}
            conversionAmount={pass.conversionAmount}
            planNickname={pass.planNickname}
          />
        ))}
      </View>
    );
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#141a5c", "#218ae3", "#0d0526"]}
        style={{ flex: 1, justifyContent: "center" }}
      >
        {showMobileMoneyPasses()}
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
export default MobileMoney;
