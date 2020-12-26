import * as actionTypes from '../actions/actionCreators';


//  the functions given are not the action creators. they are the functions that will be 
// executed by the reducer depending upon the conndition 
//  the purpose of this funtions is to UPDATE STATE
// these functions are not necessary and we can update state directly inside the reducer fucntion but for ease
// we are using this functions

const updateObject = (oldObject,updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}

const initialState = {
    token: null,
    error: '', 
    loading: false,
    showModal: true
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: '',
        loading: true
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null
    });
}

const clrErr = (state,action) => {
    return updateObject(state,{
        error : '',
    })
}

const closeModal = (state,action) => {
    return updateObject(state,{
        showModal : false
    })
}

const AuthReducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.CLEAR_ERROR: return clrErr(state,action);
        case actionTypes.CLOSE_MODAL: return closeModal(state,action);
        default:
            return state;
    }
}

export default AuthReducer;