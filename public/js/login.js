/* eslint-disable no-undef */
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:4000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    console.log(res);

    if (res.data.status === 'success') {
      //   showAlert('success', 'Logged in successfully!');
      alert('login successfully');
      window.setTimeout(() => {
        // replace는 새 문서를 불러오기 전에, 현재 문서를 브라우저의 히스토리에서 제거함.
        // A -> B(replace) -> C then, C (back) -> A
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
    // showAlert('error', err.response.data.message);
  }
};

// export const logout = () => {

// }

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
