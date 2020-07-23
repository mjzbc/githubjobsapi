import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = {
    MAKE_REQUEST: 'MAKE_REQUEST',
    GET_DATA: 'GET_DATA',
    ERROR: 'ERROR',
    UPDATE_HAS_NEXT_PAGE: 'UPDATE_HAS_NEXT_PAGE'
};

const cors_policy = 'https://cors-anywhere.herokuapp.com/';
const all_origin = 'https://api.allorigins.win/raw?url=';
const BASE_URL = all_origin + 'https://jobs.github.com/positions.json';


function reducer(state, action) {

    switch (action.type) {
        case ACTIONS.MAKE_REQUEST: 
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

export default function useFetchJobs(params, page) {

    // handle state, use reducer takes function, and initial state
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true});

    useEffect( () => {
        const cancelToken1 = axios.CancelToken.source();

        dispatch( {type: ACTIONS.MAKE_REQUEST});

        axios.get(BASE_URL, {
            cancelToken: cancelToken1.token,
            params: { markdown: true, page: page, ...params }
        }).then( res => {
            dispatch({ type: ACTIONS.GET_DATA, payload: {jobs: res.data} })
        }).catch( err => {
            if (axios.isCancel(err)) return;
            dispatch({ type: ACTIONS.ERROR, payload: {error: err}})
        });

        // another request to see if there is additional data for "next" pagination
        const cancelToken2 = axios.CancelToken.source();
        axios.get(BASE_URL, {
            cancelToken: cancelToken2.token,
            params: { markdown: true, page: page + 1, ...params }
        }).then( res => {
            dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: {hasNextPage: res.data.length !== 0} })
        }).catch( err => {
            if (axios.isCancel(err)) return;
            dispatch({ type: ACTIONS.ERROR, payload: {error: err}})
        });

        // cleanup
        return () => {
            cancelToken1.cancel();
            cancelToken2.cancel();
        }

    }, [params, page]); 
    // dependency is anytime the params (description or location typed) change, or page is changed

    return state;

};