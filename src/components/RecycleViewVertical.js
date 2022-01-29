import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from '../../constants/RouteNames';
import FastImage from 'react-native-fast-image'

const SCREEN_WIDTH = Dimensions.get('window').width;

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};
export default class RecycleViewVertical extends Component {
    constructor(props) {
        super(props)


         this.movies = [];
    for(let i = 0; i < this.props.movie.length; i++) {
      if(this.props.movie[i].dvd_thumbnail_link){

        this.movies.push({
          type: 'NORMAL',
          item: this.props.movie[i],
        });
      }
    }
        this.state = {
            list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.movies),
          };
          this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          }, (type, dim) => {
            switch (type) {
              case 'NORMAL': 
                dim.width = SCREEN_WIDTH * .32;
                dim.height = SCREEN_WIDTH * .48;
                break;
              default: 
                dim.width = 0;
                dim.height = 0;
                break;
            };
          })
        this.rowRenderer = (type, item) => {
          const { dvd_thumbnail_link, _id, film_type, title, wide_thunbnail_link } = item.item;
          //console.log('iteeem',item);
          if (dvd_thumbnail_link) {
            return (
                <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate(MOVIEDETAIL, {
                    selectedMovie: _id,
                    isSeries: film_type,
                    seriesTitle: title,
                  })
                }
              >
                <FastImage
                  style={{
                    width: SIZES.width * 0.3,
                    height: SIZES.width * 0.45,
                    borderRadius: 2,
                  }}
                  source={{ uri: dvd_thumbnail_link }}
                />
              </TouchableWithoutFeedback>
            )
          }
        }
        }
        render() {
            let heights;
            if(this.props.movie.length > 3 && this.props.movie.length % 3 !== 0) {
              heights = (SIZES.width * 0.45) * (this.props.movie.length / 3) + SIZES.width * 0.7 ;
            } else if (this.props.movie.length > 3 && this.props.movie.length % 3 === 0) {
              heights = (SIZES.width * 0.5) * (this.props.movie.length / 3);
            } else {
             heights =  SIZES.width * 0.7 
            }

           console.log('movies', heights);
            return (
              <View style={styles.container}>
                <RecyclerListView
                isHorizontal={false}
                  style={{ height: heights, width: SIZES.width}}
                  rowRenderer={this.rowRenderer}
                  dataProvider={this.state.list}
                  layoutProvider={this.layoutProvider}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            );
          }
        }
        
        const styles = StyleSheet.create({
          container: {
            backgroundColor: 'black',
            minHeight: 1,
            minWidth: 1,
            marginVertical: 3
            
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
        