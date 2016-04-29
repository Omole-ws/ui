import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash/fp'

import { Action } from '../../actions'
import EditGraphElement from './edit-graph-element'
import Cy from './cy'

class Desk extends React.Component {

    constructor(props) {
        super(props)

        this.state = {isReady: false, cy: null, isClean: true}
        this.cytoscapeElement = null
        this.cy = {addNode: () => null}
        this.loadGraphData = (g, gva) => this._loadGraphData(g, gva)
        this.setReady = isReady => this.setState({isReady})
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        graph: React.PropTypes.object,
        visualAttributes: React.PropTypes.object,
        fetchGraph: React.PropTypes.func.isRequired,
        fetchGVA: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.loadGraphData(this.props.graph, this.props.visualAttributes)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.gid !== this.props.gid) {
            this.loadGraphData(nextProps.graph, nextProps.visualAttributes)
            return
        }
        this.setState({isReady: nextProps.graph && nextProps.graph.isFetching === false &&
            (nextProps.visualAttributes && nextProps.visualAttributes.isFetching === false)})
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isReady !== this.state.isReady || nextState.cy !== this.state.cy) {
            return true
        }
        return false
    }

    componentDidMount() {
        Cy.create(this.cytoscapeElement, cy => {
            cy.menu([
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
            cy.menu([
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
            cy.menu([
                {
                    fillColor: 'rgba(0, 255, 0, 0.75)',
                    content: '<i class="ui circle add icon"></i>',
                    select: () => {
                        this.editComponent.activate(null)
                    }
                }
            ])
            cy.edgehandles()
            this.setState({cy})
        })
    }
    componentDidUpdate() {
        if (this.state.isReady && this.state.cy && this.state.isClean) {
            this.state.cy.load(this.props.graph, this.props.visualAttributes)
        }
    }

    componentWillUnmount() {
        this.state.cy.destroy()
        this.state.cy = null
    }

    render() {
        return (
            <div ref={c => this.cytoscapeElement = c}
                    className={`ui blurring dimmable ${this.state.isReady ? '' : 'dimmed'} cytoscape`}>
                <h1 className="ui disabled center alligned green header">
                    {_.get('graph.info.label')(this.props)}
                </h1>
                <EditGraphElement ref={r => this.editComponent = r} newNode={ele => this.state.cy.addNode(ele)}/>
                <div className="ui simple inverted dimmer">
                    <div className="ui large text loader">
                        Loading data  ...
                    </div>
                </div>
            </div>
        )
    }

    _loadGraphData(graph, visualAttributes) {
        if (!graph || !graph.isFetching) {
            this.props.fetchGraph(graph ? graph : {id: this.props.gid})
            // this.setState({isGraphReady: false})
        }
        if (!visualAttributes || !visualAttributes.isFetching) {
            this.props.fetchGVA(graph ? graph : {id: this.props.gid})
            // this.setState({isVisualAttributesReady: false})
        }
    }
}

function mapStoreToProps(store, ownProps) {
    return {
        graph: store.graphs.list.find(g => g.id === ownProps.gid),
        visualAttributes: store.graphsExtra.visualAttributes[ownProps.gid]
    }
}

const mapDispatchToProps = {
    fetchGraph: Action.fetchGraph,
    fetchGVA: Action.fetchGVA
}

export default connect(mapStoreToProps, mapDispatchToProps)(Desk)
