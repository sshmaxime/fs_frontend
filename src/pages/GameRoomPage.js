import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
// components
import Spacer from '../components/Spacer';
import List from '../components/List';
import GameRenderer from '../components/GameRenderer';
import Button from '../components/Button';
import { WS_ROOT } from '../constants/api';
import { withUser } from '../providers/UserProvider';
import { withTranslation } from 'react-i18next';

import { SERVER_EVENT, CLIENT_EVENT } from '../constants/events';

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
`;

const SidePanel = styled.div`
  width: 30em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const GameFrame = styled.div`
  border: 2px solid ${props => props.theme.text};

  width: 500px;
  height: 500px;
`;
const Title = styled.h1`
  color: ${props => (props.isError ? 'red' : props.theme.primary)};
  font-size: 36px;
  font-style: italic;
  letter-spacing: 0px;
  line-height: 1.2em;
  font-family: 'Poppins', sans-serif;
  font-size: 5em;
  font-weight: 600;
  font-style: normal;
  letter-spacing: -0.01em;
  line-height: 1.3em;
  text-transform: none;
  text-decoration: none;
  margin: 0;
  @media (max-width: ${({ theme }) => theme.tablet}) {
    font-size: 3em;
  }
`;

const Lobby = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.5em;
  width: 100%;
  color: ${props => props.theme.text};
`;

const STATUS = {
  IDLE: 'IDLE',
  READY: 'READY',
  PLAYING: 'PLAYING'
};

const STATE_CONNECTING = 0;
const STATE_CONNECTED = 1;
const STATE_ERROR = 2;

class GameRoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.room = this.props.match.params['roomId'];
    this.state = {
      users: [],
      status: STATUS.IDLE,
      room_state: STATE_CONNECTING,
      room_status: STATUS.IDLE
    };
    this.socket = null;
  }

  componentDidMount() {
    this.socket = io(WS_ROOT);
    this.socket.emit(SERVER_EVENT.LOGIN, {
      username: this.props.username,
      password: this.props.password,
      token: this.props.token
    });

    this.socket.emit(SERVER_EVENT.JOIN_ROOM, this.room);

    this.socket.on(CLIENT_EVENT.UPDATE_ROOM, data => {
      var status = this.state.status;

      data.users.forEach(user => {
        if (user.username === this.props.username) status = user.status;
      });
      this.setState({
        users: data.users,
        room_state: STATE_CONNECTED,
        status: status,
        room_status: data.status
      });
    });

    // this.socket.on("connect_error", () =>
    // 	this.setState({
    // 		room_state: STATE_ERROR
    // 	})
    // );
  }

  componentWillUnmount() {
    this.socket.emit(SERVER_EVENT.LEAVE_ROOM, this.room);
  }

  _addToLimitedQueue = str => {
    this.setState(pv => ({ messages: pv.slice(0, 10) }));
  };

  _setReady = () => {
    try {
      this.socket.emit(
        SERVER_EVENT.TOGGLE_READY,
        !(this.state.status === STATUS.READY)
      );
    } catch (e) {
      console.error('Error connecting to room');
    }
  };

  render() {
    return (
      <Content>
        <SidePanel>
          <Title isError={this.state.room_state === STATE_ERROR}>{`Room #${
            this.room
          } ${
            this.state.room_state === STATE_ERROR ? 'not found' : ''
          }`}</Title>
          {this.state.room_state === STATE_CONNECTED && (
            <Lobby>
              Players {this.state.users.length} / 10
              <List>
                {this.state.users.map(player => (
                  <li key={player.gameId}>
                    <span>{player.username}</span>
                    <span>
                      {player.status === STATUS.READY
                        ? this.props.t('game.ready')
                        : ''}
                    </span>
                  </li>
                ))}
              </List>
            </Lobby>
          )}

          <Spacer />
          <Button onClick={this._setReady}>
            {this.state.status === STATUS.READY
              ? this.props.t('game.waiting')
              : this.props.t('game.am_ready')}
          </Button>
        </SidePanel>

        <GameFrame>
          {this.state.room_status === STATUS.PLAYING && (
            <GameRenderer token={this.props.token} socket={this.socket} />
          )}
        </GameFrame>
      </Content>
    );
  }
}

export default GameRoomPage = withTranslation()(
  withRouter(withUser(GameRoomPage))
);
