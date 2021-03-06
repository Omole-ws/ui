/* global $ */

import '../../../../semantic/dist/components/item.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/rail.css'
import '../../../../semantic/dist/components/segment.css'
import '../../../../semantic/dist/components/dropdown.css'
import '../../../../semantic/dist/components/dropdown'


import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import ReactTransitionGroup from 'react-addons-transition-group'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import Nav from '../nav/nav'
import ListItem from './list-item'
import EditGraphList from './edit-graph-list'
import Import from './import'

class ListView extends React.Component {

    constructor(props) {
        super(props)
        this.dropdowns = []
        this.editComponent = {activate: () => undefined}
        this.importComponent = {activate: () => undefined}
    }


    static propTypes = {
        list:              PropTypes.arrayOf(PropTypes.object).isRequired,
        isFetching:        PropTypes.bool.isRequired,
        changeCSRF:        PropTypes.func.isRequired,
        getGraphList:    PropTypes.func.isRequired,
        createGraph:      PropTypes.func.isRequired,
        patchGraph:        PropTypes.func.isRequired,
        deleteGraph:       PropTypes.func.isRequired,
        duplicateGraph:    PropTypes.func.isRequired,
        importGraph:    PropTypes.func.isRequired,
        getGraph:    PropTypes.func.isRequired
    }

    componentWillMount() {
        if (!this.props.isFetching) {
            this.props.getGraphList()
        }
    }

    componentWillUpdate() {
        this.dropdowns = []
    }
    componentWillUnmount() {
        this.dropdowns = []
    }
    componentDidMount() {
        $(this.dropdowns).dropdown()
    }
    componentDidUpdate() {
        $(this.dropdowns).dropdown()
    }
    render() {
        return(
            <div>
                <Nav>
                    {[<div className="ui dropdown item" key="11" ref={r => this.dropdowns.push(r)}>
                        Graph
                        <i className="ui dropdown icon"></i>
                        <div className="ui menu">
                            <div className="ui link item" onClick={(...a) => this.editComponent.activate()}>
                                <i className="ui circle add icon"></i>
                                New
                            </div>
                            <div className="ui link item" onClick={() => this.importComponent.activate()}>
                                <i className="ui cloud upload icon"></i>
                                Import
                            </div>
                        </div>
                    </div>]}
                </Nav>

                <Import ref={r => this.importComponent = r}
                    importGraph={this.props.importGraph}/>

                <EditGraphList ref={r => this.editComponent = r}
                    createGraph={this.props.createGraph} patchGraph={this.props.patchGraph}/>

                <ReactTransitionGroup component="div"
                    className={cs('ui divided items blurring dimmable', {dimmed: this.props.isFetching})}>
                    {
                        this.props.list.map(g => {
                            return <ListItem key={g.id} graph={g}
                                edit={(...a) => this.editComponent.activate(...a)}
                                remove={this.props.deleteGraph}
                                duplicate={this.props.duplicateGraph}
                                getGraph={this.props.getGraph}/>
                        })
                    }
                    <div className="ui simple inverted dimmer">
                        <div className="ui loader"></div>
                    </div>
                </ReactTransitionGroup>
            </div>
        )
    }
}


function sortByAge(asc, a, b) {
    return (b.tstamp - a.tstamp) * asc
}
function sortByAgeR(a, b) {
    return b.tstamp - a.tstamp
}

function mapStateToProps(state) {
    let comparator
    switch (state.list.sort.by) {
        case 'age':
            comparator = sortByAge.bind(undefined, state.list.sort.asc ? 1 : -1)
    }
    comparator = sortByAgeR
    const list = Reflect.ownKeys(state.graphs)
        .filter(key => key !== 'isFetching')
        .map(gid => state.graphs[gid])
        .sort(comparator)
    return {
        list,
        isFetching: state.graphs.isFetching
    }
}

const mapDispatchToProps = {
    changeCSRF: Action.changeCSRF,
    getGraphList: Action.getGraphList,
    createGraph: Action.createGraph,
    patchGraph: Action.patchGraph,
    deleteGraph: Action.deleteGraph,
    duplicateGraph: Action.duplicateGraph,
    importGraph: Action.importGraph,
    getGraph: Action.getGraph
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView)
