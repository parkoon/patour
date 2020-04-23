/* eslint-disable no-undef */
import axios from 'axios';
import { showAlert } from './alert.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:4000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    console.log(res);

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      alert('login successfully');
      window.setTimeout(() => {
        // replace는 새 문서를 불러오기 전에, 현재 문서를 브라우저의 히스토리에서 제거함.
        // A -> B(replace) -> C then, C (back) -> A
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};

// export const logout = () => {

// }
