export default {
    namespace: 'user',

    state: {
        // hasLogin: false
    },

    effects: {
        *login({ userName, password, callback }, { put }) {
            if (userName === 'guest' && password === 'guest') {
                // TODO: send login req to server 
                // yield put({
                //     type: 'changeLoginStatus',
                //     status: true
                // })
                callback()
            }
        }
    },

    reducers: {
        // changeLoginStatus(state, { status }) {
        //     return {
        //         ...state,
        //         hasLogin: status
        //     }
        // }
    },
};
