import { createSlice } from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
	name: 'session',
	initialState: {
		authToken: '',
		participantCode: '',
		publicKey: 'initialPubKey',
		privateKey: '',
		sessionId: ''
	},
	reducers: {
		setAuthToken: (state, action) => {
			state.authToken = action.payload;
		},
		setParticipantCode: (state, action) => {
			state.participantCode = action.payload;
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

export const { setAuthToken, setParticipantCode, setPublicKey, setPrivateKey, setSessionId } = sessionSlice.actions;
export default sessionSlice.reducer;