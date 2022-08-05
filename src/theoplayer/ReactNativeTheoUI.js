import * as React from "react";

import { VideoPlayer } from "./components/videoplayer/VideoPlayer";
import { Platform, TouchableOpacity } from "react-native";

const playerConfig = {
  license: Platform.select({
    android:
      "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert Android THEOplayer license here // insert Android THEOplayer license here
    ios: "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert iOS THEOplayer license here
    web: undefined, // insert Web THEOplayer license here
  }),
  chromeless: true,
};
// const playURL =
//   'https://fliikamediaservice-usea.streaming.media.azure.net/8e73d752-c01d-443f-8d4e-2b6460eadeda/MCJW-Pilot_H264.mpd';
// const source = {
//   sources: {
//     src: 'https://contentserver.prudentgiraffe.com/tos-dash-widevine/tos_h264_main.mpd',
//     type: 'application/dash+xml',
//     contentProtection: {
//       widevine: {
//         licenseAcquisitionURL:
//           'https://widevine-dash.ezdrm.com/proxy?pX=62448C',
//       },
//       integration: 'ezdrm',
//     },
//   },
//   // sources: [
//   //   {
//   //     // src: playURL,
//   //     // type:
//   //     //   Platform.OS === 'android'
//   //     //     ? 'application/dash+xml'
//   //     //     : 'application/x-mpegurl',
//   //     src: 'https://contentserver.prudentgiraffe.com/tos-dash-widevine/tos_h264_main.mpd',
//   //     type: 'application/dash+xml',
//   //   },
//   // ],
//   textTracks: [
//     {
//       kind: 'subtitles',
//       label: 'english',
//       src: 'https://fliikamediaservice-usea.streaming.media.azure.net/4ecba15f-ee02-48df-8c55-9ba7bd2f138e/mcjw-subs.vtt',
//       srclang: 'En',
//     },
//   ],
// };

export default function ReactNativeTheoUI({ source }) {
  const [clicked, setClicked] = React.useState(false);

  const toggleClicked = () => {
    setClicked(!clicked);
  };

  // console.log(clicked);
  return <VideoPlayer source={source} config={playerConfig} />;
}
