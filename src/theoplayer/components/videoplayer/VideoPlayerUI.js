import React, { useState, useEffect, useRef } from "react";
import {
  filterRenderableTracks,
  filterThumbnailTracks,
  MediaTrack,
  TextTrack,
} from "react-native-theoplayer";

import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  AppState,
} from "react-native";
import { SeekBar } from "../seekbar/SeekBar";
import styles from "./VideoPlayerUI.style";
import { DelayedActivityIndicator } from "../delayedactivityindicator/DelayedActivityIndicator";
import {
  FullScreenIcon,
  FullScreenExitIcon,
  SubtitlesIcon,
  AudioIcon,
  PlayButton,
  MutedIcon,
  UnMutedIcon,
  ListIcon,
  backAarrow,
  backwards,
  forwards,
  pause,
} from "../../res/images";
import { MenuButton } from "../menubutton/MenuButton";
import { MenuItem } from "../modalmenu/MenuItem";
import { getISO639LanguageByCode } from "../../utils/language/Language";
import { ActionButton } from "../actionbutton/ActionButton";
import { TimeLabel } from "../timelabel/TimeLabel";
// import type { VideoPlayerUIProps } from './VideoPlayerUIProps';
import { THUMBNAIL_MODE, THUMBNAIL_SIZE } from "./VideoPlayerUIProps";
import { ThumbnailView } from "../thumbnail/ThumbnailView";
// import type { SeekBarPosition } from '../seekbar/SeekBarPosition';
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import ForwardsSvg from "../../res/images/forwards.svg";
import BackwardsSvg from "../../res/images/backwards.svg";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import { THEOPLAYER } from "../../../../constants/RouteNames";
import AsyncStorage from "@react-native-community/async-storage";
import { SIZES } from "../../../../constants";
import { useSelector, useDispatch } from "react-redux";
import {
  addtoWatchedProfile,
  updateWatchedProfile,
} from "../../../../store/actions/user";
import moment from "moment";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
const VideoPlayerUI = ({
  style,
  sources,
  srcIndex,
  error,
  paused,
  muted,
  fullscreen,
  showLoadingIndicator,
  duration,
  seekable,
  currentTime,
  textTracks,
  selectedTextTrack,
  audioTracks,
  selectedAudioTrack,
  onSetPlayPause,
  onSetFullScreen,
  onSetMuted,
  onSelectTextTrack,
  onSelectAudioTrack,
  onSelectSource,
  onSeeks,
  watchedTime,
  nextEpisode,
  title,
  content_advisory,
  film_rating,
  recommendOne,
  recommendTwo,
  recommendThree,
  recommendFour,
}) => {
  const [screenClicked, setScreenClicked] = useState(false);
  const [seekingButton, setSeekingButton] = useState(false);
  const [isPlayNext, setIsPlayNext] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showedRating, setShowedRating] = useState(false);
  const [subtitleLabel, setSubtitleLabel] = useState("");
  const [hideRecommend, setHideRecommend] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  const timer = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const appState = useRef(AppState.currentState);
  // const { isNext } = route?.params;
  // console.log("isNext", isNext);
  // console.log(
  //   "isNext",
  //   duration,
  //   currentTime,
  //   Math.trunc(duration) === Math.trunc(currentTime)
  // );
  const onSeek = (time) => {
    if (onSeeks) {
      onSeeks(time);
    }
  };
  // console.log(
  //   "Paused ?",
  //   duration,
  //   watchedTime
  //   // nextEpisode && duration - currentTime < 10000 && paused
  // );
  // console.log("is next ", watchedTime);
  // console.log(
  //   recommendOne?.title,
  //   recommendTwo?.title,
  //   recommendThree?.title,
  //   recommendFour?.title
  // );
  // console.log("isPlayNext", nextEpisode.title, duration - currentTime);
  // console.log("watched at", watchedTime);
  // useEffect(() => {
  //   setIsPlayNext(isNext);
  // }, [isNext]);
  // console.log("routes", route);
  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", () => {
  //     // console.log("unfocussed");
  //     onSetPlayPause(true);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [appState]);

  const onPlayNext = async () => {
    await saveOnPlayNext();
    navigation.navigate(THEOPLAYER, {
      movieId: nextEpisode?._id,
      // isNext: true,
    });
    setIsPlayNext(true);
    // onSeeks(0);
    // unpauseVideo();
  };

  useEffect(() => {
    if (nextEpisode && duration - currentTime < 10000 && paused) {
      // console.log("neeext");
      onPlayNext();
    }

    // return () => onPlayNext();
  }, [currentTime, paused]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showedRating && !showLoadingIndicator) {
        setShowRating(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [showLoadingIndicator]);
  useEffect(() => {
    if (!showRating) return;
    const timer = setTimeout(() => {
      setShowRating(false);
      setShowedRating(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showRating]);
  useEffect(() => {
    if (isPlayNext) {
      // console.log("neeeext");
      // if (!watchedTime) {
      //   onSeek(0);
      // } else {
      //   onSeek(watchedTime);
      // }
      if (duration - watchedTime > 3000) {
        onSeek(watchedTime);
      } else {
        onSeek(0);
      }
      setTimeout(() => {
        onSetPlayPause(false);
        setIsPlayNext(undefined);
        setHideRecommend(false);
      }, 2000);
    }
  }, [isPlayNext, paused]);
  // const unpauseVideo = () => {
  //   console.log("next");
  //   setTimeout(() => {
  //     console.log("unpause");
  //     onSetPlayPause(!paused);
  //   }, 2000);
  // };
  // console.log("left", duration - currentTime < 10000);
  // console.log(watchedTime);
  // console.log(currentTime);
  // var myVar;

  // function myFunction() {
  //   myVar = setTimeout(() => {
  //     setScreenClicked(false);
  //   }, 2000);
  // }

  // useEffect(() => {
  //   onSetFullScreen(true);
  // }, []);
  // console.log("watchedTime", watchedTime);
  // useEffect(() => {
  //   setTimeout(() => {
  //     onSetPlayPause(true);
  //   }, 1000);
  // }, [title]);
  // console.log(watchedTime);
  const saveOnPlayNext = async () => {
    const whatTime = await AsyncStorage.getItem("watched");
    const whatDuration = await AsyncStorage.getItem("duration");
    const didPlay = await AsyncStorage.getItem("didPlay");
    const movieTitle = await AsyncStorage.getItem("movieName");
    const seasonNumber = await AsyncStorage.getItem("seasonNumber");
    const episodeNumber = await AsyncStorage.getItem("episodeNumber");
    const movieId = await AsyncStorage.getItem("movieId");

    const isWatchedMovie = await AsyncStorage.getItem("isWatchedBefore");
    const userId = await AsyncStorage.getItem("userId");
    const profileId = await AsyncStorage.getItem("profileId");

    if (didPlay == "true") {
      saveMovie(
        userId,
        profileId,
        Number(whatDuration),
        Number(whatTime),
        movieId,
        movieTitle,
        isWatchedMovie,
        Number(seasonNumber),
        Number(episodeNumber)
      );
    }
    if (Platform.OS == "android") {
      //console.log('focused', didPlay);
      if (didPlay === "true") {
        //ReactNativeBitmovinPlayerIntance.destroy();
        AsyncStorage.setItem("didPlay", "false");
        // console.log("focused", didPlay);
      }
    } else {
      // console.log('focused ios');
      //ReactNativeBitmovinPlayerIntance.pause()
    }

    AsyncStorage.setItem("watched", "0");
    AsyncStorage.setItem("duration", "0");
    AsyncStorage.setItem("isWatchedBefore", "null");
    AsyncStorage.setItem("movieId", "null");
    AsyncStorage.setItem("userId", "null");
    AsyncStorage.setItem("profileId", "null");
  };
  const saveMovie = (
    userId,
    profileId,
    duration,
    time,
    movieId,
    title,
    isWatchedMovie,
    seasonNumber,
    episodeNumber
  ) => {
    // console.log(
    //   "saving movie",
    //   duration,
    //   time,
    //   title,
    //   isWatchedMovie,
    //   seasonNumber,
    //   episodeNumber
    // );
    // console.log('iswatched',   isWatched(user.currentProfile.watched, title));
    if (time > 0) {
      if (isWatchedMovie === "false") {
        // console.log("here 1 series");
        addtoWatchedProfile(
          moment(),
          moment(),
          userId,
          movieId,
          title,
          duration,
          time,
          profileId,
          seasonNumber,
          episodeNumber
        )(dispatch);
      } else {
        // console.log("here 2 series");
        updateWatchedProfile(
          moment(),
          userId,
          movieId,
          title,
          duration,
          time,
          profileId,
          seasonNumber,
          episodeNumber
        )(dispatch);
      }
    }
  };

  const saveTiming = (x, y) => {
    AsyncStorage.setItem("duration", x);
    AsyncStorage.setItem("watched", y);
  };
  useEffect(() => {
    saveTiming(String(duration), String(currentTime));
  }, [currentTime]);
  useEffect(() => {
    if (!duration) return;
    if (duration - watchedTime > 3000) {
      onSeeks(watchedTime);
    }
  }, [duration]);
  function myStopFunction() {
    // console.log(timer.current);
    clearTimeout(timer.current);
  }
  useEffect(() => {
    // if (!screenClicked || paused) return;
    timer.current = setTimeout(() => {
      setScreenClicked(false);
    }, 2000);

    return () => clearTimeout(timer.current);
  }, [screenClicked]);
  const toggleScreenTouched = () => {
    setScreenClicked(!screenClicked);
  };
  const togglePlayPause = () => {
    if (onSetPlayPause) {
      onSetPlayPause(!paused);
      if (!paused) {
        myStopFunction();
      } else {
        setScreenClicked(false);
      }
    }
  };

  const toggleFullScreen = () => {
    if (onSetFullScreen) {
      onSetFullScreen(!fullscreen);
    }
  };

  const toggleMuted = () => {
    if (onSetMuted) {
      onSetMuted(!muted);
    }
  };
  // console.log("subtitleLabel", textTracks);
  const selectTextTrack = (index) => {
    // console.log("index", index);
    // console.log("onSelectTextTrack", onSelectTextTrack);
    if (onSelectTextTrack) {
      const uid =
        textTracks && index >= 0 && index < textTracks.length
          ? textTracks[index].uid
          : undefined;
      if (Platform.OS === "ios" && index < 0) {
        const emptyTrack = textTracks.find(
          (track) => track.label === "CC" || track.label === ""
        )?.uid;
        console.log("empty", emptyTrack);
        onSelectTextTrack(emptyTrack);
        setSubtitleLabel("");
        return;
      }
      onSelectTextTrack(uid);
      console.log("uid", textTracks[index]?.label);
      setSubtitleLabel(textTracks[index]?.label);
    }
  };

  const selectAudioTrack = (index) => {
    if (onSelectAudioTrack) {
      if (audioTracks && index >= 0 && index < audioTracks.length) {
        onSelectAudioTrack(audioTracks[index].uid);
      }
    }
  };

  const selectSource = (index) => {
    if (onSelectSource) {
      onSelectSource(index);
    }
  };

  const getTrackLabel = (track) => {
    if (track.label) {
      return track.label;
    }
    const languageCode = track.language;
    if (languageCode) {
      const iso639Language = getISO639LanguageByCode(languageCode);
      if (iso639Language) {
        return iso639Language.local;
      }
    }
    return languageCode || "";
  };

  const renderThumbnailCarousel = (seekBarPosition) => {
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <ThumbnailView
        visible={seekBarPosition.isScrubbing}
        containerStyle={styles.thumbnailContainerCarousel}
        thumbnailStyleCurrent={styles.thumbnailCurrentCarousel}
        thumbnailStyleCarousel={styles.thumbnailCarousel}
        thumbnailTrack={thumbnailTrack}
        time={seekBarPosition}
        duration={seekBarPosition.duration}
        size={THUMBNAIL_SIZE}
        carouselCount={2}
        // Optionally scale down the thumbnails when further from currentTime.
        // carouselThumbnailScale={(index: number) => 1.0 - Math.abs(index) * 0.15}
      />
    );
  };

  const renderSingleThumbnail = (seekBarPosition) => {
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <ThumbnailView
        visible={seekBarPosition.isScrubbing}
        containerStyle={styles.thumbnailContainerSingle}
        thumbnailStyleCurrent={styles.thumbnailCurrentSingle}
        thumbnailTrack={thumbnailTrack}
        duration={seekBarPosition.duration}
        time={seekBarPosition.currentProgress}
        size={THUMBNAIL_SIZE}
        showTimeLabel={false}
        offset={Math.min(
          seekBarPosition.seekBarWidth - THUMBNAIL_SIZE,
          Math.max(
            0,
            seekBarPosition.currentProgressPercentage *
              seekBarPosition.seekBarWidth -
              0.5 * THUMBNAIL_SIZE
          )
        )}
      />
    );
  };

  const selectableTextTracks = filterRenderableTracks(textTracks);
  // console.log(selectableTextTracks);
  const renderRecommendations = () => {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 2000,
          backgroundColor: "black",
          flexDirection: "row",
          justifyContent: "space-around",
          // alignItems: "center",
        }}
      >
        <TouchableOpacity
          // style={{left: 0, zIndex: 10}}
          // icon={backAarrow}
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 30,
            top: 30,
            zIndex: 100,
          }}
        >
          {/* <Image source={backAarrow} style={{ height: 20, width: 30 }} /> */}
          <Icon name="arrowleft" size={30} color="#fff" />
        </TouchableOpacity>
        <View
          style={{
            // flex: 1,
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "red",
            alignSelf: "center",
            // width: SIZES.height * 0.3,
            marginLeft: SIZES.height * 0.06,
          }}
        >
          <TouchableOpacity onPress={togglePlayPause}>
            <IconMaterial name="replay" size={70} color="#fff" />
            <Text
              style={{ fontSize: 20, fontFamily: "Sora-Bold", color: "#fff" }}
            >
              Replay
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {/* <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          > */}
          <View
            style={{
              flexWrap: "wrap",
              // backgroundColor: "red",
              justifyContent: "center",
            }}
          >
            <View style={styles.recommendContainer}>
              <LinearGradient
                colors={[
                  "#fff",
                  "#17C8FF",
                  "#329BFF",
                  // "#4C64FF",
                  // "#6536FF",
                  // "#8000FF",
                ]}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={styles.linearBorder}
              >
                <TouchableOpacity
                  style={styles.touchableContainer}
                  onPress={async () => {
                    await saveOnPlayNext();
                    navigation.navigate(THEOPLAYER, {
                      movieId: recommendOne?._id,
                      // isNext: true,
                    });
                    setIsPlayNext(true);
                    setHideRecommend(true);
                    // onSeeks(0);
                    // unpauseVideo();
                  }}
                >
                  <FastImage
                    // opacity={0.7}
                    style={styles.recommendImage}
                    source={{ uri: recommendOne?.wide_thumbnail_link }}
                  />
                  <Text style={styles.recommendTitle}>
                    {recommendOne?.title}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View style={styles.recommendContainer}>
              <LinearGradient
                colors={[
                  "#fff",
                  "#17C8FF",
                  "#329BFF",
                  // "#4C64FF",
                  // "#6536FF",
                  // "#8000FF",
                ]}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={styles.linearBorder}
              >
                <TouchableOpacity
                  onPress={async () => {
                    await saveOnPlayNext();
                    navigation.navigate(THEOPLAYER, {
                      movieId: recommendTwo?._id,
                      // isNext: true,
                    });
                    setIsPlayNext(true);
                    setHideRecommend(true);
                    // onSeeks(0);
                    // unpauseVideo();
                  }}
                  style={styles.touchableContainer}
                >
                  <FastImage
                    // opacity={0.7}
                    style={styles.recommendImage}
                    source={{ uri: recommendTwo?.wide_thumbnail_link }}
                  />
                  <Text style={styles.recommendTitle}>
                    {recommendTwo?.title}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            {/* </View> */}
            {/* <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          > */}
            <View style={styles.recommendContainer}>
              <LinearGradient
                colors={[
                  "#329BFF",
                  "#17C8FF",
                  "#fff",
                  // "#4C64FF",
                  // "#6536FF",
                  // "#8000FF",
                ]}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={styles.linearBorder}
              >
                <TouchableOpacity
                  onPress={async () => {
                    await saveOnPlayNext();
                    navigation.navigate(THEOPLAYER, {
                      movieId: recommendThree?._id,
                      // isNext: true,
                    });
                    setIsPlayNext(true);
                    setHideRecommend(true);
                    // onSeeks(0);
                    // unpauseVideo();
                  }}
                  style={styles.touchableContainer}
                >
                  <FastImage
                    // opacity={0.7}
                    style={styles.recommendImage}
                    source={{ uri: recommendThree?.wide_thumbnail_link }}
                  />
                  <Text style={styles.recommendTitle}>
                    {recommendThree?.title}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View style={styles.recommendContainer}>
              <LinearGradient
                colors={[
                  "#329BFF",
                  "#17C8FF",
                  "#fff",
                  // "#4C64FF",
                  // "#6536FF",
                  // "#8000FF",
                ]}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={styles.linearBorder}
              >
                <TouchableOpacity
                  onPress={async () => {
                    await saveOnPlayNext();
                    navigation.navigate(THEOPLAYER, {
                      movieId: recommendFour?._id,
                      // isNext: true,
                    });
                    setIsPlayNext(true);
                    setHideRecommend(true);
                    // onSeeks(0);
                    // unpauseVideo();
                  }}
                  style={styles.touchableContainer}
                >
                  <FastImage
                    // opacity={0.7}
                    style={styles.recommendImage}
                    source={{ uri: recommendFour?.wide_thumbnail_link }}
                  />
                  <Text style={styles.recommendTitle}>
                    {recommendFour?.title}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
        {/* </View> */}
      </View>
    );
  };

  // console.log("tracks", selectableTextTracks);
  return (
    <View style={[styles.container, style]}>
      <StatusBar hidden></StatusBar>
      <TouchableOpacity
        onPress={() => {
          toggleScreenTouched();
        }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          justifyContent: "center",
        }}
      >
        {/* <ActionButton
          icon={backAarrow}
          style={styles.fullScreenCenter}
          iconStyle={styles.playButton}
        /> */}
        {screenClicked && (
          <TouchableOpacity
            // style={{left: 0, zIndex: 10}}
            // icon={backAarrow}
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: 30,
              top: 30,
              zIndex: 100,
            }}
          >
            {/* <Image source={backAarrow} style={{ height: 20, width: 30 }} /> */}
            <Icon name="arrowleft" size={30} color="#fff" />
          </TouchableOpacity>
        )}
        {/*Background*/}
        {screenClicked && (
          <View
            style={{
              position: "absolute",
              top: 20,
              width: "100%",
              // backgroundColor: "red",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Sora-Regular",
                fontSize: 14,
              }}
            >
              {title}
            </Text>
          </View>
        )}

        {showRating && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              position: "absolute",
              flexDirection: "row",
              top: SIZES.width * 0.26,
              marginLeft: 40,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: "aqua",
                width: 4,
                borderRadius: 5,
                marginRight: 5,
              }}
            ></View>
            <View>
              <Text
                style={{ fontFamily: "Sora-Bold", fontSize: 18, color: "#fff" }}
              >
                {film_rating}
              </Text>
              <Text
                style={{
                  fontFamily: "Sora-Regular",
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                {content_advisory}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.background} />

        {showLoadingIndicator && !paused && !seekingButton && !screenClicked && (
          <View style={styles.fullScreenCenter}>
            <DelayedActivityIndicator size="large" color="aqua" />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            width: "60%",
            justifyContent: "space-evenly",
          }}
        >
          {screenClicked && (
            <TouchableOpacity
              onPress={() => {
                setSeekingButton(true);
                myStopFunction();
                timer.current = setTimeout(() => {
                  setScreenClicked(false);
                  setSeekingButton(false);
                }, 2000);
                onSeek(currentTime - 10000);
              }}
              style={{
                // backgroundColor: "red",
                // alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
                opacity: 0.6,
              }}
            >
              <BackwardsSvg
                width={80}
                height={80}
                color="#fff"
                // style={{ margin: 0 }}
              />
            </TouchableOpacity>
            // <ActionButton
            //   touchable={!Platform.isTV}
            //   icon={backwards}
            //   style={styles.fullScreenCenter}
            //   iconStyle={styles.playButton}
            //   // onPress={togglePlayPause}
            //   onPress={() => {
            //     setSeekingButton(true);
            //     myStopFunction();
            //     timer.current = setTimeout(() => {
            //       setScreenClicked(false);
            //       setSeekingButton(false);
            //     }, 2000);
            //     onSeek(currentTime - 10000);
            //   }}
            // />
          )}
          {!error && screenClicked && (
            <TouchableOpacity
              style={{
                // padding: 30,
                minHeight: 100,
                minWidth: 100,
                maxHeight: 100,
                maxWidth: 100,
                borderRadius: 140,
                justifyContent: "center",
                alignItems: "center",
                // elevation: 25,
                borderWidth: 2,
                borderColor: "#fff",
                opacity: 0.6,
                // borderWidth: 2,
                // borderColor: "#fff",
                // padding: 40,
                // borderRadius: 100,
              }}
              onPress={togglePlayPause}
            >
              {paused ? (
                <IconAwesome
                  name="play"
                  size={40}
                  color="#fff"
                  style={{ marginLeft: 4 }}
                />
              ) : (
                <IconAnt name="pause" color="#fff" size={50} />
              )}
            </TouchableOpacity>
            // <ActionButton
            //   touchable={!Platform.isTV}
            //   icon={paused ? PlayButton : pause}
            //   style={styles.fullScreenCenter}
            //   iconStyle={paused ? styles.playButton : styles.pauseButton}
            //   onPress={togglePlayPause}
            // />
          )}
          {screenClicked && (
            <TouchableOpacity
              onPress={() => {
                setSeekingButton(true);
                myStopFunction();
                timer.current = setTimeout(() => {
                  setScreenClicked(false);
                  setSeekingButton(false);
                }, 2000);
                onSeek(currentTime + 10000);
              }}
              style={{
                // backgroundColor: "red",
                // alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
                opacity: 0.6,
              }}
            >
              <ForwardsSvg
                width={80}
                height={80}
                color="#fff"
                // style={{ margin: 0 }}
              />
            </TouchableOpacity>
            // <ActionButton
            //   touchable={!Platform.isTV}
            //   icon={forwards}
            //   style={styles.fullScreenCenter}
            //   iconStyle={styles.playButton}
            //   onPress={() => {
            //     setSeekingButton(true);
            //     myStopFunction();
            //     timer.current = setTimeout(() => {
            //       setScreenClicked(false);
            //       setSeekingButton(false);
            //     }, 2000);
            //     onSeek(currentTime + 10000);
            //   }}
            // />
          )}
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>
              {error.errorCode} - {error.errorMessage}
            </Text>
          </View>
        )}

        {nextEpisode && duration - currentTime < 10000 && (
          <TouchableOpacity
            onPress={async () => {
              await saveOnPlayNext();
              navigation.navigate(THEOPLAYER, {
                movieId: nextEpisode?._id,
                // isNext: true,
              });
              setIsPlayNext(true);
              // onSeeks(0);
              // unpauseVideo();
            }}
            style={{
              width: 100,
              height: 60,
              borderWidth: 1,
              borderColor: "#fff",
              position: "absolute",
              right: 10,
              top: SIZES.width * 0.55,
              // top: 200,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff" }}>Next Episode</Text>
          </TouchableOpacity>
        )}
        {screenClicked && (
          <View style={styles.controlsContainer}>
            <SeekBar
              // On TV platforms we use the progress dot to play/pause
              setScreenClicked={setScreenClicked}
              cleartimeout={myStopFunction}
              onDotPress={togglePlayPause}
              onSeek={onSeek}
              seekable={seekable}
              duration={duration}
              currentTime={currentTime}
              renderTopComponent={
                THUMBNAIL_MODE === "carousel"
                  ? renderThumbnailCarousel
                  : renderSingleThumbnail
              }
            />

            <View style={styles.bottomControlsContainer}>
              {/*Mute*/}
              <ActionButton
                style={{ marginLeft: 0 }}
                icon={muted ? MutedIcon : UnMutedIcon}
                onPress={toggleMuted}
                iconStyle={styles.menuIcon}
              />

              {/*TimeLabel*/}
              <TimeLabel
                style={styles.timeLabel}
                isLive={!isFinite(duration)}
                currentTime={currentTime}
                duration={duration}
              />

              {/*Spacer*/}
              <View style={{ flexGrow: 1 }} />

              {/*TextTrack menu */}
              {selectableTextTracks &&
                selectableTextTracks.length > 0 &&
                selectableTextTracks[0]?.label !== "" && (
                  <MenuButton
                    setScreenClicked={setScreenClicked}
                    cleartimeout={myStopFunction}
                    title={"Subtitles"}
                    icon={SubtitlesIcon}
                    data={
                      [...selectableTextTracks, null] ||
                      [].map((textTrack) =>
                        textTrack.label
                          ? new MenuItem(getTrackLabel(textTrack))
                          : new MenuItem("None")
                      )
                    }
                    onItemSelected={selectTextTrack}
                    selectedItem={
                      selectedTextTrack
                        ? textTracks.findIndex(
                            (textTrack) => textTrack.uid === selectedTextTrack
                          )
                        : textTracks.length
                    }
                    keyExtractor={(index) => `sub${index}`}
                    subtitleLabel={subtitleLabel}
                  />
                )}

              {/*AudioTrack menu */}
              {audioTracks && audioTracks.length > 0 && (
                <MenuButton
                  setScreenClicked={setScreenClicked}
                  title={"Language"}
                  icon={AudioIcon}
                  data={
                    audioTracks ||
                    [].map(
                      (audioTrack) => new MenuItem(getTrackLabel(audioTrack))
                    )
                  }
                  onItemSelected={selectAudioTrack}
                  minimumItems={2}
                  selectedItem={audioTracks.findIndex(
                    (audioTrack) => audioTrack.uid === selectedAudioTrack
                  )}
                  keyExtractor={(index) => `lng${index}`}
                />
              )}

              {/*Source menu */}
              {/* {sources && sources.length > 0 && (
                <MenuButton
                  title={'Source'}
                  icon={ListIcon}
                  data={sources.map(source => new MenuItem(source.name))}
                  onItemSelected={selectSource}
                  selectedItem={srcIndex}
                  keyExtractor={index => `src${index}`}
                />
              )} */}

              {/*Fullscreen*/}
              {/* {!Platform.isTV && (
                <ActionButton
                  icon={fullscreen ? FullScreenExitIcon : FullScreenIcon}
                  onPress={toggleFullScreen}
                  iconStyle={styles.menuIcon}
                />
              )} */}
            </View>
          </View>
        )}
      </TouchableOpacity>
      {!nextEpisode &&
        duration - currentTime < 10000 &&
        paused &&
        !hideRecommend &&
        renderRecommendations()}
    </View>
  );
};

export default VideoPlayerUI;
