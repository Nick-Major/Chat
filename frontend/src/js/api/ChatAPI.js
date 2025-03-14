import Entity from './Entity';
import createRequest from './createRequest';

export default class ChatAPI extends Entity {
    baseUrl = 'http://localhost:3000';

    create(data, callback) {
        const url = `${this.baseUrl}/new-user`;
        createRequest({ url, method: "POST", data }).then(callback);
    }

}
