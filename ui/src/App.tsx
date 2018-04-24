import * as React from 'react';

import StatsPanel from './components/stats.panel';
import TestsPanel from './components/tests.panel'
import TerminalPanel from './components/terminal.panel'

import './App.css';

import { Row } from 'react-bootstrap';


export default class App extends React.Component<any,any>{

    public render(){
      return (
        <Row  className="m-0 pt-5">
          <StatsPanel />
          <TestsPanel />
          <TerminalPanel />
        </Row>
      );
    }

}
