import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/loader.css'

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash/fp'

import { Action, DeskMode } from '../../actions'
import { tapeToCorrection } from '../../helpers'
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
        nodeDialog: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.loadGraphData(this.props.graph, this.props.visualAttributes)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.gid !== this.props.gid) {
            this.loadGraphData(nextProps.graph, nextProps.visualAttributes)
            return
        }
        if (nextProps.tape !== this.props.tape) {
            const news = _.difference(nextProps.tape)(this.props.tape)
            const upd = tapeToCorrection(news)
            console.log(upd)
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

    componentDidMount() {
        Cy.create(this.cytoscapeElement, cy => {
            cy.setDeskMode = this.props.setDeskMode
            cy.nodeDialog = this.props.nodeDialog
            cy.setMenus(this.props.deskMode)
            this.setState({cy})
        })
    }

    componentDidUpdate(prevProps) {
        if (this.state.isDataReady && this.state.cy && this.isEmpty) {
            this.state.cy.populate(this.props.graph, this.props.visualAttributes)
            this.isEmpty =false
        }
        if (prevProps.deskMode !== this.props.deskMode) {
            this.state.cy.setMenus(this.props.deskMode)
        }
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
    nodeDialog: Action.nodeDialog
}

export default connect(mapStoreToProps, mapDispatchToProps)(Desk)
