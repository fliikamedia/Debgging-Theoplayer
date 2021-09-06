import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from '../../constants/RouteNames';
const SCREEN_WIDTH = Dimensions.get('window').width;
const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};
export default class RecycleView extends Component {
    constructor(props) {
        super(props)


        const movies = [];
    for(i = 0; i < 100; i+= 1) {
      movies.push({
        type: 'NORMAL',
        item: props.movie,
      });
    }
        this.state = {
            list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(props.movie),
          };
          this.layoutProvider = new LayoutProvider(
            index => {
                if (index % 3 === 0) {
                    return ViewTypes.FULL;
                } else if (index % 3 === 1) {
                    return ViewTypes.HALF_LEFT;
                } else {
                    return ViewTypes.HALF_RIGHT;
                }
            },
            (type, dim) => {
                switch (type) {
                    case ViewTypes.HALF_LEFT:
                        dim.width = SCREEN_WIDTH;
                        dim.height = 160;
                        break;
                    case ViewTypes.HALF_RIGHT:
                        dim.width = SCREEN_WIDTH / 2;
                        dim.height = 160;
                        break;
                    case ViewTypes.FULL:
                        dim.width = SCREEN_WIDTH;
                        dim.height = 140;
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                }
            }
        );

        this.rowRenderer = (type, item) => {
          //  const { image, name, description } = data.item;
          if (item.dvd_thumbnail_link) {
            return (
                <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate(MOVIEDETAIL, {
                    selectedMovie: item._id,
                    isSeries: item.film_type,
                    seriesTitle: item.title,
                  })
                }
              >
                <Image
                  style={{
                    width: SIZES.width * 0.3,
                    height: SIZES.width * 0.45,
                    borderRadius: 20,
                    marginHorizontal: 5,
                    resizeMode: "contain",
                  }}
                  source={{ uri: item.dvd_thumbnail_link }}
                />
              </TouchableWithoutFeedback>
            )
          }
        }
        }

        render() {
            console.log(this.props.movie.length);
            return (
              <View style={styles.container}>
                <RecyclerListView
                  style={{flex: 1}}
                  rowRenderer={this.rowRenderer}
                  dataProvider={this.state.list}
                  layoutProvider={this.layoutProvider}
                />
              </View>
            );
          }
        }
        
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: '#FFF',
            minHeight: 1,
            minWidth: 1,
          },
          body: {
            marginLeft: 10,
            marginRight: 10,
            maxWidth: SCREEN_WIDTH - (80 + 10 + 20),
          },
          image: {
            height: 80,
            width: 80,
          },
          name: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          description: {
            fontSize: 14,
            opacity: 0.5,
          },
          listItem: {
            flexDirection: 'row',
            margin: 10,
          },
        });
        