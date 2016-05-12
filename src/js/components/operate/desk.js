import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/loader.css'

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash/fp'

import { Action, DeskMode } from '../../actions'
import EditNode from './edit-node'
import Cy from './cy'

class Desk extends React.Component {

    constructor(props) {
        super(props)

        this.state = {isDataReady: false, cy: null}
        this.isEmpty = true
        this.cytoscapeElement = null
        this.loadGraphData = (g, gva) => this._loadGraphData(g, gva)
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        graph: React.PropTypes.object,
        visualAttributes: React.PropTypes.object,
        tape: React.PropTypes.array,
        deskMode: React.PropTypes.string.isRequired,
        fetchGraph: React.PropTypes.func.isRequired,
        fetchGVA: React.PropTypes.func.isRequired,
        setDeskMode: React.PropTypes.func.isRequired,
        nodeDialog: React.PropTypes.func.isRequired,
        nodeDelete: React.PropTypes.func.isRequired,
        edgeCreate: React.PropTypes.func.isRequired,
        edgeDelete: React.PropTypes.func.isRequired,
        gvaZoom: React.PropTypes.func.isRequired,
        gvaPan: React.PropTypes.func.isRequired
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tape !== this.props.tape) {
            const news = _.difference(nextProps.tape)(this.props.tape)
            this.state.cy.applyChanges(news)
        }
        this.setState({isDataReady:
            _.flow(_.at(['graph.isFetching', 'visualAttributes.isFetching']), _.all(e => e === false))(nextProps)})
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isDataReady !== this.state.isDataReady ||
            nextState.cy !== this.state.cy ||
            nextProps.deskMode !== this.props.deskMode) {
            return true
        }
        return false
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.isDataReady && nextState.cy && this.isEmpty) {
            nextState.cy.populate(nextProps.graph, nextProps.visualAttributes, nextProps.tape)
            nextState.cy.applyChanges(nextProps.tape)
            this.isEmpty =false
        }
        if (nextProps.deskMode !== this.props.deskMode) {
            nextState.cy.setMenus(nextProps.deskMode)
        }
    }

    componentDidMount() {
        this.loadGraphData(this.props.graph, this.props.visualAttributes)
        Cy.create(this.cytoscapeElement, cy => {
            cy.setDeskMode = this.props.setDeskMode
            cy.nodeDialog = this.props.nodeDialog
            cy.nodeDelete = this.props.nodeDelete
            cy.edgeCreate = this.props.edgeCreate
            cy.edgeDelete = this.props.edgeDelete
            cy.gvaZoom = this.props.gvaZoom
            cy.gvaPan = this.props.gvaPan
            cy.setMenus(this.props.deskMode)
            this.setState({cy})
        })
    }

    componentWillUnmount() {
        this.state.cy && this.state.cy.destroy()
        this.setState({isDataReady: false, cy: null})
        this.isEmpty = true
    }

    render() {
        return (
            <div ref={c => this.cytoscapeElement = c}
                    className={`ui blurring dimmable ${this.state.isDataReady && this.state.cy ? '' : 'dimmed'} cytoscape`}
                    style={{cursor: this.props.deskMode === DeskMode.NODE_CREATE ? 'crosshair' : 'auto'}}>
                <h1 className="ui disabled center alligned green header">
                    {_.get('graph.info.label')(this.props)}
                </h1>
                <EditNode newNode={ele => this.state.cy.addNode(ele)}/>
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
        }
        if (!visualAttributes || !visualAttributes.isFetching) {
            this.props.fetchGVA(graph ? graph : {id: this.props.gid})
        }
    }
}

function mapStoreToProps(store, ownProps) {
    return {
        graph: store.graphs.list.find(g => g.id === ownProps.gid),
        visualAttributes: store.graphsExtra.visualAttributes[ownProps.gid],
        tape: store.tape[ownProps.gid],
        deskMode: store.operating.deskMode
    }
}

const mapDispatchToProps = {
    fetchGraph: Action.fetchGraph,
    fetchGVA: Action.fetchGVA,
    setDeskMode: Action.setDeskMode,
    nodeDialog: Action.nodeDialog,
    nodeDelete: Action.nodeDelete,
    edgeCreate: Action.edgeCreate,
    edgeDelete: Action.edgeDelete,
    gvaZoom: Action.gvaZoom,
    gvaPan: Action.gvaPan
}

export default connect(mapStoreToProps, mapDispatchToProps)(Desk)
