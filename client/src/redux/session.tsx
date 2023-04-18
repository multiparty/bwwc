import { createSlice } from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    authToken: '',
    companySize: '',
    decodedTable: null,
    industry: '',
    participantCode: '',
    publicKey: '',
    prime: '',
    privateKey: '',
    sessionId: ''
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    setCompanySize: (state, action) => {
      state.companySize = action.payload;
    },
    setDecodedTable: (state, action) => {
      state.decodedTable = action.payload;
    },
    setIndustry: (state, action) => {
      state.industry = action.payload;
    },
    setParticipantCode: (state, action) => {
      state.participantCode = action.payload;
    },
    setPrime: (state, action) => {
      state.prime = action.payload;
    },
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
    setPrivateKey: (state, action) => {
      state.privateKey = action.payload;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    }
  }
});

export const { setAuthToken, setCompanySize, setDecodedTable, setIndustry, setParticipantCode, setPublicKey, setPrivateKey, setSessionId, setPrime } = sessionSlice.actions;
export default sessionSlice.reducer;
