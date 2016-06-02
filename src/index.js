import './styles/app.scss'
import '../semantic/dist/components/reset.css'
import '../semantic/dist/components/site.css'
import '../semantic/dist/components/site'

import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import { Provider } from 'react-redux'


import configureRouter from './js/router'
import reducers from './js/reducers'
import Root from './js/components/root'

import { taskCheck } from './js/tasker'


// const createStoreWithMiddleware = applyMiddleware(
//     loggerMiddleware(),
//     thunkMiddleware
// )(createStore)
// const store = createStoreWithMiddleware(combineReducers(reducers))
export const store = createStore(combineReducers(reducers), applyMiddleware(loggerMiddleware(), thunkMiddleware))
// const store = applyMiddleware(loggerMiddleware(), thunkMiddleware)(createStore)(combineReducers(reducers))


configureRouter(store)

store.subscribe(taskCheck)

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('app'))
