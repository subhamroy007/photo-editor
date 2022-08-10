import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { AudioResponse } from "../../constants/types";

const audioAdapter = createEntityAdapter<AudioResponse>({
  selectId: (entity) => entity.id,
});

const audioSlice = createSlice({
  name: "audio-slice",
  initialState: audioAdapter.getInitialState(),
  reducers: {
    storeAudio: audioAdapter.upsertOne,
    storeAudios: audioAdapter.upsertMany,
  },
});

export const {
  actions: { storeAudio, storeAudios },
  reducer: audioReducer,
} = audioSlice;

export const { selectById: selectAudioById } = audioAdapter.getSelectors();
