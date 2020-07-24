import * as ACTIONS from './actions';

function reducer(state, action) {

    switch (action.type) {
        case ACTIONS.START_REQUEST: 
            return { loading: true, jobs: []};
        case ACTIONS.GET_DATA: 
            return {...state, loading: false, jobs: action.payload.jobs};
        case ACTIONS.ERROR: 
            return {...state, loading: false, error: action.payload.error, jobs: [] };
        case ACTIONS.UPDATE_HAS_NEXT_PAGE: 
            return {...state, hasNextPage: action.payload.hasNextPage }
        default: return state;
    }
};

export default reducer;