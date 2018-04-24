import { connect } from 'socket.io-client';


const socket = connect('/');

export function subscribe(event: string, callback: Function){
    socket.on(event, callback);
}
