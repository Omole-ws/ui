import React from 'react'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import NavAlgoTmpl from '!jade-react!./nav-algo.jade'

class NavAlgo extends React.Component {
    // constructor(props) {
    //     super(props)
    // }

    static propTypes = {
        algosDef: React.PropTypes.array,
        isFetchingAlgosDef: React.PropTypes.bool.isRequired,
        algosFetchDef: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.algosFetchDef()
    }

    render() {
        return <NavAlgoTmpl isFetching={this.props.isFetchingAlgosDef} algos={this.props.algosDef}/>
    }
}


function mapStoreToProps(store) {
    return {
        algosDef: store.algos.definitions.list,
        isFetchingAlgosDef: store.algos.definitions.isFetching
    }
}

const mapDispatchToProps = {
    algosFetchDef: Action.algosFetchDef
}

export default connect(mapStoreToProps, mapDispatchToProps)(NavAlgo)