import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/loader.css'

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash/fp'

import { Action, DeskMode } from '../../actions'
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
        fetchGVA: React.PropTypes.func.isRequired
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
            nextProps.deskMode !== this.props.deskMode ||
            nextProps.tape !== this.props.tape) {
            return true
        }
        return false
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.isDataReady && nextState.cy && this.isEmpty) {
            nextState.cy.populate(nextProps.graph, nextProps.visualAttributes, nextProps.tape)
            // nextState.cy.applyChanges(nextProps.tape)
            this.isEmpty =false
        }
        if (nextProps.deskMode !== this.props.deskMode) {
            nextState.cy.setMenus(nextProps.deskMode)
        }
    }

    componentDidMount() {
        this.loadGraphData(this.props.graph, this.props.visualAttributes)
        Cy.create(this.cytoscapeElement, cy => {
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
                <h1 className={`ui disabled center alligned ${this.props.tape && this.props.tape.length > 0 ? 'red' : 'green'} header`}>
                    {_.get('graph.info.label')(this.props)}
                </h1>
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

function mapStateToProps(state, ownProps) {
    return {
        graph: state.graphs.list.find(g => g.id === ownProps.gid),
        visualAttributes: state.graphsExtra.visualAttributes[ownProps.gid],
        tape: state.tape[ownProps.gid],
        deskMode: state.operating.deskMode
    }
}

const mapDispatchToProps = {
    fetchGraph: Action.fetchGraph,
    fetchGVA: Action.fetchGVA
}

export default connect(mapStateToProps, mapDispatchToProps)(Desk)
