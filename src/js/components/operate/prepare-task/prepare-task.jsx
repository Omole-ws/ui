/* global $ */
import '../../../../../semantic/dist/components/card.css'
import '../../../../../semantic/dist/components/checkbox.css'
import '../../../../../semantic/dist/components/checkbox.js'

import React from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import { connect } from 'react-redux'

import { Action, AlgoInputType } from '../../../actions'

class PrepareTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: 'READ',
            quater: 1
        }
    }
    static propTypes = {
        onScreen: PropTypes.bool.isRequired,
        algo: PropTypes.shape({
            name: PropTypes.string,
            url: PropTypes.string,
            help: PropTypes.string,
            inputParam: PropTypes.string,
            outputParam: PropTypes.string
        }).isRequired,
        gid: PropTypes.string.isRequired,
        from: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        }),
        to: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        }),
        createTask: PropTypes.func.isRequired,
        cancel: PropTypes.func.isRequired
    }

    componentDidMount() {
        $(this.ref)
            .find('.ui.radio.checkbox')
            .checkbox()
    }

    render() {
        if (!this.props.onScreen) {
            return null
        }
        const q = this.state.quater
        const q1 = this.state.quater === 1
        const q2 = this.state.quater === 2
        const q3 = this.state.quater === 3
        const q4 = this.state.quater === 4


        return (
            <div className={cs('ui card cy-widget', ['', 'tl', 'tr', 'br', 'bl'][q])} ref={r => this.ref = r}>
                <div className="content">
                    <i className={cs('large left floated square icon', {disabled: q1, orange: !q1})} onClick={() => this.snapTo(1)}/>
                    <i className={cs('large right floated square icon', {disabled: q2, orange: !q2})} onClick={() => this.snapTo(2)}/>
                    <div className="center aligned header"> Task </div>
                </div>
                <div className="content">
                    <form className="ui form">
                        <div className="inline field">
                            <label> Algorythm </label>
                            <div className="ui transparent input">
                                <input type="text" readOnly value={this.props.algo.name}/>
                            </div>
                        </div>
                        <div className="grouped fields">
                            <label htmlFor="label"> Select LABEL </label>
                            {
                                ['READ', 'WRITE', 'TAKE', 'GRANT'].map((v,i) =>
                                    <div className="field" key={i}>
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="label" checked={v === this.state.label} value={v} onChange={e => this.handleFieldChange(e)}/>
                                            <label>{ v }</label>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {
                            this.props.algo.inputParam === AlgoInputType.GLFT &&
                                <div className="inline field">
                                    <label> From </label>
                                    <div className="ui transparent input">
                                        <input type="text" readOnly value={this.props.from.name}/>
                                    </div>
                                </div>
                        }
                        {
                            this.props.algo.inputParam === AlgoInputType.GLFT &&
                                <div className="inline field">
                                    <label> To </label>
                                    <div className="ui transparent input">
                                        <input type="text" readOnly value={this.props.to.name}/>
                                    </div>
                                </div>
                        }
                    </form>
                </div>
                <div className="content">
                    <i className={cs('large left floated square icon', {disabled: q4, orange: !q4})} onClick={() => this.snapTo(4)}/>
                    <i className={cs('large right floated square icon', {disabled: q3, orange: !q3})} onClick={() => this.snapTo(3)}/>
                    <div className="center aligned">
                        <div className={cs('ui green compact basic button', {disabled: !this.state.label || (this.props.algo.inputParam === AlgoInputType.GLFT && (!this.props.from.name || !this.props.to.name))})} onClick={() => this.launch()}>
                            Launch
                        </div>
                        <div className="ui red compact basic button" onClick={this.props.cancel}> Cancel </div>
                    </div>
                </div>
            </div>
        )
    }

    snapTo(quater) {
        this.setState({ quater })
    }

    handleFieldChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    launch() {
        let params = { gid: this.props.gid, cclabel: this.state.label }
        if (this.props.algo.inputParam === AlgoInputType.GLFT) {
            params = { ...params, from: this.props.from.id, to: this.props.to.id }
        }
        this.props.createTask({ algo: this.props.algo, params })
    }
}

//  +-+-+-+-+-+-+-+
//  |c|o|n|n|e|c|t|
//  +-+-+-+-+-+-+-+

function mapStateToProps(state) {
    return {
        onScreen: state.pendingAlgo.onScreen,
        algo: state.pendingAlgo.algo,
        gid: state.currentGraph,
        from: state.pendingAlgo.from,
        to: state.pendingAlgo.to
    }
}

const mapDispatchToProps = {
    createTask: Action.createTask,
    cancel: Action.cancelTaskPrepare
}

export default connect(mapStateToProps, mapDispatchToProps)(PrepareTask)
