/* global $ */

import '../../../../semantic/dist/components/item.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/rail.css'
import '../../../../semantic/dist/components/segment.css'
import '../../../../semantic/dist/components/dropdown.css'
import '../../../../semantic/dist/components/dropdown'


import React from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import Nav from '../nav/nav'
import MessageCenter from '../mcenter/mcenter'
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
        list:              React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        isFetching:        React.PropTypes.bool.isRequired,
        changeCSRF:        React.PropTypes.func.isRequired,
        fetchGraphList:    React.PropTypes.func.isRequired,
        postNewGraph:      React.PropTypes.func.isRequired,
        patchGraph:        React.PropTypes.func.isRequired,
        removeGraph:       React.PropTypes.func.isRequired,
        duplicateGraph:    React.PropTypes.func.isRequired,
        fetchGraph:    React.PropTypes.func.isRequired,
        showMessageCenter: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        if (!this.props.isFetching) {
            this.props.fetchGraphList()
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
                            <div className="ui link item" onClick={() => this.editComponent.activate()}>
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

                <MessageCenter/>

                <Import ref={r => this.importComponent = r}
                    postNewGraph={this.props.postNewGraph}/>

                <EditGraphList ref={r => this.editComponent = r}
                    postNewGraph={this.props.postNewGraph} patchGraph={this.props.patchGraph}/>

                <ReactTransitionGroup component="div"
                    className={`ui divided items blurring dimmable${this.props.isFetching ? ' dimmed' : ''}`}>
                    {
                        this.props.list.map(g => {
                            return <ListItem key={g.id} graph={g}
                                edit={this.editComponent.activate}
                                remove={this.props.removeGraph}
                                duplicate={this.props.duplicateGraph}
                                fetchGraph={this.props.fetchGraph}/>
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



function mapStateToProps(state) {
    return {
        list: state.graphs.list,
        isFetching: state.graphs.isFetching
    }
}

const mapDispatchToProps = {
    changeCSRF: Action.changeCSRF,
    fetchGraphList: Action.fetchGraphsList,
    postNewGraph: Action.postNewGraph,
    patchGraph: Action.patchGraph,
    removeGraph: Action.removeGraph,
    duplicateGraph: Action.duplicateGraph,
    fetchGraph: Action.fetchGraph,
    showMessageCenter: Action.showMessageCenter
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView)
