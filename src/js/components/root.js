import React from 'react'

require('../../../semantic/dist/components/container.css')

import { Mode } from '../actions'
import Nav from './nav/nav'
// import Login from './lr/login'


class Root extends React.Component {

    constructor(props) {
        super(props)

        this.state= {mainView: require(`${Root.modes[props.mode].componentPath}`).default}
        // this.updateMainView = () => this.updateMainView()
    }

    static propTypes = {
        mode: React.PropTypes.string.isRequired
    }

    static modes = {
        [Mode.LOGIN]: {
            componentPath: './lr/login'
        },
        [Mode.LIST]: {
            componentPath: './list/list'
        },
        [Mode.OPERATE]: {
            componentPath: './operate/operate'
        }
    }

    // updateMainView(mode) {
        // require.ensure([], (req) => {
        //     const component = req(`${Root.modes[mode].componentPath}`)
        //     this.setState({mainView: component.default})
        // })
    // }

    // componentWillMount() {
        // this.updateMainView(this.state.mode)
    // }

    componentWillReceiveProps(nextProps) {
        if(nextProps.mode !== this.props.mode) {
            require([`${Root.modes[nextProps.mode].componentPath}`], component => this.setState({mainView: component.default}))
            // this.updateMainView(nextProps.mode)
        }
    }


    render () {
        let MainView = this.state.mainView
        return (
                <div className="ui main text container">
                    <Nav mode={this.props.mode}/>
                    { MainView ? <MainView/> : '' }
                </div>
        )
    }
}


// ========================= connected
import { connect } from 'react-redux'

const mapStoreToProps = store => {
    return {
        mode: store.mode
    }
}

export default connect(mapStoreToProps)(Root)
