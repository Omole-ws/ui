import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Action, Mode } from '../../actions'
import Cy from './cy'

export default class Desk extends React.Component {

    constructor(props) {
        super(props)

        this.state = {isReady: false, isGraphReady: false, isVisualAttributesReady: false}
        this.loadNewGraph = graph => this._loadNewGraph(graph)
        this._cytoscape = null
        this._cy = null
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        graph: React.PropTypes.object.isRequired,
        visualAttributes: React.PropTypes.object.isRequired,
        fetchGraph: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.loadNewGraph(this.props.graph)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.gid !== this.props.gid) {
            this.loadNewGraph(nextProps.graph)
            return
        }
        let isGraphReady = this.state.isGraphReady, isVisualAttributesReady = this.state.isVisualAttributesReady
        if (!this.state.isReady && !nextProps.graph.isFetching && this.props.graph.isFetching) {
            isGraphReady = true
            this._cy.load(nextProps.graph)
        }
        if (!this.state.isReady && !nextProps.visualAttributes.isFetching && this.props.visualAttributes.isFetching) {
            isVisualAttributesReady = true
        }
        this.setState({isReady: isGraphReady && isVisualAttributesReady, isGraphReady, isVisualAttributesReady})
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isReady !== this.state.isReady) {
            return true
        }
        return false
    }

    componentDidMount() {
        this._cy = new Cy(this._cytoscape)
    }

    componentWillUnmount() {
        this._cy.destroy()
        this._cy = null
    }

                    // <div className="ui active inverted dimmer">
                        // <div className="content">
                            // <div className="center">
                                // <h2 className="ui icon header">
                                    // <i className="spinner loading icon"></i>
                                    // Loading data....
                                // </h2>
                            // </div>
                        // </div>
                    // </div>
    render() {
        return (
            <div id="cytoscape" ref={c => this._cytoscape = c}
                    className={`ui blurring dimmable ${this.state.isReady ? '' : 'dimmed'} cytoscape`}>
                <h1 className="ui disabled center alligned header">
                    {this.props.graph.info.label}
                </h1>
                <div className="ui simple inverted dimmer">
                    <div className="ui large text loader">
                        Loading data ...
                    </div>
                </div>
            </div>
        )
    }

    _loadNewGraph(graph) {
        if (!graph.isFetching) {
            this.props.fetchGraph(graph)
            // TODO: fetch vizual attributes
        }
        this.setState({isReady: false, isGraphReady: false, isVisualAttributesReady: true})       
    }
}

function mapStoreToProps(store, ownProps) {
    return {
        graph: store.graphs.list.find(g => g.id === ownProps.gid) || {id: ownProps.gid, info: {label: '', tstamp: null}},
        visualAttributes: store.graphExtra.visualAttributes.get(ownProps.gid) || {isFetching: false}
    }
}

const mapDispatchToProps = {
    fetchGraph: Action.fetchGraph
}

export default connect(mapStoreToProps, mapDispatchToProps)(Desk)