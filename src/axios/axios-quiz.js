import axios from 'axios';

export default axios.create({
    baseURL: 'https://react-quiz-a5bf2-default-rtdb.firebaseio.com/'
})