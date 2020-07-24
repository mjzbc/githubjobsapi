import { useReducer, useEffect } from 'react';
import axios from 'axios';
import reducer from './reducer';
import * as ACTIONS from './actions';

const cors_policy = 'https://cors-anywhere.herokuapp.com/';
//const all_origin = 'https://api.allorigins.win/raw?url=';
const BASE_URL = cors_policy + 'https://jobs.github.com/positions.json';


export default function useFetchJobs(params, page) {

    // handle state, use reducer takes function, and initial state
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true});

    useEffect( () => {
        const cancelToken1 = axios.CancelToken.source();

        dispatch( {type: ACTIONS.START_REQUEST});

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