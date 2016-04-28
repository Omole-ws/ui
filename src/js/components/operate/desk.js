import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Action, Mode } from '../../actions'
import EditGraphElement from './edit-graph-element'
import Cy from './cy'

export default class Desk extends React.Component {

    constructor(props) {
        super(props)

        this.state = {isReady: false, isGraphReady: false, isVisualAttributesReady: false}
        this.cytoscapeElement = null
        this.cy = {addNode: () => null}
        this.loadNewGraph = graph => this._loadNewGraph(graph)
        this.setReady = isReady => this.setState({isReady})
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
            this.cy.load(nextProps.graph)
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
        this.cy = new Cy(this.cytoscapeElement)
        this.cy.menu([
            {
                content: '<i class="ui edit icon"></i>',
                select: nod => console.log('edit ' + nod.id() + ' : ' + nod)
            },
            {
                fillColor: 'rgba(255, 0, 0, 0.75)',
                content: '<i class="ui recycle icon"></i>',
                select: nod => console.log('remove ' + nod.id() + ' : ' + nod)
            }
        ], 'node')
        this.cy.menu([
            {
                content: '<i class="ui edit icon"></i>',
                select: nod => console.log('edit ' + nod.id() + ' : ' + nod)
            },
            {
                fillColor: 'rgba(255, 0, 0, 0.75)',
                content: '<i class="ui recycle icon"></i>',
                select: nod => console.log('remove ' + nod.id() + ' : ' + nod)
            }
        ], 'edge')
        this.cy.menu([
            {
                fillColor: 'rgba(0, 255, 0, 0.75)',
                content: '<i class="ui circle add icon"></i>',
                select: () => this.editComponent.activate(null)
            }
        ])
        this.cy.edgehandles()
    }

    componentWillUnmount() {
        this.cy.destroy()
        this.cy = null
    }

    render() {
        return (
            <div ref={c => this.cytoscapeElement = c}
                    className={`ui blurring dimmable ${this.state.isReady ? '' : 'dimmed'} cytoscape`}>
                <h1 className="ui disabled center alligned green header">
                    {this.props.graph.info.label}
                </h1>
                <EditGraphElement ref={r => this.editComponent = r} newNode={ele => this.cy.addNode(ele)}/>
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
        visualAttributes: store.graphsExtra.visualAttributes.get(ownProps.gid) || {isFetching: false}
    }
}

const mapDispatchToProps = {
    fetchGraph: Action.fetchGraph
}

export default connect(mapStoreToProps, mapDispatchToProps)(Desk)