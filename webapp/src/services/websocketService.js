class WebSocketService {
    constructor() {
        this.socket = null;
        this.url = "ws://localhost:3000/?type=user&id=1";
        // this.dispatch = useDispatch();
    }

    connect() {
        if (!this.socket) {
            this.socket = new WebSocket(this.url);

            this.socket.onopen = () => {
                console.log("WebSocket connected");
            };

            this.socket.onclose = () => {
                this.socket = null;
                console.log("WebSocket disconnected");
            };
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

}

const websocketService = new WebSocketService();
export default websocketService;
