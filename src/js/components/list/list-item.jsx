import '../../../../semantic/dist/components/transition.css'
import '../../../../semantic/dist/components/transition'

import React from 'react'

import ListItemTmpl from '!jade-react!./list-item.jade'

export default class ListItem extends React.Component {

    // constructor(props) {
        // super(props)
    // }

    componentWillAppear(fin) {
        fin()
    }

    componentWillEnter(fin) {
        $(this.ref).transition('fly right in', fin)
    }

    componentWillLeave(fin) {
        $(this.ref).transition('fly left out', fin)
    }

    static propTypes = {
        graph: React.PropTypes.object.isRequired,
        setRef: React.PropTypes.func.isRequired,
        edit: React.PropTypes.func.isRequired,
        remove: React.PropTypes.func.isRequired,
        duplicate: React.PropTypes.func.isRequired
    }

    render() {
        return <ListItemTmpl setRef={r => this.ref = r} graph={this.props.graph}
            edit={this.props.edit} remove={this.props.remove} duplicate={this.props.duplicate}/>
    }
}