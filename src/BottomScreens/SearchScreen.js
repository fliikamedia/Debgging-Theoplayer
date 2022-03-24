import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import MoviesItem from "../components/MoviesItem";
import IconFeather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";

const SearchScreen = ({ navigation }) => {
  const movies = useSelector((state) => state.movies);

  const [term, setTerm] = useState("");
  //console.log(movies.availableMovies[0]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTerm("");
    });
    return () => unsubscribe();
  }, [navigation]);
  let searchArray = [];
  try {
    for (let i = 0; i < movies.availableMovies.length; i++) {
      if (
        movies.availableMovies[i].title
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        movies.availableMovies[i].cast
          .toString()
          .replace(/,/g, " ")
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        movies.availableMovies[i].storyline
          .toLowerCase()
          .includes(term.toLowerCase())
      ) {
        searchArray.push(movies.availableMovies[i]);
      }
    }
  } catch (err) {}

  let searchLength;
  try {
    searchLength = searchArray.length;
  } catch (err) {}
  const allMovies = new Array(...movies.availableMovies);

  const renderSearch = () => {
    if (term && searchLength > 0) {
      return searchArray.map((item) => {
        if (
          item.film_type == "movie" ||
          (item.film_type == "series" && item.episode_number == 1)
        ) {
          return (
            <MoviesItem
              navigation={navigation}
              movie={item}
              key={item._id}
              setTerm={setTerm}
            />
          );
        }
      });
    } else if (term && searchLength == 0) {
      return (
        <Text
          style={{
            fontFamily: "Sora-Regular",
            fontSize: 20,
            color: "aqua",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          No results match your search
        </Text>
      );
    } else {
      return Object.values(allMovies).map((item) => {
        if (
          item.film_type == "movie" ||
          (item.film_type == "series" && item.episode_number == 1)
        ) {
          return (
            <MoviesItem navigation={navigation} movie={item} key={item._id} />
          );
        }
      });
    }
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        //colors={["#003366", "#483D8B", "#4682B4"]}
        // colors={["#000020", "#000080", "#4682B4"]}
        colors={["#000025", "#000020", "black"]}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: "row",
            borderWidth: 2,
            borderColor: "teal",
            borderRadius: 10,
            width: "90%",
            alignItems: "center",
            marginTop: 50,
            alignSelf: "center",
            marginBottom: 10,
          }}
        >
          <IconFeather
            name="search"
            size={25}
            color="white"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            placeholderTextColor="white"
            style={styles.textInput}
            placeholder="Search by movie title, actor"
            onChangeText={(newTerm) => setTerm(newTerm)}
            value={term}
            autoCapitalize="none"
            autoCorrect={false}
            numberOfLines={1}
          />
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {renderSearch()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    height: 50,
    paddingHorizontal: 10,
    color: "white",
  },
  iconStyle: {
    fontSize: 35,
    alignSelf: "center",
    marginHorizontal: 15,
  },
});
export default SearchScreen;
