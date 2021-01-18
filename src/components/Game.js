import React, { Component } from 'react';
import Area from './Area'
export default class Game extends Component {
    render() {
        const { complexity } = this.props
        return <Area {...{complexity}} />
    }
}