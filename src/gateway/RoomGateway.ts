import axios from "axios";

export class RoomGateway {
    static url = import.meta.env.VITE_API_URL;

    static find(roomId: string, callback) {
        const url = RoomGateway.url + "/rooms/" + roomId;
        
        axios.get(url).then(res => {
            console.log(res);
        });
    }

    static create(data = {}, callback) {
        const url = RoomGateway.url + "/rooms";
        axios.post(url, data).then(res => {
            callback(res);
        }).catch(err => {
            console.log(err);
        });
    }
}