import React, { PureComponent } from "react";
import {
  addTextTrack,
  addTextTrackCue,
  DurationChangeEvent,
  ErrorEvent,
  findTextTrackByUid,
  LoadedMetadataEvent,
  MediaTrack,
  PlayerConfiguration,
  PlayerError,
  ProgressEvent,
  removeTextTrack,
  removeTextTrackCue,
  SourceDescription,
  TextTrack,
  TextTrackEvent,
  TextTrackEventType,
  TextTrackListEvent,
  THEOplayerView,
  TimeRange,
  TimeUpdateEvent,
  TrackListEventType,
} from "react-native-theoplayer";
import ALL_SOURCES from "../../res/sources.json";

import { Platform, View } from "react-native";
import styles from "./VideoPlayer.style";
import VideoPlayerUI from "./VideoPlayerUI";
// import type { Source } from '../../utils/source/Source';

const TAG = "VideoPlayer";

// const SOURCES = ALL_SOURCES.filter(
//   source => source.os.indexOf(Platform.OS) >= 0,
// );

export class VideoPlayer extends PureComponent {
  static initialState = {
    srcIndex: 0,
    playbackRate: 1,
    volume: 1,
    muted: false,
    duration: Number.NaN,
    currentTime: 0.0,
    seekable: [],
    paused: false,
    fullscreen: false,
    showLoadingIndicator: false,
    textTracks: [],
    videoTracks: [],
    audioTracks: [],
    selectedTextTrack: undefined,
    selectedVideoTrack: undefined,
    selectedAudioTrack: undefined,
    error: undefined,
  };

  video;

  constructor(props) {
    super(props);
    this.state = { ...VideoPlayer.initialState };
  }

  logEvent = (eventName) => (data) => {
    if (data) {
      // console.log(TAG, eventName, JSON.stringify(data));
    } else {
      // console.log(TAG, eventName);
    }
  };

  onLoadStart = () => {
    // console.log(TAG, 'loadstart');
    this.setState({ error: undefined });
  };

  // onLoadedMetadata = data => {
  //   // console.log(TAG, 'loadedmetadata', JSON.stringify(data));
  //   this.setState({
  //     duration: data.duration,
  //     textTracks: data.textTracks,
  //     audioTracks: data.audioTracks,
  //     videoTracks: data.videoTracks,
  //     selectedTextTrack: data.selectedTextTrack,
  //     selectedVideoTrack: data.selectedVideoTrack,
  //     selectedAudioTrack: data.selectedAudioTrack,
  //   });
  // };

  onPause = () => {
    // console.log(TAG, 'pause');
    this.setState({ paused: true });
  };

  onTimeUpdate = (data) => {
    const { currentTime, currentProgramDateTime } = data;
    // console.log(TAG, 'timeupdate', currentTime, currentProgramDateTime);
    this.setState({ currentTime });
  };

  onDurationChange = (data) => {
    const { duration } = data;
    // console.log(TAG, "durationchange", duration);
    if (Platform.OS === "android") {
      this.setState({ duration });
    } else {
      this.setState({ duration: duration * 1000 });
    }
  };

  onTextTrackListEvent = (data) => {
    const { textTracks } = this.state;
    const { track } = data;
    switch (data.type) {
      case TrackListEventType.AddTrack:
        this.setState({ textTracks: addTextTrack(textTracks, track) });
        // console.log(TAG, 'Added text track', track.uid);
        break;
      case TrackListEventType.RemoveTrack:
        this.setState({ textTracks: removeTextTrack(textTracks, track) });
        // console.log(TAG, 'Removed text track', track.uid);
        break;
    }
  };

  onTextTrackEvent = (data) => {
    const { textTracks } = this.state;
    const { trackUid, cue } = data;
    const track = findTextTrackByUid(textTracks, trackUid);
    if (!track) {
      console.warn(TAG, "onTextTrackCueEvent - Unknown track:", trackUid);
      return;
    }
    switch (data.type) {
      case TextTrackEventType.AddCue:
        addTextTrackCue(track, cue);
        break;
      case TextTrackEventType.RemoveCue:
        removeTextTrackCue(track, cue);
        break;
    }
  };

  onProgress = (data) => {
    const { seekable } = data;
    // console.log(TAG, 'progress', seekable);
    this.setState({ seekable });
  };

  onError = (event) => {
    const { error } = event;
    this.setState({ error });
  };

  onBufferingStateChange = (isBuffering) => {
    this.setState({ showLoadingIndicator: isBuffering });
  };

  seek = (time) => {
    // console.log(TAG, 'Seeking to', time);
    if (!isNaN(time) && this.video) {
      this.video.seek(time);
    }
  };

  onUISelectTextTrack = (uid) => {
    this.setState({ selectedTextTrack: uid });
  };

  onUISelectAudioTrack = (uid) => {
    this.setState({ selectedAudioTrack: uid });
  };

  onUISelectVideoTrack = (uid) => {
    this.setState({ selectedVideoTrack: uid });
  };

  onUISetPlayPause = (paused) => {
    this.setState({ paused });
  };

  onUISelectSource = (srcIndex) => {
    this.setState({ ...VideoPlayer.initialState, srcIndex, paused: true });
  };

  onUISetFullscreen = (fullscreen) => {
    this.setState({ fullscreen });
  };

  onUISetMuted = (muted) => {
    this.setState({ muted });
  };

  onUISetPlaybackRate = (playbackRate) => {
    this.setState({ playbackRate });
  };

  onUISetVolume = (volume) => {
    this.setState({ volume });
  };

  render() {
    const {
      srcIndex,
      error,
      playbackRate,
      paused,
      volume,
      muted,
      fullscreen,
      showLoadingIndicator,
      duration,
      seekable,
      currentTime,
      textTracks,
      selectedTextTrack,
      videoTracks,
      selectedVideoTrack,
      audioTracks,
      selectedAudioTrack,
    } = this.state;

    const { config } = this.props;
    const chromeless = config?.chromeless;
    // console.log(duration);
    return (
      <View style={styles.container}>
        <THEOplayerView
          ref={(ref) => {
            this.video = ref;
          }}
          config={config}
          source={this.props.source}
          fullscreen={fullscreen}
          style={styles.fullScreen}
          playbackRate={playbackRate}
          paused={paused}
          volume={volume}
          muted={muted}
          selectedTextTrack={selectedTextTrack}
          selectedAudioTrack={selectedAudioTrack}
          selectedVideoTrack={selectedVideoTrack}
          onBufferingStateChange={this.onBufferingStateChange}
          onSourceChange={this.logEvent("sourcechange")}
          onLoadStart={this.onLoadStart}
          onLoadedMetadata={this.onLoadedMetadata}
          onLoadedData={this.logEvent("loadeddata")}
          onReadyStateChange={this.logEvent("readystatechange")}
          onError={this.onError}
          onProgress={this.onProgress}
          onPlay={this.logEvent("play")}
          onPlaying={this.logEvent("playing")}
          onPause={this.onPause}
          onSeeking={this.logEvent("seeking")}
          onSeeked={this.logEvent("seeked")}
          onEnded={this.logEvent("ended")}
          onTimeUpdate={this.onTimeUpdate}
          onDurationChange={this.onDurationChange}
          onTextTrackListEvent={this.onTextTrackListEvent}
          onTextTrackEvent={this.onTextTrackEvent}
        />

        {/* Use React-Native UI if a native chromeless (without UI) player is requested. */}
        {(chromeless == true || chromeless == undefined) && (
          <VideoPlayerUI
            sources={this.props.source}
            watchedTime={this.props.watchedTime}
            nextEpisode={this.props.nextEpisode}
            film_rating={this.props.film_rating}
            recommendOne={this.props.recommendOne}
            recommendTwo={this.props.recommendTwo}
            recommendThree={this.props.recommendThree}
            recommendFour={this.props.recommendFour}
            content_advisory={this.props.content_advisory}
            title={this.props.title}
            srcIndex={srcIndex}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            duration={duration}
            seekable={seekable}
            currentTime={currentTime}
            paused={paused}
            fullscreen={fullscreen}
            showLoadingIndicator={showLoadingIndicator}
            textTracks={textTracks}
            videoTracks={videoTracks}
            audioTracks={audioTracks}
            selectedTextTrack={selectedTextTrack}
            selectedVideoTrack={selectedVideoTrack}
            selectedAudioTrack={selectedAudioTrack}
            error={error}
            onSetPlayPause={this.onUISetPlayPause}
            onSeeks={this.seek}
            onSelectSource={this.onUISelectSource}
            onSelectTextTrack={this.onUISelectTextTrack}
            onSelectAudioTrack={this.onUISelectAudioTrack}
            onSelectVideoTrack={this.onUISelectVideoTrack}
            onSetFullScreen={this.onUISetFullscreen}
            onSetMuted={this.onUISetMuted}
            onSetPlaybackRate={this.onUISetPlaybackRate}
            onSetVolume={this.onUISetVolume}
            onDurationChange={this.onDurationChange}
          />
        )}
      </View>
    );
  }
}
