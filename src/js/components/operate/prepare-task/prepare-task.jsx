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

    snapTo(quater) {
        this.setState({ quater })
    }

    handleFieldChange = ev => {
        this.setState({
            label: ev.target.value
        })
    }

    launch = () => {
        let params = { gid: this.props.gid, cclabel: this.state.label }
        if (this.props.algo.inputParam === AlgoInputType.GLFT) {
            params = { ...params, from: this.props.from.id, to: this.props.to.id }
        }
        this.props.createTask({ algo: this.props.algo, params })
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
        const q1 = q === 1
        const q2 = q === 2
        const q3 = q === 3
        const q4 = q === 4


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
                                ['READ', 'WRITE', 'TAKE', 'GRANT'].map(v =>
                                    <div className="field" key={v}>
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="label" checked={v === this.state.label} value={v} onChange={this.handleFieldChange}/>
                                            <label>{ v }</label>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {
                            this.props.algo.inputParam === AlgoInputType.GLFT &&
                                <div>
                                    <div className="inline field">
                                        <label> From </label>
                                        <div className="ui transparent input">
                                            <input type="text" readOnly value={this.props.from.name || ''}/>
                                        </div>
                                    </div>
                                    <div className="inline field">
                                        <label> To </label>
                                        <div className="ui transparent input">
                                            <input type="text" readOnly value={this.props.to.name || ''}/>
                                        </div>
                                    </div>
                                </div>
                        }
                    </form>
                </div>
                <div className="content">
                    <i className={cs('large left floated square icon', {disabled: q4, orange: !q4})} onClick={() => this.snapTo(4)}/>
                    <i className={cs('large right floated square icon', {disabled: q3, orange: !q3})} onClick={() => this.snapTo(3)}/>
                    <div className="center aligned">
                        <div className={cs('ui green compact basic button', {disabled: !this.state.label || (this.props.algo.inputParam === AlgoInputType.GLFT && (!this.props.from.name || !this.props.to.name))})}
                             onClick={this.launch}>
                            Launch
                        </div>
                        <div className="ui red compact basic button" onClick={this.props.cancel}> Cancel </div>
                    </div>
                </div>
            </div>
        )
    }
}

//                                                      888
//                                                      888
//                                                      888
//  .d8888b .d88b.  88888b.  88888b.   .d88b.   .d8888b 888888
// d88P"   d88""88b 888 "88b 888 "88b d8P  Y8b d88P"    888
// 888     888  888 888  888 888  888 88888888 888      888
// Y88b.   Y88..88P 888  888 888  888 Y8b.     Y88b.    Y88b.
//  "Y8888P "Y88P"  888  888 888  888  "Y8888   "Y8888P  "Y888
//
//
//

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
